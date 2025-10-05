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
          <img
            src={BlueLogo.src}
            alt="White Logo"
            style={{ width: 120, height: "auto" }}
          />
        </div>
        <div className={styles.textContainer}>
          <h1
            className={styles.title}
            style={{ marginBottom: 12, fontSize: 32, fontWeight: 700 }}
          >
            Bem-vindo ao seu Monitoramento Energético
          </h1>
          <h2
            className={styles.subtitle}
            style={{ marginBottom: 24, fontSize: 20, color: "#555" }}
          >
            Acesse o sistema de monitoramento de forma rápida e fácil
          </h2>
        </div>
        <GoogleButton
          type="light"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          label="Entrar com Google"
          style={{ width: 260, fontSize: 16, borderRadius: 8 }}
          className={styles.googleButton}
        />
      </div>
    </div>
  );
}
