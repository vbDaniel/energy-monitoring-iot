// context/AuthContext.tsx
"use client";

import { signIn as nextSignIn, signOut, useSession } from "next-auth/react";
import React, { createContext, useContext } from "react";

type AuthContextType = {
  user: {
    name?: string;
    email?: string;
    image?: string;
    [key: string]: any;
  } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const signOutUser = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  const user = session?.user
    ? {
        ...session.user,
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signOut: signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
