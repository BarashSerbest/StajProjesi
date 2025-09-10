import { useState, useEffect } from 'react';
import AnomalyList from '../components/Anomalies/AnomalyList';
import { apiService } from '../services/api';
import { Anomaly } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function Anomalies() {
  const { t, language } = useLanguage();
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Eşik değer durumları
  const [thresholds, setThresholds] = useState({
    cancelRateThreshold: 15,
    lateShippingThreshold: 24,
    stockOutThreshold: 5
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [anomaliesData, settingsData] = await Promise.all([
          apiService.getAnomalies(),
          apiService.getSettings()
        ]);
        setAnomalies(anomaliesData);
        if (settingsData) {
          setThresholds({
            cancelRateThreshold: settingsData.cancelRateThreshold || 15,
            lateShippingThreshold: settingsData.lateShippingThreshold || 24,
            stockOutThreshold: settingsData.stockOutThreshold || 5
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Anomali türleri için çeviri eşleştirmesi
  const typeTranslations: { [key: string]: { en: string, tr: string } } = {
    'cancel_rate': { en: 'Cancel Rate Anomaly', tr: 'İptal Oranı Anomalisi' },
    'anomaly.highCancelRate': { en: 'High Cancel Rate Anomaly', tr: 'Yüksek İptal Oranı Anomalisi' },
    'stock_out': { en: 'Stock Out Anomaly', tr: 'Stok Tükenmesi Anomalisi' },
    'anomaly.stockOut': { en: 'Stock Out Anomaly', tr: 'Stok Tükenmesi Anomalisi' },
    'shipping_delay': { en: 'Shipping Delay', tr: 'Kargo Gecikmesi' },
    'anomaly.lateShipping': { en: 'Shipping Delay Anomaly', tr: 'Kargo Gecikme Anomalisi' },
    'price_anomaly': { en: 'Price Anomaly', tr: 'Fiyat Anomalisi' },
    'anomaly.priceAnomaly': { en: 'Price Anomaly', tr: 'Fiyat Anomalisi' },
    'anomaly.priceFluctuation': { en: 'Price Fluctuation Anomaly', tr: 'Fiyat Dalgalanma Anomalisi' }
  };

  // Anomali açıklamaları için çeviri eşleştirmesi  
  const descriptionTranslations: { [key: string]: { en: string, tr: string } } = {
    'Cancel rate exceeded 15% threshold for iPhone 15 Pro': { en: 'Cancel rate exceeded 15% threshold for iPhone 15 Pro', tr: 'iPhone 15 Pro için iptal oranı %15 eşiğini aştı' },
    'MacBook Air M3 out of stock but still accepting orders': { en: 'MacBook Air M3 out of stock but still accepting orders', tr: 'MacBook Air M3 stokta yok ancak hala sipariş alınıyor' },
    'Shipping delay detected for electronics category': { en: 'Shipping delay detected for electronics category', tr: 'Elektronik kategorisinde kargo gecikmesi tespit edildi' },
    'Price fluctuation detected for gaming consoles': { en: 'Price fluctuation detected for gaming consoles', tr: 'Oyun konsollarında fiyat dalgalanması tespit edildi' },
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
    // Yeni açıklamalar genişletilmiş veritabanından
    'Critical cancel rate increase in laptops': { en: 'Critical cancel rate increase in laptops', tr: 'Dizüstü bilgisayarlarda kritik iptal oranı artışı' },
    'Abnormal cancellation pattern in tablets': { en: 'Abnormal cancellation pattern in tablets', tr: 'Tabletlerde anormal iptal deseni' },
    'Cancel rate surge in audio devices': { en: 'Cancel rate surge in audio devices', tr: 'Ses cihazlarında iptal oranı artışı' },
    'High cancellation rate in smartwatches': { en: 'High cancellation rate in smartwatches', tr: 'Akıllı saatlerde yüksek iptal oranı' },
    'Sudden increase in electronics returns': { en: 'Sudden increase in electronics returns', tr: 'Elektronik ürünlerde ani iade artışı' },
    'Cancel rate spike in premium products': { en: 'Cancel rate spike in premium products', tr: 'Premium ürünlerde iptal oranı artışı' },
    'Unusual cancellation trend in peripherals': { en: 'Unusual cancellation trend in peripherals', tr: 'Çevre birimlerinde olağandışı iptal trendi' },
    'Critical inventory shortage alert': { en: 'Critical inventory shortage alert', tr: 'Kritik envanter sıkıntısı uyarısı' },
    'Zero stock detected in high-demand products': { en: 'Zero stock detected in high-demand products', tr: 'Yüksek talep gören ürünlerde sıfır stok tespit edildi' },
    'Inventory management failure detected': { en: 'Inventory management failure detected', tr: 'Envanter yönetimi hatası tespit edildi' },
    'Stock shortage in seasonal products': { en: 'Stock shortage in seasonal products', tr: 'Mevsimlik ürünlerde stok sıkıntısı' },
    'Critical supply chain disruption': { en: 'Critical supply chain disruption', tr: 'Kritik tedarik zinciri kesintisi' },
    'Inventory levels below safety threshold': { en: 'Inventory levels below safety threshold', tr: 'Envanter seviyeleri güvenlik eşiğinin altında' },
    'Product availability crisis detected': { en: 'Product availability crisis detected', tr: 'Ürün kullanılabilirlik krizi tespit edildi' },
    'Critical shipping delays nationwide': { en: 'Critical shipping delays nationwide', tr: 'Ülke genelinde kritik kargo gecikmeleri' },
    'Express delivery service disrupted': { en: 'Express delivery service disrupted', tr: 'Ekspres teslimat hizmeti kesintiye uğradı' },
    'International shipping delays detected': { en: 'International shipping delays detected', tr: 'Uluslararası kargo gecikmeleri tespit edildi' },
    'Regional logistics network failure': { en: 'Regional logistics network failure', tr: 'Bölgesel lojistik ağ arızası' },
    'Carrier performance below standards': { en: 'Carrier performance below standards', tr: 'Kargo şirketi performansı standartların altında' },
    'Shipping time exceeded SLA': { en: 'Shipping time exceeded SLA', tr: 'Kargo süresi SLA\'yı aştı' },
    'Distribution center delays reported': { en: 'Distribution center delays reported', tr: 'Dağıtım merkezinde gecikmeler rapor edildi' },
    'Competitor pricing mismatch identified': { en: 'Competitor pricing mismatch identified', tr: 'Rakip fiyatlandırma uyumsuzluğu tespit edildi' },
    'Dynamic pricing algorithm error': { en: 'Dynamic pricing algorithm error', tr: 'Dinamik fiyatlandırma algoritması hatası' },
    'Price synchronization failure': { en: 'Price synchronization failure', tr: 'Fiyat senkronizasyon hatası' },
    'Market rate adjustment needed': { en: 'Market rate adjustment needed', tr: 'Piyasa oranı ayarlaması gerekli' },
    'Pricing strategy deviation detected': { en: 'Pricing strategy deviation detected', tr: 'Fiyatlandırma stratejisi sapması tespit edildi' },
    'Cost inflation impact observed': { en: 'Cost inflation impact observed', tr: 'Maliyet enflasyonu etkisi gözlemlendi' },
    'Revenue optimization alert triggered': { en: 'Revenue optimization alert triggered', tr: 'Gelir optimizasyonu uyarısı tetiklendi' },
    // Ek açıklamalar veritabanından
    'Cancel rate (25.5%) exceeded threshold (15%) in last 24 hours': { en: 'Cancel rate (25.5%) exceeded threshold (15%) in last 24 hours', tr: 'İptal oranı (%25.5) son 24 saatte eşik değerini (%15) aştı' },
    '292 orders have exceeded 24h shipping threshold': { en: '292 orders have exceeded 24h shipping threshold', tr: '292 sipariş 24 saatlik kargo eşik değerini aştı' },
    'Low stock detected: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (below 5 units)': { en: 'Low stock detected: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (below 5 units)', tr: 'Düşük stok tespit edildi: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (5 adet altında)' },
    // Dil İngilizce olduğunda Türkçe açıklamalar olduğu gibi kalmalı veya İngilizce'ye çevrilmeli
    'İptal oranı (%25.5) son 24 saatte eşik değerini (%15) aştı': { en: 'Cancel rate (25.5%) exceeded threshold (15%) in last 24 hours', tr: 'İptal oranı (%25.5) son 24 saatte eşik değerini (%15) aştı' },
    '287 sipariş 24 saatlik kargo eşik değerini aştı': { en: '287 orders have exceeded 24h shipping threshold', tr: '287 sipariş 24 saatlik kargo eşik değerini aştı' },
    'Düşük stok tespit edildi: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (5 adet altında)': { en: 'Low stock detected: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (below 5 units)', tr: 'Düşük stok tespit edildi: iPhone 15 Pro, MacBook Air M3, PlayStation 5 (5 adet altında)' },
    // Anomali dedektöründen yeni dinamik açıklamalar - EKSİK ÇEVİRİLER
    '577 orders have exceeded 48h shipping threshold': { en: '577 orders have exceeded 48h shipping threshold', tr: '577 sipariş 48 saatlik kargo eşik değerini aştı' },
    'Düşük stok tespit edildi: MacBook Air M2, Xiaomi 13 (3 adet altında)': { en: 'Low stock detected: MacBook Air M2, Xiaomi 13 (below 3 units)', tr: 'Düşük stok tespit edildi: MacBook Air M2, Xiaomi 13 (3 adet altında)' },
    'İptal oranı (%26.2) son 24 saatte eşik değerini (%20) aştı': { en: 'Cancel rate (26.2%) exceeded threshold (20%) in last 24 hours', tr: 'İptal oranı (%26.2) son 24 saatte eşik değerini (%20) aştı' },
    // EN ÖNEMLİ: Soruna neden olan eksik çeviri
    'Cancel rate (25.3%) exceeded threshold (20%) in last 24 hours': { en: 'Cancel rate (25.3%) exceeded threshold (20%) in last 24 hours', tr: 'İptal oranı (%25.3) son 24 saatte eşik değerini (%20) aştı' },
    'İptal oranı (%25.3) son 24 saatte eşik değerini (%20) aştı': { en: 'Cancel rate (25.3%) exceeded threshold (20%) in last 24 hours', tr: 'İptal oranı (%25.3) son 24 saatte eşik değerini (%20) aştı' },
    '577 sipariş 48 saatlik kargo eşik değerini aştı': { en: '577 orders have exceeded 48h shipping threshold', tr: '577 sipariş 48 saatlik kargo eşik değerini aştı' },
    // Veritabanından ek stok tükenme çeşitleri
    'Low stock detected: Apple Watch Series 9 (below 3 units)': { en: 'Low stock detected: Apple Watch Series 9 (below 3 units)', tr: 'Düşük stok tespit edildi: Apple Watch Series 9 (3 adet altında)' },
    'Low stock detected: Apple Watch Series 9, iPad Pro 11 (below 3 units)': { en: 'Low stock detected: Apple Watch Series 9, iPad Pro 11 (below 3 units)', tr: 'Düşük stok tespit edildi: Apple Watch Series 9, iPad Pro 11 (3 adet altında)' },
    'Low stock detected: MacBook Air M2 (below 3 units)': { en: 'Low stock detected: MacBook Air M2 (below 3 units)', tr: 'Düşük stok tespit edildi: MacBook Air M2 (3 adet altında)' },
    'Low stock detected: MacBook Air M2, MacBook Air M3 (below 3 units)': { en: 'Low stock detected: MacBook Air M2, MacBook Air M3 (below 3 units)', tr: 'Düşük stok tespit edildi: MacBook Air M2, MacBook Air M3 (3 adet altında)' },
    'Low stock detected: Xiaomi 13, MacBook Air M3, Apple Watch Series 9 (below 3 units)': { en: 'Low stock detected: Xiaomi 13, MacBook Air M3, Apple Watch Series 9 (below 3 units)', tr: 'Düşük stok tespit edildi: Xiaomi 13, MacBook Air M3, Apple Watch Series 9 (3 adet altında)' },
    'Low stock detected: Xiaomi 13, iPad Pro 11 (below 3 units)': { en: 'Low stock detected: Xiaomi 13, iPad Pro 11 (below 3 units)', tr: 'Düşük stok tespit edildi: Xiaomi 13, iPad Pro 11 (3 adet altında)' },
    'Düşük stok tespit edildi: MacBook Air M2, Xiaomi 13, Apple Watch Series 9 (3 adet altında)': { en: 'Low stock detected: MacBook Air M2, Xiaomi 13, Apple Watch Series 9 (below 3 units)', tr: 'Düşük stok tespit edildi: MacBook Air M2, Xiaomi 13, Apple Watch Series 9 (3 adet altında)' },
    'Düşük stok tespit edildi: MacBook Air M3 (3 adet altında)': { en: 'Low stock detected: MacBook Air M3 (below 3 units)', tr: 'Düşük stok tespit edildi: MacBook Air M3 (3 adet altında)' },
    // YENİ DİNAMİK AÇIKLAMALAR - Backend'den mevcut anomaliler
    'Cancel rate (23.8%) exceeded threshold (15%) in last 24 hours': { en: 'Cancel rate (23.8%) exceeded threshold (15%) in last 24 hours', tr: 'İptal oranı (%23.8) son 24 saatte eşik değerini (%15) aştı' },
    '574 orders have exceeded 24h shipping threshold': { en: '574 orders have exceeded 24h shipping threshold', tr: '574 sipariş 24 saatlik kargo eşik değerini aştı' },
    'Low stock detected: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (below 5 units)': { en: 'Low stock detected: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (below 5 units)', tr: 'Düşük stok tespit edildi: Sony WF-1000XM4, Samsung Galaxy Tab S9, Nintendo Switch Lite (5 adet altında)' }
  };

  // Öneriler için çeviri eşleştirmesi
  const suggestionTranslations: { [key: string]: { en: string, tr: string } } = {
    // Temel öneriler
    'Review pricing strategy': { en: 'Review pricing strategy', tr: 'Fiyatlandırma stratejisini gözden geçirin' },
    'Adjust pricing algorithm': { en: 'Adjust pricing algorithm', tr: 'Fiyatlandırma algoritmasını ayarlayın' },
    'Update pricing rules': { en: 'Update pricing rules', tr: 'Fiyatlandırma kurallarını güncelleyin' },
    'Check inventory levels': { en: 'Check inventory levels', tr: 'Stok seviyelerini kontrol edin' },
    'Restock product': { en: 'Restock product', tr: 'Ürün stokunu yenileyin' },
    'Update product availability': { en: 'Update product availability', tr: 'Ürün durumunu güncelleyin' },
    'Contact shipping provider': { en: 'Contact shipping provider', tr: 'Kargo sağlayıcısıyla iletişime geçin' },
    'Review shipping routes': { en: 'Review shipping routes', tr: 'Kargo rotalarını gözden geçirin' },
    'Optimize logistics': { en: 'Optimize logistics', tr: 'Lojistiği optimize edin' },
    'Investigate order patterns': { en: 'Investigate order patterns', tr: 'Sipariş desenlerini araştırın' },
    'Review product quality': { en: 'Review product quality', tr: 'Ürün kalitesini gözden geçirin' },
    'Review product descriptions': { en: 'Review product descriptions', tr: 'Ürün açıklamalarını gözden geçirin' },
    'Check customer feedback': { en: 'Check customer feedback', tr: 'Müşteri geri bildirimlerini kontrol edin' },
    'Review customer feedback': { en: 'Review customer feedback', tr: 'Müşteri geri bildirimlerini gözden geçirin' },
    'Check product quality': { en: 'Check product quality', tr: 'Ürün kalitesini kontrol edin' },
    'Check carrier performance': { en: 'Check carrier performance', tr: 'Kargo şirketi performansını kontrol edin' },
    'Update product descriptions': { en: 'Update product descriptions', tr: 'Ürün açıklamalarını güncelleyin' },
    'Review marketing strategy': { en: 'Review marketing strategy', tr: 'Pazarlama stratejisini gözden geçirin' },
    'Adjust promotional campaigns': { en: 'Adjust promotional campaigns', tr: 'Promosyon kampanyalarını ayarlayın' },
    
    // Genişletilmiş öneriler - Veritabanından tüm eksik çeviriler
    'Adjust pricing model': { en: 'Adjust pricing model', tr: 'Fiyatlandırma modelini ayarlayın' },
    'Adjust seasonal pricing': { en: 'Adjust seasonal pricing', tr: 'Mevsimsel fiyatlandırmayı ayarlayın' },
    'Analyze competitor pricing': { en: 'Analyze competitor pricing', tr: 'Rakip fiyatlandırmasını analiz edin' },
    'Analyze customer feedback patterns': { en: 'Analyze customer feedback patterns', tr: 'Müşteri geri bildirimi desenlerini analiz edin' },
    'Analyze market dynamics': { en: 'Analyze market dynamics', tr: 'Pazar dinamiklerini analiz edin' },
    'Analyze price elasticity': { en: 'Analyze price elasticity', tr: 'Fiyat esnekliğini analiz edin' },
    'Analyze profit margins': { en: 'Analyze profit margins', tr: 'Kar marjlarını analiz edin' },
    'Analyze return reasons': { en: 'Analyze return reasons', tr: 'İade nedenlerini analiz edin' },
    'Automate stock replenishment': { en: 'Automate stock replenishment', tr: 'Stok yenilemesini otomatikleştirin' },
    'Check MSRP changes': { en: 'Check MSRP changes', tr: 'MSRP değişikliklerini kontrol edin' },
    'Check competitor activity': { en: 'Check competitor activity', tr: 'Rakip aktivitelerini kontrol edin' },
    'Check competitor prices': { en: 'Check competitor prices', tr: 'Rakip fiyatlarını kontrol edin' },
    'Check customer satisfaction': { en: 'Check customer satisfaction', tr: 'Müşteri memnuniyetini kontrol edin' },
    'Check local carrier': { en: 'Check local carrier', tr: 'Yerel kargo şirketini kontrol edin' },
    'Check payment processing': { en: 'Check payment processing', tr: 'Ödeme işlemlerini kontrol edin' },
    'Check shipping infrastructure': { en: 'Check shipping infrastructure', tr: 'Kargo altyapısını kontrol edin' },
    'Check shipping times and costs': { en: 'Check shipping times and costs', tr: 'Kargo sürelerini ve maliyetlerini kontrol edin' },
    'Conduct market research': { en: 'Conduct market research', tr: 'Pazar araştırması yapın' },
    'Consider alternative suppliers': { en: 'Consider alternative suppliers', tr: 'Alternatif tedarikçileri değerlendirin' },
    'Consider pre-orders': { en: 'Consider pre-orders', tr: 'Ön siparişleri değerlendirin' },
    'Contact Sony supplier': { en: 'Contact Sony supplier', tr: 'Sony tedarikçisiyle iletişime geçin' },
    'Contact logistics partner': { en: 'Contact logistics partner', tr: 'Lojistik ortağıyla iletişime geçin' },
    'Contact regional logistics': { en: 'Contact regional logistics', tr: 'Bölgesel lojistikle iletişime geçin' },
    'Contact supplier for restock': { en: 'Contact supplier for restock', tr: 'Yeniden stoklama için tedarikçiyle iletişime geçin' },
    'Contact supplier for restock timeline': { en: 'Contact supplier for restock timeline', tr: 'Stok yenileme zamanlaması için tedarikçiyle iletişime geçin' },
    'Disable product listing temporarily': { en: 'Disable product listing temporarily', tr: 'Ürün listesini geçici olarak devre dışı bırakın' },
    'Diversify supplier base': { en: 'Diversify supplier base', tr: 'Tedarikçi tabanını çeşitlendirin' },
    'Diversify supplier network': { en: 'Diversify supplier network', tr: 'Tedarikçi ağını çeşitlendirin' },
    'Enhance customer experience': { en: 'Enhance customer experience', tr: 'Müşteri deneyimini geliştirin' },
    'Enhance inventory management': { en: 'Enhance inventory management', tr: 'Envanter yönetimini geliştirin' },
    'Enhance inventory tracking': { en: 'Enhance inventory tracking', tr: 'Envanter takibini geliştirin' },
    'Enhance product photos': { en: 'Enhance product photos', tr: 'Ürün fotoğraflarını iyileştirin' },
    'Enhance product quality control': { en: 'Enhance product quality control', tr: 'Ürün kalite kontrolünü geliştirin' },
    'Enhance shipping infrastructure': { en: 'Enhance shipping infrastructure', tr: 'Kargo altyapısını geliştirin' },
    'Establish backup shipping options': { en: 'Establish backup shipping options', tr: 'Yedek kargo seçenekleri oluşturun' },
    'Establish safety stock levels': { en: 'Establish safety stock levels', tr: 'Güvenlik stok seviyelerini belirleyin' },
    'Find alternative carriers': { en: 'Find alternative carriers', tr: 'Alternatif kargo şirketleri bulun' },
    'Implement automated reordering': { en: 'Implement automated reordering', tr: 'Otomatik yeniden sipariş vermeyi uygulayın' },
    'Implement customer retention strategies': { en: 'Implement customer retention strategies', tr: 'Müşteri tutma stratejilerini uygulayın' },
    'Implement dynamic pricing': { en: 'Implement dynamic pricing', tr: 'Dinamik fiyatlandırma uygulayın' },
    'Implement expedited shipping': { en: 'Implement expedited shipping', tr: 'Hızlandırılmış kargo uygulayın' },
    'Implement just-in-time ordering': { en: 'Implement just-in-time ordering', tr: 'Tam zamanında sipariş vermeyi uygulayın' },
    'Implement predictive analytics': { en: 'Implement predictive analytics', tr: 'Tahminsel analitik uygulayın' },
    'Implement price monitoring': { en: 'Implement price monitoring', tr: 'Fiyat izlemeyi uygulayın' },
    'Implement real-time tracking': { en: 'Implement real-time tracking', tr: 'Gerçek zamanlı takip uygulayın' },
    'Implement shipment tracking': { en: 'Implement shipment tracking', tr: 'Kargo takibini uygulayın' },
    'Implement stock alerts': { en: 'Implement stock alerts', tr: 'Stok uyarılarını uygulayın' },
    'Improve customer communication': { en: 'Improve customer communication', tr: 'Müşteri iletişimini iyileştirin' },
    'Improve customer service': { en: 'Improve customer service', tr: 'Müşteri hizmetlerini iyileştirin' },
    'Improve demand forecasting': { en: 'Improve demand forecasting', tr: 'Talep tahminlemesini iyileştirin' },
    'Improve supply chain efficiency': { en: 'Improve supply chain efficiency', tr: 'Tedarik zinciri verimliliğini artırın' },
    'Improve supply chain visibility': { en: 'Improve supply chain visibility', tr: 'Tedarik zinciri görünürlüğünü artırın' },
    'Improve warehouse efficiency': { en: 'Improve warehouse efficiency', tr: 'Depo verimliliğini artırın' },
    'Investigate category issues': { en: 'Investigate category issues', tr: 'Kategori sorunlarını araştırın' },
    'Investigate payment processing issues': { en: 'Investigate payment processing issues', tr: 'Ödeme işleme sorunlarını araştırın' },
    'Monitor accessory quality': { en: 'Monitor accessory quality', tr: 'Aksesuar kalitesini izleyin' },
    'Monitor carrier performance': { en: 'Monitor carrier performance', tr: 'Kargo şirketi performansını izleyin' },
    'Monitor competitor activity': { en: 'Monitor competitor activity', tr: 'Rakip aktivitelerini izleyin' },
    'Monitor inventory levels': { en: 'Monitor inventory levels', tr: 'Stok seviyelerini izleyin' },
    'Monitor market trends': { en: 'Monitor market trends', tr: 'Pazar trendlerini izleyin' },
    'Monitor price trends': { en: 'Monitor price trends', tr: 'Fiyat trendlerini izleyin' },
    'Monitor shipping times': { en: 'Monitor shipping times', tr: 'Kargo sürelerini izleyin' },
    'Monitor weather conditions': { en: 'Monitor weather conditions', tr: 'Hava koşullarını izleyin' },
    'Monitor weather impacts': { en: 'Monitor weather impacts', tr: 'Hava durumu etkilerini izleyin' },
    'Negotiate better shipping terms': { en: 'Negotiate better shipping terms', tr: 'Daha iyi kargo koşulları müzakere edin' },
    'Notify affected customers': { en: 'Notify affected customers', tr: 'Etkilenen müşterileri bilgilendirin' },
    'Optimize checkout process': { en: 'Optimize checkout process', tr: 'Ödeme sürecini optimize edin' },
    'Optimize delivery routes': { en: 'Optimize delivery routes', tr: 'Teslimat rotalarını optimize edin' },
    'Optimize distribution network': { en: 'Optimize distribution network', tr: 'Dağıtım ağını optimize edin' },
    'Optimize product portfolio': { en: 'Optimize product portfolio', tr: 'Ürün portföyünü optimize edin' },
    'Review Apple pricing': { en: 'Review Apple pricing', tr: 'Apple fiyatlandırmasını gözden geçirin' },
    'Review carrier contracts': { en: 'Review carrier contracts', tr: 'Kargo şirketi sözleşmelerini gözden geçirin' },
    'Review carrier performance': { en: 'Review carrier performance', tr: 'Kargo şirketi performansını değerlendirin' },
    'Review cost structure': { en: 'Review cost structure', tr: 'Maliyet yapısını gözden geçirin' },
    'Review demand forecasting': { en: 'Review demand forecasting', tr: 'Talep tahminlemesini gözden geçirin' },
    'Review demand patterns': { en: 'Review demand patterns', tr: 'Talep desenlerini gözden geçirin' },
    'Review minimum order quantities': { en: 'Review minimum order quantities', tr: 'Minimum sipariş miktarlarını gözden geçirin' },
    'Review packaging procedures': { en: 'Review packaging procedures', tr: 'Paketleme prosedürlerini gözden geçirin' },
    'Review product descriptions for accuracy': { en: 'Review product descriptions for accuracy', tr: 'Ürün açıklamalarının doğruluğunu gözden geçirin' },
    'Review product photography quality': { en: 'Review product photography quality', tr: 'Ürün fotoğrafı kalitesini gözden geçirin' },
    'Review promotional pricing': { en: 'Review promotional pricing', tr: 'Promosyonel fiyatlandırmayı gözden geçirin' },
    'Review return policy': { en: 'Review return policy', tr: 'İade politikasını gözden geçirin' },
    'Review shipping zones': { en: 'Review shipping zones', tr: 'Kargo bölgelerini gözden geçirin' },
    'Review supplier agreements': { en: 'Review supplier agreements', tr: 'Tedarikçi anlaşmalarını gözden geçirin' },
    'Review supplier pricing': { en: 'Review supplier pricing', tr: 'Tedarikçi fiyatlandırmasını gözden geçirin' },
    'Review vendor contracts': { en: 'Review vendor contracts', tr: 'Satıcı sözleşmelerini gözden geçirin' },
    'Update customer expectations': { en: 'Update customer expectations', tr: 'Müşteri beklentilerini güncelleyin' },
    'Update customer service protocols': { en: 'Update customer service protocols', tr: 'Müşteri hizmetleri protokollerini güncelleyin' },
    'Update delivery estimates': { en: 'Update delivery estimates', tr: 'Teslimat tahminlerini güncelleyin' },
    'Update inventory system': { en: 'Update inventory system', tr: 'Envanter sistemini güncelleyin' },
    'Update margin requirements': { en: 'Update margin requirements', tr: 'Kar marjı gereksinimlerini güncelleyin' },
    'Update stock levels': { en: 'Update stock levels', tr: 'Stok seviyelerini güncelleyin' }
  };

  const translateType = (type: string): string => {
    const translation = typeTranslations[type];
    if (translation) {
      return language === 'tr' ? translation.tr : translation.en;
    }
    return type;
  };

  const translateDescription = (description: string): string => {
    // Önce tam eşleşme deneyin
    const exactTranslation = descriptionTranslations[description];
    if (exactTranslation) {
      console.log('Exact match found for:', description, 'Language:', language, 'Translation:', exactTranslation);
      return language === 'tr' ? exactTranslation.tr : exactTranslation.en;
    }
    
    // Mevcut eşik değerleri ile dinamik desen eşleştirme
    // İptal oranı anomalileri için geliştirilmiş dinamik desen eşleştirme
    const cancelRatePatternEn = /Cancel rate \((\d+\.?\d*)%\) exceeded threshold \((\d+)%\) in last 24 hours/;
    const cancelRatePatternTr = /İptal oranı \(%(\d+\.?\d*)\) son 24 saatte eşik değerini \(%(\d+)\) aştı/;
    
    let cancelRateMatch = description.match(cancelRatePatternEn);
    if (cancelRateMatch) {
      const [, currentRate] = cancelRateMatch;
      if (language === 'tr') {
        console.log('Cancel rate EN pattern matched:', description);
        return `İptal oranı (%${currentRate}) son 24 saatte eşik değerini (%${thresholds.cancelRateThreshold}) aştı`;
      }
      return `Cancel rate (${currentRate}%) exceeded threshold (${thresholds.cancelRateThreshold}%) in last 24 hours`;
    }
    
    cancelRateMatch = description.match(cancelRatePatternTr);
    if (cancelRateMatch) {
      const [, currentRate] = cancelRateMatch;
      if (language === 'en') {
        console.log('Cancel rate TR pattern matched:', description);
        return `Cancel rate (${currentRate}%) exceeded threshold (${thresholds.cancelRateThreshold}%) in last 24 hours`;
      }
      return `İptal oranı (%${currentRate}) son 24 saatte eşik değerini (%${thresholds.cancelRateThreshold}) aştı`;
    }
    
    // Kargo eşiği anomalileri için geliştirilmiş dinamik desen eşleştirme
    const shippingPatternEn = /(\d+) orders have exceeded (\d+)h shipping threshold/;
    const shippingPatternTr = /(\d+) sipariş (\d+) saatlik kargo eşik değerini aştı/;
    
    let shippingMatch = description.match(shippingPatternEn);
    if (shippingMatch) {
      const [, orderCount] = shippingMatch;
      if (language === 'tr') {
        console.log('Shipping EN pattern matched:', description);
        return `${orderCount} sipariş ${thresholds.lateShippingThreshold} saatlik kargo eşik değerini aştı`;
      }
      return `${orderCount} orders have exceeded ${thresholds.lateShippingThreshold}h shipping threshold`;
    }
    
    shippingMatch = description.match(shippingPatternTr);
    if (shippingMatch) {
      const [, orderCount] = shippingMatch;
      if (language === 'en') {
        console.log('Shipping TR pattern matched:', description);
        return `${orderCount} orders have exceeded ${thresholds.lateShippingThreshold}h shipping threshold`;
      }
      return `${orderCount} sipariş ${thresholds.lateShippingThreshold} saatlik kargo eşik değerini aştı`;
    }
    
    // Stok tükenme anomalileri için geliştirilmiş dinamik desen eşleştirme
    const stockPatternEn = /Low stock detected: (.+) \(below (\d+) units\)/;
    const stockPatternTr = /Düşük stok tespit edildi: (.+) \((\d+) adet altında\)/;
    
    let stockMatch = description.match(stockPatternEn);
    if (stockMatch) {
      const [, products] = stockMatch;
      if (language === 'tr') {
        console.log('Stock EN pattern matched:', description);
        return `Düşük stok tespit edildi: ${products} (${thresholds.stockOutThreshold} adet altında)`;
      }
      return `Low stock detected: ${products} (below ${thresholds.stockOutThreshold} units)`;
    }
    
    stockMatch = description.match(stockPatternTr);
    if (stockMatch) {
      const [, products] = stockMatch;
      if (language === 'en') {
        console.log('Stock TR pattern matched:', description);
        return `Low stock detected: ${products} (below ${thresholds.stockOutThreshold} units)`;
      }
      return `Düşük stok tespit edildi: ${products} (${thresholds.stockOutThreshold} adet altında)`;
    }
    
    // Ayrıca "kritik seviyede düşük" stok desenlerini de işleyin
    const stockCriticalPatternEn = /Low stock detected: (.+) \(critically low\)/;
    const stockCriticalPatternTr = /Düşük stok tespit edildi: (.+) \(kritik seviyede düşük\)/;
    
    let stockCriticalMatch = description.match(stockCriticalPatternEn);
    if (stockCriticalMatch) {
      const [, products] = stockCriticalMatch;
      if (language === 'tr') {
        console.log('Stock critical EN pattern matched:', description);
        return `Düşük stok tespit edildi: ${products} (${thresholds.stockOutThreshold} adet altında)`;
      }
      return `Low stock detected: ${products} (below ${thresholds.stockOutThreshold} units)`;
    }
    
    stockCriticalMatch = description.match(stockCriticalPatternTr);
    if (stockCriticalMatch) {
      const [, products] = stockCriticalMatch;
      if (language === 'en') {
        console.log('Stock critical TR pattern matched:', description);
        return `Low stock detected: ${products} (below ${thresholds.stockOutThreshold} units)`;
      }
      return `Düşük stok tespit edildi: ${products} (${thresholds.stockOutThreshold} adet altında)`;
    }
    
    // Çeviri bulunamazsa orijinal açıklamayı döndür
    console.log('No translation found for:', description);
    return description;
  };

  const translateSuggestion = (suggestion: string): string => {
    const translation = suggestionTranslations[suggestion];
    if (translation) {
      return language === 'tr' ? translation.tr : translation.en;
    }
    return suggestion;
  };

  // Eşik güncellemelerini işle
  const handleThresholdUpdate = async () => {
    try {
      setUpdating(true);
      const currentSettings = await apiService.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...thresholds
      };
      
      // Önce ayarları güncelle
      await apiService.updateSettings(updatedSettings);
      
      // Sonra yeni eşiklere dayalı taze anomaliler almak için anomali tespitini tetikle
      await apiService.triggerAnomalyDetection();
      
      // Veritabanı işlemlerinin tamamlanmasını sağlamak için küçük gecikme
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mevcut eşik ayarlarına göre filtrelenmiş anomalileri getir
      const filteredAnomalies = await apiService.getFilteredAnomalies({
        cancel_rate_threshold: thresholds.cancelRateThreshold,
        late_shipping_threshold: thresholds.lateShippingThreshold,
        stock_out_threshold: thresholds.stockOutThreshold
      });
      setAnomalies(filteredAnomalies);
      
      // Detay panelinin yenilenmesini zorlamak için seçili anomaliyi sıfırla
      setSelectedAnomaly(null);
      
    } catch (error) {
      console.error('Error updating thresholds:', error);
      // Sadece hata uyarıları göster, başarı uyarıları değil
      alert(language === 'tr' ? 'Eşik değerleri güncellenirken hata oluştu.' : 'Error updating thresholds.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAnomalyClick = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('anomalies.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('anomalies.subtitle')}
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
          {t('anomalies.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('anomalies.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('anomalies.recent')}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[480px] overflow-y-auto p-4">
              <AnomalyList anomalies={anomalies} onAnomalyClick={handleAnomalyClick} thresholds={thresholds} />
            </div>
          </div>
          
          {/* Eşik Ayarları Paneli */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'tr' ? 'Eşik Değerleri' : 'Threshold Settings'}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 h-[158px]">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'tr' ? 'İptal Oranı (%)' : 'Cancel Rate (%)'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={thresholds.cancelRateThreshold}
                    onChange={(e) => setThresholds({...thresholds, cancelRateThreshold: parseInt(e.target.value) || 15})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'tr' ? 'Kargo Gecikmesi (saat)' : 'Late Shipping (hours)'}
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="72"
                    value={thresholds.lateShippingThreshold}
                    onChange={(e) => setThresholds({...thresholds, lateShippingThreshold: parseInt(e.target.value) || 24})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'tr' ? 'Stok Tükenmesi (adet)' : 'Stock Out (units)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={thresholds.stockOutThreshold}
                    onChange={(e) => setThresholds({...thresholds, stockOutThreshold: parseInt(e.target.value) || 5})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleThresholdUpdate}
                disabled={updating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {updating 
                  ? (language === 'tr' ? 'Güncelleniyor...' : 'Updating...') 
                  : (language === 'tr' ? 'Güncelle' : 'Update')
                }
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('anomalies.details')}
          </h2>
          <div className="h-[674px]">
            {selectedAnomaly ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {translateType(selectedAnomaly.type)}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {translateDescription(selectedAnomaly.description)}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    {t('anomalies.suggestedActions')}
                  </h4>
                  <ul className="space-y-2">
                    {selectedAnomaly.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{translateSuggestion(suggestion)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eşik Bilgileri */}
                {(selectedAnomaly.cancel_rate_threshold || selectedAnomaly.late_shipping_threshold || selectedAnomaly.stock_out_threshold) && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      {language === 'tr' ? 'Anomali Eşik Değerleri' : 'Anomaly Threshold Values'}
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                      {selectedAnomaly.cancel_rate_threshold && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'tr' ? 'İptal Oranı Eşiği:' : 'Cancel Rate Threshold:'}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedAnomaly.cancel_rate_threshold}%
                          </span>
                        </div>
                      )}
                      {selectedAnomaly.late_shipping_threshold && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'tr' ? 'Kargo Gecikme Eşiği:' : 'Late Shipping Threshold:'}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedAnomaly.late_shipping_threshold} {language === 'tr' ? 'saat' : 'hours'}
                          </span>
                        </div>
                      )}
                      {selectedAnomaly.stock_out_threshold && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'tr' ? 'Stok Tükenme Eşiği:' : 'Stock Out Threshold:'}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedAnomaly.stock_out_threshold} {language === 'tr' ? 'adet' : 'units'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedAnomaly.orderId ? (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('anomalies.relatedOrder')}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {selectedAnomaly.orderId}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {t('anomalies.relatedOrder')}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {language === 'tr' 
                        ? 'Bu anomali genel bir kategori anomalisidir ve belirli bir siparişe bağlı değildir.' 
                        : 'This anomaly is a general category anomaly and is not tied to a specific order.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {t('anomalies.selectMessage')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}