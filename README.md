Barış Serbest / 5220505051 

# STAJ22001Projesi  
Akıllı E-Ticaret Sipariş Anomali Tespit ve İzleme Uygulaması 

Gerçek zamanlı sipariş akışında iptal oranı artışı, geç kargo, stok tükenmesi gibi operasyonel riskleri tespit eden; gösterge paneli, envanter yönetimi, 
kullanıcı kimlik doğrulama ve bildirim sistemi içeren uçtan uca bir izleme çözümü işlemlerini gerçekleştiren bir prototip uygulama.

## Özellikler
- Dinamik anomali tespiti (iptal oranı, geç kargo, düşük stok)
- Eşik değerleri değişince otomatik yeniden değerlendirme
- Dashboard: özet istatistikler, grafikler, anomali dağılımları
- Anomali listesi ve filtreleme
- Envanter görüntüleme, düşük stok sorgulama ve stok güncelleme
- Bildirim paneli (okundu / silme)
- Kullanıcı kayıt, giriş, şifre sıfırlama isteği (basit demo)
- Mock veritabanı + otomatik veri üretimi (2000+ sipariş, 190+ anomali, 200+ bildirim)
- CORS destekli FastAPI backend + Vite React TypeScript frontend
- TailwindCSS ile modern arayüz

## Teknolojiler
Backend: FastAPI, Uvicorn, Pydantic, SQLite  
Frontend: React 18, TypeScript, Vite, Axios, Recharts, TailwindCSS, Lucide Icons  
Veri: SQLite (gömülü dosya ecommerce.db)  
Diğer: Dinamik seed mekanizması, eşik bazlı anomali üreteci

## Sistem Gereksinimleri
- Node.js >= 18.x (LTS önerilir)
- npm >= 9.x
- Python 3.11+ (3.12 de çalışır)
- Git (opsiyonel)
- Windows 10/11 (test edilen), Linux / macOS desteklenir
- 2GB boş disk alanı (geçici node modülleri + veritabanı için)

## Hızlı Başlangıç (Kısa)
1. Backend bağımlılıkları:  
   `cd backend`  
   `python -m venv .venv`  
   `.\.venv\Scripts\activate` (PowerShell)  
   `pip install -r requirements.txt`
2. Veritabanını başlat (isteğe bağlı ilk reset):  
   `python database.py`
3. Backend’i çalıştır:  
   `python main.py` (varsayılan http://localhost:8000)
4. Frontend:  
   Üst dizine dön → `npm install` → `npm run dev` (http://localhost:5173)
5. Tarayıcıdan arayüzü aç.

## Detaylı Kurulum

### 1. Depoyu Klonla
```
git clone https://github.com/<kullanici>/STAJ22001Projesi.git
cd STAJ22001Projesi
```

### 2. Backend Ortamı
PowerShell:
```
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```
Linux/macOS:
```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Veritabanı Başlatma / Reset
İlk çalıştırmada otomatik tablo + örnek veri üretmek için:
```
python database.py
```
Bu script:
- Tabloları oluşturur / eksikleri tamamlar
- Mevcut veriyi temizler (demo yapısı)
- 2000 sipariş + anomali + bildirim üretir
- İlk anomali tespitini çalıştırır

### 4. Backend Sunucusu
```
python main.py
```
Varsayılan: http://localhost:8000  
Swagger UI (otomatik dokümantasyon): http://localhost:8000/docs

### 5. Frontend
Root dizine dön:
```
npm install
npm run dev
```
Adres: http://localhost:5173

### 6. Hazır .bat Dosyaları (Windows)
- start_backend.bat: Sanal ortam aktif değilse manuel aktifleştirin
- start_frontend.bat: Frontend geliştirme sunucusunu başlatır

## Önemli Scriptler
- database.py: Seed + tablo init + tarih güncelleme
- anomaly_detector.py: Eşik bazlı anomali üretimi
- main.py: API endpoint’leri
- src içi React bileşenleri

## API Özet (Seçme Uç Noktalar)
- GET `/orders` (filtre: status, date_from, date_to, search)
- GET `/anomalies`, GET `/anomalies/filtered`
- POST `/anomalies/detect` (manuel tetikleme)
- GET `/dashboard/stats`, `/dashboard/chart-data`, `/dashboard/anomaly-types`
- GET/POST `/settings`
- Envanter: GET `/inventory`, GET `/inventory/{product}`, PUT `/inventory/{product}`, GET `/inventory/low-stock`
- Auth: POST `/auth/register`, POST `/auth/login`, GET `/users/me`
- Bildirimler: GET `/notifications`, PUT `/notifications/{id}/read`, DELETE `/notifications/{id}`

## Mimari Akış
1. Kullanıcı arayüzü React + Axios ile API’ya istek atar.  
2. FastAPI SQLite üzerinden veri okur/yazar.  
3. Ayar güncellemesi → anomali tespit tetiklenir → yeni kayıtlar `anomalies` tablosuna eklenir.  
4. Frontend dashboard grafikleri son 7 gün verilerini birleştirir.  
5. Seed mekanizması tarihleri güncel tutar (son 7 gün görünümü canlı hissi verir).

## Klasör Yapısı (Özet)
```
backend/
  main.py
  anomaly_detector.py
  database.py
  requirements.txt
src/
  components/
  pages/
  context/
  services/api.ts
ecommerce.db (oluşur/seed edilir)
```

## Geliştirme İpuçları
- Kod değişikliği sonrası veriyi sıfırlamak için database.py çalıştır
- Eşik testleri: Ayarları düşür → `/settings` POST → yeni anomaliler oluşur
- Performans: 2000 sipariş + 200 anomali hızlı sorgu için optimize (basit indeks ihtiyacı doğarsa `orders(id,date,status)` eklenebilir)

## Yol Haritası (Öneri)
- JWT tabanlı gerçek kimlik doğrulama
- Roller (admin / operator)
- WebSocket ile canlı anomali push
- Rapor export (CSV / PDF)
- Gerçek envanter entegrasyonu
- Docker Compose ile tek komutla kurulum
- Unit test + CI pipeline

## Katkı
1. Fork
2. Feature branch: `feat/<ozellik>`
3. PR açmadan önce: Kod formatı + kısa açıklama
4. Issue açarak tartışma başlatabilirsiniz

## Sorun Giderme
- Port çakışması: 8000 veya 5173 doluysa parametrelerle değiştir
- `ModuleNotFoundError`: Sanal ortam aktif mi kontrol et
- Bozuk veritabanı: ecommerce.db sil → `python database.py`
- Tailwind çalışmıyorsa: Node sürümü ve `postcss` kurulumunu doğrula

## Güvenlik Notu
- Parolalar düz metin (demo amaçlı). Üretim için hashing (bcrypt) + JWT zorunlu.
- CORS şu an localhost’a açık; dağıtımda domain bazlı kısıtlanmalı.

## Lisans
İç proje / eğitim amaçlı (lisans belirtilmemişse eklenmesi önerilir).
