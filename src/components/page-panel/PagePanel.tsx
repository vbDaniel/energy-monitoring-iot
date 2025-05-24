"use client";

import styles from "./PagePanel.module.css";

import { DrawerMenu } from "src/components";

import ProfileConfig from "src/components/profile-config/ProfileConfig";

export default function PagePanel({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children: React.ReactNode;
}) {
  const drawerWidth = 300;

  return (
    <div className={styles.wrapper}>
      <div style={{ width: drawerWidth }}>
        <DrawerMenu drawerWidth={drawerWidth} />
      </div>
      <div className={styles.safeWrapper}>
        <div className={styles.headerContainer}>
          <h1>{pageTitle}</h1>
          <ProfileConfig />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
