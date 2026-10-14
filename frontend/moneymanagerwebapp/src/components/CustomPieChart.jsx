import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CustomPieChart = ({
  data = [],
  label = "",
  totalAmount = "",
  colors = [],
  showTextAnchor = false,
}) => {
  const chartData = data.filter((item) => Number(item.amount) > 0);

  return (
    <div className="relative h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
          >
            {chartData.map((item, index) => (
              <Cell
                key={item.name}
                fill={colors[index % colors.length] || "#7c3aed"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
          />
        </PieChart>
      </ResponsiveContainer>

      {showTextAnchor && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500">{label}</span>
          <span className="text-xl font-semibold">{totalAmount}</span>
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;