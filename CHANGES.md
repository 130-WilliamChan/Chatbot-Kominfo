# CCTV Chatbot - Browser TTS Implementation

## ✅ Perubahan yang Telah Dilakukan

### 1. Menghapus Semua Dependensi ElevenLabs TTS
- ❌ Removed: ElevenLabs API integration
- ❌ Removed: API key requirements
- ❌ Removed: External TTS service calls
- ✅ Added: Browser-native TTS service

### 2. Implementasi Browser TTS
- ✅ **browserTTSService.ts**: Service TTS menggunakan Web Speech API
- ✅ **Text Chunking**: Pembagian text untuk TTS yang natural
- ✅ **Indonesian Language**: Optimized untuk Bahasa Indonesia
- ✅ **Voice Control**: Start/stop speech functionality

### 3. CCTV-Specific Configuration
- ✅ **cctvChatbotConfig.ts**: Konfigurasi khusus untuk website CCTV
- ✅ **Knowledge Base**: Database response untuk pertanyaan CCTV
- ✅ **Quick Actions**: Tombol cepat untuk info penting
- ✅ **Emergency Contacts**: Kontak darurat terintegrasi

### 4. Widget Integration System
- ✅ **ChatbotWidget.tsx**: Komponen widget yang dapat diintegrasikan
- ✅ **ChatbotWidget.css**: Styling responsif dan customizable
- ✅ **Integration Script**: Standalone JavaScript untuk integrasi website

### 5. Integration Files
- ✅ **cctv-chatbot-integration.js**: Script standalone untuk integrasi
- ✅ **integration-example.html**: Contoh implementasi lengkap
- ✅ **INTEGRATION.md**: Dokumentasi lengkap cara integrasi

## 🎯 Fitur CCTV yang Tersedia

### Informasi CCTV
1. **📍 Lokasi Kamera**
   - Info coverage area
   - Posisi strategis kamera
   - Area monitoring

2. **🔧 Jadwal Maintenance**
   - Maintenance rutin mingguan
   - Schedule bulanan
   - Emergency maintenance

3. **📞 Kontak Emergency**
   - Nomor darurat (110, 113, 118)
   - Kontak internal (Control Room, Security)
   - WhatsApp admin

4. **🕐 Jam Operasional**
   - Monitoring 24/7
   - Control room schedule
   - Technical support hours

5. **📝 Laporan Masalah**
   - Cara melaporkan kamera rusak
   - Response time commitment
   - Multiple channel reporting

## 🚀 Cara Integrasi ke Website CCTV

### Integrasi Sederhana (3 Langkah)

1. **Upload File**
   ```
   Upload 'cctv-chatbot-integration.js' ke server website
   ```

2. **Tambah Script**
   ```html
   <script src="path/to/cctv-chatbot-integration.js"></script>
   ```

3. **Initialize**
   ```html
   <script>
     CCTVChatbot.init({
       position: 'bottom-right',
       theme: 'light'
     });
   </script>
   ```

### Customization untuk Brand Website
```javascript
CCTVChatbot.init({
  customization: {
    primaryColor: '#YOUR_BRAND_COLOR',
    fontFamily: 'Your-Font-Family',
    borderRadius: '8px'
  }
});
```

## 📱 Keunggulan Browser TTS

### ✅ Advantages
- **No API Key Required**: Tidak perlu registrasi atau biaya
- **Offline Capable**: Bekerja tanpa internet setelah load
- **Multi-language**: Support Bahasa Indonesia dan Inggris
- **Fast Response**: Instant speech tanpa network delay
- **Privacy Friendly**: Tidak ada data yang dikirim ke server eksternal

### 🔧 Technical Features
- **Auto Voice Detection**: Otomatis pilih voice Indonesia jika tersedia
- **Text Chunking**: Pembagian text untuk natural speech
- **Error Recovery**: Fallback handling jika TTS gagal
- **Volume Control**: Kontrol volume yang optimal untuk web

## 📋 File Structure Baru

```
src/
├── services/
│   ├── browserTTSService.ts      # ✅ NEW: Browser TTS service
│   ├── elevenlabsService.ts      # ✅ UPDATED: Redirect to browser TTS
│   └── ...
├── components/
│   ├── ChatbotWidget.tsx         # ✅ NEW: Integration widget
│   ├── ChatbotWidget.css         # ✅ NEW: Widget styling
│   └── ...
├── config/
│   └── cctvChatbotConfig.ts      # ✅ NEW: CCTV-specific config
└── ...

public/
├── cctv-chatbot-integration.js   # ✅ NEW: Standalone integration
├── integration-example.html      # ✅ NEW: Implementation example
└── ...
```

## 🎯 Use Cases untuk Website CCTV

### 1. Website Pemerintah
- Informasi CCTV traffic
- Kontak dinas terkait
- Jadwal maintenance jalan

### 2. Sistem Keamanan Gedung
- Lokasi kamera per lantai
- Kontak security 24/7
- Prosedur emergency

### 3. Mall/Shopping Center
- Info kamera area publik
- Kontak customer service
- Emergency evacuation

### 4. Kampus/Sekolah
- Monitoring area kampus
- Kontak keamanan
- Jadwal operasional

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## 📞 Quick Test

Setelah integrasi, user dapat:

1. **Klik chatbot icon** (pojok kanan bawah)
2. **Pilih quick action**:
   - 📍 Lokasi Kamera
   - 🚨 Emergency
   - 🕐 Jam Operasional
   - 🔧 Maintenance
3. **Atau ketik pertanyaan**:
   - "Di mana lokasi kamera CCTV?"
   - "Nomor emergency berapa?"
   - "Jam berapa control room buka?"

## 🎉 Ready for Production

Project ini sekarang siap untuk:
- ✅ Deployment ke production server
- ✅ Integrasi ke website CCTV manapun
- ✅ Customization sesuai brand
- ✅ Mobile dan desktop usage
- ✅ Multiple language support

**Total waktu integrasi: ~15 menit untuk basic setup**
