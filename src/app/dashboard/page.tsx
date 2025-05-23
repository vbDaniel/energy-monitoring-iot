"use client";

import { CustomCard } from "src/components/cards";
import styles from "./page.module.css";
import { useState } from "react";

export default function EnergyMonitor() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.wrapper}>
      <h1>Monitoramento de Energia</h1>

      <CustomCard title="Monitoramento de Energia">
        <></>
      </CustomCard>
    </div>
  );
}
