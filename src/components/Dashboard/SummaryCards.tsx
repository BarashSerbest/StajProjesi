import React from 'react';
import { ShoppingCart, AlertTriangle, Truck, XCircle } from 'lucide-react';
import { DashboardStats } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SummaryCardsProps {
  stats: DashboardStats;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      title: t('dashboard.totalOrders'),
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: t('dashboard.anomaliesDetected'),
      value: stats.anomaliesDetected.toString(),
      icon: AlertTriangle,
      color: 'red',
      trend: '-5%'
    },
    {
      title: t('dashboard.lateShipments'),
      value: stats.lateShipments.toString(),
      icon: Truck,
      color: 'orange',
      trend: '+3%'
    },
    {
      title: t('dashboard.cancelledOrders'),
      value: stats.cancelledOrders.toString(),
      icon: XCircle,
      color: 'gray',
      trend: '-8%'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    gray: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${
                card.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}