"use client";

import styles from "./page.module.css";
import { signIn } from "next-auth/react";

import GoogleButton from "react-google-button";

import { BlueLogo } from "src/assets";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={BlueLogo.src} alt="White Logo" />
        </div>
        <div>
          <h1 className={styles.title}>
            Bem-vindo ao seu Monitoramento Energético
          </h1>
          <h2 className={styles.subtitle}>
            Acesse o sistema de monitoramento de forma rápida e fácil
          </h2>
        </div>
        <GoogleButton
          type="light"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          label="Entrar com Google"
        />
      </div>
    </div>
  );
}
