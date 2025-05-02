import axios from "axios";
import crypto from "crypto";

const API_ENDPOINT = process.env.API_ENDPOINT;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

let accessToken: string | null = null;

interface TuyaTokenResponse {
  result: {
    access_token: string;
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
function generateSign(
  method: string,
  urlPath: string,
  query: string,
  body: string,
  nonce: string = ""
): string {
  const timestamp = getTimestamp();
  const signStr = `${method}\n${hashBody(body)}\n\n${urlPath}?${query}`;
  const stringToSign = `${CLIENT_ID}${timestamp}${nonce}${signStr}`;

  return crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(stringToSign)
    .digest("hex")
    .toUpperCase();
}

// Obtém o token de acesso Tuya
export const getTuyaToken = async (): Promise<string | null> => {
  const method = "GET";
  const urlPath = "/v1.0/token";
  const query = "grant_type=1";
  const body = "";
  const nonce = "";
  const timestamp = getTimestamp();
  const sign = generateSign(method, urlPath, query, body, nonce);

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
  const timestamp = getTimestamp();
  const sign = generateSign(method, urlPath, query, body, nonce);

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
  if (!accessToken) {
    accessToken = await getTuyaToken();
  }
  if (!accessToken) {
    console.error("Erro: Token de acesso não disponível");
    return null;
  }

  const method = "GET";
  const urlPath = "/v1.0/devices";
  const query = "";
  const body = "";
  const nonce = "";
  const timestamp = getTimestamp();
  const sign = generateSign(method, urlPath, query, body, nonce);

  try {
    const response = await axios.get<TuyaDevicesResponse>(
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

    console.log("Dispositivos obtidos com sucesso:", response.data);

    return response.data.result.devices;
  } catch (error) {
    console.error("Erro ao obter dispositivos:", error);
    return null;
  }
};
