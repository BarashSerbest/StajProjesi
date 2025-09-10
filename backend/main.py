from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List
import sqlite3
import json
from datetime import datetime, timedelta
from pydantic import BaseModel
import uvicorn
from anomaly_detector import trigger_detection_after_settings_update

app = FastAPI(title="E-ticaret Sipariş Anomali Tespit API", version="1.0.0")

# Başlangıçta veritabanı tarihlerini kontrol etmek ve güncellemek için startup olayı
@app.on_event("startup")
async def startup_event():
    """Başlangıçta veritabanı tarihlerini kontrol et ve güncelle"""
    try:
        from database import check_and_update_dates
        conn = get_db_connection()
        cursor = conn.cursor()
        check_and_update_dates(cursor)
        conn.commit()
        conn.close()
        print(" Başlangıçta veritabanı tarih kontrolü tamamlandı")
    except Exception as e:
        print(f"Uyarı: Başlangıçta veritabanı tarih kontrolü başarısız: {str(e)}")

# Frontend isteklerine izin vermek için CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite ve React geliştirme sunucuları
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# İstek/yanıt doğrulaması için Pydantic modelleri
class Order(BaseModel):
    id: str
    date: str
    customer: str
    product: str
    amount: float
    status: str
    anomaly: Optional[str] = None
    severity: Optional[str] = None

class Anomaly(BaseModel):
    id: str
    type: str
    severity: str
    description: str
    date: str
    orderId: Optional[str] = None
    suggestions: List[str]
    cancel_rate_threshold: Optional[int] = None
    late_shipping_threshold: Optional[int] = None
    stock_out_threshold: Optional[int] = None

class Notification(BaseModel):
    id: str
    title: str
    message: str
    type: str
    date: str
    read: bool

class DashboardStats(BaseModel):
    totalOrders: int
    anomaliesDetected: int
    lateShipments: int
    cancelledOrders: int

class ChartData(BaseModel):
    date: str
    orders: int
    anomalies: int

class AnomalyTypeData(BaseModel):
    name: str
    value: int
    color: str

class Settings(BaseModel):
    emailAlerts: bool
    slackWebhook: str
    cancelRateThreshold: int
    lateShippingThreshold: int
    stockOutThreshold: int
    notifications: dict

class InventoryItem(BaseModel):
    id: int
    product_name: str
    current_stock: int
    max_stock: int
    min_stock: int
    created_at: str
    updated_at: str
    
class InventoryUpdate(BaseModel):
    current_stock: int

class User(BaseModel):
    id: int
    username: str
    email: str
    created_at: str
    last_login: Optional[str] = None

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    email: str
    min_stock: int

# Veritabanı bağlantı yardımcısı
def get_db_connection():
    import os
    db_path = os.path.join(os.path.dirname(__file__), 'ecommerce.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

# API Rotaları
@app.get("/")
async def root():
    return {"message": "E-ticaret Sipariş Anomali Tespit API"}

@app.get("/orders", response_model=List[Order])
async def get_orders(
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    search: Optional[str] = None
):
    """Siparişleri filtreleme seçenekleri ile getir"""
    conn = get_db_connection()
    query = "SELECT * FROM orders WHERE 1=1"
    params = []
    
    if status and status != "all":
        query += " AND status = ?"
        params.append(status)
    
    if date_from:
        query += " AND date >= ?"
        params.append(date_from)
    
    if date_to:
        query += " AND date <= ?"
        params.append(date_to)
    
    if search:
        query += " AND (id LIKE ? OR customer LIKE ? OR product LIKE ?)"
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param])
    
    query += " ORDER BY date DESC"
    
    try:
        cursor = conn.execute(query, params)
        orders = cursor.fetchall()
        conn.close()
        
        return [dict(order) for order in orders]
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/anomalies", response_model=List[Anomaly])
async def get_anomalies():
    """Tüm anomalileri getir"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("""SELECT id, type, severity, description, date, orderId, suggestions,
                                         cancel_rate_threshold, late_shipping_threshold, stock_out_threshold 
                                 FROM anomalies ORDER BY date DESC""")
        anomalies = cursor.fetchall()
        conn.close()
        
        result = []
        for anomaly in anomalies:
            anomaly_dict = dict(anomaly)
            anomaly_dict['suggestions'] = json.loads(anomaly_dict['suggestions'])
            result.append(anomaly_dict)
        
        return result
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/anomalies/filtered", response_model=List[Anomaly])
async def get_filtered_anomalies(
    cancel_rate_threshold: Optional[int] = None,
    late_shipping_threshold: Optional[int] = None,
    stock_out_threshold: Optional[int] = None
):
    """Eşik değerlerine göre filtrelenmiş anomalileri getir"""
    conn = get_db_connection()
    try:
        query = """SELECT id, type, severity, description, date, orderId, suggestions,
                          cancel_rate_threshold, late_shipping_threshold, stock_out_threshold 
                   FROM anomalies WHERE 1=1"""
        params = []
        
        # Basit filtreleme mantığı:
        # Cancel Rate: belirlenen eşik ve ÜSTÜNDEKİ eşik değerine sahip anomaliler (>=)
        if cancel_rate_threshold is not None:
            query += """ AND (cancel_rate_threshold IS NOT NULL AND cancel_rate_threshold >= ?)"""
            params.append(cancel_rate_threshold)
            
        # Late Shipping: belirlenen eşik ve ÜSTÜNDEKİ eşik değerine sahip anomaliler (>=)
        if late_shipping_threshold is not None:
            query += """ AND (late_shipping_threshold IS NOT NULL AND late_shipping_threshold >= ?)"""
            params.append(late_shipping_threshold)
            
        # Stock Out: belirlenen eşik ve ALTINDAKİ eşik değerine sahip anomaliler (<=)
        if stock_out_threshold is not None:
            query += """ AND (stock_out_threshold IS NOT NULL AND stock_out_threshold <= ?)"""
            params.append(stock_out_threshold)
        
        query += " ORDER BY date DESC"
        
        cursor = conn.execute(query, params)
        anomalies = cursor.fetchall()
        conn.close()
        
        result = []
        for anomaly in anomalies:
            anomaly_dict = dict(anomaly)
            anomaly_dict['suggestions'] = json.loads(anomaly_dict['suggestions'])
            result.append(anomaly_dict)
        
        return result
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/notifications", response_model=List[Notification])
async def get_notifications():
    """Tüm bildirimleri getir"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("SELECT * FROM notifications ORDER BY date DESC")
        notifications = cursor.fetchall()
        conn.close()
        
        return [dict(notification) for notification in notifications]
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Bildirimi okundu olarak işaretle"""
    conn = get_db_connection()
    try:
        conn.execute("UPDATE notifications SET read = 1 WHERE id = ?", (notification_id,))
        conn.commit()
        conn.close()
        return {"message": "Bildirim okundu olarak işaretlendi"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: str):
    """Bildirimi sil"""
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM notifications WHERE id = ?", (notification_id,))
        conn.commit()
        conn.close()
        return {"message": "Bildirim silindi"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Dashboard istatistiklerini getir"""
    conn = get_db_connection()
    try:
        # Toplam sipariş sayısını al
        cursor = conn.execute("SELECT COUNT(*) as count FROM orders")
        total_orders = cursor.fetchone()['count']
        
        # Tespit edilen anomali sayısını al
        cursor = conn.execute("SELECT COUNT(*) as count FROM anomalies")
        anomalies_detected = cursor.fetchone()['count']
        
        # Geç kargo sevkiyatlarını al
        cursor = conn.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'shipped' AND anomaly LIKE '%lateShipping%'")
        late_shipments = cursor.fetchone()['count']
        
        # İptal edilen siparişleri al
        cursor = conn.execute("SELECT COUNT(*) as count FROM orders WHERE status = 'cancelled'")
        cancelled_orders = cursor.fetchone()['count']
        
        conn.close()
        
        return {
            "totalOrders": total_orders,
            "anomaliesDetected": anomalies_detected,
            "lateShipments": late_shipments,
            "cancelledOrders": cancelled_orders
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/chart-data", response_model=List[ChartData])
async def get_chart_data():
    """Grafik verilerini getir"""
    conn = get_db_connection()
    try:
        # Yerel zamanda 7 gün önceki tarihi hesapla
        start_date = (datetime.now() - timedelta(days=6)).strftime('%Y-%m-%d')
        
        # Yerel tarihleri kullanarak son 7 günün sipariş ve anomali verilerini al
        cursor = conn.execute("""
            SELECT 
                date,
                COUNT(*) as orders
            FROM orders 
            WHERE date >= ?
            GROUP BY date
            ORDER BY date
        """, (start_date,))
        orders_data = cursor.fetchall()
        
        cursor = conn.execute("""
            SELECT 
                DATE(date) as date,
                COUNT(*) as anomalies
            FROM anomalies 
            WHERE DATE(date) >= ?
            GROUP BY DATE(date)
            ORDER BY date
        """, (start_date,))
        anomalies_data = cursor.fetchall()
        
        conn.close()
        
        # Verileri birleştir
        chart_data = []
        orders_dict = {row['date']: row['orders'] for row in orders_data}
        anomalies_dict = {row['date']: row['anomalies'] for row in anomalies_data}
        
        # Son 7 günü oluştur
        for i in range(7):
            date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
            formatted_date = (datetime.now() - timedelta(days=6-i)).strftime('%b %d').replace(' 0', ' ')
            chart_data.append({
                "date": formatted_date,
                "orders": orders_dict.get(date, 0),
                "anomalies": anomalies_dict.get(date, 0)
            })
        
        return chart_data
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard/anomaly-types", response_model=List[AnomalyTypeData])
async def get_anomaly_types():
    """Anomali türü verilerini getir"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("""
            SELECT type, COUNT(*) as count
            FROM anomalies
            GROUP BY type
        """)
        anomaly_types = cursor.fetchall()
        conn.close()
        
        colors = ["#EF4444", "#F59E0B", "#F97316", "#8B5CF6"]
        result = []
        
        for i, anomaly_type in enumerate(anomaly_types):
            result.append({
                "name": anomaly_type['type'],
                "value": anomaly_type['count'],
                "color": colors[i % len(colors)]
            })
        
        return result
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/settings", response_model=Settings)
async def get_settings():
    """Ayarları getir"""
    conn = get_db_connection()
    try:
        cursor = conn.execute("SELECT * FROM settings WHERE id = 1")
        settings = cursor.fetchone()
        conn.close()
        
        if settings:
            settings_dict = dict(settings)
            settings_dict['notifications'] = json.loads(settings_dict['notifications'])
            return settings_dict
        else:
            # Varsayılan ayarları döndür
            return {
                "emailAlerts": True,
                "slackWebhook": "",
                "cancelRateThreshold": 15,
                "lateShippingThreshold": 24,
                "stockOutThreshold": 5,
                "notifications": {
                    "highSeverity": True,
                    "mediumSeverity": True,
                    "lowSeverity": False
                }
            }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/settings")
async def update_settings(settings: Settings):
    """Ayarları güncelle"""
    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT OR REPLACE INTO settings 
            (id, emailAlerts, slackWebhook, cancelRateThreshold, lateShippingThreshold, stockOutThreshold, notifications)
            VALUES (1, ?, ?, ?, ?, ?, ?)
        """, (
            settings.emailAlerts,
            settings.slackWebhook,
            settings.cancelRateThreshold,
            settings.lateShippingThreshold,
            settings.stockOutThreshold,
            json.dumps(settings.notifications)
        ))
        conn.commit()
        conn.close()
        
        # Yeni ayarlarla anomali tespitini tetikle
        print(f"🔄 Ayarlar güncellendi - yeni eşik değerleriyle anomali tespiti tetikleniyor:")
        print(f"   İptal Oranı: {settings.cancelRateThreshold}%")
        print(f"   Geç Kargo: {settings.lateShippingThreshold} saat") 
        print(f"   Stok Tükenmesi: {settings.stockOutThreshold} birim")
        
        try:
            new_anomalies = trigger_detection_after_settings_update()
            print(f" Güncellenmiş ayarlara göre {len(new_anomalies)} yeni anomali oluşturuldu")
        except Exception as e:
            print(f"Uyarı: Anomali tespiti başarısız: {str(e)}")
        
        return {"message": "Ayarlar başarıyla güncellendi", "anomalies_updated": True}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/anomalies/detect")
async def trigger_anomaly_detection():
    """Manuel olarak anomali tespitini tetikle"""
    try:
        from anomaly_detector import run_anomaly_detection
        new_anomalies = run_anomaly_detection()
        return {
            "message": "Anomali tespiti tamamlandı",
            "new_anomalies_count": len(new_anomalies),
            "anomalies": new_anomalies
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomali tespiti başarısız: {str(e)}")

@app.get("/inventory")
async def get_inventory():
    """Tüm envanter öğelerini getir"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, product_name, current_stock, max_stock, min_stock, created_at, updated_at
            FROM inventory
            ORDER BY product_name
        """)
        inventory = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in inventory]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/inventory/{product_name}")
async def get_inventory_item(product_name: str):
    """Belirli bir ürün için envanter bilgisini getir"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, product_name, current_stock, max_stock, min_stock, created_at, updated_at
            FROM inventory
            WHERE product_name = ?
        """, (product_name,))
        item = cursor.fetchone()
        conn.close()
        
        if not item:
            raise HTTPException(status_code=404, detail="Ürün enventerde bulunamadı")
        
        return dict(item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/inventory/{product_name}")
async def update_inventory(product_name: str, inventory_update: InventoryUpdate):
    """Belirli bir ürün için envanteri güncelle"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Ürünün var olup olmadığını kontrol et
        cursor.execute("SELECT id FROM inventory WHERE product_name = ?", (product_name,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Ürün enventerde bulunamadı")
        
        # Envanteri güncelle
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            UPDATE inventory 
            SET current_stock = ?, min_stock = ?, updated_at = ?
            WHERE product_name = ?
        """, (inventory_update.current_stock, inventory_update.min_stock, current_time, product_name))
        
        conn.commit()
        conn.close()
        
        return {"message": "Envanter başarıyla güncellendi"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/inventory/low-stock")
async def get_low_stock_items():
    """Düşük stoklu öğeleri getir (current_stock <= min_stock)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, product_name, current_stock, max_stock, min_stock, created_at, updated_at
            FROM inventory
            WHERE current_stock <= min_stock
            ORDER BY (current_stock - min_stock) ASC
        """)
        low_stock_items = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in low_stock_items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Kullanıcı Kimlik Doğrulama Endpoint'leri
@app.post("/auth/register")
async def register_user(user_data: UserRegister):
    """Yeni kullanıcı kaydı"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # E-postanın zaten var olup olmadığını kontrol et
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            conn.close()
            raise HTTPException(status_code=400, detail="E-posta zaten kayıtlı")
        
        # Yeni kullanıcı ekle
        cursor.execute('''
            INSERT INTO users (username, email, password, created_at)
            VALUES (?, ?, ?, ?)
        ''', (user_data.username, user_data.email, user_data.password, datetime.now().isoformat()))
        
        user_id = cursor.lastrowid
        conn.commit()
        
        # Oluşturulan kullanıcıyı al
        cursor.execute("SELECT id, username, email, created_at FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        return {
            "message": "Kullanıcı başarıyla kaydedildi",
            "user": dict(user)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
async def login_user(login_data: UserLogin):
    """Kullanıcı giriş kimlik doğrulaması"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Kullanıcı kimlik bilgilerini kontrol et
        cursor.execute("SELECT id, username, email, password FROM users WHERE email = ?", (login_data.email,))
        user = cursor.fetchone()
        
        if not user or user['password'] != login_data.password:
            conn.close()
            raise HTTPException(status_code=401, detail="Geçersiz kimlik bilgileri")
        
        # Son giriş tarihini güncelle
        cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", 
                      (datetime.now().isoformat(), user['id']))
        conn.commit()
        conn.close()
        
        return {
            "message": "Giriş başarılı",
            "user": {
                "id": user['id'],
                "username": user['username'], 
                "email": user['email']
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/forgot-password")
async def forgot_password(forgot_data: ForgotPassword):
    """Şifre sıfırlama talebini işle"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # E-postanın var olup olmadığını kontrol et
        cursor.execute("SELECT id FROM users WHERE email = ?", (forgot_data.email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=404, detail="E-posta bulunamadı")
        
        # Gerçek bir uygulamada burada e-posta gönderilir
        # Şimdilik sadece başarı mesajı döndürüyoruz
        return {"message": "Şifre sıfırlama e-postası başarıyla gönderildi"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users/me")
async def get_current_user(email: str = Query(...)):
    """E-posta ile mevcut kullanıcı bilgisini al"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, username, email, created_at, last_login FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        
        return dict(user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)