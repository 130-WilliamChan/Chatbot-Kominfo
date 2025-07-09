# CCTV Chatbot - Asisten Virtual untuk Informasi CCTV & Layanan Publik

Chatbot interaktif yang dirancang khusus untuk website sistem CCTV dan informasi layanan publik. Menggunakan browser TTS (Text-to-Speech) untuk pengalaman yang lebih baik.

## ✨ Fitur Utama

### 🎯 Fitur CCTV
- **Lokasi Kamera**: Informasi lengkap lokasi dan coverage kamera CCTV
- **Jadwal Maintenance**: Jadwal perawatan rutin dan emergency maintenance
- **Laporan Masalah**: Sistem pelaporan kamera rusak atau bermasalah
- **Status Operasional**: Real-time status sistem CCTV

### 📞 Layanan Publik
- **Kontak Darurat**: Akses cepat nomor emergency dan kontak penting
- **Jam Operasional**: Informasi lengkap jadwal operasional layanan
- **FAQ**: Pertanyaan yang sering diajukan tentang sistem CCTV
- **Pengumuman**: Update dan informasi terkini

### 🎤 Teknologi TTS
- **Browser TTS**: Menggunakan TTS bawaan browser (tidak memerlukan API key)
- **Multi-bahasa**: Mendukung Bahasa Indonesia dan Inggris
- **Responsif**: Text chunking untuk pembacaan yang natural
- **Kontrol Audio**: Start/stop speech dengan mudah

## 🚀 Cara Install & Jalankan

### Development Mode
```bash
# Clone repository
git clone <repository-url>
cd chatbot-cctv

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka browser dan akses
http://localhost:5173
```

### Production Build
```bash
# Build project
npm run build

# Preview production build
npm run preview
```

## 🔗 Integrasi ke Website Lain

### 1. Integrasi Sederhana (Copy-Paste)

Tambahkan script berikut sebelum closing tag `</body>`:

```html
<!-- Load chatbot script -->
<script src="path/to/cctv-chatbot-integration.js"></script>

<!-- Initialize chatbot -->
<script>
  CCTVChatbot.init({
    position: 'bottom-right',  // bottom-left, top-right, top-left
    theme: 'light',           // light, dark, auto
    size: 'normal'           // compact, normal, large
  });
</script>
```

### 2. Integrasi dengan Kustomisasi Penuh

```html
<script>
  CCTVChatbot.init({
    // Posisi widget
    position: 'bottom-right',
    
    // Tema tampilan
    theme: 'auto',  // Otomatis mengikuti sistem
    
    // Ukuran widget
    size: 'normal',
    
    // Fitur yang diaktifkan
    features: {
      cameraLocations: true,
      maintenanceSchedule: true,
      emergencyContacts: true,
      reportIssues: true,
      operationalHours: true
    },
    
    // Kustomisasi visual
    customization: {
      primaryColor: '#2196F3',    // Warna primary (sesuai brand)
      fontFamily: 'system-ui',    // Font family
      borderRadius: '12px'        // Border radius
    },
    
    // Integrasi dengan sistem backend
    integration: {
      apiEndpoint: 'https://api.yoursite.com/cctv',
      authToken: 'your-auth-token',
      customData: {
        siteId: 'main-building',
        department: 'Security'
      }
    },
    
    // Event callbacks
    onOpen: function() {
      console.log('Chatbot dibuka');
      // Google Analytics, tracking, dll
    },
    
    onClose: function() {
      console.log('Chatbot ditutup');
    },
    
    onMessage: function(message) {
      console.log('User mengirim:', message);
      // Custom message processing
    }
  });
</script>
```

### 3. API Kontrol Programmatik

```javascript
// Menampilkan chatbot
CCTVChatbot.show();

// Menyembunyikan chatbot
CCTVChatbot.hide();

// Mengirim pesan custom dari sistem
CCTVChatbot.sendCustomMessage("Sistem CCTV sedang maintenance pada 15:00-16:00");

// Mengecek status chatbot
if (CCTVChatbot.isInitialized) {
  console.log('Chatbot sudah aktif');
}

// Destroy chatbot (cleanup)
CCTVChatbot.destroy();
```

### 4. Integrasi WordPress

Tambahkan di `functions.php` tema Anda:

```php
function add_cctv_chatbot() {
    // Enqueue script
    wp_enqueue_script(
        'cctv-chatbot', 
        get_template_directory_uri() . '/js/cctv-chatbot-integration.js', 
        array(), 
        '1.0.0', 
        true
    );
    
    // Inline initialization
    $primary_color = get_theme_mod('primary_color', '#007cba');
    wp_add_inline_script('cctv-chatbot', "
        CCTVChatbot.init({
            position: 'bottom-right',
            theme: 'auto',
            customization: {
                primaryColor: '{$primary_color}'
            }
        });
    ");
}
add_action('wp_enqueue_scripts', 'add_cctv_chatbot');
```

## 📋 Struktur File Project

```
src/
├── components/
│   ├── FullModeChatbot.tsx     # Komponen chatbot utama
│   ├── ChatbotWidget.tsx       # Widget untuk integrasi
│   ├── VideoAvatar.tsx         # Avatar video (opsional)
│   └── TypingIndicator.tsx     # Indikator typing
├── services/
│   ├── browserTTSService.ts    # Service TTS browser
│   ├── elevenlabsService.ts    # Legacy service (redirect to TTS)
│   ├── geminiService.ts        # Service AI Gemini
│   └── chatHistoryService.ts   # Manajemen history chat
├── config/
│   └── cctvChatbotConfig.ts    # Konfigurasi khusus CCTV
├── hooks/
│   └── useVoiceRecognition.ts  # Hook voice recognition
└── types/
    └── chatbot.ts              # Type definitions

public/
├── cctv-chatbot-integration.js # Script integrasi standalone
├── integration-example.html    # Contoh implementasi
└── avatars/                    # Asset avatar video
```

## 🎯 Konfigurasi CCTV Spesifik

File `src/config/cctvChatbotConfig.ts` berisi:

### Knowledge Base CCTV
```typescript
export const cctvKnowledgeBase = {
  cameraLocations: {
    keywords: ["lokasi kamera", "dimana kamera", "posisi cctv"],
    response: "Informasi lokasi kamera CCTV..."
  },
  
  maintenanceSchedule: {
    keywords: ["jadwal maintenance", "perawatan", "service"],
    response: "Jadwal maintenance rutin..."
  },
  
  emergencyContacts: {
    keywords: ["kontak darurat", "emergency", "bantuan"],
    response: "Kontak emergency dan nomor penting..."
  }
  // ... dan lainnya
};
```

### Quick Actions
- 📍 **Lokasi Kamera**: Info lokasi dan coverage
- 🚨 **Emergency**: Kontak darurat dan prosedur
- 🕐 **Jam Operasional**: Schedule dan availability
- 🔧 **Maintenance**: Jadwal dan status maintenance

## 🛠 Kustomisasi & Pengembangan

### Menambah Response Baru
1. Edit `cctvKnowledgeBase` di config file
2. Tambahkan keywords dan response yang sesuai
3. Update quick actions jika diperlukan

### Mengubah Tampilan
1. Edit CSS di `ChatbotWidget.css`
2. Sesuaikan tema dan warna brand
3. Modify component props sesuai kebutuhan

### Integrasi Backend
```javascript
// Custom API endpoint
CCTVChatbot.init({
  integration: {
    apiEndpoint: 'https://your-api.com/cctv',
    authToken: 'bearer-token',
    customHeaders: {
      'X-Site-ID': 'main-building'
    }
  }
});
```

## 📱 Responsivitas & Aksesbilitas

- ✅ **Mobile Responsive**: Otomatis menyesuaikan ukuran layar
- ✅ **Touch Friendly**: Optimized untuk touch devices
- ✅ **Keyboard Navigation**: Support keyboard navigation
- ✅ **Screen Reader**: ARIA labels dan semantic HTML
- ✅ **High Contrast**: Support untuk high contrast mode
- ✅ **Reduced Motion**: Respect user motion preferences

## 🔧 Troubleshooting

### TTS Tidak Berfungsi
- Pastikan browser mendukung Web Speech API
- Cek permission mikrofon/audio di browser
- Test dengan browser lain (Chrome/Edge recommended)

### Chatbot Tidak Muncul
- Cek console browser untuk error JavaScript
- Pastikan script di-load dengan benar
- Verifikasi path ke file integration script

### Styling Bentrok
- Gunakan CSS specificity yang lebih tinggi
- Wrap dalam namespace CSS jika diperlukan
- Override variable CSS custom

## 📈 Analytics & Monitoring

```javascript
// Track chatbot usage
CCTVChatbot.init({
  onOpen: function() {
    gtag('event', 'chatbot_opened', {
      'event_category': 'engagement',
      'event_label': 'cctv_chatbot'
    });
  },
  
  onMessage: function(message) {
    gtag('event', 'chatbot_message', {
      'event_category': 'engagement',
      'event_label': message.substring(0, 50)
    });
  }
});
```

## 🚀 Deployment

### Untuk Website Statis
1. Build project: `npm run build`
2. Upload file `dist/` ke web server
3. Copy `public/cctv-chatbot-integration.js` ke website tujuan
4. Tambahkan script initialization

### Untuk CDN
1. Host file integration di CDN
2. Update URL script source
3. Test dari different domains

## 📄 License & Support

- **License**: MIT License
- **Support**: [Email/Discord/GitHub Issues]
- **Documentation**: [Link ke dokumentasi lengkap]
- **Demo**: [Link ke demo online]

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit Pull Request

---

**💡 Tips**: Untuk implementasi enterprise atau kustomisasi khusus, silakan hubungi tim development kami.
