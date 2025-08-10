import React from 'react';
import {
  LineChart, BarChart, PieChart, AreaChart,
  Line, Bar, Pie, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartContainer = ({
  data,
  type,
  title,
  xAxisKey,
  dataKeys,
  width = '100%',
  height = 300,
  showLegend = true,
  grid = true,
  tooltip = true,
  stackBars = false
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {tooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {tooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                stackId={stackBars ? "1" : undefined}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKeys[0]}
              nameKey={xAxisKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {tooltip && <Tooltip formatter={(value) => [value, title]} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            {grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {tooltip && <Tooltip />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartContainer;
