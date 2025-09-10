import { useState, useEffect } from 'react';
import NotificationPanel from '../components/Notifications/NotificationPanel';
import { apiService } from '../services/api';
import { Notification } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notificationsData = await apiService.getNotifications();
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Bildirimler getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Bildirim silinirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notifications.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('notifications.subtitle')}
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
          {t('notifications.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('notifications.subtitle')}
        </p>
      </div>
      
      <NotificationPanel 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}