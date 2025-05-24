"use client";

import { Drawer, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

import styles from "./DrawerMenu.module.css";

import { BlueLogo } from "src/assets";
import { Button } from "../buttons";
import Link from "next/link";

import LineAxisIcon from "@mui/icons-material/LineAxis";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

interface DrawerMenuProps {
  drawerWidth: number;
}

const DrawerMenu = ({ drawerWidth }: DrawerMenuProps) => {
  const pathname = usePathname();

  const pagesList = [
    { name: "Monitoramento", path: "/dashboard", icon: LineAxisIcon },
    { name: "Relatórios", path: "/reports", icon: HistoryEduIcon },
  ];

  const RenderMenuContent = () => (
    <div className={styles.menuContent}>
      <div className={styles.logo}>
        <img src={BlueLogo.src} alt="White Logo" />
      </div>
      <div className={styles.listItens}>
        {pagesList.map((item, index) => (
          <Link href={item.path} passHref key={index}>
            <Button
              variant="filled"
              key={index}
              classStyle={`
                ${styles.listItem} 
                ${pathname === item.path ? styles.listItemActive : ""}
              `}
            >
              <item.icon />
              {item.name}
            </Button>
          </Link>
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
