import { useState, useEffect } from 'react';
import SummaryCards from '../components/Dashboard/SummaryCards';
import OrdersChart from '../components/Dashboard/OrdersChart';
import AnomalyChart from '../components/Dashboard/AnomalyChart';
import { apiService } from '../services/api';
import { DashboardStats, ChartData, AnomalyTypeData } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [anomalyTypes, setAnomalyTypes] = useState<AnomalyTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Dashboard verisi getiriliyor...');
        
        const [statsData, chartDataResponse, anomalyTypesData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getChartData(),
          apiService.getAnomalyTypes()
        ]);
        
        console.log('İstatistik verisi:', statsData);
        console.log('Grafik verisi:', chartDataResponse);
        console.log('Anomali türleri verisi:', anomalyTypesData);
        
        setStats(statsData);
        setChartData(chartDataResponse);
        setAnomalyTypes(anomalyTypesData);
      } catch (error) {
        console.error('Dashboard verisi getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('dashboard.subtitle')}
        </p>
      </div>
      
      {stats && <SummaryCards stats={stats} />}
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <OrdersChart data={chartData} />
        <AnomalyChart data={anomalyTypes} />
      </div>
    </div>
  );
}