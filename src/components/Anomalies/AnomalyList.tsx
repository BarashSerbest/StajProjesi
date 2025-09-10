import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Anomaly } from '../../types';
import { format } from 'date-fns';
import { useLanguage } from '../../context/LanguageContext';

interface AnomalyListProps {
  anomalies: Anomaly[];
  onAnomalyClick: (anomaly: Anomaly) => void;
  thresholds?: {
    cancelRateThreshold: number;
    lateShippingThreshold: number;
    stockOutThreshold: number;
  };
}

export default function AnomalyList({ anomalies, onAnomalyClick, thresholds }: AnomalyListProps) {
  const { t, language } = useLanguage();

  // Varyılan eşik değerleri
  const currentThresholds = thresholds || {
    cancelRateThreshold: 15,
    lateShippingThreshold: 24,
    stockOutThreshold: 5
  };

  // Anomali açıklamaları için çeviri eşlemeleri  
  const descriptionTranslations: { [key: string]: { en: string, tr: string } } = {
    'Cancel rate exceeded 15% threshold for iPhone 15 Pro': { en: 'Cancel rate exceeded 15% threshold for iPhone 15 Pro', tr: 'iPhone 15 Pro için iptal oranı %15 eşiğini aştı' },
    'MacBook Air M3 out of stock but still accepting orders': { en: 'MacBook Air M3 out of stock but still accepting orders', tr: 'MacBook Air M3 stokta yok ama hala sipariş kabul ediyor' },
    'Shipping delay detected for electronics category': { en: 'Shipping delay detected for electronics category', tr: 'Elektronik kategorisinde kargo gecikmesi tespit edildi' },
    'Shipping delays detected in electronics category': { en: 'Shipping delays detected in electronics category', tr: 'Elektronik kategorisinde kargo gecikmesi tespit edildi' },
    'Price fluctuation detected for gaming consoles': { en: 'Price fluctuation detected for gaming consoles', tr: 'Oyun konsolları için fiyat dalgalanması tespit edildi' },
    'High cancel rate detected for Samsung Galaxy S24': { en: 'High cancel rate detected for Samsung Galaxy S24', tr: 'Samsung Galaxy S24 için yüksek iptal oranı tespit edildi' },
    'Unusual cancel rate spike in electronics category': { en: 'Unusual cancel rate spike in electronics category', tr: 'Elektronik kategorisinde olağandışı iptal oranı artışı' },
    'Critical shipping delays in Istanbul region': { en: 'Critical shipping delays in Istanbul region', tr: 'İstanbul bölgesinde kritik kargo gecikmeleri' },
    'Minor delays detected in Ankara shipments': { en: 'Minor delays detected in Ankara shipments', tr: 'Ankara kargolarında küçük gecikmeler tespit edildi' },
    'PlayStation 5 inventory running low': { en: 'PlayStation 5 inventory running low', tr: 'PlayStation 5 stoğu azalıyor' },
    'Minor price discrepancy in Apple products': { en: 'Minor price discrepancy in Apple products', tr: 'Apple ürünlerinde küçük fiyat tutarsızlığı' },
    'Slight increase in cancel rate for accessories': { en: 'Slight increase in cancel rate for accessories', tr: 'Aksesuarlarda iptal oranında hafif artış' },
    'Minor shipping delays in Izmir region': { en: 'Minor shipping delays in Izmir region', tr: 'İzmir bölgesinde küçük kargo gecikmeleri' },
    'High cancel rate detected for electronics': { en: 'High cancel rate detected for electronics', tr: 'Elektroniklerde yüksek iptal oranı tespit edildi' },
    'Unusual cancellation spike in mobile phones': { en: 'Unusual cancellation spike in mobile phones', tr: 'Cep telefonlarında olağandışı iptal artışı' },
    'Cancel rate exceeded threshold for accessories': { en: 'Cancel rate exceeded threshold for accessories', tr: 'Aksesuarlarda iptal oranı eşiği aşıldı' },
    'Significant increase in order cancellations': { en: 'Significant increase in order cancellations', tr: 'Sipariş iptallerinde önemli artış' },
    'Cancel rate anomaly in gaming category': { en: 'Cancel rate anomaly in gaming category', tr: 'Oyun kategorisinde iptal oranı anomalisi' },
    'Product inventory critically low': { en: 'Product inventory critically low', tr: 'Ürün stoğu kritik seviyede düşük' },
    'Stock shortage detected in electronics': { en: 'Stock shortage detected in electronics', tr: 'Elektroniklerde stok sıkıntısı tespit edildi' },
    'Inventory depletion warning': { en: 'Inventory depletion warning', tr: 'Stok tükenme uyarısı' },
    'Product availability issue detected': { en: 'Product availability issue detected', tr: 'Ürün kullanılabilirlik sorunu tespit edildi' },
    'Stock out anomaly in popular items': { en: 'Stock out anomaly in popular items', tr: 'Popüler ürünlerde stok tükenme anomalisi' },
    'Shipping delays detected in region': { en: 'Shipping delays detected in region', tr: 'Bölgede kargo gecikmeleri tespit edildi' },
    'Delivery time anomaly identified': { en: 'Delivery time anomaly identified', tr: 'Teslimat süresi anomalisi belirlendi' },
    'Late shipment pattern observed': { en: 'Late shipment pattern observed', tr: 'Geç kargo deseni gözlemlendi' },
    'Logistics delay warning': { en: 'Logistics delay warning', tr: 'Lojistik gecikme uyarısı' },
    'Shipping performance degradation': { en: 'Shipping performance degradation', tr: 'Kargo performansında bozulma' },
    'Price fluctuation detected': { en: 'Price fluctuation detected', tr: 'Fiyat dalgalanması tespit edildi' },
    'Pricing inconsistency found': { en: 'Pricing inconsistency found', tr: 'Fiyatlandırma tutarsızlığı bulundu' },
    'Market price deviation observed': { en: 'Market price deviation observed', tr: 'Piyasa fiyat sapması gözlemlendi' },
    'Price anomaly in category': { en: 'Price anomaly in category', tr: 'Kategoride fiyat anomalisi' },
    'Unexpected price change detected': { en: 'Unexpected price change detected', tr: 'Beklenmeyen fiyat değişimi tespit edildi' },
    'Low stock detected: Lenovo ThinkPad X1, Samsung Galaxy S24, iPhone 15 Pro (below 5 units)': { en: 'Low stock detected: Lenovo ThinkPad X1, Samsung Galaxy S24, iPhone 15 Pro (below 5 units)', tr: 'Düşük stok tespit edildi: Lenovo ThinkPad X1, Samsung Galaxy S24, iPhone 15 Pro (5 adet altında)' },
    'Cancel rate for iPhone 15 Pro exceeded 15% threshold': { en: 'Cancel rate for iPhone 15 Pro exceeded 15% threshold', tr: 'iPhone 15 Pro için iptal oranı %15 eşiğini aştı' },
    'Cancel rate (24.6%) exceeded threshold value (15%) in the last 24 hours': { en: 'Cancel rate (24.6%) exceeded threshold value (15%) in the last 24 hours', tr: 'İptal oranı (%24.6) son 24 saatte eşik değerini (%15) aştı' },
    'Cancel rate (24.6%) exceeded threshold value (20%) in the last 24 hours': { en: 'Cancel rate (24.6%) exceeded threshold value (20%) in the last 24 hours', tr: 'İptal oranı (%24.6) son 24 saatte eşik değerini (%20) aştı' },
    '795 orders have exceeded 24h shipping threshold': { en: '795 orders have exceeded 24h shipping threshold', tr: '795 sipariş 24 saatlik kargo eşik değerini aştı' },
    'Low stock detected: Lenovo ThinkPad X1, AirPods Pro (critically low)': { en: 'Low stock detected: Lenovo ThinkPad X1, AirPods Pro (critically low)', tr: 'Düşük stok tespit edildi: Lenovo ThinkPad X1, AirPods Pro (kritik seviyede düşük)' },
    'Low stock detected: Lenovo ThinkPad X1, ROG Ally, Samsung Galaxy S24 (critically low)': { en: 'Low stock detected: Lenovo ThinkPad X1, ROG Ally, Samsung Galaxy S24 (critically low)', tr: 'Düşük stok tespit edildi: Lenovo ThinkPad X1, ROG Ally, Samsung Galaxy S24 (kritik seviyede düşük)' },
    'Cancel rate (23.8%) exceeded threshold (15%) in last 24 hours': { en: 'Cancel rate (23.8%) exceeded threshold (15%) in last 24 hours', tr: 'İptal oranı (%23.8) son 24 saatte eşik değerini (%15) aştı' },
    '574 orders have exceeded 24h shipping threshold': { en: '574 orders have exceeded 24h shipping threshold', tr: '574 sipariş 24 saatlik kargo eşik değerini aştı' },
    'Low stock detected: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (below 5 units)': { en: 'Low stock detected: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (below 5 units)', tr: 'Düşük stok tespit edildi: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (5 adet altında)' },
    'Cancel rate spike in premium products': { en: 'Cancel rate spike in premium products', tr: 'Premium ürünlerde iptal oranı artışı' },
    'Inventory levels below safety threshold': { en: 'Inventory levels below safety threshold', tr: 'Envanter seviyeleri güvenlik eşiğinin altında' },
    'Shipping time exceeded SLA': { en: 'Shipping time exceeded SLA', tr: 'Kargo süresi SLA\'yı aştı' },
    'Critical shipping delays nationwide': { en: 'Critical shipping delays nationwide', tr: 'Ülke genelinde kritik kargo gecikmeleri' },
    'Express delivery service disrupted': { en: 'Express delivery service disrupted', tr: 'Ekspres teslimat hizmeti kesintiye uğradı' },
    'International shipping delays detected': { en: 'International shipping delays detected', tr: 'Uluslararası kargo gecikmeleri tespit edildi' },
    'Regional logistics network failure': { en: 'Regional logistics network failure', tr: 'Bölgesel lojistik ağ arızası' },
    'Carrier performance below standards': { en: 'Carrier performance below standards', tr: 'Kargo şirketi performansı standartların altında' },
    'Distribution center delays reported': { en: 'Distribution center delays reported', tr: 'Dağıtım merkezinde gecikmeler rapor edildi' },
    'Critical inventory shortage alert': { en: 'Critical inventory shortage alert', tr: 'Kritik envanter sıkıntısı uyarısı' },
    'Zero stock detected in high-demand products': { en: 'Zero stock detected in high-demand products', tr: 'Yüksek talep gören ürünlerde sıfır stok tespit edildi' },
    'Inventory management failure detected': { en: 'Inventory management failure detected', tr: 'Envanter yönetimi hatası tespit edildi' },
    'Stock shortage in seasonal products': { en: 'Stock shortage in seasonal products', tr: 'Mevsimlik ürünlerde stok sıkıntısı' },
    'Critical supply chain disruption': { en: 'Critical supply chain disruption', tr: 'Kritik tedarik zinciri kesintisi' },
    'Product availability crisis detected': { en: 'Product availability crisis detected', tr: 'Ürün kullanılabilirlik krizi tespit edildi' },
    'Competitor pricing mismatch identified': { en: 'Competitor pricing mismatch identified', tr: 'Rakip fiyatlandırma uyumsuzluğu tespit edildi' },
    'Dynamic pricing algorithm error': { en: 'Dynamic pricing algorithm error', tr: 'Dinamik fiyatlandırma algoritması hatası' },
    'Price synchronization failure': { en: 'Price synchronization failure', tr: 'Fiyat senkronizasyon hatası' },
    'Market rate adjustment needed': { en: 'Market rate adjustment needed', tr: 'Piyasa oranı ayarlaması gerekli' },
    'Pricing strategy deviation detected': { en: 'Pricing strategy deviation detected', tr: 'Fiyatlandırma stratejisi sapması tespit edildi' },
    'Cost inflation impact observed': { en: 'Cost inflation impact observed', tr: 'Maliyet enflasyonu etkisi gözlemlendi' },
    'Revenue optimization alert triggered': { en: 'Revenue optimization alert triggered', tr: 'Gelir optimizasyonu uyarısı tetiklendi' },
    'Cancel rate surge in audio devices': { en: 'Cancel rate surge in audio devices', tr: 'Ses cihazlarında iptal oranı artışı' },
    'Abnormal cancellation pattern in tablets': { en: 'Abnormal cancellation pattern in tablets', tr: 'Tabletlerde anormal iptal deseni' },
    'Critical cancel rate increase in laptops': { en: 'Critical cancel rate increase in laptops', tr: 'Laptop\'larda kritik iptal oranı artışı' },
    'High cancellation rate in smartwatches': { en: 'High cancellation rate in smartwatches', tr: 'Akıllı saatlerde yüksek iptal oranı' },
    'Sudden increase in electronics returns': { en: 'Sudden increase in electronics returns', tr: 'Elektronik ürünlerde ani iade artışı' },
    'Unusual cancellation trend in peripherals': { en: 'Unusual cancellation trend in peripherals', tr: 'Çevre birimlerinde olağandışı iptal trendi' },
    'Low stock detected: Lenovo ThinkPad X1 (below 5 units)': { en: 'Low stock detected: Lenovo ThinkPad X1 (below 5 units)', tr: 'Düşük stok tespit edildi: Lenovo ThinkPad X1 (5 adet altında)' }
  };

  const translateDescription = (description: string): string => {
    // Önce tam eşleşme dene
    const exactTranslation = descriptionTranslations[description];
    if (exactTranslation) {
      return language === 'tr' ? exactTranslation.tr : exactTranslation.en;
    }
    
    // Mevcut eşiklerle iptal oranı anomalileri için dinamik desen eşleştirme
    const cancelRatePattern = /Cancel rate \((\d+\.?\d*)%\) exceeded threshold \((\d+)%\) in last 24 hours/;
    const cancelRateMatch = description.match(cancelRatePattern);
    if (cancelRateMatch) {
      const [, currentRate] = cancelRateMatch;
      if (language === 'tr') {
        return `İptal oranı (%${currentRate}) son 24 saatte eşik değerini (%${currentThresholds.cancelRateThreshold}) aştı`;
      }
      return `Cancel rate (${currentRate}%) exceeded threshold (${currentThresholds.cancelRateThreshold}%) in last 24 hours`;
    }
    
    // Mevcut eşiklerle kargo eşik anomalileri için dinamik desen eşleştirme
    const shippingPattern = /(\d+) orders have exceeded (\d+)h shipping threshold/;
    const shippingMatch = description.match(shippingPattern);
    if (shippingMatch) {
      const [, orderCount] = shippingMatch;
      if (language === 'tr') {
        return `${orderCount} sipariş ${currentThresholds.lateShippingThreshold} saatlik kargo eşik değerini aştı`;
      }
      return `${orderCount} orders have exceeded ${currentThresholds.lateShippingThreshold}h shipping threshold`;
    }
    
    // Mevcut eşiklerle stok anomalileri için dinamik desen eşleştirme
    const stockPattern = /Low stock detected: (.+) \(below (\d+) units\)/;
    const stockMatch = description.match(stockPattern);
    if (stockMatch) {
      const [, products] = stockMatch;
      if (language === 'tr') {
        return `Düşük stok tespit edildi: ${products} (${currentThresholds.stockOutThreshold} adet altında)`;
      }
      return `Low stock detected: ${products} (below ${currentThresholds.stockOutThreshold} units)`;
    }
    
    // Mevcut eşiklerle "kritik seviyede düşük" desenini işleme
    const stockCriticalPattern = /Low stock detected: (.+) \(critically low\)/;
    const stockCriticalMatch = description.match(stockCriticalPattern);
    if (stockCriticalMatch) {
      const [, products] = stockCriticalMatch;
      if (language === 'tr') {
        return `Düşük stok tespit edildi: ${products} (${currentThresholds.stockOutThreshold} adet altında)`;
      }
      return `Low stock detected: ${products} (below ${currentThresholds.stockOutThreshold} units)`;
    }
    
    return description;
  };

  const getSeverityText = (severity: string): string => {
    const severityMap = {
      'low': { en: 'LOW', tr: 'DÜŞÜK' },
      'medium': { en: 'MEDIUM', tr: 'ORTA' },
      'high': { en: 'HIGH', tr: 'YÜKSEK' }
    };
    
    const severityData = severityMap[severity as keyof typeof severityMap];
    if (severityData) {
      return language === 'tr' ? severityData.tr : severityData.en;
    }
    return severity.toUpperCase();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case 'low':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const severityClasses = {
      low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityClasses[severity as keyof typeof severityClasses]}`}>
        {getSeverityText(severity)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <div
          key={anomaly.id}
          onClick={() => onAnomalyClick(anomaly)}
          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getSeverityIcon(anomaly.severity)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t(anomaly.type)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(anomaly.date), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
            {getSeverityBadge(anomaly.severity)}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {translateDescription(anomaly.description)}
          </p>
          
          <div className="text-sm">
            {anomaly.orderId ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span>{t('anomalies.relatedOrder')}:</span>
                <span className="font-medium">{anomaly.orderId}</span>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                <span>
                  {language === 'tr' 
                    ? 'Genel kategori anomalisi - belirli sipariş yok' 
                    : 'General category anomaly - no specific order'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
