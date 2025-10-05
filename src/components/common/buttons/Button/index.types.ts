import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: React.ElementType;
  customStyles?: React.CSSProperties;
  classStyle?: string;
  classStyleIcon?: string;
  classStyleProgress?: string;
  progress?: boolean;
  progressIcon?: boolean;
  customRole?: string;
  children?: ReactNode;
  variant?: "filled" | "outline" | "default";
}
