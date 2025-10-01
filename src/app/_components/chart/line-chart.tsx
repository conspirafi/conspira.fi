"use client";
import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartArea,
} from "chart.js";

interface LineChartProps {
  labels: string[];
  values: number[];
}

// Реєструємо необхідні компоненти Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
const createGradient = (
  ctx: CanvasRenderingContext2D,
  chartArea: ChartArea,
) => {
  const gradient = ctx.createLinearGradient(
    chartArea.left,
    0,
    chartArea.right,
    0,
  );
  // Старіші дані (зліва) — темніші та прозоріші
  gradient.addColorStop(0, "rgba(97, 196, 84, 0.3)");
  // Новіші дані (справа) — світліші та насиченіші
  gradient.addColorStop(1, "rgba(97, 196, 84, 1)");
  return gradient;
};
const LineChart = (props: LineChartProps) => {
  const { labels, values } = props;

  // Дані для графіку
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderWidth: 2, // Тонша лінія для різкості
        tension: 0, // Плавність ліній
        pointRadius: 0, // Чіткі точки
        pointBackgroundColor: "rgba(97, 196, 84, 1)", // Колір точок
        pointBorderColor: "rgb(0, 100, 0)", // Контур точок
        borderColor: (context: {
          chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea };
        }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(97, 196, 84, 1)"; // Початковий колір, якщо chartArea не доступна
          return createGradient(ctx, chartArea);
        },
        backgroundColor: (context: {
          chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea };
        }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(97, 196, 84, 0.2)"; // Початкове заповнення
          return createGradient(ctx, chartArea);
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Контроль розміру
    plugins: {
      legend: {
        display: false, // Ховаємо легенду
      },
      title: {
        display: false, // Ховаємо заголовок
      },
      tooltip: {
        enabled: false, // Ховаємо підказки
      },
    },
    scales: {
      x: {
        display: false, // Ховаємо вісь X (мітки та сітку)
      },
      y: {
        display: false, // Ховаємо вісь Y (мітки та сітку)
      },
    },
    elements: {
      line: {
        borderJoinStyle: "miter" as const, // Різкі з'єднання
      },
      point: {
        pointStyle: "circle", // Круглі точки
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "230px",
        height: "41px",
        margin: "24px auto",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
