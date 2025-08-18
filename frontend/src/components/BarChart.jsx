import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ taskPriorityCounts }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Check if the prop has data before processing
    if (taskPriorityCounts && Object.keys(taskPriorityCounts).length > 0) {
      const labels = Object.keys(taskPriorityCounts);
      const dataValues = Object.values(taskPriorityCounts);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Task Count",
            data: dataValues,
            backgroundColor: ["#74C0FC", "#B197FC", "#FFDAB9"],
            borderColor: ["#4DABF7", "#9775FA", "#FFA94D"],
            borderWidth: 1,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Task Priority Distribution",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      });
    }
    // ✨ Add taskPriorityCounts to the dependency array
  }, [taskPriorityCounts]);

  // 5. Render the bar chart with the state data
  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
