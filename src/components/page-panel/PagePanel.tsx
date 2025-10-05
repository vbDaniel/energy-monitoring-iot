// components/PageShell.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";

import { DrawerMenu, Header } from "@/components";
import { useTheme } from "@/hooks/useTheme";

import styles from "./PagePanel.module.css"; // CSS Modules
import { useWindowSize } from "src/hooks/useWindowsSize";

export default function PagePanel({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme, isDark } = useTheme();
  const { isMobile } = useWindowSize();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={clsx(
        styles.container,
        theme === "dark" && styles.containerDark
      )}
    >
      <DrawerMenu
        toggleSidebar={toggleSidebar}
        isDarkMode={isDark}
        isDrawerMenuOpen={isSidebarOpen}
        isMobile={isMobile}
      />
      <div className={styles.content}>
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
        {children}
      </div>
    </div>
  );
}
