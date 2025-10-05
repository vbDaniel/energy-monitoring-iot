"use client";

import React, { useState, useEffect, useMemo } from "react";

// import Card from "./common/Card";
// import { generateEnergyInsights } from "../services/geminiService";

import { ConsumptionChart } from "@/components/charts";

import { ConsumptionDataPoint, Insight } from "types";
import { ICONS, COLORS } from "@/constants";
import { useI18n } from "@/hooks/useI18n";
import styles from "./page.module.css";
import { CircularProgress } from "@mui/material";

import { Card } from "@/components/common";
import { PagePanel } from "src/components";

const mockConsumptionData: ConsumptionDataPoint[] = [
  { name: "Seg", actual: 12, predicted: 11.5 },
  { name: "Ter", actual: 13, predicted: 12.5 },
  { name: "Qua", actual: 15, predicted: 13 },
  { name: "Qui", actual: 18, predicted: 14 },
  { name: "Sex", actual: 16, predicted: 15 },
  { name: "Sáb", actual: 20, predicted: 19 },
  { name: "Dom", actual: 22, predicted: 20 },
];

const InsightIcon: React.FC<{ type: Insight["type"] }> = ({ type }) => {
  const iconMap = {
    alert: <ICONS.alert className="h-6 w-6 text-red-500" />,
    warning: <ICONS.alert className="h-6 w-6 text-yellow-500" />,
    info: <ICONS.info className="h-6 w-6 text-blue-500" />,
    success: <ICONS.success className="h-6 w-6 text-green-500" />,
  };
  return iconMap[type];
};

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t, locale } = useI18n();

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // const result = await generateEnergyInsights(
        //   mockConsumptionData,
        //   locale
        // );
        // setInsights(result);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
        setInsights([
          { type: "alert", message: "Failed to load AI insights." },
        ]);
      }
      setLoading(false);
    };

    fetchInsights();
  }, [locale]);

  const summary = useMemo(() => {
    const totalActual = mockConsumptionData.reduce(
      (sum, day) => sum + day.actual,
      0
    );
    const totalPredicted = mockConsumptionData.reduce(
      (sum, day) => sum + day.predicted,
      0
    );
    const costPerKwh = 0.75;
    const estimatedCost = totalActual * costPerKwh;
    return { totalActual, totalPredicted, estimatedCost };
  }, []);

  return (
    <PagePanel>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{t("energy_consumption_overview")}</h1>

        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <Card className={styles.summaryCard}>
            <h3 className={styles.cardTitle}>{t("current_consumption")}</h3>
            <p className={styles.cardValue}>
              {summary.totalActual.toFixed(2)}{" "}
              <span className={styles.cardUnit}>{t("kwh")}</span>
            </p>
          </Card>
          <Card className={styles.summaryCard}>
            <h3 className={styles.cardTitle}>{t("predicted_consumption")}</h3>
            <p className={styles.cardValue}>
              {summary.totalPredicted.toFixed(2)}{" "}
              <span className={styles.cardUnit}>{t("kwh")}</span>
            </p>
          </Card>
          <Card className={styles.summaryCard}>
            <h3 className={styles.cardTitle}>{t("estimated_cost")}</h3>
            <p className={`${styles.cardValue} ${styles.cardCost}`}>
              R$ {summary.estimatedCost.toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Main Chart and Insights */}
        <div className={styles.mainGrid}>
          <Card className={styles.summaryCardGrafic}>
            <h2 className={styles.sectionTitle}>
              {t("consumption_over_time")}
            </h2>
            <ConsumptionChart
              data={mockConsumptionData}
              xAxisDataKey="name"
              yAxisLabel={t("kwh")}
              lines={[
                { dataKey: "actual", stroke: COLORS.lime, nameKey: "actual" },
                {
                  dataKey: "predicted",
                  stroke: COLORS.yellow,
                  nameKey: "predicted",
                  isArea: true,
                },
              ]}
            />
          </Card>
          <Card className={styles.summaryCard}>
            <h2 className={styles.sectionTitle}>{t("alerts_insights")}</h2>
            {loading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress />
                <p className={styles.loadingText}>{t("generating_insights")}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {insights.map((insight, index) => (
                  <li key={index} className={styles.insightItem}>
                    <div className="icon">
                      {<InsightIcon type={insight.type} />}
                    </div>
                    <p className={styles.insightText}>{insight.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </PagePanel>
  );
};

export default Dashboard;
