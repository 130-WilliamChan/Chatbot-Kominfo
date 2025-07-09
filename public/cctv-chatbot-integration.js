/**
 * CCTV Chatbot Integration Script
 * 
 * This script allows easy integration of the CCTV chatbot into any website.
 * Simply include this script and call CCTVChatbot.init() with your configuration.
 * 
 * Usage:
 * <script src="path/to/cctv-chatbot-integration.js"></script>
 * <script>
 *   CCTVChatbot.init({
 *     position: 'bottom-right',
 *     theme: 'light',
 *     features: ['cameraLocations', 'emergencyContacts']
 *   });
 * </script>
 */

(function(window, document) {
  'use strict';

  // Prevent multiple initializations
  if (window.CCTVChatbot) {
    return;
  }

  const CCTVChatbot = {
    // Configuration defaults
    defaultConfig: {
      position: 'bottom-right',
      theme: 'auto',
      size: 'normal',
      enabled: true,
      features: {
        cameraLocations: true,
        maintenanceSchedule: true,
        emergencyContacts: true,
        reportIssues: true,
        operationalHours: true
      },
      customization: {
        primaryColor: '#2196F3',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px'
      },
      integration: {
        apiEndpoint: null,
        authToken: null,
        customData: {}
      }
    },

    // Internal state
    isInitialized: false,
    widget: null,
    config: null,

    /**
     * Initialize the chatbot widget
     * @param {Object} userConfig - User configuration
     */
    init: function(userConfig = {}) {
      if (this.isInitialized) {
        console.warn('CCTV Chatbot already initialized');
        return;
      }

      // Merge user config with defaults
      this.config = this.deepMerge(this.defaultConfig, userConfig);
      
      // Validate configuration
      if (!this.validateConfig(this.config)) {
        console.error('Invalid CCTV Chatbot configuration');
        return;
      }

      console.log('🎥 Initializing CCTV Chatbot Widget...');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.createWidget());
      } else {
        this.createWidget();
      }

      this.isInitialized = true;
    },

    /**
     * Create and inject the chatbot widget
     */
    createWidget: function() {
      try {
        // Create widget container
        this.widget = document.createElement('div');
        this.widget.id = 'cctv-chatbot-widget';
        this.widget.className = 'cctv-chatbot-widget';
        
        // Apply custom styles
        this.injectStyles();
        
        // Create widget HTML
        this.widget.innerHTML = this.getWidgetHTML();
        
        // Add to page
        document.body.appendChild(this.widget);
        
        // Bind events
        this.bindEvents();
        
        console.log('✅ CCTV Chatbot Widget created successfully');
        
        // Auto-show greeting if configured
        if (this.config.autoGreeting) {
          setTimeout(() => this.showGreeting(), 2000);
        }
        
      } catch (error) {
        console.error('❌ Error creating CCTV Chatbot Widget:', error);
      }
    },

    /**
     * Generate widget HTML
     */
    getWidgetHTML: function() {
      const position = this.config.position;
      const theme = this.config.theme === 'auto' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : this.config.theme;

      return `
        <div class="chatbot-toggle ${position} ${theme}" id="chatbot-toggle">
          <div class="toggle-button" title="Bantuan Informasi CCTV & Layanan Publik">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="pulse-ring"></div>
          </div>
        </div>
        
        <div class="chatbot-container ${position} ${theme}" id="chatbot-container" style="display: none;">
          <div class="chatbot-header">
            <div class="header-info">
              <h3>🎥 Asisten CCTV</h3>
              <p>Informasi & Layanan Publik</p>
            </div>
            <div class="header-controls">
              <button class="minimize-btn" id="minimize-btn" title="Minimize">−</button>
              <button class="close-btn" id="close-btn" title="Tutup">×</button>
            </div>
          </div>
          
          <div class="chatbot-content" id="chatbot-content">
            <div class="chat-messages" id="chat-messages">
              <div class="message bot-message">
                <div class="message-content">
                  🎥 Selamat datang di layanan informasi CCTV dan layanan publik!<br><br>
                  Silakan pilih informasi yang Anda butuhkan:
                </div>
              </div>
            </div>
            
            <div class="quick-actions">
              <button class="quick-btn" data-action="camera-locations">📍 Lokasi Kamera</button>
              <button class="quick-btn" data-action="rtsp-streaming">📡 RTSP Stream</button>
              <button class="quick-btn" data-action="emergency">🚨 Emergency</button>
              <button class="quick-btn" data-action="hours">🕐 Jam Operasional</button>
              <button class="quick-btn" data-action="multiple-points">📊 Multiple Points</button>
              <button class="quick-btn" data-action="recording-access">💾 Access Recording</button>
            </div>
            
            <div class="chat-input-area">
              <input type="text" id="chat-input" placeholder="Ketik pertanyaan Anda..." />
              <button id="send-btn" title="Kirim">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Inject CSS styles
     */
    injectStyles: function() {
      if (document.getElementById('cctv-chatbot-styles')) {
        return; // Styles already injected
      }

      const styles = document.createElement('style');
      styles.id = 'cctv-chatbot-styles';
      styles.textContent = this.getCSS();
      document.head.appendChild(styles);
    },

    /**
     * Get CSS styles for the widget
     */
    getCSS: function() {
      const primaryColor = this.config.customization.primaryColor;
      const fontFamily = this.config.customization.fontFamily;
      const borderRadius = this.config.customization.borderRadius;

      return `
        .cctv-chatbot-widget * {
          box-sizing: border-box;
          font-family: ${fontFamily};
        }
        
        .chatbot-toggle {
          position: fixed;
          z-index: 9999;
          cursor: pointer;
        }
        
        .chatbot-toggle.bottom-right { bottom: 20px; right: 20px; }
        .chatbot-toggle.bottom-left { bottom: 20px; left: 20px; }
        .chatbot-toggle.top-right { top: 20px; right: 20px; }
        .chatbot-toggle.top-left { top: 20px; left: 20px; }
        
        .toggle-button {
          position: relative;
          width: 60px;
          height: 60px;
          background: ${primaryColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        
        .toggle-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0,0,0,0.2);
        }
        
        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid ${primaryColor};
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        .chatbot-container {
          position: fixed;
          z-index: 9998;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: ${borderRadius};
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideInUp 0.3s ease;
        }
        
        .chatbot-container.bottom-right { bottom: 90px; right: 20px; }
        .chatbot-container.bottom-left { bottom: 90px; left: 20px; }
        .chatbot-container.top-right { top: 90px; right: 20px; }
        .chatbot-container.top-left { top: 90px; left: 20px; }
        
        .chatbot-container.dark {
          background: #2d2d2d;
          color: white;
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .chatbot-header {
          background: ${primaryColor};
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .header-info p {
          margin: 2px 0 0;
          font-size: 12px;
          opacity: 0.9;
        }
        
        .header-controls {
          display: flex;
          gap: 8px;
        }
        
        .header-controls button {
          background: rgba(255,255,255,0.2);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-controls button:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .chatbot-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: calc(100% - 70px);
        }
        
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          max-height: 300px;
        }
        
        .message {
          margin-bottom: 15px;
        }
        
        .message-content {
          background: #f0f0f0;
          padding: 10px 12px;
          border-radius: 12px;
          max-width: 80%;
          line-height: 1.4;
        }
        
        .bot-message .message-content {
          background: ${primaryColor};
          color: white;
        }
        
        .user-message {
          text-align: right;
        }
        
        .user-message .message-content {
          background: #e3f2fd;
          margin-left: auto;
        }
        
        .quick-actions {
          padding: 10px 15px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          border-top: 1px solid #eee;
          max-height: 150px;
          overflow-y: auto;
        }
        
        .quick-btn {
          background: white;
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }
        
        .quick-btn:hover {
          background: ${primaryColor};
          color: white;
          border-color: ${primaryColor};
        }
        
        .chat-input-area {
          padding: 15px;
          display: flex;
          gap: 8px;
          border-top: 1px solid #eee;
          background: #fafafa;
        }
        
        #chat-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }
        
        #chat-input:focus {
          border-color: ${primaryColor};
        }
        
        #send-btn {
          width: 40px;
          height: 40px;
          background: ${primaryColor};
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #send-btn:hover {
          background: #1976D2;
        }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
          .chatbot-container {
            width: calc(100vw - 40px);
            height: calc(100vh - 40px);
            bottom: 20px !important;
            right: 20px !important;
            left: 20px !important;
          }
        }
      `;
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
      const toggle = document.getElementById('chatbot-toggle');
      const container = document.getElementById('chatbot-container');
      const closeBtn = document.getElementById('close-btn');
      const minimizeBtn = document.getElementById('minimize-btn');
      const sendBtn = document.getElementById('send-btn');
      const chatInput = document.getElementById('chat-input');
      const quickBtns = document.querySelectorAll('.quick-btn');

      // Toggle chat visibility
      toggle.addEventListener('click', () => this.toggleChat());
      closeBtn.addEventListener('click', () => this.closeChat());
      
      // Minimize functionality
      minimizeBtn.addEventListener('click', () => this.minimizeChat());

      // Send message
      sendBtn.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      // Quick actions
      quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.target.getAttribute('data-action');
          this.handleQuickAction(action);
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && !toggle.contains(e.target)) {
          // Optional: auto-close feature
        }
      });
    },

    /**
     * Toggle chat visibility
     */
    toggleChat: function() {
      const container = document.getElementById('chatbot-container');
      const isVisible = container.style.display !== 'none';
      
      if (isVisible) {
        this.closeChat();
      } else {
        this.openChat();
      }
    },

    /**
     * Open chat
     */
    openChat: function() {
      const container = document.getElementById('chatbot-container');
      container.style.display = 'flex';
      
      // Focus on input
      setTimeout(() => {
        document.getElementById('chat-input').focus();
      }, 100);
    },

    /**
     * Close chat
     */
    closeChat: function() {
      const container = document.getElementById('chatbot-container');
      container.style.display = 'none';
    },

    /**
     * Minimize chat (placeholder)
     */
    minimizeChat: function() {
      // Could implement minimize to header-only view
      this.closeChat();
    },

    /**
     * Send user message
     */
    sendMessage: function() {
      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Add user message to chat
      this.addMessage('user', message);
      
      // Clear input
      input.value = '';
      
      // Simulate bot response
      setTimeout(() => {
        const response = this.generateResponse(message);
        this.addMessage('bot', response);
      }, 500);
    },

    /**
     * Add message to chat
     */
    addMessage: function(type, content) {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}-message`;
      
      messageDiv.innerHTML = `
        <div class="message-content">${content}</div>
      `;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    /**
     * Handle quick action buttons
     */
    handleQuickAction: function(action) {
      const responses = {
        'camera-locations': this.getCameraLocationInfo(),
        'rtsp-streaming': this.getRTSPInfo(),
        'emergency': this.getEmergencyInfo(),
        'hours': this.getOperationalHours(),
        'maintenance': this.getMaintenanceInfo(),
        'multiple-points': this.getMultiplePoints(),
        'stream-quality': this.getStreamQuality(),
        'recording-access': this.getRecordingAccess()
      };
      
      const response = responses[action] || 'Informasi tidak tersedia.';
      this.addMessage('bot', response);
    },

    /**
     * Generate bot response (enhanced for RTSP system)
     */
    generateResponse: function(message) {
      const msg = message.toLowerCase();
      
      if (msg.includes('rtsp') || msg.includes('streaming') || msg.includes('stream')) {
        return this.getRTSPInfo();
      } else if (msg.includes('kamera') || msg.includes('lokasi') || msg.includes('titik')) {
        return this.getCameraLocationInfo();
      } else if (msg.includes('jumlah') || msg.includes('berapa') || msg.includes('multiple')) {
        return this.getMultiplePoints();
      } else if (msg.includes('kualitas') || msg.includes('resolusi') || msg.includes('quality')) {
        return this.getStreamQuality();
      } else if (msg.includes('rekaman') || msg.includes('recording') || msg.includes('playback')) {
        return this.getRecordingAccess();
      } else if (msg.includes('emergency') || msg.includes('darurat')) {
        return this.getEmergencyInfo();
      } else if (msg.includes('jam') || msg.includes('operasional')) {
        return this.getOperationalHours();
      } else if (msg.includes('maintenance') || msg.includes('perawatan')) {
        return this.getMaintenanceInfo();
      } else {
        return 'Maaf, saya belum mengerti pertanyaan Anda. Silakan gunakan tombol quick action atau tanyakan tentang:<br>• 📡 RTSP streaming dan akses<br>• 📍 Lokasi kamera dan multiple points<br>• 💾 Recording dan playback<br>• 🎬 Kualitas video dan setting<br>• 🚨 Kontak emergency<br>• 🕐 Jam operasional';
      }
    },

    /**
     * Response templates
     */
    getCameraLocationInfo: function() {
      return `📍 <strong>Lokasi Kamera CCTV:</strong><br><br>
      🎥 <strong>Area Utama:</strong><br>
      • Pintu masuk utama<br>
      • Area parkir<br>
      • Lobby dan resepsionis<br><br>
      🎥 <strong>Area Khusus:</strong><br>
      • Ruang server<br>
      • Area keamanan<br>
      • Emergency exit<br><br>
      Untuk informasi detail lokasi, hubungi petugas keamanan.`;
    },

    getEmergencyInfo: function() {
      return `🚨 <strong>Kontak Darurat:</strong><br><br>
      🔴 <strong>Emergency:</strong><br>
      • Polisi: 110<br>
      • Pemadam Kebakaran: 113<br>
      • Ambulans: 118<br><br>
      🏢 <strong>Internal:</strong><br>
      • Control Room: Ext. 100<br>
      • Security: Ext. 101<br>
      • Maintenance: Ext. 102`;
    },

    getOperationalHours: function() {
      return `🕐 <strong>Jam Operasional:</strong><br><br>
      📹 <strong>Sistem CCTV:</strong><br>
      • Monitoring: 24/7<br>
      • Live viewing: 24/7<br>
      • Akses rekaman: 06:00 - 22:00<br><br>
      🏢 <strong>Control Room:</strong><br>
      • Senin-Jumat: 08:00 - 17:00<br>
      • Sabtu: 08:00 - 12:00<br>
      • Minggu: On-call emergency`;
    },

    getMaintenanceInfo: function() {
      return `🔧 <strong>Jadwal Maintenance:</strong><br><br>
      📋 <strong>Rutin Mingguan:</strong><br>
      • Senin: Pembersihan lensa<br>
      • Rabu: Pengecekan koneksi<br>
      • Jumat: Update software<br><br>
      📋 <strong>Bulanan:</strong><br>
      • Minggu 1: Kalibrasi sistem<br>
      • Minggu 3: Backup data<br><br>
      ⚠️ Selama maintenance, beberapa kamera temporary offline.`;
    },

    /**
     * Response templates for RTSP system
     */
    getRTSPInfo: function() {
      return `📡 <strong>RTSP Streaming System:</strong><br><br>
      🔗 <strong>Configuration:</strong><br>
      • Protocol: RTSP/TCP<br>
      • Port: 554 (default)<br>
      • Video: H.264/H.265<br>
      • Audio: AAC (optional)<br><br>
      📱 <strong>Compatible Players:</strong><br>
      • VLC Media Player<br>
      • IP Cam Viewer (Mobile)<br>
      • Web browsers with plugin<br>
      • NVR Software (Blue Iris)<br><br>
      🔐 <strong>Access Required:</strong><br>
      • Username/Password authentication<br>
      • IP whitelisting for external access<br><br>
      Hubungi admin untuk mendapatkan akses RTSP.`;
    },

    getMultiplePoints: function() {
      return `📊 <strong>Multiple Camera Points:</strong><br><br>
      🎯 <strong>Total Coverage:</strong><br>
      • 18 kamera aktif<br>
      • 95% area coverage<br>
      • Recording 24/7<br>
      • 30 hari retention<br><br>
      📍 <strong>Distribusi:</strong><br>
      • Lantai 1: 8 kamera (CAM-01 s/d 08)<br>
      • Lantai 2: 6 kamera (CAM-09 s/d 14)<br>
      • Lantai 3: 4 kamera (CAM-15 s/d 18)<br><br>
      🔄 <strong>Backup System:</strong><br>
      • Dual server recording<br>
      • Automatic failover<br>
      • Cloud backup for critical events<br><br>
      📈 <strong>Expansion:</strong> Ready untuk 32 kamera total.`;
    },

    getStreamQuality: function() {
      return `🎬 <strong>Stream Quality Options:</strong><br><br>
      📺 <strong>Main Stream (Recording):</strong><br>
      • Resolusi: 1920x1080 (Full HD)<br>
      • Frame Rate: 25 fps<br>
      • Bitrate: 4-6 Mbps<br>
      • Codec: H.264 High Profile<br><br>
      📱 <strong>Sub Stream (Live View):</strong><br>
      • Resolusi: 1280x720 (HD)<br>
      • Frame Rate: 15 fps<br>
      • Bitrate: 1-2 Mbps<br><br>
      📲 <strong>Mobile Stream:</strong><br>
      • Resolusi: 640x480 (VGA)<br>
      • Frame Rate: 10 fps<br>
      • Bitrate: 512 kbps<br><br>
      ⚙️ <strong>Features:</strong> Night vision, motion detection, variable bitrate.`;
    },

    getRecordingAccess: function() {
      return `💾 <strong>Recording Access System:</strong><br><br>
      📅 <strong>Retention Policy:</strong><br>
      • Local: 30 hari<br>
      • Cloud backup: 90 hari<br>
      • Critical events: 1 tahun<br><br>
      🔍 <strong>Access Methods:</strong><br>
      1. <strong>Web Interface:</strong> http://[server]:8080<br>
      2. <strong>Mobile App:</strong> "CCTV Mobile View"<br>
      3. <strong>Formal Request:</strong> admin@cctv-system.com<br><br>
      ⚡ <strong>Export Options:</strong><br>
      • Single camera: Max 2 jam<br>
      • Multiple cameras: Max 1 jam<br>
      • Format: MP4 (H.264)<br>
      • Include timestamp & metadata<br><br>
      🔐 Login diperlukan untuk semua akses.`;
    },

    /**
     * Utility functions
     */
    deepMerge: function(target, source) {
      const result = Object.assign({}, target);
      
      if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key])) {
            if (!(key in target)) Object.assign(result, { [key]: {} });
            result[key] = this.deepMerge(target[key], source[key]);
          } else {
            Object.assign(result, { [key]: source[key] });
          }
        });
      }
      
      return result;
    },

    isObject: function(item) {
      return item && typeof item === 'object' && !Array.isArray(item);
    },

    validateConfig: function(config) {
      // Basic validation
      const validPositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
      const validThemes = ['light', 'dark', 'auto'];
      
      return validPositions.includes(config.position) && validThemes.includes(config.theme);
    },

    /**
     * Public API methods
     */
    show: function() {
      this.openChat();
    },

    hide: function() {
      this.closeChat();
    },

    destroy: function() {
      if (this.widget) {
        this.widget.remove();
        this.isInitialized = false;
        this.widget = null;
      }
    },

    sendCustomMessage: function(message) {
      if (this.isInitialized) {
        this.addMessage('bot', message);
      }
    }
  };

  // Expose to global scope
  window.CCTVChatbot = CCTVChatbot;

  // Auto-init if config is provided in script tag
  const script = document.currentScript;
  if (script && script.hasAttribute('data-config')) {
    try {
      const config = JSON.parse(script.getAttribute('data-config'));
      CCTVChatbot.init(config);
    } catch (e) {
      console.error('Invalid data-config JSON:', e);
    }
  }

})(window, document);
