"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ICONS } from "src/constants";
import { useI18n } from "src/hooks/useI18n";
import styles from "./DrawerMenu.module.css";
import clsx from "clsx";
import { Button } from "src/components/common";

interface DrawerMenuProps {
  isDrawerMenuOpen: boolean;
  isDarkMode?: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isDrawerMenuOpen,
  isDarkMode = false,
  toggleSidebar,
  isMobile,
}) => {
  const { t } = useI18n();
  const pathname = usePathname();

  console.log("DrawerMenu", pathname);
  const navLinks = [
    { to: "/dashboard", text: t("dashboard"), icon: ICONS.dashboard },
    { to: "/reports", text: t("technical_analysis"), icon: ICONS.technical },
  ];

  return (
    <aside
      className={clsx(
        styles.sidebar,
        isDrawerMenuOpen && styles.sidebarOpen,
        isDarkMode && styles.sidebarDark
      )}
    >
      <div className={styles.padding}>
        <div className={styles.header}>
          <ICONS.dashboard className={styles.iconLarge} />
          <h1 className={clsx(styles.logo, isDarkMode && styles.logoDark)}>
            Energy<span className={styles.logoAccent}>Monitor</span>
          </h1>
          {isMobile && (
            <Button
              classStyle={styles.closeButton}
              onClick={toggleSidebar}
              aria-label="Fechar menu"
              type="button"
            >
              <ICONS.close className={styles.iconLarge} />
            </Button>
          )}
        </div>
        <nav className={styles.nav}>
          {navLinks.map(({ to, text, icon: Icon }) => {
            const isActive = pathname === to;

            return (
              <Link href={to} key={to} legacyBehavior>
                <a
                  className={clsx(
                    styles.linkBase,
                    isActive ? styles.linkActive : styles.linkInactive,
                    !isActive && isDarkMode && styles.linkInactiveDark,
                    !isActive &&
                      (isDarkMode
                        ? styles.linkHoverDark
                        : styles.linkHoverLight)
                  )}
                >
                  <Icon className={styles.iconSmall} />
                  <span>{text}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default DrawerMenu;
