"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "src/context/auth";
import { AppProvider } from "src/context/reducer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AppProvider>{children}</AppProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
