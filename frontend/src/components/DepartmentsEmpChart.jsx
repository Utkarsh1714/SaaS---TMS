// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";

// const DepartmentsEmpChart = ({ departmentCounts }) => {
//   const [chartData, setChartData] = useState([]);
//   const [chartOptions, setChartOptions] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data1`,
//         { withCredentials: true }
//       );

//       const departmentCount = res.data.departmentCount;

//       const label = departmentCount.map((item) => item.departmentName);
//       const dataValues = departmentCount.map((item) => item.employeeCount);

//       setChartData({
//         labels: label,
//         datasets: [
//           {
//             label: "Employee Count by Department",
//             data: dataValues,
//             backgroundColor: "black",
//             borderColor: "black",
//             borderWidth: 1,
//           },
//         ],
//       });

//       setChartOptions({
//         indexAxis: 'y',
//         responsive: true,
//         plugins: {
//             legeng: {
//                 display: false,
//             },
//             title: {
//                 display: true,
//                 text: "Employees by Department",
//             }
//         },
//         scales: {
//             x: {
//                 grid: {
//                     borderDash: [5, 5],
//                 }
//             },
//             y: {
//                 grid: {
//                     dispaly: false,
//                 }
//             }
//         }
//       })
//     };

//     fetchData();
//   }, []);
//   return <Bar options={chartOptions} data={chartData} />;
// };

// export default DepartmentsEmpChart;


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

// ✨ 1. Added the required Chart.js registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentsEmpChart = ({ departmentCounts }) => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  // ✨ 2. useEffect now listens for changes to the 'departmentCounts' prop
  useEffect(() => {
    // Check if the prop has valid data before processing
    if (departmentCounts && departmentCounts.length > 0) {
      const label = departmentCounts.map((item) => item.departmentName);
      const dataValues = departmentCounts.map((item) => item.employeeCount);

      // This is the data for the chart
      setChartData({
        labels: label,
        datasets: [
          {
            label: "Employee Count by Department",
            data: dataValues,
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      });

      // These are the chart settings you wanted to keep
      setChartOptions({
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Employees by Department",
          },
        },
        scales: {
          x: {
            grid: {
              borderDash: [5, 5],
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      });
    }
  }, [departmentCounts]); // The effect depends on the prop

  return <Bar options={chartOptions} data={chartData} />;
};

export default DepartmentsEmpChart;