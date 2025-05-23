import { NextApiRequest, NextApiResponse } from "next";
import {
  getDeviceData,
  getAllDevices,
  getDeviceDataById,
  getDeviceLogsAndSaveToFile,
  getDeviceFunctions,
  getDeviceReportLogsAndSaveToFile,
  getDeviceSpecifications,
} from "src/lib/tuyaApi";
import { mapDP_describe_trifasico } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const start = Date.now() - 1000 * 60 * 60; // 1 hora atrás
    const end = Date.now();

    console.log("Iniciando busca de logs...", start, end);

    const dpsIds = Object.keys(mapDP_describe_trifasico);

    const logs = await getDeviceReportLogsAndSaveToFile(
      "eb4aea956de9ad0b93ngrg",
      dpsIds,
      start,
      end
    );

    // const logs = await getDeviceSpecifications("eb4aea956de9ad0b93ngrg");
    console.log("Logs encontrados:", logs);
    return res.status(200).json(logs);
  } catch (error) {
    console.error("Erro ao buscar dados dos dispositivos:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar dados dos dispositivos" });
  }
}
