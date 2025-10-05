"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "src/context/auth";
import { AppProvider } from "src/context/reducer";

import { ThemeProvider } from "@/hooks/useTheme";
import { I18nProvider } from "@/hooks/useI18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <AppProvider>{children}</AppProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
