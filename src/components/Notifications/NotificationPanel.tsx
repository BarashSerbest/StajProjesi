import { useState } from 'react';
import { Bell, Check, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../../types';
import { format } from 'date-fns';
import { useLanguage } from '../../context/LanguageContext';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationPanel({ notifications, onMarkAsRead, onDelete }: NotificationPanelProps) {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Translation mapping for notification titles
  const titleTranslations: { [key: string]: { en: string, tr: string } } = {
    'High anomaly rate detected': { en: 'High anomaly rate detected', tr: 'Yüksek anomali oranı tespit edildi' },
    'Stock alert': { en: 'Stock alert', tr: 'Stok uyarısı' },
    'System update completed': { en: 'System update completed', tr: 'Sistem güncellemesi tamamlandı' },
    'New order received': { en: 'New order received', tr: 'Yeni sipariş alındı' },
    'Shipping delay alert': { en: 'Shipping delay alert', tr: 'Kargo gecikmesi uyarısı' },
    'Payment completed': { en: 'Payment completed', tr: 'Ödeme tamamlandı' },
    'Order processed successfully': { en: 'Order processed successfully', tr: 'Sipariş başarıyla işlendi' },
    'Shipment delivered': { en: 'Shipment delivered', tr: 'Kargo teslim edildi' },
    'System backup completed': { en: 'System backup completed', tr: 'Sistem yedeklemesi tamamlandı' },
    'Database optimization finished': { en: 'Database optimization finished', tr: 'Veritabanı optimizasyonu tamamlandı' },
    'New customer registered': { en: 'New customer registered', tr: 'Yeni müşteri kaydı' },
    'Product review submitted': { en: 'Product review submitted', tr: 'Ürün değerlendirmesi gönderildi' },
    'Newsletter sent successfully': { en: 'Newsletter sent successfully', tr: 'Bülten başarıyla gönderildi' },
    'Monthly report generated': { en: 'Monthly report generated', tr: 'Aylık rapor oluşturuldu' },
    'System maintenance scheduled': { en: 'System maintenance scheduled', tr: 'Sistem bakımı planlandı' },
    'Critical system error detected': { en: 'Critical system error detected', tr: 'Kritik sistem hatası tespit edildi' },
    'Payment processing failed': { en: 'Payment processing failed', tr: 'Ödeme işlemi başarısız' },
    'Database connection lost': { en: 'Database connection lost', tr: 'Veritabanı bağlantısı kesildi' },
    'High error rate in API': { en: 'High error rate in API', tr: 'API\'de yüksek hata oranı' },
    'Security breach detected': { en: 'Security breach detected', tr: 'Güvenlik ihlali tespit edildi' },
    'Low inventory warning': { en: 'Low inventory warning', tr: 'Düşük stok uyarısı' },
    'High server load detected': { en: 'High server load detected', tr: 'Yüksek sunucu yükü tespit edildi' },
    'Unusual traffic pattern': { en: 'Unusual traffic pattern', tr: 'Olağandışı trafik deseni' },
    'Payment gateway slow': { en: 'Payment gateway slow', tr: 'Ödeme geçidi yavaş' },
    'Backup process delayed': { en: 'Backup process delayed', tr: 'Yedekleme işlemi gecikti' },
    // Additional notification titles from database
    'System health check passed': { en: 'System health check passed', tr: 'Sistem sağlık kontrolü başarılı' },
    'Security update installed': { en: 'Security update installed', tr: 'Güvenlik güncellemesi yüklendi' },
    'Performance improvements deployed': { en: 'Performance improvements deployed', tr: 'Performans iyileştirmeleri dağıtıldı' },
    'New feature released': { en: 'New feature released', tr: 'Yeni özellik yayınlandı' },
    'Data migration completed': { en: 'Data migration completed', tr: 'Veri taşıma tamamlandı' },
    'Cache refresh successful': { en: 'Cache refresh successful', tr: 'Önbellek yenileme başarılı' },
    'Maintenance window completed': { en: 'Maintenance window completed', tr: 'Bakım penceresi tamamlandı' },
    'Software update available': { en: 'Software update available', tr: 'Yazılım güncellemesi mevcut' },
    'New promotion launched': { en: 'New promotion launched', tr: 'Yeni promosyon başlatıldı' },
    'Analytics report ready': { en: 'Analytics report ready', tr: 'Analitik raporu hazır' },
    'User activity summary': { en: 'User activity summary', tr: 'Kullanıcı etkinlik özeti' },
    'Inventory report generated': { en: 'Inventory report generated', tr: 'Envanter raporu oluşturuldu' },
    'Weekly sales summary': { en: 'Weekly sales summary', tr: 'Haftalık satış özeti' },
    'System performance metrics': { en: 'System performance metrics', tr: 'Sistem performans metrikleri' },
    'Disk space running low': { en: 'Disk space running low', tr: 'Disk alanı azalıyor' },
    'Memory usage high': { en: 'Memory usage high', tr: 'Bellek kullanımı yüksek' },
    'Response time degradation': { en: 'Response time degradation', tr: 'Yanıt süresi bozulması' },
    'SSL certificate expiring': { en: 'SSL certificate expiring', tr: 'SSL sertifikası süresi doluyor' },
    'Queue processing delays': { en: 'Queue processing delays', tr: 'Kuyruk işleme gecikmeleri' },
    'API rate limit approaching': { en: 'API rate limit approaching', tr: 'API hız sınırına yaklaşılıyor' },
    'Database performance issues': { en: 'Database performance issues', tr: 'Veritabanı performans sorunları' },
    'Network connectivity issues': { en: 'Network connectivity issues', tr: 'Ağ bağlantı sorunları' },
    'Authentication service down': { en: 'Authentication service down', tr: 'Kimlik doğrulama servisi çalışmıyor' },
    'File system corruption': { en: 'File system corruption', tr: 'Dosya sistemi bozulması' },
    'Service dependency failure': { en: 'Service dependency failure', tr: 'Servis bağımlılık hatası' },
    'Configuration error detected': { en: 'Configuration error detected', tr: 'Yapılandırma hatası tespit edildi' },
    'Resource exhaustion warning': { en: 'Resource exhaustion warning', tr: 'Kaynak tükenme uyarısı' },
    'Load balancer issues': { en: 'Load balancer issues', tr: 'Yük dengeleyici sorunları' },
    'Cache invalidation failed': { en: 'Cache invalidation failed', tr: 'Önbellek geçersizleştirme başarısız' },
    'Session management error': { en: 'Session management error', tr: 'Oturum yönetim hatası' },
    // Additional missing notification titles from database
    'Server overload critical': { en: 'Server overload critical', tr: 'Sunucu aşırı yükü kritik' },
    'Authentication system failure': { en: 'Authentication system failure', tr: 'Kimlik doğrulama sistemi arızası' },
    'Data corruption detected': { en: 'Data corruption detected', tr: 'Veri bozulması tespit edildi' },
    'Service unavailable error': { en: 'Service unavailable error', tr: 'Servis kullanılamıyor hatası' },
    'Cache system failure': { en: 'Cache system failure', tr: 'Önbellek sistemi arızası' }
  };

  // Translation mapping for notification messages
  const messageTranslations: { [key: string]: { en: string, tr: string } } = {
    'Operation completed without any issues': { en: 'Operation completed without any issues', tr: 'İşlem herhangi bir sorun olmadan tamamlandı' },
    'Process executed successfully within timeframe': { en: 'Process executed successfully within timeframe', tr: 'İşlem belirlenen süre içinde başarıyla gerçekleştirildi' },
    'All systems operating normally': { en: 'All systems operating normally', tr: 'Tüm sistemler normal çalışıyor' },
    'Task completed as expected': { en: 'Task completed as expected', tr: 'Görev beklendiği gibi tamamlandı' },
    'Performance metrics within normal range': { en: 'Performance metrics within normal range', tr: 'Performans metrikleri normal aralıkta' },
    'Immediate attention required for system stability': { en: 'Immediate attention required for system stability', tr: 'Sistem kararlılığı için acil dikkat gerekli' },
    'Critical error affecting user experience': { en: 'Critical error affecting user experience', tr: 'Kullanıcı deneyimini etkileyen kritik hata' },
    'System performance degraded significantly': { en: 'System performance degraded significantly', tr: 'Sistem performansı önemli ölçüde düştü' },
    'Error rate exceeded acceptable threshold': { en: 'Error rate exceeded acceptable threshold', tr: 'Hata oranı kabul edilebilir eşiği aştı' },
    'Security incident requires investigation': { en: 'Security incident requires investigation', tr: 'Güvenlik olayı araştırma gerektiriyor' },
    'Monitor situation closely for potential issues': { en: 'Monitor situation closely for potential issues', tr: 'Potansiyel sorunlar için durumu yakından izleyin' },
    'Performance may be affected if not addressed': { en: 'Performance may be affected if not addressed', tr: 'Ele alınmazsa performans etkilenebilir' },
    'Warning threshold reached for system metrics': { en: 'Warning threshold reached for system metrics', tr: 'Sistem metrikleri için uyarı eşiğine ulaşıldı' },
    'Potential issue identified in system operations': { en: 'Potential issue identified in system operations', tr: 'Sistem operasyonlarında potansiyel sorun tespit edildi' },
    'Monitoring alert triggered for review': { en: 'Monitoring alert triggered for review', tr: 'İnceleme için izleme uyarısı tetiklendi' },
    'Information update for your awareness': { en: 'Information update for your awareness', tr: 'Bilginiz için bilgi güncellemesi' },
    'Status update on ongoing operations': { en: 'Status update on ongoing operations', tr: 'Devam eden operasyonlar durum güncellemesi' },
    'Routine notification for system activity': { en: 'Routine notification for system activity', tr: 'Sistem etkinliği için rutin bildirim' },
    'General information about system state': { en: 'General information about system state', tr: 'Sistem durumu hakkında genel bilgi' },
    'Standard operational notification': { en: 'Standard operational notification', tr: 'Standart operasyonel bildirim' },
    'Cancel rate for iPhone 15 Pro exceeded 15% in the last hour': { en: 'Cancel rate for iPhone 15 Pro exceeded 15% in the last hour', tr: 'iPhone 15 Pro için iptal oranı son saatte %15\'i aştı' },
    'MacBook Air M3 inventory is running low (5 units remaining)': { en: 'MacBook Air M3 inventory is running low (5 units remaining)', tr: 'MacBook Air M3 stoğu azalıyor (5 adet kaldı)' },
    'Anomaly detection system has been updated successfully': { en: 'Anomaly detection system has been updated successfully', tr: 'Anomali tespit sistemi başarıyla güncellendi' },
    'Large order received for gaming accessories': { en: 'Large order received for gaming accessories', tr: 'Oyun aksesuarları için büyük sipariş alındı' },
    'Potential delays in electronics category shipments': { en: 'Potential delays in electronics category shipments', tr: 'Elektronik kategori kargolarında potansiyel gecikmeler' }
  };

  const translateText = (text: string, isTitle: boolean = true): string => {
    const translations = isTitle ? titleTranslations : messageTranslations;
    const translation = translations[text];
    if (translation) {
      return language === 'tr' ? translation.tr : translation.en;
    }
    return text; // Return original text if no translation found
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const typeClasses = {
      error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type as keyof typeof typeClasses]}`}>
        {t(`notification.${type}`)}
      </span>
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" />
            {t('notifications.title')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('notifications.all')}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('notifications.unread')}
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'read'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {t('notifications.read')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {t('notifications.noNotifications')}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {translateText(notification.title, true)}
                        </h4>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {translateText(notification.message, false)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(notification.date), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title={t('notifications.markAsRead')}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title={t('notifications.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}