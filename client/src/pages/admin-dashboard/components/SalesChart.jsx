import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesChart = ({ data, title }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.payload?.name}</p>
          <p className="text-xs text-success">
            Sales: <span className="font-bold">${payload?.[0]?.value?.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full h-64 md:h-80" aria-label={title}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="sales" 
              fill="var(--color-accent)" 
              radius={[8, 8, 0, 0]}
              name="Sales ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;