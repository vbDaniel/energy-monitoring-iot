"use client";

import styles from "./page.module.css";
import { signIn } from "next-auth/react";

import GoogleButton from "react-google-button";

export default function Home() {
  return (
    <div className={styles.page}>
      <GoogleButton
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      />
    </div>
  );
}
