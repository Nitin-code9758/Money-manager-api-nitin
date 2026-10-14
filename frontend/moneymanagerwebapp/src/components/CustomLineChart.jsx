import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomLineChart = ({ data = [] }) => {
  const [range, setRange] = useState("All");

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const sortedData = [...data]
      .filter((item) => item.date && Number.isFinite(Number(item.amount)))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const daysByRange = { "7D": 7, "30D": 30, "90D": 90 };

    if (range === "All") return sortedData;

    // Show transactions from the selected number of days.
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysByRange[range]);

    return sortedData.filter((item) => new Date(item.date) >= cutoff);
  }, [data, range]);

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  return (
    <div className="w-full">
      <div className="mb-5 flex gap-2">
        {["7D", "30D", "90D", "All"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={`rounded-lg px-4 py-2 text-sm transition-colors ${
              range === option
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-violet-500"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          Is date range ke liye income data nahi hai.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
              width={90}
            />

            <Tooltip
              formatter={(value) => [formatCurrency(value), "Income"]}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN")
              }
            />

            <Line
              type="monotone"
              dataKey="amount"
              name="Income"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 5, fill: "#7c3aed" }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomLineChart;