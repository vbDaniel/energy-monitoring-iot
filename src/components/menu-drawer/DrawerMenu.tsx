"use client";

import { Drawer, Typography } from "@mui/material";
import React from "react";

import styles from "./DrawerMenu.module.css";

import { BlueLogo } from "src/assets";
import { Button } from "../buttons";
import Link from "next/link";

import LineAxisIcon from "@mui/icons-material/LineAxis";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

interface DrawerMenuProps {
  data: any;
  drawerWidth: number;
}

const DrawerMenu = ({ data, drawerWidth }: DrawerMenuProps) => {
  const pagesList = [
    { name: "Monitoramento", path: "/dashboard", icon: LineAxisIcon },
    { name: "Relatórios", path: "/reports", icon: HistoryEduIcon },
  ];

  const RenderMenuContent = () => (
    <div className={styles.menuContent}>
      <div className={styles.logo}>
        <img src={BlueLogo.src} alt="White Logo" />
      </div>
      {/* <div className={styles.reception}>
        <Typography className={styles.title}>Daniel Vidal</Typography>
      </div> */}
      <div className={styles.listItens}>
        {pagesList.map((item) => (
          <Button
            variant="filled"
            classStyle={`${styles.listItem} ${
              window.location.pathname === item.path
                ? styles.listItemActive
                : ""
            }`}
            onClick={() => {
              window.location.href = item.path;
            }}
          >
            <item.icon />
            <Link href={item.path}>{item.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Drawer
      variant="permanent"
      open
      classes={{
        root: styles.drawerRoot,
        paper: styles.drawerPaper,
      }}
      sx={{
        "& .MuiDrawer-paper": { width: drawerWidth },
      }}
      data-testid="drawer-menu"
    >
      <RenderMenuContent />
    </Drawer>
  );
};

export default DrawerMenu;
