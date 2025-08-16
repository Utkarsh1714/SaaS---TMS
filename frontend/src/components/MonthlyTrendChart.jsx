import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const quarters = [
  { label: "Jan - Mar", value: 1 },
  { label: "Apr - Jun", value: 2 },
  { label: "Jul - Sep", value: 3 },
  { label: "Oct - Dec", value: 4 },
];

const MonthlyTrendChart = () => {
  const [trendData, setTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState({ period: "3M" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      let url = `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data2`;

      // if the specific quarter is selected, append it to the URL
      if (timeRange.quarter) {
        url += `?year=${timeRange.year}&quarter=${timeRange.quarter}`;
      }

      try {
        const response = await axios.get(url, { withCredentials: true });
        setTrendData(response.data);
      } catch (error) {
        setError("Failed to fetch data", error);
        console.error("Error fetching monthly trend data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // In MonthlyTrendChart.jsx

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-visible">
      {/* Row 1: Title */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Completed Tasks — Trend</h3>
        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Year:</span>
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[100px] text-black">
              <SelectValue placeholder="year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: All Controls, aligned to the right */}
      <div className="flex justify-end items-center gap-4 mb-4">
        {/* Period Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timeRange.period === "3M" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTimeRange({ period: "3M" })}
          >
            Last 3 Months
          </Button>

          {quarters.map((q) => (
            <Button
              key={q.value}
              variant={
                timeRange.year === selectedYear && timeRange.quarter === q.value
                  ? "secondary"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setTimeRange({ year: selectedYear, quarter: q.value })
              }
            >
              {q.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart rendering part (no changes here) */}
      {!isLoading && !error && (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name="Completed Tasks"
                stroke="#16a34a"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlyTrendChart;
