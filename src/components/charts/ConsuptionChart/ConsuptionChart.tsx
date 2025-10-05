import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import styles from "./ConsuptionChart.module.css";

interface LineConfig {
  dataKey: string;
  stroke: string;
  nameKey: string;
  isArea?: boolean;
}

interface ConsumptionChartProps<T> {
  data: T[];
  lines: LineConfig[];
  xAxisDataKey: string;
  yAxisLabel: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  const { theme } = useTheme();
  if (active && payload && payload.length) {
    return (
      <div
        className={`${styles.tooltipContainer} ${
          theme === "dark" ? styles.tooltipContainerDark : ""
        }`}
      >
        <p
          className={`${styles.tooltipLabel} ${
            theme === "dark" ? styles.tooltipLabelDark : ""
          }`}
        >
          {label}
        </p>
        {payload.map((pld: any) => (
          <p
            key={pld.dataKey}
            className={styles.tooltipItem}
            style={{ color: pld.color }}
          >
            {`${pld.name}: ${pld.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ConsumptionChart = <T,>({
  data,
  lines,
  xAxisDataKey,
  yAxisLabel,
}: ConsumptionChartProps<T>) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const gridColor = theme === "dark" ? "#404040" : "#e5e7eb";
  const textColor = theme === "dark" ? "#a3a3a3" : "#525252";

  const chartLines = lines.map((line) => (
    <Line
      key={line.dataKey}
      type="monotone"
      dataKey={line.dataKey}
      name={t(line.nameKey as any)}
      stroke={line.stroke}
      strokeWidth={2}
      dot={{ r: 4, strokeWidth: 2 }}
      activeDot={{ r: 6 }}
    />
  ));

  const chartAreas = lines
    .filter((l) => l.isArea)
    .map((line) => (
      <Area
        key={`area-${line.dataKey}`}
        type="monotone"
        dataKey={line.dataKey}
        fill={line.stroke}
        fillOpacity={0.1}
        stroke="none"
      />
    ));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey={xAxisDataKey}
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: "insideLeft",
            fill: textColor,
            fontSize: 12,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "14px" }} />
        {chartAreas}
        {chartLines}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ConsumptionChart;
