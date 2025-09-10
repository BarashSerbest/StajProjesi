"""
Anomali Tespit Sistemi
Yapılandırılabilir eşiklere dayalı dinamik anomali tespiti
"""
import sqlite3
import json
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import random

class AnomalyDetector:
    def __init__(self, db_path: str = 'ecommerce.db'):
        self.db_path = db_path
        
    def get_db_connection(self):
        """Veritabanı bağlantısını al"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
        
    def get_current_settings(self) -> Dict:
        """Mevcut anomali tespit ayarlarını al"""
        conn = self.get_db_connection()
        cursor = conn.execute("SELECT * FROM settings WHERE id = 1")
        settings = cursor.fetchone()
        conn.close()
        
        if settings:
            return {
                'cancelRateThreshold': settings['cancelRateThreshold'],
                'lateShippingThreshold': settings['lateShippingThreshold'],
                'stockOutThreshold': settings['stockOutThreshold']
            }
        else:
            # Varsayılan ayarlar
            return {
                'cancelRateThreshold': 15,
                'lateShippingThreshold': 24,
                'stockOutThreshold': 5
            }
    
    def calculate_cancel_rate(self, time_window_hours: int = 24) -> float:
        """Belirtilen zaman dilimindeki iptal oranı yüzdesini hesapla"""
        conn = self.get_db_connection()
        
        # Son zaman penceresindeki toplam siparişleri al
        cursor = conn.execute("""
            SELECT COUNT(*) as total_orders
            FROM orders 
            WHERE datetime(date) >= datetime('now', '-{} hours')
        """.format(time_window_hours))
        total_orders = cursor.fetchone()['total_orders']
        
        if total_orders == 0:
            conn.close()
            return 0.0
            
        # Son zaman penceresindeki iptal edilen siparişleri al
        cursor = conn.execute("""
            SELECT COUNT(*) as cancelled_orders
            FROM orders 
            WHERE datetime(date) >= datetime('now', '-{} hours')
            AND status = 'cancelled'
        """.format(time_window_hours))
        cancelled_orders = cursor.fetchone()['cancelled_orders']
        
        conn.close()
        return (cancelled_orders / total_orders) * 100
    
    def get_late_shipping_orders(self, threshold_hours: int) -> List[Dict]:
        """Belirtilen kargo süresi eşiğini aşan siparişleri getir"""
        conn = self.get_db_connection()
        
        cursor = conn.execute("""
            SELECT * FROM orders 
            WHERE status IN ('pending', 'shipped')
            AND datetime(date) <= datetime('now', '-{} hours')
        """.format(threshold_hours))
        
        late_orders = cursor.fetchall()
        conn.close()
        
        return [dict(order) for order in late_orders]
    
    def get_low_stock_products(self, threshold: int) -> List[str]:
        """Düşük stok tespitini simüle et (gerçek sistemde envanter kontrol edilir)"""
        # Envanter tablosu olmadığından, son sipariş desenlerine dayalı simülasyon yapacağız
        conn = self.get_db_connection()
        
        # Yüksek son sipariş hacmine sahip ürünleri al (düşük stok simülasyonu)
        cursor = conn.execute("""
            SELECT product, COUNT(*) as order_count
            FROM orders 
            WHERE datetime(date) >= datetime('now', '-7 days')
            GROUP BY product
            HAVING COUNT(*) > 15
            ORDER BY COUNT(*) DESC
            LIMIT 5
        """)
        
        high_demand_products = cursor.fetchall()
        conn.close()
        
        # Bunlardan bazılarının düşük stokta olduğunu simüle et
        low_stock = []
        for product in high_demand_products:
            if random.random() < 0.4:  # %40 düşük stok olma şansı
                low_stock.append(product['product'])
                
        return low_stock
    
    def generate_anomaly_id(self) -> str:
        """Benzersiz anomali kimliği oluştur"""
        import time
        timestamp = str(int(time.time() * 1000))[-6:]  # Zaman damgasının son 6 hanesi
        random_suffix = str(random.randint(100, 999))
        return f"ANO-{timestamp}-{random_suffix}"
    
    def create_cancel_rate_anomaly(self, current_rate: float, threshold: int) -> Dict:
        """İptal oranı anomalisi oluştur"""
        severity = 'high' if current_rate > threshold * 1.5 else 'medium'
        
        # Her zaman güncel eşik değerini kullan
        description = f'İptal oranı ({current_rate:.1f}%) son 24 saatte eşik değerini ({threshold}%) aştı'
        
        suggestions = [
            "Ürün açıklamalarının doğruluğunu gözden geçirin",
            "Kargo sürelerini ve maliyetlerini kontrol edin", 
            "Rakip fiyatlarını analiz edin",
            "Müşteri iletişimini geliştirin"
        ]
        
        return {
            'id': self.generate_anomaly_id(),
            'type': 'anomaly.highCancelRate',
            'severity': severity,
            'description': description,
            'date': datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
            'orderId': None,
            'suggestions': json.dumps(suggestions),
            'cancel_rate_threshold': threshold,
            'late_shipping_threshold': None,
            'stock_out_threshold': None
        }
    
    def create_late_shipping_anomaly(self, late_orders_count: int, threshold: int) -> Dict:
        """Geç kargo anomalisi oluştur"""
        severity = 'high' if late_orders_count > 50 else 'medium' if late_orders_count > 20 else 'low'
        
        # Her zaman güncel eşik değerini kullan
        description = f'{late_orders_count} sipariş {threshold} saatlik kargo eşik değerini aştı'
        
        suggestions = [
            "Lojistik ortağıyla iletişime geçin",
            "Teslimat tahminlerini güncelleyin",
            "Alternatif kargo şirketleri bulun",
            "Teslimat rotalarını optimize edin"
        ]
        
        return {
            'id': self.generate_anomaly_id(),
            'type': 'anomaly.lateShipping',
            'severity': severity,
            'description': description,
            'date': datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
            'orderId': None,
            'suggestions': json.dumps(suggestions),
            'cancel_rate_threshold': None,
            'late_shipping_threshold': threshold,
            'stock_out_threshold': None
        }
    
    def create_stock_out_anomaly(self, products: List[str], threshold: int) -> Dict:
        """Stok tükendi anomalisi oluştur"""
        severity = 'high' if len(products) > 3 else 'medium'
        
        product_list = ', '.join(products[:3])  # İlk 3 ürünü göster
        unit_text = f"{threshold} adet altında" if threshold > 1 else "kritik seviyede düşük"
        
        # Her zaman güncel eşik değerini kullan
        description = f'Düşük stok tespit edildi: {product_list} ({unit_text})'
        
        suggestions = [
            "Envanter sistemini güncelleyin",
            "Yeniden stok için tedarikçiyle iletişime geçin",
            "Alternatif tedarikçileri değerlendirin",
            "Stok uyarıları uygulayın"
        ]
        
        return {
            'id': self.generate_anomaly_id(),
            'type': 'anomaly.stockOut',
            'severity': severity,
            'description': description,
            'date': datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
            'orderId': None,
            'suggestions': json.dumps(suggestions),
            'cancel_rate_threshold': None,
            'late_shipping_threshold': None,
            'stock_out_threshold': threshold
        }
    
    def save_anomaly(self, anomaly: Dict):
        """Anomaliyi veritabanına kaydet"""
        conn = self.get_db_connection()
        
        # Mevcut ayarları al
        settings = self.get_current_settings()
        
        try:
            conn.execute("""
                INSERT INTO anomalies (id, type, severity, description, date, orderId, suggestions, 
                                     cancel_rate_threshold, late_shipping_threshold, stock_out_threshold)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                anomaly['id'],
                anomaly['type'],
                anomaly['severity'],
                anomaly['description'],
                anomaly['date'],
                anomaly['orderId'],
                anomaly['suggestions'],
                anomaly.get('cancel_rate_threshold'),
                anomaly.get('late_shipping_threshold'),
                anomaly.get('stock_out_threshold')
            ))
            conn.commit()
            print(f"✅ Anomali kaydedildi: {anomaly['type']} - {anomaly['description']}")
        except Exception as e:
            print(f"❌ Hata: Anomali kaydedilemedi: {str(e)}")
        finally:
            conn.close()
    
    def cleanup_old_dynamic_anomalies(self):
        """Karmaşayı önlemek için eski dinamik olarak oluşturulan anomalileri kaldır"""
        conn = self.get_db_connection()
        
        # Her tipten sadece en son 50 anomaliyi tut
        try:
            for anomaly_type in ['anomaly.highCancelRate', 'anomaly.lateShipping', 'anomaly.stockOut']:
                conn.execute("""
                    DELETE FROM anomalies 
                    WHERE id NOT IN (
                        SELECT id FROM anomalies 
                        WHERE type = ? 
                        ORDER BY datetime(date) DESC 
                        LIMIT 20
                    ) AND type = ?
                """, (anomaly_type, anomaly_type))
            
            conn.commit()
        except Exception as e:
            print(f"❌ Hata: Anomaliler temizlenirken hata oluştu: {str(e)}")
        finally:
            conn.close()
    
    def cleanup_threshold_based_anomalies(self):
        """Yenilerini oluşturmadan önce tüm eşik tabanlı anomalileri kaldır"""
        conn = self.get_db_connection()
        
        try:
            # Eşik bilgisi içeren tüm dinamik anomalileri kaldır
            conn.execute("""
                DELETE FROM anomalies 
                WHERE (
                    description LIKE '%exceeded threshold%' OR
                    description LIKE '%eşik değerini aştı%' OR
                    description LIKE '%shipping threshold%' OR
                    description LIKE '%kargo eşik değerini aştı%' OR
                    description LIKE '%below % units%' OR
                    description LIKE '%adet altında%'
                ) AND type IN ('anomaly.highCancelRate', 'anomaly.lateShipping', 'anomaly.stockOut')
            """)
            
            deleted_count = conn.total_changes
            conn.commit()
            print(f"🧹 {deleted_count} eski eşik tabanlı anomali temizlendi")
            
        except Exception as e:
            print(f"❌ Hata: Eşik tabanlı anomaliler temizlenirken hata oluştu: {str(e)}")
        finally:
            conn.close()
    
    def detect_and_create_anomalies(self) -> List[Dict]:
        """Ana tespit fonksiyonu - mevcut ayarlara göre anomalileri tespit eder"""
        settings = self.get_current_settings()
        new_anomalies = []
        
        print(f"🔍 Anomali tespiti şu eşiklerle çalışıyor:")
        print(f"   İptal Oranı: {settings['cancelRateThreshold']}%")
        print(f"   Geç Kargo: {settings['lateShippingThreshold']} saat")
        print(f"   Stok Tükendi: {settings['stockOutThreshold']} adet")
        
        # Önce tüm eski eşik tabanlı anomalileri temizle ki taze veri olsun
        self.cleanup_threshold_based_anomalies()
        
        # 1. İptal oranını kontrol et
        current_cancel_rate = self.calculate_cancel_rate()
        print(f"📊 Mevcut iptal oranı: {current_cancel_rate:.1f}%")
        
        if current_cancel_rate > settings['cancelRateThreshold']:
            anomaly = self.create_cancel_rate_anomaly(current_cancel_rate, settings['cancelRateThreshold'])
            new_anomalies.append(anomaly)
            self.save_anomaly(anomaly)
            print(f"⚠️ İptal oranı anomalisi oluşturuldu: {current_cancel_rate:.1f}% > {settings['cancelRateThreshold']}%")
        else:
            print(f"✅ İptal oranı OK: {current_cancel_rate:.1f}% <= {settings['cancelRateThreshold']}%")
        
        # 2. Geç kargo kontrolü
        late_orders = self.get_late_shipping_orders(settings['lateShippingThreshold'])
        print(f"🚚 Geç kargo siparişleri: {len(late_orders)}")
        
        if len(late_orders) > 0:
            anomaly = self.create_late_shipping_anomaly(len(late_orders), settings['lateShippingThreshold'])
            new_anomalies.append(anomaly)
            self.save_anomaly(anomaly)
            print(f"⚠️ Geç kargo anomalisi oluşturuldu: {len(late_orders)} sipariş > {settings['lateShippingThreshold']}h")
        else:
            print(f"✅ Kargo süreleri OK: {settings['lateShippingThreshold']}h üzerinde sipariş yok")
        
        # 3. Stok seviyelerini kontrol et
        low_stock_products = self.get_low_stock_products(settings['stockOutThreshold'])
        print(f"📦 Düşük stoklu ürünler: {len(low_stock_products)}")
        
        if low_stock_products:
            anomaly = self.create_stock_out_anomaly(low_stock_products, settings['stockOutThreshold'])
            new_anomalies.append(anomaly)
            self.save_anomaly(anomaly)
            print(f"⚠️ Stok tükendi anomalisi oluşturuldu: {len(low_stock_products)} ürün < {settings['stockOutThreshold']} adet")
        else:
            print(f"✅ Stok seviyeleri OK: Tüm ürünler >= {settings['stockOutThreshold']} adet")
        
        print(f"🎯 Tespit tamamlandı. {len(new_anomalies)} yeni anomali oluşturuldu.")
        return new_anomalies
    
    def trigger_detection_on_settings_change(self):
        """Ayarlar güncellendiğinde anomali tespitini tetikle"""
        print("🔄 Ayarlar değişti - anomali tespiti tetikleniyor...")
        return self.detect_and_create_anomalies()

# Harici kullanım için kolaylık fonksiyonu
def run_anomaly_detection():
    """Mevcut ayarlarla anomali tespitini çalıştır"""
    detector = AnomalyDetector()
    return detector.detect_and_create_anomalies()

def trigger_detection_after_settings_update():
    """Ayar güncellemesinden sonra tespiti tetikle"""
    detector = AnomalyDetector()
    return detector.trigger_detection_on_settings_change()

if __name__ == "__main__":
    # Anomali tespit sistemini test et
    print("🔍 Anomali Tespit Sistemi Test Ediliyor")
    detector = AnomalyDetector()
    anomalies = detector.detect_and_create_anomalies()
    
    print(f"\n📋 Özet:")
    for anomaly in anomalies:
        print(f"   - {anomaly['type']}: {anomaly['severity']} - {anomaly['description'][:60]}...")
