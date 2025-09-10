import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnomalyTypeData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface AnomalyChartProps {
  data: AnomalyTypeData[];
}

export default function AnomalyChart({ data }: AnomalyChartProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Görüntüleme için anomali türü isimlerini çevir
  const translatedData = data.map(item => ({
    ...item,
    name: t(item.name) || item.name
  }));

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Daha iyi tema desteği için özel tooltip renderer'ı
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3">
          <p className="text-gray-900 dark:text-white font-semibold">
            {data.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('dashboard.count')}: <span className="font-medium text-blue-600 dark:text-blue-400">{data.value}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('dashboard.percentage')}: <span className="font-medium text-green-600 dark:text-green-400">{((data.value / translatedData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {t('dashboard.anomalyChart')}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={translatedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {translatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ 
              color: theme === 'dark' ? '#D1D5DB' : '#6B7280'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}