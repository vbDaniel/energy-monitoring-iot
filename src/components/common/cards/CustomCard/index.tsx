import React from "react";
import styles from "./index.module.css";
import { Button } from "src/components/common/buttons";
import { useTheme } from "@/hooks/useTheme";

interface CustomCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

const Card: React.FC<CustomCardProps> = ({
  children,
  onClick,
  title,
  className,
}) => {
  const { isDark } = useTheme();
  return (
    <Button onClick={onClick} style={{ flex: 1 }}>
      <div
        className={`${styles.card} ${className || ""}`}
        style={{
          cursor: onClick ? "pointer" : "default",
          backgroundColor: isDark ? "#1f2937" : "#fff",
        }}
      >
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </Button>
  );
};

export default Card;
