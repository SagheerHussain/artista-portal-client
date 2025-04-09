import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

const PieChartWithCustomizedLabel = ({
  totalRevenue,
  totalRecievedAmount,
  pendingAmount,
  totalExpance,
}) => {
  const data = [
    { name: "Total Revenue", value: totalRevenue },
    { name: "Received Amount", value: totalRecievedAmount },
    { name: "Pending Amount", value: pendingAmount },
    { name: "Total Expense", value: totalExpance },
  ];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full rounded-xl shadow-lg p-4">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
            }}
            itemStyle={{ color: "#4FA0FF" }} // Tooltip values white
            labelStyle={{ color: "#C96FFE " }} // Tooltip label white
            cursor={{ fill: "#212121" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWithCustomizedLabel;
