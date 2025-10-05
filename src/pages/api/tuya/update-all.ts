// import { NextApiRequest, NextApiResponse } from "next";
// import { getDeviceLogsAndSaveToSupabase } from "src/lib/tuyaApi";
// import { mapDP_describe_trifasico } from "types";

// type QueryParams = {
//   deviceId?: string;
//   startTime?: string;
//   endTime?: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { deviceId, startTime, endTime } = req.query as QueryParams;

//     if (!deviceId || typeof deviceId !== "string") {
//       return res.status(400).json({ error: "deviceId é obrigatório" });
//     }

//     const start = startTime ? Number(startTime) : Date.now() - 1000 * 60 * 60;
//     const end = endTime ? Number(endTime) : Date.now();

//     if (isNaN(start) || isNaN(end)) {
//       return res
//         .status(400)
//         .json({ error: "startTime e endTime devem ser timestamps válidos" });
//     }

//     console.log("Iniciando busca de logs...", { deviceId, start, end });

//     const dpsIds = Object.keys(mapDP_describe_trifasico);

//     await getDeviceLogsAndSaveToSupabase(deviceId, dpsIds, start, end);

//     return res
//       .status(200)
//       .json({ message: "Logs salvos com sucesso no Firebase" });
//   } catch (error) {
//     console.error("Erro ao buscar dados dos dispositivos:", error);
//     return res
//       .status(500)
//       .json({ error: "Erro ao buscar dados dos dispositivos" });
//   }
// }
