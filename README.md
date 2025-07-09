# 🤖 Modern AI Chatbot with Avatar Interface

Chatbot modern dengan integrasi Google Gemini AI, avatar video, dan fitur voice recognition. Dibangun menggunakan React + TypeScript dengan Vite untuk performa optimal.

## ✨ Fitur Terbaru (Updated July 2025)

- 🎬 **Video Avatar Interface**: Avatar video interaktif dengan berbagai ekspresi (idle, listening, speaking, thinking, happy)
- 🗣️ **ElevenLabs TTS Integration**: Text-to-speech berkualitas tinggi (dengan fallback ke browser TTS)
- 🔄 **Continuous Mode**: Mode percakapan berkelanjutan dengan deteksi jeda
- 💬 **Subtitle Animation**: Tampilan subtitle real-time saat avatar berbicara
- 📱 **Full Mode Interface**: Tampilan chatbot lengkap dengan avatar video
- 🎤 **Advanced Voice Recognition**: Peningkatan akurasi input suara

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Integration**: Google Gemini API
- **Voice Recognition**: Web Speech API
- **Text-to-Speech**: ElevenLabs API dengan browser TTS fallback
- **Styling**: Modern CSS dengan animasi
- **Media**: Video avatar dengan multiple states
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup API Keys**
   - Google Gemini API Key: Configure di environment variables atau di `src/services/geminiService.ts`
   - ElevenLabs API Key: Configure di environment variables atau di `src/services/elevenLabsService.ts`

4. **Run development server**
```bash
npm run dev
```

5. **Build untuk production**
```bash
npm run build
```

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── FullModeChatbot.tsx     # Komponen chatbot utama dengan avatar
│   ├── FullModeChatbot.css     # Styling untuk full mode
│   ├── TypingIndicator.tsx     # Indikator saat AI mengetik
│   ├── VideoAvatar.tsx         # Komponen avatar video
│   └── VideoAvatar.css         # Styling untuk avatar
├── hooks/
│   └── useVoiceRecognition.ts  # Custom hook untuk voice input
├── services/
│   ├── chatHistoryService.ts   # Pengelolaan history chat
│   ├── elevenLabsService.ts    # Integrasi ElevenLabs TTS
│   ├── geminiService.ts        # Integrasi Google Gemini API
│   └── profanityFilter.ts      # Filter konten tidak pantas
├── types/
│   └── chatbot.ts              # TypeScript interfaces
├── assets/
│   └── [static assets]         # Gambar dan aset statis
├── App.tsx                     # Main app container
└── main.tsx                    # Entry point
```

## 🎯 Fitur Avatar Mode

### Video Avatar States
- **Idle**: Saat menunggu input
- **Listening**: Saat mendengarkan input suara
- **Thinking**: Saat memproses respons
- **Speaking**: Saat memberikan respons
- **Happy**: Ekspresi positif pada respons tertentu

### Continuous Mode
- Aktifkan untuk percakapan berkelanjutan
- Otomatis mendeteksi jeda untuk mengirim input
- Indikator visual untuk mode berkelanjutan

## 🎨 Text-to-Speech Options

### ElevenLabs Integration
```typescript
// Konfigurasi ElevenLabs
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || '';
const VOICE_ID = ;
```

### Browser Fallback
- Otomatis beralih ke browser TTS jika ElevenLabs tidak tersedia
- Konfigurasi pitch dan rate untuk pengalaman optimal

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env` di root project:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Avatar Customization
Ganti video di folder `public/avatars/video/states/` dengan avatar kustom Anda.

## 📱 Responsiveness

- **Desktop**: Tampilan penuh dengan avatar video
- **Mobile**: Adaptif dengan kontrol yang lebih compact
- **Tablet**: Layout yang dioptimalkan untuk layar menengah

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
Konfigurasi sudah tersedia di `netlify.toml`
```bash
npm run build
netlify deploy --prod
```

## 🔒 Keamanan

⚠️ **Penting**: 
- Gunakan environment variables untuk API key di production
- ElevenLabs API memiliki rate limiting, pertimbangkan untuk implementasi caching
- Aktifkan profanity filter untuk konten yang aman

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


**Dibuat dengan menggunakan React + TypeScript + Google Gemini AI + ElevenLabs**
