"use client";

import styles from "./page.module.css";
import { useState } from "react";

import { CustomCard } from "src/components/cards";
import { DrawerMenu } from "src/components";
import { MenuModal } from "src/components/modals";
import ProfileConfig from "src/components/profile-config/ProfileConfig";

export default function EnergyMonitor() {
  const [loading, setLoading] = useState(false);
  const drawerWidth = 300;

  return (
    <div className={styles.wrapper}>
      <div style={{ width: drawerWidth }}>
        <DrawerMenu drawerWidth={drawerWidth} />
      </div>
      <div className={styles.safeWrapper}>
        <div className={styles.headerContainer}>
          <h1>Monitoramento de Energia</h1>
          <ProfileConfig />
        </div>
      </div>
    </div>
  );
}
