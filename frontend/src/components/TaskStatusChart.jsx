// src/components/TaskStatusChart.jsx

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // ✨ Required for Doughnut/Pie charts
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register the required elements
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const TaskStatusChart = ({ taskStatusCount }) => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (taskStatusCount && Object.keys(taskStatusCount).length > 0) {
      // Capitalize first letter of each key for labels
      const labels = Object.keys(taskStatusCount).map(
        key => key.charAt(0).toUpperCase() + key.slice(1)
      );
      const data = Object.values(taskStatusCount);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Task Count',
            data: data,
            backgroundColor: [
              '#EF4444', // Red for Completed
              '#22C55E', // Green for In Progress
              '#14B8A6', // Teal for Pending
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        cutout: '60%', // ✨ This makes the pie chart a doughnut chart
        plugins: {
          legend: {
            display: true,
            position: 'bottom', // Display legend at the bottom like the image
          },
          title: {
            display: true,
            text: 'Task Status',
            position: 'top',
            align: 'start',
            font: {
              size: 18,
            },
            padding: {
              bottom: 20,
            }
          },
        },
      });
    }
  }, [taskStatusCount]);

  return <Doughnut options={chartOptions} data={chartData} />;
};

export default TaskStatusChart;