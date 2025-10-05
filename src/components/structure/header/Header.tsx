"use client";
import React, { use } from "react";
import { User } from "types";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { ICONS } from "@/constants";
import styles from "./Header.module.css";
import clsx from "clsx";
import { Button } from "src/components";
import { useAuth } from "src/context/auth";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isMobile }) => {
  const { theme, setTheme, isDark } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const { user } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLocale = () => {
    setLocale(locale === "pt" ? "en" : "pt");
  };

  return (
    <header className={clsx(styles.header, isDark && styles.headerDark)}>
      <div className={styles.left}>
        {isMobile ? (
          <Button
            onClick={toggleSidebar}
            classStyle={clsx(
              styles.sidebarToggle,
              isDark && styles.sidebarToggleDark
            )}
          >
            <ICONS.menu />
          </Button>
        ) : (
          <h3
            className={clsx(
              styles.welcomeText,
              isDark && styles.welcomeTextDark
            )}
          >
            {t("welcome")}, {}
          </h3>
        )}
      </div>

      <div className={styles.right}>
        {/* Language Switcher */}
        <Button
          onClick={toggleLocale}
          classStyle={clsx(
            styles.localeButton,
            isDark && styles.localeButtonDark
          )}
          aria-label={`Idioma atual: ${
            locale === "pt" ? "Português" : "English"
          }. Clique para trocar.`}
        >
          {locale === "pt" ? (
            <ICONS.flagBrazil className="h-5 w-auto rounded-sm" />
          ) : (
            <ICONS.flagUsa className="h-5 w-auto rounded-sm" />
          )}
        </Button>

        {/* Theme Switcher */}
        <Button
          onClick={toggleTheme}
          className={clsx(styles.themeButton, isDark && styles.themeButtonDark)}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <ICONS.moon className="h-5 w-5" />
          ) : (
            <ICONS.sun className="h-6 w-6 text-brand-yellow" />
          )}
        </Button>

        {/* User Avatar */}
        <img src={user?.image} alt={user?.name} className={styles.avatar} />
      </div>
    </header>
  );
};

export default Header;
