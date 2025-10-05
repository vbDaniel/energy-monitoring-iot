export type Theme = "light" | "dark";
export type Locale = "en" | "pt";

export interface ConsumptionDataPoint {
  name: string; // e.g., 'Day 1', 'Mon'
  actual: number; // in kWh
  predicted: number; // in kWh
}

export interface PhaseDataPoint {
  name: string; // e.g., '12:00'
  voltage: number;
  current: number;
}

export interface Insight {
  type: "alert" | "info" | "success" | "warning";
  message: string;
}

export interface User {
  name: string;
  avatarUrl: string;
}

export const mapDP_describe_trifasico: Record<string, string> = {
  fault: "Falha",
  switch: "Chave",
  balance_kwh: "Energia restante (kWh)",
  positive_kwh: "Energia consumida (kWh)",
  reverse_kwh: "Energia injetada (kWh)",
  cur_current_1: "Corrente Fase 1 (A)",
  cur_current_2: "Corrente Fase 2 (A)",
  cur_current_3: "Corrente Fase 3 (A)",
  cur_power_1: "Potência Fase 1 (W)",
  cur_power_2: "Potência Fase 2 (W)",
  cur_power_3: "Potência Fase 3 (W)",
  cur_voltage_1: "Tensão Fase 1 (V)",
  cur_voltage_2: "Tensão Fase 2 (V)",
  cur_voltage_3: "Tensão Fase 3 (V)",
};
