import { NextApiRequest, NextApiResponse } from "next";
import { getDeviceData, getAllDevices } from "src/lib/tuyaApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Obter todos os dispositivos
    const devices = await getAllDevices();

    if (!devices || devices.length === 0) {
      return res.status(404).json({ error: "Nenhum dispositivo encontrado." });
    }

    // Criar um array para armazenar os dados de todos os dispositivos
    const devicesData = await Promise.all(
      devices.map(async (device) => {
        // Para cada dispositivo, buscar seus dados
        const data = await getDeviceData(device.id); // Usar 'id' de cada dispositivo
        return { deviceId: device.id, data }; // Retornar dados de cada dispositivo
      })
    );

    // Enviar os dados dos dispositivos como resposta
    return res.status(200).json(devicesData);
  } catch (error) {
    console.error("Erro ao buscar dados dos dispositivos:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar dados dos dispositivos" });
  }
}
