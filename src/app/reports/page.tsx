"use client";

import { PagePanel } from "src/components";
import styles from "./page.module.css";

export default function EnergyMonitor() {
  return (
    <PagePanel pageTitle={"MONITORAMENTE ENERGETICO"}>
      <div className={styles.wrapper}>
        <h1>REPORTS LOGS</h1>
      </div>
    </PagePanel>
  );
}
