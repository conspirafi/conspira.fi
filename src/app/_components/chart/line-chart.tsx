"use client";
import React from "react";
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
  gradient.addColorStop(0, "rgba(97, 196, 84, 0.3)");
  gradient.addColorStop(1, "rgba(97, 196, 84, 1)");
  return gradient;
};
const LineChart = (props: LineChartProps) => {
  const { labels, values } = props;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointBackgroundColor: "rgba(97, 196, 84, 1)",
        pointBorderColor: "rgb(0, 100, 0)",
        borderColor: (context: {
          chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea };
        }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(97, 196, 84, 1)";
          return createGradient(ctx, chartArea);
        },
        backgroundColor: (context: {
          chart: { ctx: CanvasRenderingContext2D; chartArea?: ChartArea };
        }) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "rgba(97, 196, 84, 0.2)";
          return createGradient(ctx, chartArea);
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      line: {
        borderJoinStyle: "miter" as const,
      },
      point: {
        pointStyle: "circle",
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "278px",
        height: "41px",
        margin: "24px auto",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
