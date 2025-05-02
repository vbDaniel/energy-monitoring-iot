"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface TuyaDeviceData {
  code: string;
  value: string | number;
}

export default function EnergyMonitor() {
  const [deviceData, setDeviceData] = useState<TuyaDeviceData[] | null>(null);

  useEffect(() => {
    axios
      .get<TuyaDeviceData[]>("/api/tuya")
      .then((response) => setDeviceData(response.data))
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }, []);

  return (
    <div>
      <h1>Monitoramento de Energia</h1>
      {deviceData ? (
        <ul>
          {deviceData.map((item) => (
            <li key={item.code}>
              <strong>{item.code}:</strong> {item.value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}
