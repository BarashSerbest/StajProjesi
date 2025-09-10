import sqlite3
import json
from datetime import datetime, timedelta
import random

def init_database():
    """SQLite veritabanını tablolar ve örnek verilerle başlat"""
    conn = sqlite3.connect('ecommerce.db')  # Mevcut dizin için düzeltilmiş yol
    cursor = conn.cursor()
    
    # Tabloları oluştur
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            customer TEXT NOT NULL,
            product TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL,
            anomaly TEXT,
            severity TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS anomalies (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            orderId TEXT,
            suggestions TEXT NOT NULL,
            cancel_rate_threshold INTEGER,
            late_shipping_threshold INTEGER,
            stock_out_threshold INTEGER
        )
    ''')
    
    # Mevcut anomalies tablosuna yeni sütunları ekle (eğer yoksa)
    try:
        # Mevcut sütunları kontrol et
        cursor.execute("PRAGMA table_info(anomalies)")
        existing_columns = [col[1] for col in cursor.fetchall()]
        
        # Yeni sütunları ekle (eğer mevcut değilse)
        new_columns = [
            ('cancel_rate_threshold', 'INTEGER'),
            ('late_shipping_threshold', 'INTEGER'),
            ('stock_out_threshold', 'INTEGER')
        ]
        
        for column_name, column_type in new_columns:
            if column_name not in existing_columns:
                cursor.execute(f"ALTER TABLE anomalies ADD COLUMN {column_name} {column_type}")
                print(f"✅ {column_name} sütunu anomalies tablosuna eklendi")
        
    except sqlite3.Error as e:
        print(f"⚠️ Anomalies tablosu güncellenirken hata (normal olabilir): {e}")
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            date TEXT NOT NULL,
            read INTEGER DEFAULT 0
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            emailAlerts INTEGER DEFAULT 1,
            slackWebhook TEXT DEFAULT '',
            cancelRateThreshold INTEGER DEFAULT 15,
            lateShippingThreshold INTEGER DEFAULT 24,
            stockOutThreshold INTEGER DEFAULT 5,
            notifications TEXT DEFAULT '{}'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT UNIQUE NOT NULL,
            current_stock INTEGER NOT NULL DEFAULT 0,
            max_stock INTEGER NOT NULL DEFAULT 10000,
            min_stock INTEGER NOT NULL DEFAULT 100,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    ''')
    
    # Son güncelleme tarihini takip etmek için system_info tablosunu oluştur
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_info (
            id INTEGER PRIMARY KEY,
            last_update_date TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    # Veri zaten mevcut ise temizle
    cursor.execute("DELETE FROM orders")
    cursor.execute("DELETE FROM anomalies") 
    cursor.execute("DELETE FROM notifications")
    cursor.execute("DELETE FROM settings")
    cursor.execute("DELETE FROM inventory")
    cursor.execute("DELETE FROM users")
    
    # Tarihlerin güncellenmesi gerekip gerekmediğini kontrol et
    check_and_update_dates(cursor)
    
    seed_data(cursor)
    
    conn.commit()
    conn.close()
    
    # İlk anomali tespitini çalıştır
    try:
        from anomaly_detector import run_anomaly_detection
        print("\nİlk anomali tespiti çalıştırılıyor...")
        anomalies = run_anomaly_detection()
        print(f"İlk anomali tespiti {len(anomalies)} anomali ile tamamlandı")
    except Exception as e:
        print(f"Uyarı: İlk anomali tespiti başarısız: {str(e)}")

def check_and_update_dates(cursor):
    """Tarihlerin güncellenmesi gerekip gerekmediğini kontrol et ve gerekiyorsa güncelle"""
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Mevcut last_update_date'i kontrol et
    cursor.execute("SELECT last_update_date FROM system_info ORDER BY id DESC LIMIT 1")
    result = cursor.fetchone()
    
    if result is None or result[0] != today:
        print(f"Verileri son 7 gün içinde tutmak için tarihler güncelleniyor... (Son güncelleme: {result[0] if result else 'Hiç'})")
        update_dates_to_last_7_days(cursor)
        
        # system_info'yu güncelle veya ekle
        cursor.execute("DELETE FROM system_info")
        cursor.execute(
            "INSERT INTO system_info (last_update_date, created_at) VALUES (?, ?)",
            (today, datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'))
        )
        print("Tarihler başarıyla güncellendi!")
    else:
        print("Tarihler güncel, güncelleme gerekmiyor.")

def update_dates_to_last_7_days(cursor):
    """Tüm siparişleri, anomalileri ve bildirimleri son 7 gün içinde olacak şekilde güncelle"""
    base_date = datetime.now()
    
    # Tüm siparişleri al ve tarihlerini güncelle
    cursor.execute("SELECT id FROM orders")
    orders = cursor.fetchall()
    
    for order in orders:
        order_id = order[0]
        # Son 7 gün içinde rastgele dağıt
        random_days = random.randint(0, 6)
        random_hours = random.randint(0, 23)
        new_date = (base_date - timedelta(days=random_days, hours=random_hours)).strftime('%Y-%m-%d')
        cursor.execute("UPDATE orders SET date = ? WHERE id = ?", (new_date, order_id))
    
    # Anomali tarihlerini güncelle
    cursor.execute("SELECT id FROM anomalies")
    anomalies = cursor.fetchall()
    
    for anomaly in anomalies:
        anomaly_id = anomaly[0]
        random_days = random.randint(0, 6)
        random_hours = random.randint(0, 23)
        new_date = (base_date - timedelta(days=random_days, hours=random_hours)).strftime('%Y-%m-%dT%H:%M:%SZ')
        cursor.execute("UPDATE anomalies SET date = ? WHERE id = ?", (new_date, anomaly_id))
    
    # Bildirim tarihlerini güncelle
    cursor.execute("SELECT id FROM notifications")
    notifications = cursor.fetchall()
    
    for notification in notifications:
        notification_id = notification[0]
        random_days = random.randint(0, 6)
        random_hours = random.randint(0, 23)
        new_date = (base_date - timedelta(days=random_days, hours=random_hours)).strftime('%Y-%m-%dT%H:%M:%SZ')
        cursor.execute("UPDATE notifications SET date = ? WHERE id = ?", (new_date, notification_id))

def seed_data(cursor):
    """Veritabanını örnek verilerle doldur"""
    
    # Örnek siparişler - bugün dahil güncel tarihlerle güncellendi
    base_date = datetime.now()
    orders = [
        # Bugünkü siparişler
        ("ORD-0001", base_date.strftime('%Y-%m-%d'), "Ahmet Yılmaz", "iPhone 15 Pro", 45000, "shipped", "anomaly.highCancelRate", "medium"),
        ("ORD-0002", base_date.strftime('%Y-%m-%d'), "Zeynep Kaya", "Samsung Galaxy S24", 38000, "pending", None, None),
        ("ORD-0003", base_date.strftime('%Y-%m-%d'), "Mehmet Özkan", "MacBook Air M3", 55000, "delivered", None, None),
        # Dünkü siparişler
        ("ORD-0004", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), "Fatma Demir", "AirPods Pro", 8500, "shipped", "anomaly.lateShipping", "low"),
        ("ORD-0005", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), "Ali Şahin", "iPad Pro 12.9", 42000, "delivered", None, None),
        ("ORD-0006", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), "Ayşe Yıldız", "Sony WH-1000XM5", 12000, "shipped", None, None),
        # 2 gün önce
        ("ORD-0007", (base_date - timedelta(days=2)).strftime('%Y-%m-%d'), "Can Özdemir", "Dell XPS 13", 48000, "cancelled", "anomaly.stockOut", "high"),
        ("ORD-0008", (base_date - timedelta(days=2)).strftime('%Y-%m-%d'), "Elif Kara", "Nintendo Switch", 15000, "delivered", None, None),
        # 3 gün önce
        ("ORD-0009", (base_date - timedelta(days=3)).strftime('%Y-%m-%d'), "Murat Aydın", "PlayStation 5", 25000, "shipped", "anomaly.highCancelRate", "medium"),
        ("ORD-0010", (base_date - timedelta(days=3)).strftime('%Y-%m-%d'), "Selin Çelik", "Apple Watch Series 9", 18000, "delivered", None, None),
    ]
    
    # Genişletilmiş verilerle son 30 gün için daha fazla sipariş oluştur
    customers = [
        "Ahmet Yılmaz", "Zeynep Kaya", "Mehmet Özkan", "Fatma Demir", "Ali Şahin", 
        "Ayşe Yıldız", "Can Özdemir", "Elif Kara", "Murat Aydın", "Selin Çelik",
        "Emre Başkan", "Derya Koç", "Burak Arslan", "Nazlı Güneş", "Cem Yıldırım",
        "Pınar Akgül", "Oğuz Kartal", "Deniz Mutlu", "Esra Doğan", "Kaan Özbek",
        "İpek Soysal", "Berk Özmen", "Ceyda Nas", "Furkan Güler", "Seda Tunç",
        "Tolga Erdem", "Melisa Kılıç", "Barış Çetin", "Neslihan Uçar", "Gökhan Taş",
        "Hakan Demir", "Sibel Avcı", "Kemal Şen", "Burcu Koç", "Serkan Yıldız",
        "Melek Özkan", "Onur Kaya", "Gizem Arslan", "Volkan Çelik", "Aslı Doğan",
        "Caner Özdemir", "Didem Yılmaz", "Erhan Kara", "Gamze Aydın", "Hasan Çetin",
        "İrem Güneş", "Jale Mutlu", "Koray Başkan", "Lale Özbek", "Mert Kartal"
    ]
    
    products = [
        "iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air M3", "AirPods Pro", "iPad Pro 12.9",
        "Sony WH-1000XM5", "Dell XPS 13", "Nintendo Switch", "PlayStation 5", "Apple Watch Series 9",
        "iPhone 14", "Samsung Galaxy Tab S9", "MacBook Pro 14", "AirPods Max", "iPad Air 5",
        "Sony WH-CH720N", "HP Spectre x360", "Steam Deck", "Xbox Series X", "Garmin Forerunner 265",
        "Google Pixel 8", "Surface Pro 9", "MacBook Air M2", "Galaxy Buds2 Pro", "iPad mini 6",
        "Beats Studio3", "Asus ZenBook 14", "Nintendo Switch Lite", "PlayStation 4", "Apple Watch SE",
        "OnePlus 11", "Lenovo ThinkPad X1", "iMac 24", "Sony WF-1000XM4", "Microsoft Surface Laptop 5",
        "iPhone 13", "Samsung Galaxy A54", "MacBook Pro 16", "AirPods 3rd Gen", "iPad 10th Gen",
        "JBL Tune 770NC", "Acer Swift 3", "Meta Quest 3", "Xbox Series S", "Fitbit Versa 4",
        "Xiaomi 13", "Huawei MatePad 11", "Mac mini M2", "Beats Fit Pro", "iPad Pro 11",
        "Bose QuietComfort 45", "MSI Modern 14", "ROG Ally", "Nintendo Switch OLED", "Samsung Galaxy Watch 6",
        "iPhone 12", "Oppo Find X6", "iMac Pro", "Sony LinkBuds S", "Surface Go 3",
        "Sennheiser Momentum 4", "Razer Blade 15", "Steam Deck OLED", "PlayStation Portal", "Apple Watch Ultra 2"
    ]
    statuses = ["pending", "shipped", "delivered", "cancelled"]
    anomalies = ["anomaly.highCancelRate", "anomaly.stockOut", "anomaly.lateShipping", "anomaly.priceAnomaly"]
    severities = ["low", "medium", "high"]
    
    # Daha iyi veri için çok daha fazla sipariş oluştur ve daha iyi tarih dağılımı yap
    for i in range(11, 2001):  # 1990 sipariş daha oluştur (toplam 2000)
        # Daha iyi dağılım: %40 bugün ve dün, %30 son 3 gün, %30 eski veriler
        rand = random.random()
        if rand < 0.20:  # %20 bugün
            date = datetime.now().strftime('%Y-%m-%d')
        elif rand < 0.40:  # %20 dün  
            date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        elif rand < 0.70:  # %30 son 3 gün (2-4. günler)
            date = (datetime.now() - timedelta(days=random.randint(2, 4))).strftime('%Y-%m-%d')
        else:  # %30 eski veriler (5-30. günler)
            date = (datetime.now() - timedelta(days=random.randint(5, 30))).strftime('%Y-%m-%d')
            
        customer = random.choice(customers)
        product = random.choice(products)
        amount = random.randint(3000, 75000)  # Daha geniş fiyat aralığı
        status = random.choice(statuses)
        
        # %30 anomali olma şansı (%25'ten artırıldı)
        if random.random() < 0.30:
            anomaly = random.choice(anomalies)
            severity = random.choice(severities)
        else:
            anomaly = None
            severity = None
        
        orders.append((f"ORD-{i:04d}", date, customer, product, amount, status, anomaly, severity))
    
    cursor.executemany('''
        INSERT INTO orders (id, date, customer, product, amount, status, anomaly, severity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', orders)
    
    # Çok daha fazla verili örnek anomaliler - bugün dahil güncellenmiş tarihler
    anomalies_data = [
        ("ANO-001", "anomaly.highCancelRate", "high", "iPhone 15 Pro için iptal oranı %15 eşiğini aştı", base_date.strftime('%Y-%m-%d'), "ORD-0001", 
         json.dumps(["Ürün açıklamalarının doğruluğunu gözden geçir", "Kargo sürelerini ve maliyetlerini kontrol et", "Rakip fiyatlandırmasını analiz et"])),
        ("ANO-002", "anomaly.stockOut", "high", "MacBook Air M3 stokta yok ama hala sipariş kabul ediyor", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), "ORD-0007",
         json.dumps(["Envanter sistemini güncelle", "Ürün listesini geçici olarak devre dışı bırak", "Yeniden stok zamanı için tedarikçiyle iletişime geç"])),
        ("ANO-003", "anomaly.lateShipping", "medium", "Elektronik kategorisinde kargo gecikmesi tespit edildi", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), None,
         json.dumps(["Lojistik ortakla iletişime geç", "Teslimat tahminlerini güncelle", "Etkilenen müşterileri bilgilendir"])),
        ("ANO-004", "anomaly.priceAnomaly", "low", "Oyun konsolları için fiyat dalgalanması tespit edildi", (base_date - timedelta(days=2)).strftime('%Y-%m-%d'), None,
         json.dumps(["Fiyatlandırma stratejisini gözden geçir", "Rakip fiyatlarını kontrol et", "Fiyatlandırma kurallarını güncelle"])),
        # Daha iyi dağılım için daha fazla anomali ekle
        ("ANO-005", "anomaly.highCancelRate", "medium", "High cancel rate detected for Samsung Galaxy S24", base_date.strftime('%Y-%m-%d'), None,
         json.dumps(["Review customer feedback", "Check product quality", "Analyze return reasons"])),
        ("ANO-006", "anomaly.highCancelRate", "high", "Unusual cancel rate spike in electronics category", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), None,
         json.dumps(["Investigate category issues", "Review pricing strategy", "Check competitor activity"])),
        ("ANO-007", "anomaly.lateShipping", "high", "Critical shipping delays in Istanbul region", base_date.strftime('%Y-%m-%d'), None,
         json.dumps(["Contact regional logistics", "Find alternative carriers", "Update delivery estimates"])),
        ("ANO-008", "anomaly.lateShipping", "medium", "Minor delays detected in Ankara shipments", (base_date - timedelta(days=2)).strftime('%Y-%m-%d'), None,
         json.dumps(["Monitor shipping times", "Optimize delivery routes", "Check carrier performance"])),
        ("ANO-009", "anomaly.stockOut", "medium", "PlayStation 5 inventory running low", (base_date - timedelta(days=1)).strftime('%Y-%m-%d'), None,
         json.dumps(["Contact Sony supplier", "Update stock levels", "Consider pre-orders"])),
        ("ANO-010", "anomaly.priceAnomaly", "low", "Minor price discrepancy in Apple products", (base_date - timedelta(days=3)).strftime('%Y-%m-%d'), None,
         json.dumps(["Review Apple pricing", "Check MSRP changes", "Update pricing rules"])),
        ("ANO-011", "anomaly.highCancelRate", "low", "Slight increase in cancel rate for accessories", (base_date - timedelta(days=3)).strftime('%Y-%m-%d'), None,
         json.dumps(["Monitor accessory quality", "Review product descriptions", "Check customer satisfaction"])),
        ("ANO-012", "anomaly.lateShipping", "low", "Minor shipping delays in Izmir region", (base_date - timedelta(days=4)).strftime('%Y-%m-%d'), None,
         json.dumps(["Check local carrier", "Monitor weather conditions", "Update delivery estimates"])),
    ]
    
    # Çok daha fazla rastgele anomali oluştur
    anomaly_types = ["anomaly.highCancelRate", "anomaly.stockOut", "anomaly.lateShipping", "anomaly.priceAnomaly"]
    severities = ["low", "medium", "high"]
    
    anomaly_descriptions = {
        "anomaly.highCancelRate": [
            "High cancel rate detected for electronics",
            "Unusual cancellation spike in mobile phones",
            "Cancel rate exceeded threshold for accessories",
            "Significant increase in order cancellations",
            "Cancel rate anomaly in gaming category",
            "Critical cancel rate increase in laptops",
            "Abnormal cancellation pattern in tablets",
            "Cancel rate surge in audio devices",
            "High cancellation rate in smartwatches",
            "Sudden increase in electronics returns",
            "Cancel rate spike in premium products",
            "Unusual cancellation trend in peripherals"
        ],
        "anomaly.stockOut": [
            "Product inventory critically low",
            "Stock shortage detected in electronics",
            "Inventory depletion warning",
            "Product availability issue detected",
            "Stock out anomaly in popular items",
            "Critical inventory shortage alert",
            "Zero stock detected in high-demand products",
            "Inventory management failure detected",
            "Stock shortage in seasonal products",
            "Critical supply chain disruption",
            "Inventory levels below safety threshold",
            "Product availability crisis detected"
        ],
        "anomaly.lateShipping": [
            "Shipping delays detected in region",
            "Delivery time anomaly identified",
            "Late shipment pattern observed",
            "Logistics delay warning",
            "Shipping performance degradation",
            "Critical shipping delays nationwide",
            "Express delivery service disrupted",
            "International shipping delays detected",
            "Regional logistics network failure",
            "Carrier performance below standards",
            "Shipping time exceeded SLA",
            "Distribution center delays reported"
        ],
        "anomaly.priceAnomaly": [
            "Price fluctuation detected",
            "Pricing inconsistency found",
            "Market price deviation observed",
            "Price anomaly in category",
            "Unexpected price change detected",
            "Competitor pricing mismatch identified",
            "Dynamic pricing algorithm error",
            "Price synchronization failure",
            "Market rate adjustment needed",
            "Pricing strategy deviation detected",
            "Cost inflation impact observed",
            "Revenue optimization alert triggered"
        ]
    }
    
    suggestions_map = {
        "anomaly.highCancelRate": [
            "Review product descriptions for accuracy",
            "Check shipping times and costs", 
            "Analyze competitor pricing",
            "Improve customer communication",
            "Review return policy",
            "Enhance product quality control",
            "Update customer service protocols",
            "Investigate payment processing issues",
            "Review product photography quality",
            "Analyze customer feedback patterns",
            "Implement customer retention strategies",
            "Optimize checkout process"
        ],
        "anomaly.stockOut": [
            "Update inventory system",
            "Contact supplier for restock",
            "Consider alternative suppliers",
            "Implement stock alerts",
            "Review demand forecasting",
            "Establish safety stock levels",
            "Improve supply chain visibility",
            "Implement just-in-time ordering",
            "Review minimum order quantities",
            "Diversify supplier network",
            "Implement automated reordering",
            "Enhance inventory tracking"
        ],
        "anomaly.lateShipping": [
            "Contact logistics partner",
            "Update delivery estimates",
            "Find alternative carriers",
            "Optimize delivery routes",
            "Monitor carrier performance",
            "Implement shipment tracking",
            "Review packaging procedures",
            "Establish backup shipping options",
            "Improve warehouse efficiency",
            "Negotiate better shipping terms",
            "Implement expedited shipping",
            "Monitor weather impacts"
        ],
        "anomaly.priceAnomaly": [
            "Review pricing strategy",
            "Check competitor prices",
            "Update pricing rules",
            "Monitor market trends",
            "Adjust pricing algorithm",
            "Implement dynamic pricing",
            "Review cost structure",
            "Analyze price elasticity",
            "Update margin requirements",
            "Review promotional pricing",
            "Implement price monitoring",
            "Adjust seasonal pricing"
        ]
    }
    
    # 184 rastgele anomali daha oluştur (toplam 196 olacak) daha iyi tarih dağılımıyla
    for i in range(13, 197):  # 184 yeni anomali
        anomaly_type = random.choice(anomaly_types)
        severity = random.choice(severities)
        description = random.choice(anomaly_descriptions[anomaly_type])
        
        # Anomaliler için de daha iyi dağılım
        rand = random.random()
        if rand < 0.15:  # %15 bugün
            date = datetime.now().strftime('%Y-%m-%d')
        elif rand < 0.30:  # %15 dün  
            date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        elif rand < 0.60:  # %30 son 3 gün (2-4. günler)
            date = (datetime.now() - timedelta(days=random.randint(2, 4))).strftime('%Y-%m-%d')
        else:  # %40 eski veriler (5-30. günler)
            date = (datetime.now() - timedelta(days=random.randint(5, 30))).strftime('%Y-%m-%d')
        
        # Belirli bir siparişe bağlı olma şansı %20
        order_id = None
        if random.random() < 0.20:
            order_num = random.randint(1, 2000)
            order_id = f"ORD-{order_num:04d}"
        
        suggestions = json.dumps(random.sample(suggestions_map[anomaly_type], 3))
        
        anomalies_data.append((
            f"ANO-{i:03d}",
            anomaly_type,
            severity,
            description,
            date,
            order_id,
            suggestions
        ))
    
    cursor.executemany('''
        INSERT INTO anomalies (id, type, severity, description, date, orderId, suggestions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', anomalies_data)
    
    # Daha fazla verili örnek bildirimler - bugün dahil güncellenmiş tarihler
    notifications_data = [
        ("NOT-001", "Yüksek anomali oranı tespit edildi", "iPhone 15 Pro için iptal oranı son saatte %15'i aştı", "error", base_date.strftime('%Y-%m-%dT%H:%M:%SZ'), 0),
        ("NOT-002", "Stok uyarısı", "MacBook Air M3 envanteri azalıyor (5 adet kaldı)", "warning", (base_date - timedelta(hours=2)).strftime('%Y-%m-%dT%H:%M:%SZ'), 0),
        ("NOT-003", "Sistem güncellemesi tamamlandı", "Anomali tespit sistemi başarıyla güncellendi", "success", (base_date - timedelta(hours=5)).strftime('%Y-%m-%dT%H:%M:%SZ'), 1),
        ("NOT-004", "Yeni sipariş alındı", "Oyun aksesuarları için büyük sipariş alındı", "info", (base_date - timedelta(days=1, hours=1)).strftime('%Y-%m-%dT%H:%M:%SZ'), 1),
        ("NOT-005", "Kargo gecikmesi uyarısı", "Elektronik kategorisi kargolarında potansiyel gecikmeler", "warning", (base_date - timedelta(days=1, hours=3)).strftime('%Y-%m-%dT%H:%M:%SZ'), 0),
    ]
    
    # Çok daha fazla rastgele bildirim oluştur
    notification_types = ["error", "warning", "success", "info"]
    notification_titles = {
        "error": [
            "Critical system error detected",
            "Payment processing failed",
            "Database connection lost",
            "High error rate in API",
            "Security breach detected",
            "Server overload critical",
            "Authentication system failure",
            "Data corruption detected",
            "Service unavailable error",
            "Network connectivity issues",
            "Cache system failure",
            "Session management error"
        ],
        "warning": [
            "Low inventory warning",
            "High server load detected",
            "Unusual traffic pattern",
            "Payment gateway slow",
            "Backup process delayed",
            "Disk space running low",
            "Memory usage high",
            "Response time degradation",
            "SSL certificate expiring",
            "Queue processing delays",
            "API rate limit approaching",
            "Database performance issues"
        ],
        "success": [
            "Order processed successfully",
            "Payment completed",
            "Shipment delivered",
            "System backup completed",
            "Database optimization finished",
            "Security update installed",
            "Performance improvements deployed",
            "New feature released",
            "System health check passed",
            "Data migration completed",
            "Cache refresh successful",
            "Maintenance window completed"
        ],
        "info": [
            "New customer registered",
            "Product review submitted",
            "Newsletter sent successfully",
            "Monthly report generated",
            "System maintenance scheduled",
            "Software update available",
            "New promotion launched",
            "Analytics report ready",
            "User activity summary",
            "Inventory report generated",
            "Weekly sales summary",
            "System performance metrics"
        ]
    }
    
    notification_messages = {
        "error": [
            "Immediate attention required for system stability",
            "Critical error affecting user experience",
            "System performance degraded significantly",
            "Error rate exceeded acceptable threshold",
            "Security incident requires investigation"
        ],
        "warning": [
            "Monitor situation closely for potential issues",
            "Performance may be affected if not addressed",
            "Warning threshold reached for system metrics",
            "Potential issue identified in system operations",
            "Monitoring alert triggered for review"
        ],
        "success": [
            "Operation completed without any issues",
            "Process executed successfully within timeframe",
            "All systems operating normally",
            "Task completed as expected",
            "Performance metrics within normal range"
        ],
        "info": [
            "Information update for your awareness",
            "Status update on ongoing operations",
            "Routine notification for system activity",
            "General information about system state",
            "Standard operational notification"
        ]
    }
    
    # 200 rastgele bildirim daha oluştur (toplam 205 olacak) daha iyi tarih dağılımıyla
    for i in range(6, 206):
        notification_type = random.choice(notification_types)
        title = random.choice(notification_titles[notification_type])
        message = random.choice(notification_messages[notification_type])
        
        # Bildirimler için de daha iyi dağılım
        rand = random.random()
        if rand < 0.25:  # %25 bugün
            date = (datetime.now() - timedelta(hours=random.randint(0, 23), minutes=random.randint(0, 59))).strftime('%Y-%m-%dT%H:%M:%SZ')
        elif rand < 0.45:  # %20 dün  
            date = (datetime.now() - timedelta(days=1, hours=random.randint(0, 23), minutes=random.randint(0, 59))).strftime('%Y-%m-%dT%H:%M:%SZ')
        elif rand < 0.70:  # %25 son 3 gün (2-4. günler)
            date = (datetime.now() - timedelta(days=random.randint(2, 4), hours=random.randint(0, 23), minutes=random.randint(0, 59))).strftime('%Y-%m-%dT%H:%M:%SZ')
        else:  # %30 eski veriler (5-30. günler)
            date = (datetime.now() - timedelta(days=random.randint(5, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        read = random.choice([0, 0, 1])  # %33 okunmuş, %67 okunmamış daha gerçekçi veri için
        
        notifications_data.append((
            f"NOT-{i:03d}",
            title,
            message,
            notification_type,
            date,
            read
        ))
    
    cursor.executemany('''
        INSERT INTO notifications (id, title, message, type, date, read)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', notifications_data)
    
    # Varsayılan ayarlar
    default_settings = (
        1, 1, "", 15, 24, 5, 
        json.dumps({"highSeverity": True, "mediumSeverity": True, "lowSeverity": False})
    )
    
    cursor.execute('''
        INSERT INTO settings (id, emailAlerts, slackWebhook, cancelRateThreshold, lateShippingThreshold, stockOutThreshold, notifications)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', default_settings)
    
    # Tüm benzersiz ürünler için envanter verisi oluştur
    cursor.execute("SELECT DISTINCT product FROM orders")
    unique_products = [row[0] for row in cursor.fetchall()]
    
    inventory_data = []
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    for product in unique_products:
        current_stock = random.randint(0, 10000)  # 0-10000 arası rastgele stok
        max_stock = 10000
        min_stock = random.randint(50, 200)  # Rastgele minimum eşik
        
        inventory_data.append((
            product,
            current_stock,
            max_stock,
            min_stock,
            current_time,
            current_time
        ))
    
    cursor.executemany('''
        INSERT INTO inventory (product_name, current_stock, max_stock, min_stock, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', inventory_data)
    
    # Varsayılan admin kullanıcısını ekle
    cursor.execute('''
        INSERT INTO users (username, email, password, created_at)
        VALUES (?, ?, ?, ?)
    ''', ("Admin", "admin@example.com", "123456", datetime.now().isoformat()))

if __name__ == "__main__":
    init_database()
    print("Veritabanı örnek verilerle başlatıldı!")