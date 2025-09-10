import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'Smart Order Monitoring and Alert System',
    'header.user': 'Admin User',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.orders': 'Order List',
    'sidebar.anomalies': 'Anomalies',
    'sidebar.notifications': 'Notifications',
    'sidebar.inventory': 'Inventory Tracking',
    'sidebar.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'General Order Overview',
    'dashboard.subtitle': 'E-commerce orders and real-time anomaly detection',
    'dashboard.totalOrders': 'Total Orders',
    'dashboard.anomaliesDetected': 'Anomalies Detected',
    'dashboard.lateShipments': 'Late Shipments',
    'dashboard.cancelledOrders': 'Cancelled Orders',
    'dashboard.ordersChart': 'Orders Over Time (Last 7 Days)',
    'dashboard.anomalyChart': 'Anomaly Types Distribution (Last 7 Days)',
    'dashboard.count': 'Count',
    'dashboard.percentage': 'Percentage',
    
    // Orders
    'orders.title': 'Order Management',
    'orders.subtitle': 'View and manage all orders across your marketplace channels',
    'orders.search': 'Search orders...',
    'orders.allStatus': 'All Status',
    'orders.pending': 'Pending',
    'orders.processing': 'Processing',
    'orders.shipped': 'Shipped',
    'orders.delivered': 'Delivered',
    'orders.cancelled': 'Cancelled',
    'orders.returned': 'Returned',
    'orders.orderId': 'Order ID',
    'orders.date': 'Date',
    'orders.customer': 'Customer',
    'orders.product': 'Product',
    'orders.amount': 'Amount',
    'orders.status': 'Status',
    'orders.anomaly': 'Anomaly',
    
    // Anomalies
    'anomalies.title': 'Anomaly Detection',
    'anomalies.subtitle': 'Monitor and investigate detected anomalies in your order flow',
    'anomalies.recent': 'Recent Anomalies',
    'anomalies.details': 'Anomaly Details',
    'anomalies.selectMessage': 'Select an anomaly to view details and suggested actions',
    'anomalies.suggestedActions': 'Suggested Actions:',
    'anomalies.relatedOrder': 'Related Order',
    'anomalies.highCancelRate': 'High Cancel Rate',
    'anomalies.stockOut': 'Stock Out',
    'anomalies.lateShipping': 'Late Shipping',
    'anomalies.priceAnomaly': 'Price Anomaly',
    
    // Notifications
    'notifications.title': 'Notifications Center',
    'notifications.subtitle': 'Stay updated with real-time alerts and system notifications',
    'notifications.all': 'All',
    'notifications.unread': 'Unread',
    'notifications.read': 'Read',
    'notifications.noNotifications': 'No notifications found.',
    'notifications.markAsRead': 'Mark as read',
    'notifications.delete': 'Delete',
    
    // Notification Content Translations
    'notification.high_anomaly_rate': 'High anomaly rate detected',
    'notification.stock_alert': 'Stock alert',
    'notification.system_update': 'System update completed',
    'notification.new_order': 'New order received',
    'notification.shipping_delay': 'Shipping delay alert',
    'notification.payment_completed': 'Payment completed',
    'notification.order_processed': 'Order processed successfully',
    'notification.shipment_delivered': 'Shipment delivered',
    'notification.system_backup': 'System backup completed',
    'notification.database_optimization': 'Database optimization finished',
    'notification.customer_registered': 'New customer registered',
    'notification.product_review': 'Product review submitted',
    'notification.newsletter_sent': 'Newsletter sent successfully',
    'notification.monthly_report': 'Monthly report generated',
    'notification.system_maintenance': 'System maintenance scheduled',
    'notification.critical_error': 'Critical system error detected',
    'notification.payment_failed': 'Payment processing failed',
    'notification.database_connection': 'Database connection lost',
    'notification.api_error': 'High error rate in API',
    'notification.security_breach': 'Security breach detected',
    'notification.low_inventory': 'Low inventory warning',
    'notification.server_load': 'High server load detected',
    'notification.traffic_pattern': 'Unusual traffic pattern',
    'notification.payment_gateway': 'Payment gateway slow',
    'notification.backup_delayed': 'Backup process delayed',
    
    // Notification Messages
    'notification.msg.operation_completed': 'Operation completed without any issues',
    'notification.msg.process_successful': 'Process executed successfully within timeframe',
    'notification.msg.systems_normal': 'All systems operating normally',
    'notification.msg.task_completed': 'Task completed as expected',
    'notification.msg.performance_normal': 'Performance metrics within normal range',
    'notification.msg.attention_required': 'Immediate attention required for system stability',
    'notification.msg.error_affecting': 'Critical error affecting user experience',
    'notification.msg.performance_degraded': 'System performance degraded significantly',
    'notification.msg.error_threshold': 'Error rate exceeded acceptable threshold',
    'notification.msg.security_investigation': 'Security incident requires investigation',
    'notification.msg.monitor_situation': 'Monitor situation closely for potential issues',
    'notification.msg.performance_affected': 'Performance may be affected if not addressed',
    'notification.msg.warning_threshold': 'Warning threshold reached for system metrics',
    'notification.msg.issue_identified': 'Potential issue identified in system operations',
    'notification.msg.monitoring_alert': 'Monitoring alert triggered for review',
    'notification.msg.information_update': 'Information update for your awareness',
    'notification.msg.status_update': 'Status update on ongoing operations',
    'notification.msg.routine_notification': 'Routine notification for system activity',
    'notification.msg.general_information': 'General information about system state',
    'notification.msg.operational_notification': 'Standard operational notification',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.subtitle': 'Configure your anomaly detection preferences and notification settings',
    'settings.general': 'General Settings',
    'settings.emailAlerts': 'Email Alerts',
    'settings.emailAlertsDesc': 'Receive email notifications for anomalies',
    'settings.slackWebhook': 'Slack Webhook URL',
    'settings.thresholds': 'Anomaly Thresholds',
    'settings.cancelRate': 'Cancel Rate Threshold',
    'settings.lateShipping': 'Late Shipping Threshold',
    'settings.stockOut': 'Stock Out Threshold',
    'settings.notificationPrefs': 'Notification Preferences',
    'settings.highSeverity': 'High Severity Alerts',
    'settings.mediumSeverity': 'Medium Severity Alerts',
    'settings.lowSeverity': 'Low Severity Alerts',
    'settings.highSeverityDesc': 'Receive notifications for high severity anomalies',
    'settings.mediumSeverityDesc': 'Receive notifications for medium severity anomalies',
    'settings.lowSeverityDesc': 'Receive notifications for low severity anomalies',
    'settings.save': 'Save Settings',
    'settings.saving': 'Saving...',
    'settings.saved': 'Settings saved successfully!',
    
    // Inventory
    'inventory.title': 'Inventory Tracking',
    'inventory.subtitle': 'Monitor and manage product stock levels across your inventory',
    'inventory.search': 'Search products...',
    'inventory.stockList': 'Stock List',
    'inventory.filterAll': 'All',
    'inventory.filterInStock': 'In Stock',
    'inventory.filterLowStock': 'Low Stock',
    'inventory.filterOutOfStock': 'Out of Stock',
    'inventory.current': 'Current',
    'inventory.noProductsFound': 'No products found',
    'inventory.noProductsMatch': 'No products match your search criteria.',
    'inventory.noProductsAdded': 'No products have been added yet.',
    'inventory.productsShowing': 'products showing',
    'inventory.searchResults': 'search results for',
    'inventory.totalProducts': 'Total Products',
    'inventory.ofTotal': 'of total',
    'inventory.needsReplenishment': 'Needs urgent replenishment',
    'inventory.criticalStatus': 'Critical status',
    'inventory.productName': 'Product Name',
    'inventory.currentStock': 'Current Stock',
    'inventory.minStock': 'Min Stock',
    'inventory.maxStock': 'Max Stock',
    'inventory.status': 'Status',
    'inventory.actions': 'Actions',
    'inventory.lastUpdated': 'Last Updated',
    'inventory.inStock': 'In Stock',
    'inventory.lowStock': 'Low Stock',
    'inventory.outOfStock': 'Out of Stock',
    'inventory.editStock': 'Edit Stock',
    'inventory.updateStock': 'Update Stock',
    'inventory.currentStockLevel': 'Current Stock Level',
    'inventory.minimumStockLevel': 'Minimum Stock Level',
    'inventory.cancel': 'Cancel',
    'inventory.save': 'Save Changes',
    'inventory.stockUpdated': 'Stock updated successfully!',
    'inventory.lowStockAlert': 'Low Stock Alert',
    'inventory.outOfStockAlert': 'Out of Stock Alert',
    'inventory.units': 'units',
    
    // Common
    'common.hours': 'hours',
    'common.units': 'units',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.loginTitle': 'Welcome Back',
    'auth.loginSubtitle': 'Sign in to your account to continue',
    'auth.registerTitle': 'Create Account',
    'auth.registerSubtitle': 'Join us to get started',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Create Account',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signUp': 'Sign up',
    'auth.signIn': 'Sign in',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Account created successfully!',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.userExists': 'User with this email already exists',
    'auth.allFieldsRequired': 'All fields are required',
    'auth.logout': 'Logout',
    'auth.confirmLogout': 'Are you sure you want to logout?',
    'auth.forgotPassword': 'Forgot Password',
    'auth.forgotPasswordTitle': 'Forgot Password',
    'auth.emailAddress': 'Email Address',
    'auth.enterEmail': 'Enter your email address',
    'auth.send': 'Send',
    'auth.cancel': 'Cancel',
    'auth.emailRequired': 'Email address is required',
    'auth.resetEmailSent': 'Password reset email sent',
    'auth.errorOccurred': 'An error occurred',
    
    // Anomaly types
    'anomaly.highCancelRate': 'High Cancel Rate',
    'anomaly.stockOut': 'Stock Out',
    'anomaly.lateShipping': 'Late Shipping',
    'anomaly.priceAnomaly': 'Price Anomaly',
    
    // Anomaly descriptions
    'anomaly.desc.highCancelRate': 'High cancellation rate detected',
    'anomaly.desc.stockOut': 'Stock shortage detected',
    'anomaly.desc.lateShipping': 'Shipping delays detected',
    'anomaly.desc.priceAnomaly': 'Price fluctuation detected',
    'anomaly.desc.generalCategory': 'General category anomaly - no specific order',
    
    // Notification types
    'notification.info': 'INFO',
    'notification.warning': 'WARNING',
    'notification.error': 'ERROR',
    'notification.success': 'SUCCESS',
  },
  tr: {
    // Header
    'header.title': 'Akıllı Sipariş Takip ve Uyarı Sistemi',
    'header.user': 'Yönetici Kullanıcı',
    
    // Sidebar
    'sidebar.dashboard': 'Ana Sayfa',
    'sidebar.orders': 'Sipariş Listesi',
    'sidebar.anomalies': 'Anomaliler',
    'sidebar.notifications': 'Bildirimler',
    'sidebar.inventory': 'Stok Takip',
    'sidebar.settings': 'Ayarlar',
    
    // Dashboard
    'dashboard.title': 'Genel Sipariş Özeti',
    'dashboard.subtitle': 'E-ticaret siparişleri ve gerçek zamanlı anomali tespitleri',
    'dashboard.totalOrders': 'Toplam Sipariş',
    'dashboard.anomaliesDetected': 'Tespit Edilen Anomali',
    'dashboard.lateShipments': 'Geç Kargolar',
    'dashboard.cancelledOrders': 'İptal Edilen Siparişler',
    'dashboard.ordersChart': 'Zaman İçinde Siparişler (Son 7 Gün)',
    'dashboard.anomalyChart': 'Anomali Türleri Dağılımı (Son 7 Gün)',
    'dashboard.count': 'Adet',
    'dashboard.percentage': 'Yüzde',
    
    // Orders
    'orders.title': 'Sipariş Yönetimi',
    'orders.subtitle': 'Tüm pazar yeri kanallarınızdaki siparişleri görüntüleyin ve yönetin',
    'orders.search': 'Sipariş ara...',
    'orders.allStatus': 'Tüm Durumlar',
    'orders.pending': 'Beklemede',
    'orders.processing': 'İşleniyor',
    'orders.shipped': 'Kargoya Verildi',
    'orders.delivered': 'Teslim Edildi',
    'orders.cancelled': 'İptal Edildi',
    'orders.returned': 'İade Edildi',
    'orders.orderId': 'Sipariş No',
    'orders.date': 'Tarih',
    'orders.customer': 'Müşteri',
    'orders.product': 'Ürün',
    'orders.amount': 'Tutar',
    'orders.status': 'Durum',
    'orders.anomaly': 'Anomali',
    
    // Anomalies
    'anomalies.title': 'Anomali Tespiti',
    'anomalies.subtitle': 'Sipariş akışınızdaki tespit edilen anomalileri izleyin ve araştırın',
    'anomalies.recent': 'Son Anomaliler',
    'anomalies.details': 'Anomali Detayları',
    'anomalies.selectMessage': 'Detayları ve önerilen eylemleri görmek için bir anomali seçin',
    'anomalies.suggestedActions': 'Önerilen Eylemler:',
    'anomalies.relatedOrder': 'İlgili Sipariş',
    'anomalies.highCancelRate': 'Yüksek İptal Oranı',
    'anomalies.stockOut': 'Stok Tükendi',
    'anomalies.lateShipping': 'Geç Kargo',
    'anomalies.priceAnomaly': 'Fiyat Anomalisi',
    
    // Notifications
    'notifications.title': 'Bildirim Merkezi',
    'notifications.subtitle': 'Gerçek zamanlı uyarılar ve sistem bildirimleri ile güncel kalın',
    'notifications.all': 'Tümü',
    'notifications.unread': 'Okunmamış',
    'notifications.read': 'Okunmuş',
    'notifications.noNotifications': 'Bildirim bulunamadı.',
    'notifications.markAsRead': 'Okundu olarak işaretle',
    'notifications.delete': 'Sil',
    
    // Notification Content Translations
    'notification.high_anomaly_rate': 'Yüksek anomali oranı tespit edildi',
    'notification.stock_alert': 'Stok uyarısı',
    'notification.system_update': 'Sistem güncellemesi tamamlandı',
    'notification.new_order': 'Yeni sipariş alındı',
    'notification.shipping_delay': 'Kargo gecikmesi uyarısı',
    'notification.payment_completed': 'Ödeme tamamlandı',
    'notification.order_processed': 'Sipariş başarıyla işlendi',
    'notification.shipment_delivered': 'Kargo teslim edildi',
    'notification.system_backup': 'Sistem yedeklemesi tamamlandı',
    'notification.database_optimization': 'Veritabanı optimizasyonu tamamlandı',
    'notification.customer_registered': 'Yeni müşteri kaydı',
    'notification.product_review': 'Ürün değerlendirmesi gönderildi',
    'notification.newsletter_sent': 'Bülten başarıyla gönderildi',
    'notification.monthly_report': 'Aylık rapor oluşturuldu',
    'notification.system_maintenance': 'Sistem bakımı planlandı',
    'notification.critical_error': 'Kritik sistem hatası tespit edildi',
    'notification.payment_failed': 'Ödeme işlemi başarısız',
    'notification.database_connection': 'Veritabanı bağlantısı kesildi',
    'notification.api_error': 'API\'de yüksek hata oranı',
    'notification.security_breach': 'Güvenlik ihlali tespit edildi',
    'notification.low_inventory': 'Düşük stok uyarısı',
    'notification.server_load': 'Yüksek sunucu yükü tespit edildi',
    'notification.traffic_pattern': 'Olağandışı trafik deseni',
    'notification.payment_gateway': 'Ödeme geçidi yavaş',
    'notification.backup_delayed': 'Yedekleme işlemi gecikti',
    
    // Notification Messages
    'notification.msg.operation_completed': 'İşlem herhangi bir sorun olmadan tamamlandı',
    'notification.msg.process_successful': 'İşlem belirlenen süre içinde başarıyla gerçekleştirildi',
    'notification.msg.systems_normal': 'Tüm sistemler normal çalışıyor',
    'notification.msg.task_completed': 'Görev beklendiği gibi tamamlandı',
    'notification.msg.performance_normal': 'Performans metrikleri normal aralıkta',
    'notification.msg.attention_required': 'Sistem kararlılığı için acil dikkat gerekli',
    'notification.msg.error_affecting': 'Kullanıcı deneyimini etkileyen kritik hata',
    'notification.msg.performance_degraded': 'Sistem performansı önemli ölçüde düştü',
    'notification.msg.error_threshold': 'Hata oranı kabul edilebilir eşiği aştı',
    'notification.msg.security_investigation': 'Güvenlik olayı araştırma gerektiriyor',
    'notification.msg.monitor_situation': 'Potansiyel sorunlar için durumu yakından izleyin',
    'notification.msg.performance_affected': 'Ele alınmazsa performans etkilenebilir',
    'notification.msg.warning_threshold': 'Sistem metrikleri için uyarı eşiğine ulaşıldı',
    'notification.msg.issue_identified': 'Sistem operasyonlarında potansiyel sorun tespit edildi',
    'notification.msg.monitoring_alert': 'İnceleme için izleme uyarısı tetiklendi',
    'notification.msg.information_update': 'Bilginiz için bilgi güncellemesi',
    'notification.msg.status_update': 'Devam eden operasyonlar durum güncellemesi',
    'notification.msg.routine_notification': 'Sistem etkinliği için rutin bildirim',
    'notification.msg.general_information': 'Sistem durumu hakkında genel bilgi',
    'notification.msg.operational_notification': 'Standart operasyonel bildirim',
    
    // Settings
    'settings.title': 'Sistem Ayarları',
    'settings.subtitle': 'Anomali tespit tercihlerinizi ve bildirim ayarlarınızı yapılandırın',
    'settings.general': 'Genel Ayarlar',
    'settings.emailAlerts': 'E-posta Uyarıları',
    'settings.emailAlertsDesc': 'Anomaliler için e-posta bildirimleri alın',
    'settings.slackWebhook': 'Slack Webhook URL',
    'settings.thresholds': 'Anomali Eşikleri',
    'settings.cancelRate': 'İptal Oranı Eşiği',
    'settings.lateShipping': 'Geç Kargo Eşiği',
    'settings.stockOut': 'Stok Tükendi Eşiği',
    'settings.notificationPrefs': 'Bildirim Tercihleri',
    'settings.highSeverity': 'Yüksek Önem Uyarıları',
    'settings.mediumSeverity': 'Orta Önem Uyarıları',
    'settings.lowSeverity': 'Düşük Önem Uyarıları',
    'settings.highSeverityDesc': 'Yüksek önem anomalileri için bildirim alın',
    'settings.mediumSeverityDesc': 'Orta önem anomalileri için bildirim alın',
    'settings.lowSeverityDesc': 'Düşük önem anomalileri için bildirim alın',
    'settings.save': 'Ayarları Kaydet',
    'settings.saving': 'Kaydediliyor...',
    'settings.saved': 'Ayarlar başarıyla kaydedildi!',
    
    // Inventory
    'inventory.title': 'Stok Takip',
    'inventory.subtitle': 'Ürün stok seviyelerini izleyin ve yönetin',
    'inventory.search': 'Ürün ara...',
    'inventory.stockList': 'Stok Listesi',
    'inventory.filterAll': 'Tümü',
    'inventory.filterInStock': 'Stokta',
    'inventory.filterLowStock': 'Düşük Stok',
    'inventory.filterOutOfStock': 'Stok Yok',
    'inventory.current': 'Mevcut',
    'inventory.noProductsFound': 'Ürün bulunamadı',
    'inventory.noProductsMatch': 'Arama kriterlerinize uygun ürün bulunamadı.',
    'inventory.noProductsAdded': 'Henüz hiç ürün eklenmemiş.',
    'inventory.productsShowing': 'ürün gösteriliyor',
    'inventory.searchResults': 'için arama sonuçları',
    'inventory.totalProducts': 'Toplam Ürün',
    'inventory.ofTotal': 'toplam',
    'inventory.needsReplenishment': 'Acil tedarik gerekli',
    'inventory.criticalStatus': 'Kritik durum',
    'inventory.productName': 'Ürün Adı',
    'inventory.currentStock': 'Mevcut Stok',
    'inventory.minStock': 'Min Stok',
    'inventory.maxStock': 'Maks Stok',
    'inventory.status': 'Durum',
    'inventory.actions': 'İşlemler',
    'inventory.lastUpdated': 'Son Güncelleme',
    'inventory.inStock': 'Stokta',
    'inventory.lowStock': 'Düşük Stok',
    'inventory.outOfStock': 'Stok Yok',
    'inventory.editStock': 'Stok Düzenle',
    'inventory.updateStock': 'Stok Güncelle',
    'inventory.currentStockLevel': 'Mevcut Stok Seviyesi',
    'inventory.minimumStockLevel': 'Minimum Stok Seviyesi',
    'inventory.cancel': 'İptal',
    'inventory.save': 'Değişiklikleri Kaydet',
    'inventory.stockUpdated': 'Stok başarıyla güncellendi!',
    'inventory.lowStockAlert': 'Düşük Stok Uyarısı',
    'inventory.outOfStockAlert': 'Stok Tükendi Uyarısı',
    'inventory.units': 'adet',
    
    // Common
    'common.hours': 'saat',
    'common.units': 'adet',
    
    // Authentication
    'auth.login': 'Giriş Yap',
    'auth.register': 'Kayıt Ol',
    'auth.loginTitle': 'Hoş Geldiniz',
    'auth.loginSubtitle': 'Devam etmek için hesabınıza giriş yapın',
    'auth.registerTitle': 'Hesap Oluştur',
    'auth.registerSubtitle': 'Başlamak için bize katılın',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.username': 'Kullanıcı Adı',
    'auth.loginButton': 'Giriş Yap',
    'auth.registerButton': 'Hesap Oluştur',
    'auth.noAccount': 'Hesabınız yok mu?',
    'auth.hasAccount': 'Zaten hesabınız var mı?',
    'auth.signUp': 'Kayıt ol',
    'auth.signIn': 'Giriş yap',
    'auth.loginSuccess': 'Giriş başarılı!',
    'auth.registerSuccess': 'Hesap başarıyla oluşturuldu!',
    'auth.invalidCredentials': 'Geçersiz e-posta veya şifre',
    'auth.userExists': 'Bu e-posta ile kullanıcı zaten mevcut',
    'auth.allFieldsRequired': 'Tüm alanlar zorunludur',
    'auth.logout': 'Çıkış Yap',
    'auth.confirmLogout': 'Çıkış yapmak istediğinizden emin misiniz?',
    'auth.forgotPassword': 'Şifremi Unuttum',
    'auth.forgotPasswordTitle': 'Şifremi Unuttum',
    'auth.emailAddress': 'E-posta Adresi',
    'auth.enterEmail': 'E-posta adresinizi girin',
    'auth.send': 'Gönder',
    'auth.cancel': 'İptal',
    'auth.emailRequired': 'E-posta adresi gerekli',
    'auth.resetEmailSent': 'Şifre sıfırlama e-postası gönderildi',
    'auth.errorOccurred': 'Bir hata oluştu',
    
    // Anomaly types
    'anomaly.highCancelRate': 'Yüksek İptal Oranı',
    'anomaly.stockOut': 'Stok Tükendi',
    'anomaly.lateShipping': 'Geç Kargo',
    'anomaly.priceAnomaly': 'Fiyat Anomalisi',
    
    // Anomaly descriptions
    'anomaly.desc.highCancelRate': 'Yüksek iptal oranı tespit edildi',
    'anomaly.desc.stockOut': 'Stok sıkıntısı tespit edildi',
    'anomaly.desc.lateShipping': 'Kargo gecikmeleri tespit edildi',
    'anomaly.desc.priceAnomaly': 'Fiyat dalgalanması tespit edildi',
    'anomaly.desc.generalCategory': 'Genel kategori anomalisi - belirli sipariş yok',
    
    // Notification types
    'notification.info': 'BİLGİ',
    'notification.warning': 'UYARI',
    'notification.error': 'HATA',
    'notification.success': 'BAŞARILI',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}