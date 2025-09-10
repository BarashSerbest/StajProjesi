#!/usr/bin/env python3
"""
FastAPI backend sunucusu için çalıştırma scripti
"""
import uvicorn
from database import init_database

if __name__ == "__main__":
    # Veritabanını örnek verilerle başlat
    print("Veritabanı başlatılıyor...")
    init_database()
    print("Veritabanı başlatıldı!")
    
    # FastAPI sunucusunu başlat
    print("FastAPI sunucusu http://localhost:8000 adresinde başlatılıyor")
    print("API dokümantasyonu http://localhost:8000/docs adresinde mevcut")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)