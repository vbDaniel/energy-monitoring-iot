"use client";

import { PagePanel } from "src/components";
import styles from "./page.module.css";
import { useState } from "react";

export default function EnergyMonitor() {
  const [loading, setLoading] = useState(false);
  const drawerWidth = 300;

  return (
    <PagePanel pageTitle={"MONITORAMENTE ENERGETICO"}>
      <div className={styles.wrapper}>
        <h1>DASHBOARD</h1>
      </div>
    </PagePanel>
  );
}
