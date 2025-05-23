import React from "react";
import styles from "./index.module.css";
import { Button } from "src/components/buttons";

interface CustomCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  onClick,
  title,
  className,
}) => {
  return (
    <Button onClick={onClick}>
      <div className={`${styles.card} ${className || ""}`}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
      </div>
    </Button>
  );
};

export default CustomCard;
