import axios from "axios";
import crypto from "crypto";

import fs from "fs";
import path from "path";
import { supabase } from "supabaseClient";

const API_ENDPOINT = process.env.API_ENDPOINT;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

let accessToken: string | null = null;
let uid: string | null = null;

interface TuyaTokenResponse {
  result: {
    access_token: string;
    uid: string;
  };
}

interface TuyaDeviceData {
  code: string;
  value: string | number;
}

interface TuyaDeviceResponse {
  result: TuyaDeviceData[];
}

interface TuyaDevicesResponse {
  result: {
    devices: Array<{
      id: string;
      name: string;
      product_id: string;
      category: string;
    }>;
  };
}

const includedDPs = [
  "fault",
  "switch",
  "balance_kwh",
  "positive_kwh",
  "reverse_kwh",
  "cur_current_1",
  "cur_current_2",
  "cur_power_1",
  "cur_power_2",
  "cur_voltage_1",
  "cur_voltage_2",
];

// Gera timestamp
function getTimestamp(): string {
  return Date.now().toString();
}

// Gera hash SHA256 do corpo da requisição
function hashBody(body: string): string {
  return body
    ? crypto.createHash("sha256").update(body).digest("hex")
    : "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // SHA256 de ""
}

// Gera assinatura HMAC-SHA256 conforme a documentação da Tuya
function generateSign({
  method,
  urlPath,
  query,
  body = "",
  nonce = "",
  accessToken = "",
}: {
  method: string;
  urlPath: string;
  query: string;
  body?: string;
  nonce?: string;
  accessToken?: string;
}): { sign: string; timestamp: string } {
  const timestamp = getTimestamp();
  const contentSHA256 = hashBody(body);
  const headersPart = ""; // nenhum header customizado usado aqui
  const fullUrl = query ? `${urlPath}?${query}` : urlPath;

  const stringToSign = `${method}\n${contentSHA256}\n${headersPart}\n${fullUrl}`;
  const strToHash = `${CLIENT_ID}${accessToken}${timestamp}${nonce}${stringToSign}`;

  const sign = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(strToHash)
    .digest("hex")
    .toUpperCase();

  return { sign, timestamp };
}

const EMPTY_BODY_SHA256 =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function sortQuery(queryObj: Record<string, string>): string {
  return Object.keys(queryObj)
    .sort()
    .map((k) => `${k}=${queryObj[k]}`)
    .join("&");
}

function generateSignV2({
  method,
  urlPath,
  queryObj,
  body = "",
  accessToken,
  nonce,
  timestamp,
}: {
  method: string;
  urlPath: string;
  queryObj: Record<string, string>;
  body?: string;
  accessToken: string;
  nonce: string;
  timestamp: string;
}): { sign: string; canonicalUrl: string } {
  // 1) SHA256 do body
  const contentSha = body
    ? crypto.createHash("sha256").update(body).digest("hex")
    : EMPTY_BODY_SHA256;

  // 2) Query ordenada
  const sortedQs = sortQuery(queryObj);
  const canonicalUrl = sortedQs ? `${urlPath}?${sortedQs}` : urlPath;

  // 3) Monta stringToSign
  const stringToSign = [
    method.toUpperCase(),
    contentSha,
    /* headersPart vazio */ "",
    canonicalUrl,
  ].join("\n");

  // 4) Concatena client_id + access_token + t + nonce + stringToSign
  const strToHash =
    process.env.CLIENT_ID! + accessToken + timestamp + nonce + stringToSign;

  // 5) HMAC-SHA256 e HEX MAIÚSCULO
  const sign = crypto
    .createHmac("sha256", process.env.CLIENT_SECRET!)
    .update(strToHash)
    .digest("hex")
    .toUpperCase();

  return { sign, canonicalUrl };
}

// Obtém o token de acesso Tuya
export const getTuyaToken = async (): Promise<string | null> => {
  const method = "GET";
  const urlPath = "/v1.0/token";
  const query = "grant_type=1";
  const body = "";
  const nonce = "";
  // const sign = generateSign(method, urlPath, query, body, nonce);

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
  });

  try {
    const response = await axios.get<TuyaTokenResponse>(
      `${API_ENDPOINT}${urlPath}?${query}`,
      {
        headers: {
          client_id: CLIENT_ID,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "1.0",
          t: timestamp,
          nonce,
        },
      }
    );

    console.log("Token obtido com sucesso:", response.data);

    accessToken = response.data.result.access_token;
    uid = response.data.result.uid;
    return accessToken;
  } catch (error) {
    console.error("Erro ao obter token da Tuya:", error);
    return null;
  }
};

// Obtém status do dispositivo
export const getDeviceData = async (
  deviceId: string
): Promise<TuyaDeviceData[] | null> => {
  if (!accessToken) {
    accessToken = await getTuyaToken();
  }
  if (!accessToken) {
    console.error("Erro: Token de acesso não disponível");
    return null;
  }

  const method = "GET";
  const urlPath = `/v1.0/devices/${deviceId}/status`;
  const query = "";
  const body = "";
  const nonce = "";

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
    accessToken,
  });

  try {
    const response = await axios.get<TuyaDeviceResponse>(
      `${API_ENDPOINT}${urlPath}`,
      {
        headers: {
          client_id: CLIENT_ID,
          access_token: accessToken,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "1.0",
          t: timestamp,
          nonce,
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error("Erro ao obter dados do dispositivo:", error);
    return null;
  }
};

// Obtém todos os dispositivos
export const getAllDevices = async (): Promise<any[] | null> => {
  if (!accessToken || !uid) {
    accessToken = await getTuyaToken();
  }
  if (!accessToken || !uid) {
    console.error("Erro: Token de acesso ou UID não disponível");
    return null;
  }

  const method = "GET";
  const urlPath = "/v1.0/users/devices";
  const query = `uid=${uid}`;
  const body = "";
  const nonce = "";

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
    accessToken,
  });

  try {
    const response = await axios.get<TuyaDevicesResponse>(
      `${API_ENDPOINT}${urlPath}?${query}`,
      {
        headers: {
          client_id: CLIENT_ID,
          access_token: accessToken,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "1.0",
          t: timestamp,
          nonce,
        },
      }
    );

    console.log("Dispositivos obtidos com sucesso:", response.data);

    return response.data.result.devices;
  } catch (error) {
    console.error("Erro ao obter dispositivos:", error);
    return null;
  }
};

export const getDeviceDataById = async (
  deviceId: string
): Promise<TuyaDeviceData[] | null> => {
  if (!accessToken) {
    accessToken = await getTuyaToken();
  }
  if (!accessToken) {
    console.error("Erro: Token de acesso não disponível");
    return null;
  }

  const method = "GET";
  const urlPath = `/v1.0/devices/${deviceId}/status`;
  const query = "";
  const body = "";
  const nonce = "";

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
    accessToken,
  });

  try {
    const response = await axios.get<TuyaDeviceResponse>(
      `${API_ENDPOINT}${urlPath}`,
      {
        headers: {
          client_id: CLIENT_ID,
          access_token: accessToken,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "1.0",
          t: timestamp,
          nonce,
        },
      }
    );

    console.log("Resposta da API:", response.data);

    return response.data.result;
  } catch (error) {
    console.error("Erro ao obter dados do dispositivo:", error);
    return null;
  }
};

// Chamada para pegar logs
export const getDeviceLogs = async (
  deviceId: string,
  dpIds: string[],
  startTime: number,
  endTime: number
): Promise<any[] | null> => {
  if (!accessToken) {
    // Obtenha seu token com sua função getTuyaToken
    accessToken = await getTuyaToken(); // ← supondo que você já tenha essa função implementada
  }

  if (!accessToken) {
    console.error("Token não disponível");
    return null;
  }

  const method = "GET";
  const urlPath = `/v1.0/iot-03/devices/${deviceId}/logs`;
  const query = `start_time=${startTime}&end_time=${endTime}&dp_ids=${dpIds.join(
    ","
  )}`;
  const body = "";
  const nonce = "";

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
    accessToken,
  });

  try {
    const response = await axios.get(`${API_ENDPOINT}${urlPath}?${query}`, {
      headers: {
        client_id: CLIENT_ID,
        access_token: accessToken,
        sign,
        sign_method: "HMAC-SHA256",
        sign_version: "1.0",
        t: timestamp,
        nonce,
      },
    });

    console.log("Logs recebidos:", response.data);
    return response.data.result; // aqui você tem os logs
  } catch (error) {
    console.error("Erro ao obter logs:", error);
    return null;
  }
};

export async function getDeviceFunctions(
  deviceId: string
): Promise<Array<{ code: string; type: string; values: any }> | null> {
  // 1) Obtém o token
  const accessToken = await getTuyaToken();
  if (!accessToken) {
    console.error("Não foi possível obter access token");
    return null;
  }

  // 2) Prepara chamada ao endpoint
  const method = "GET";
  const urlPath = `/v1.0/iot-03/devices/${deviceId}/functions`;
  const nonce = crypto.randomBytes(8).toString("hex");
  const query = "";
  const body = "";

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query,
    body,
    nonce,
    accessToken,
  });

  // 3) Executa requisição
  try {
    const res = await axios.get(`${API_ENDPOINT}${urlPath}`, {
      headers: {
        client_id: CLIENT_ID,
        access_token: accessToken,
        sign,
        sign_method: "HMAC-SHA256",
        sign_version: "1.0",
        t: timestamp,
        nonce,
      },
    });
    return res.data.result.functions;
  } catch (err: any) {
    console.error("Erro ao buscar functions:", err.response?.data || err);
    return null;
  }
}

export const getDeviceReportLogsAndSaveToFile = async (
  deviceId: string,
  dpIds: string[],
  startTime: number,
  endTime: number
): Promise<void> => {
  if (!accessToken) accessToken = await getTuyaToken();
  if (!accessToken) {
    console.error("Token não disponível");
    return;
  }

  const method = "GET";
  const urlPath = `/v2.0/cloud/thing/${deviceId}/report-logs`;
  const queryObj = {
    codes: dpIds.join(","),
    end_time: endTime.toString(),
    size: "100",
    start_time: startTime.toString(),
  };
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  // Gera a assinatura e a URL canônica (útil para debug)
  const { sign, canonicalUrl } = generateSignV2({
    method,
    urlPath,
    queryObj,
    body: "",
    accessToken,
    nonce,
    timestamp,
  });

  console.log("URL canônica:", canonicalUrl);
  console.log("String assinar:" /* imprima stringToSign se quiser */);

  try {
    const response = await axios.get(
      `${API_ENDPOINT}${urlPath}?${sortQuery(queryObj)}`,
      {
        headers: {
          client_id: CLIENT_ID,
          access_token: accessToken,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "2.0",
          t: timestamp,
          nonce,
        },
      }
    );

    const logs = response.data.result?.logs;
    console.log("response :", response.data);

    if (!logs) {
      console.error("Nenhum log retornado:", response.data);
      return;
    }

    fs.writeFileSync(
      path.join(process.cwd(), "logs_trifasico_inicial.json"),
      JSON.stringify(logs, null, 2),
      "utf-8"
    );
    console.log("Logs salvos em:", "logs_trifasico_inicial.json");
  } catch (err) {
    if (err instanceof Error && (err as any).response?.data) {
      console.error(
        "Erro ao obter ou salvar logs:",
        (err as any).response.data
      );
    } else {
      console.error("Erro ao obter ou salvar logs:", err);
    }
  }
};

export const getDeviceLogsAndSaveToFile = async (
  deviceId: string,
  dpIds: string[],
  startTime: number,
  endTime: number
): Promise<void> => {
  if (!accessToken) accessToken = await getTuyaToken();
  if (!accessToken) {
    console.error("Token não disponível");
    return;
  }

  const method = "GET";
  const urlPath = `/v2.0/cloud/thing/${deviceId}/report-logs`;
  const queryObj = {
    codes: dpIds.join(","),
    type: "1,2,3,4,5,6,7,8,9,10",
    query_type: "1",
    end_time: endTime.toString(),
    start_time: startTime.toString(),
    size: "100",
  };

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const { sign, canonicalUrl } = generateSignV2({
    method,
    urlPath,
    queryObj,
    body: "",
    accessToken,
    nonce,
    timestamp,
  });

  console.log("URL canônica:", canonicalUrl);

  try {
    const response = await axios.get(
      `${API_ENDPOINT}${urlPath}?${sortQuery(queryObj)}`,
      {
        headers: {
          client_id: CLIENT_ID,
          access_token: accessToken,
          sign,
          sign_method: "HMAC-SHA256",
          sign_version: "2.0",
          t: timestamp,
          nonce,
        },
      }
    );

    const logs = response.data.result?.logs;
    console.log("response:", response.data);

    if (!logs) {
      console.error("Nenhum log retornado:", response.data);
      return;
    }

    const filePath = path.join(process.cwd(), "logs_operacoes_iniciais.json");
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), "utf-8");
    console.log("Logs salvos em:", filePath);
  } catch (err) {
    if ((err as any).response?.data) {
      console.error(
        "Erro ao obter ou salvar logs:",
        (err as any).response.data
      );
    } else {
      console.error("Erro ao obter ou salvar logs:", err);
    }
  }
};

// Exemplo de função para pegar os códigos de status
export const getDeviceSpecifications = async (deviceId: string) => {
  if (!accessToken) accessToken = await getTuyaToken();
  if (!accessToken) throw new Error("Token não disponível");

  const method = "GET";
  const urlPath = `/v1.0/devices/${deviceId}/functions`;
  const nonce = crypto.randomBytes(16).toString("hex");

  const { sign, timestamp } = generateSign({
    method,
    urlPath,
    query: "",
    body: "",
    accessToken,
    nonce,
  });

  const resp = await axios.get(`${API_ENDPOINT}${urlPath}`, {
    headers: {
      client_id: CLIENT_ID,
      access_token: accessToken,
      sign,
      sign_method: "HMAC-SHA256",
      sign_version: "1.0",
      t: timestamp,
      nonce,
    },
  });

  console.log("Resposta da API:", resp.data.result.functions);
  return resp.data.result.functions; // array de { dpId, code, type, values }
};

// Update ALL historical data of ONE device
export const getDeviceLogsAndSaveToSupabase = async (
  deviceId: string,
  dpIds: string[],
  startTime: number,
  endTime: number
): Promise<void> => {
  if (!accessToken) accessToken = await getTuyaToken();
  if (!accessToken) {
    console.error("Token não disponível");
    return;
  }

  const method = "GET";
  const urlPath = `/v2.0/cloud/thing/${deviceId}/report-logs`;

  let lastRowKey = "";
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const queryObj: Record<string, string> = {
      codes: dpIds.join(","),
      type: "1,2,3,4,5,6,7,8,9,10",
      query_type: "1",
      end_time: endTime.toString(),
      start_time: startTime.toString(),
      size: "100",
    };

    if (lastRowKey) {
      queryObj["last_row_key"] = lastRowKey;
    }

    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString("hex");

    const { sign, canonicalUrl } = generateSignV2({
      method,
      urlPath,
      queryObj,
      body: "",
      accessToken,
      nonce,
      timestamp,
    });

    try {
      const response = await axios.get(
        `${API_ENDPOINT}${urlPath}?${sortQuery(queryObj)}`,
        {
          headers: {
            client_id: CLIENT_ID,
            access_token: accessToken,
            sign,
            sign_method: "HMAC-SHA256",
            sign_version: "2.0",
            t: timestamp,
            nonce,
          },
        }
      );

      const result = response.data.result;
      const logs = result?.logs;

      if (!logs || logs.length === 0) {
        break;
      }

      const formattedLogs = [];

      for (const log of logs) {
        const { code, value, event_time } = log;

        if (!dpIds.includes(code)) continue;

        const id = `${deviceId}_${event_time}_${code}`;
        const { data: existing, error } = await supabase
          .from("logs")
          .select("id")
          .eq("id", id)
          .maybeSingle();

        if (!existing && !error) {
          formattedLogs.push({
            id,
            device_id: deviceId,
            timestamp: new Date(event_time),
            code,
            value,
          });
        }
      }

      if (formattedLogs.length > 0) {
        const { error: insertError } = await supabase
          .from("logs")
          .insert(formattedLogs);

        if (insertError) {
          console.error("Erro ao salvar no Supabase:", insertError);
        } else {
          console.log(
            `✅ ${formattedLogs.length} logs salvos na página ${page}`
          );
        }
      }

      lastRowKey = result.last_row_key ?? "";
      hasMore = !!result.has_more;
      page++;
    } catch (err) {
      console.error("Erro ao consultar Tuya:", err);
      break;
    }
  }

  console.log("✅ Salvamento de logs históricos concluído.");
};
