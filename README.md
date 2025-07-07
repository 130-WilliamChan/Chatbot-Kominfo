# 🤖 Modern Chatbot with Voice Recognition

Chatbot modern dengan integrasi Google Gemini AI dan fitur voice recognition. Dibangun menggunakan React + TypeScript dengan Vite untuk performa optimal.

## ✨ Fitur Utama

- 💬 **Chat Interface Modern**: UI yang clean dan responsif dengan animasi smooth
- 🎤 **Voice Recognition**: Input suara menggunakan Web Speech API
- 🧠 **Google Gemini AI**: Respons cerdas dari AI terdepan
- 📱 **Responsive Design**: Tampilan optimal di semua perangkat
- 🎨 **Modern UI/UX**: Desain gradient dan glassmorphism
- ⚡ **Real-time Chat**: Komunikasi instant dengan typing indicator
- 🔧 **TypeScript**: Type safety dan developer experience yang baik

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Integration**: Google Gemini API
- **Voice Recognition**: Web Speech API
- **Styling**: Modern CSS dengan animasi
- **Icons**: Lucide React
- **Build Tool**: Vite (Lightning fast)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd chatbot-modern
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Google Gemini API**
   - API Key sudah dikonfigurasi: `AIzaSyDHUaGPrnXOx5X6hJUGccMihtYxMsbBZBQ`
   - Untuk production, ganti dengan API key Anda di `src/services/geminiService.ts`

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
│   ├── ChatWidget.tsx      # Komponen chatbot utama
│   └── ChatWidget.css      # Styling chatbot
├── hooks/
│   └── useVoiceRecognition.ts  # Custom hook untuk voice
├── services/
│   └── geminiService.ts    # Service Google Gemini API
├── types/
│   └── chatbot.ts         # TypeScript interfaces
├── App.tsx                # Main app dengan dummy website
├── App.css               # Website styling
└── main.tsx              # Entry point
```

## 🎯 Cara Penggunaan

### Integrasi ke Website Existing

1. **Copy komponen ChatWidget**:
   - `src/components/ChatWidget.tsx`
   - `src/components/ChatWidget.css`

2. **Copy dependencies**:
   - `src/hooks/useVoiceRecognition.ts`
   - `src/services/geminiService.ts`
   - `src/types/chatbot.ts`

3. **Install packages**:
```bash
npm install @google/generative-ai lucide-react
```

4. **Import dan gunakan**:
```tsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div>
      {/* Konten website Anda */}
      <ChatWidget />
    </div>
  );
}
```

### Kustomisasi Website Context

Untuk memberikan konteks website spesifik, edit bagian ini di `ChatWidget.tsx`:

```typescript
const websiteContext = `
  // Ganti dengan informasi website Anda
  Website ini adalah platform e-commerce yang menjual produk teknologi.
  Kami menyediakan smartphone, laptop, aksesoris, dan gadget terbaru.
  Tim customer service kami siap membantu 24/7.
`;
```

## 🎨 Kustomisasi Styling

### Warna Tema
Edit variabel CSS di `ChatWidget.css`:
```css
/* Ganti gradient utama */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Posisi Chatbot
Chatbot default di pojok kanan bawah. Untuk mengubah posisi:
```css
.chat-widget {
  bottom: 20px;    /* Jarak dari bawah */
  right: 20px;     /* Jarak dari kanan */
  /* atau gunakan left: 20px; untuk pojok kiri */
}
```

## 🔧 Konfigurasi

### Google Gemini API
```typescript
// src/services/geminiService.ts
const API_KEY = 'YOUR_GEMINI_API_KEY';
```

### Voice Recognition
```typescript
// Bahasa default Indonesia
recognition.lang = 'id-ID';

// Untuk bahasa lain:
// 'en-US' - English
// 'ja-JP' - Japanese
// 'ko-KR' - Korean
```

## 📱 Fitur Voice Recognition

- **Tekan tombol mikrofon** untuk mulai recording
- **Berbicara dengan jelas** dalam bahasa Indonesia
- **Otomatis berhenti** setelah jeda
- **Indikator visual** saat mendengarkan
- **Fallback ke text input** jika voice tidak didukung

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload folder dist/ ke Netlify
```

### Manual
```bash
npm run build
# Upload folder dist/ ke hosting Anda
```

## 🔒 Keamanan

⚠️ **Penting**: 
- Ganti API key dengan yang baru untuk production
- Gunakan environment variables untuk API key
- Implementasi rate limiting jika diperlukan

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙋‍♂️ Support

Jika ada pertanyaan atau butuh bantuan:
- Buka issue di GitHub
- Email: support@technovision.com

---

**Dibuat dengan ❤️ menggunakan React + TypeScript + Google Gemini AI**

# Modern Chatbot Application

## 🚀 Teknologi Stack

### Frontend
- **React 19** + **TypeScript** - Framework modern dengan type safety
- **Vite** - Build tool super cepat 
- **CSS Modern** - Glassmorphism design, animations
- **Lucide React** - Icon library

### AI & Voice Integration
- **Google Gemini AI** - AI engine utama
- **ElevenLabs** - Text-to-speech premium
- **Web Speech API** - Voice recognition
- **Speech Synthesis API** - Text-to-speech native

## 🏗️ Arsitektur Project

### Component Structure
```
src/components/
├── FullModeChatbot.tsx    # Main chatbot dengan dual mode
├── AvatarChatbot.tsx      # Avatar-based interface  
├── CompactChatbot.tsx     # Widget mode
├── CSSAvatar.tsx          # Animated avatar
├── HumanAvatar.tsx        # Human-like avatar
└── ChatWidget.tsx         # Floating widget
```

### Services Layer
```
src/services/
├── geminiService.ts       # Google AI integration
├── chatHistoryService.ts  # Local storage management
└── profanityFilter.ts     # Content filtering
```

## 🎯 Fitur Utama

### Dual Mode Interface
1. **Avatar Mode** - Voice-first interaction
2. **Text Mode** - Traditional chat

### Voice Features
- Speech Recognition (Indonesian support)
- Text-to-Speech dengan subtitle animation
- Audio controls (mute/unmute)
- Voice activity detection

## 🛠️ Setup Development

### Prerequisites
- Node.js 18+
- npm atau yarn
- Google Gemini API Key
- ElevenLabs API Key

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd chatbot-dari-awal

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan API keys Anda

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

## 🚀 Deployment

### Build untuk Production
```bash
npm run build
```

### Platform Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder ke Netlify
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📱 Browser Support

- Chrome 25+ (Speech Recognition)
- Firefox 49+ (Limited speech support)
- Safari 14.1+ (Limited speech support)
- Edge 79+

## 🔒 Security Notes

- API keys hanya untuk development
- Untuk production, gunakan backend proxy
- Implementasi rate limiting
- Content filtering aktif

## 📄 License

MIT License
