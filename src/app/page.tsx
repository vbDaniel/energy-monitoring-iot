import styles from "./page.module.css";
import EnergyMonitor from "src/components/EnergyMonitory";

export default function Home() {
  return (
    <div className={styles.page}>
      <EnergyMonitor />
    </div>
  );
}
