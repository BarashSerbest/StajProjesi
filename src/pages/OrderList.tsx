import { useState, useEffect } from 'react';
import OrderTable from '../components/OrderList/OrderTable';
import { apiService } from '../services/api';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function OrderList() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await apiService.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Siparişler getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('orders.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('orders.subtitle')}
          </p>
        </div>
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
          {t('orders.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('orders.subtitle')}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[600px] overflow-y-auto">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}