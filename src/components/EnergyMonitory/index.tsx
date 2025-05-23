"use client";

import { useState } from "react";

export default function EnergyMonitor() {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Monitoramento de Energia</h1>
      {/* <button onClick={updateDeviceData} disabled={loading}>
        {loading ? "Carregando..." : "Carregar dados"}
      </button> */}
    </div>
  );
}
