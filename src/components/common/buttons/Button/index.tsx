"use client";

import React, { forwardRef } from "react";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";

import styles from "./index.module.css";
import { ButtonProps } from "./index.types";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      text,
      customStyles,
      classStyle = "",
      classStyleIcon = "",
      classStyleProgress = "",
      disabled = false,
      variant = "default",
      type = "button",
      progress = false,
      progressIcon = false,
      "aria-label": ariaLabel,
      children,
      customRole,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const variantClass =
      {
        filled: styles.btnFilled,
        outline: styles.btnOutline,
        default: styles.btnDefault,
      }[variant] || styles.btnDefault;

    const isLoading = progress || progressIcon;

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(variantClass, classStyle)}
        style={customStyles}
        disabled={disabled || progress}
        aria-label={ariaLabel}
        role={customRole || "button"}
        {...props}
      >
        {isLoading && (
          <CircularProgress
            size={22}
            data-testid="circularProgress"
            className={classStyleProgress}
          />
        )}

        {!progress && !progressIcon && Icon && (
          <Icon className={clsx(styles.icon, classStyleIcon)} />
        )}

        {text && <p className={styles.text}>{text}</p>}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
