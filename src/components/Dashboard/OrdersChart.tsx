import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface OrdersChartProps {
  data: ChartData[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {t('dashboard.ordersChart')}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="anomalies"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#EF4444', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}