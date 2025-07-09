// Configuration for CCTV website chatbot integration

// Enhanced interfaces for comprehensive CCTV system
export interface CameraPoint {
  id: string;
  name: string;
  location: string;
  type: 'indoor' | 'outdoor' | 'ptz' | 'fixed' | 'dome' | 'bullet';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  rtspUrl?: string;
  httpUrl?: string;
  resolution: string;
  fps: number;
  recording: boolean;
  nightVision: boolean;
  motionDetection: boolean;
  audioEnabled: boolean;
  description: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  zone: string;
  floor: number;
  coverage: string;
  bitrate: string;
  codec: 'H.264' | 'H.265' | 'MJPEG';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  category: 'streaming' | 'recording' | 'monitoring' | 'system' | 'troubleshooting' | 'maintenance';
  icon: string;
  response: string;
  action?: string;
  keywords: string[];
}

export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: 'rtsp' | 'cameras' | 'recording' | 'troubleshooting' | 'configuration' | 'maintenance' | 'access';
  keywords: string[];
  relatedTopics: string[];
  priority: number;
}

export interface SystemStatus {
  serverStatus: 'online' | 'offline' | 'maintenance';
  totalCameras: number;
  onlineCameras: number;
  recording: boolean;
  storage: {
    used: string;
    total: string;
    percentage: number;
  };
  network: {
    status: 'stable' | 'unstable' | 'down';
    bandwidth: string;
  };
  alerts: number;
}

export interface ChatbotConfig {
  // Widget appearance
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark' | 'auto';
  size: 'compact' | 'normal' | 'large';
  
  // CCTV specific features
  cctvFeatures: {
    cameraLocations: boolean;
    maintenanceSchedule: boolean;
    emergencyContacts: boolean;
    reportIssues: boolean;
    trafficInfo: boolean;
    rtspStreaming: boolean;
    multiplePoints: boolean;
    streamQuality: boolean;
    recordingAccess: boolean;
    systemStatus: boolean;
    nightVision: boolean;
    motionDetection: boolean;
    alertManagement: boolean;
  };
  
  // Public information features
  publicInfo: {
    operationalHours: boolean;
    contactDirectory: boolean;
    serviceUpdates: boolean;
    announcements: boolean;
    faq: boolean;
  };
  
  // Integration settings
  integration: {
    embedAsWidget: boolean;
    fullPageMode: boolean;
    apiEndpoint?: string;
    authRequired: boolean;
  };
  
  // TTS settings
  tts: {
    enabled: boolean;
    autoSpeak: boolean;
    language: 'id-ID' | 'en-US';
    speed: number;
  };

  // System configuration
  systemConfig: {
    maxCameras: number;
    supportedProtocols: string[];
    rtspPort: number;
    httpPort: number;
    maxStreams: number;
    retentionDays: number;
  };
}

// Enhanced camera points data
export const cameraPoints: CameraPoint[] = [
  {
    id: "CAM-01",
    name: "Main Entrance",
    location: "Pintu Masuk Utama",
    type: "outdoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.100:554/stream1",
    httpUrl: "http://192.168.1.100/video.cgi",
    resolution: "1920x1080",
    fps: 25,
    recording: true,
    nightVision: true,
    motionDetection: true,
    audioEnabled: true,
    description: "Kamera utama di pintu masuk dengan IR night vision dan audio recording",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    zone: "Entrance",
    floor: 1,
    coverage: "180° view of main entrance and approach area",
    bitrate: "4 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-02",
    name: "Parking Area North",
    location: "Area Parkir Utara",
    type: "outdoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.101:554/stream1",
    resolution: "1920x1080",
    fps: 25,
    recording: true,
    nightVision: true,
    motionDetection: true,
    audioEnabled: false,
    description: "Coverage area parkir utara dengan detection plate nomor",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    zone: "Parking",
    floor: 0,
    coverage: "North parking lot - 50 car capacity",
    bitrate: "4 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-03",
    name: "Parking Area South",
    location: "Area Parkir Selatan",
    type: "outdoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.102:554/stream1",
    resolution: "1920x1080",
    fps: 25,
    recording: true,
    nightVision: true,
    motionDetection: true,
    audioEnabled: false,
    description: "Coverage area parkir selatan dengan wide angle view",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    zone: "Parking",
    floor: 0,
    coverage: "South parking lot - 75 car capacity",
    bitrate: "4 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-04",
    name: "Lobby Reception",
    location: "Lobby & Resepsionis",
    type: "indoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.103:554/stream1",
    resolution: "1920x1080",
    fps: 30,
    recording: true,
    nightVision: false,
    motionDetection: true,
    audioEnabled: true,
    description: "Kamera lobby dengan audio untuk monitoring customer service",
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-02-08",
    zone: "Lobby",
    floor: 1,
    coverage: "Reception desk and waiting area",
    bitrate: "3 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-05",
    name: "Corridor Floor 1",
    location: "Koridor Lantai 1",
    type: "indoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.104:554/stream1",
    resolution: "1280x720",
    fps: 25,
    recording: true,
    nightVision: false,
    motionDetection: true,
    audioEnabled: false,
    description: "Koridor utama lantai 1 dengan coverage lift area",
    lastMaintenance: "2024-01-12",
    nextMaintenance: "2024-02-12",
    zone: "Corridor",
    floor: 1,
    coverage: "Main corridor and elevator access",
    bitrate: "2 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-06",
    name: "Emergency Exit East",
    location: "Pintu Darurat Timur",
    type: "indoor",
    status: "maintenance",
    rtspUrl: "rtsp://192.168.1.105:554/stream1",
    resolution: "1280x720",
    fps: 25,
    recording: false,
    nightVision: false,
    motionDetection: true,
    audioEnabled: false,
    description: "Pintu darurat timur - sedang maintenance",
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-01-25",
    zone: "Emergency",
    floor: 1,
    coverage: "Emergency exit monitoring",
    bitrate: "2 Mbps",
    codec: "H.264"
  },
  {
    id: "CAM-07",
    name: "Server Room",
    location: "Ruang Server",
    type: "indoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.106:554/stream1",
    resolution: "1920x1080",
    fps: 30,
    recording: true,
    nightVision: false,
    motionDetection: true,
    audioEnabled: true,
    description: "High security monitoring untuk server room dengan environmental sensors",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    zone: "Critical",
    floor: 2,
    coverage: "Complete server room coverage",
    bitrate: "6 Mbps",
    codec: "H.265"
  },
  {
    id: "CAM-08",
    name: "Security Office",
    location: "Kantor Keamanan",
    type: "indoor",
    status: "online",
    rtspUrl: "rtsp://192.168.1.107:554/stream1",
    resolution: "1920x1080",
    fps: 25,
    recording: true,
    nightVision: false,
    motionDetection: true,
    audioEnabled: true,
    description: "Monitoring kantor keamanan dan control room",
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    zone: "Security",
    floor: 1,
    coverage: "Security office and control center",
    bitrate: "4 Mbps",
    codec: "H.264"
  }
];

// Enhanced quick actions
export const quickActions: QuickAction[] = [
  {
    id: "view_all_cameras",
    label: "📹 Lihat Semua Kamera",
    description: "Tampilkan status dan informasi semua kamera yang terpasang",
    category: "monitoring",
    icon: "🎥",
    keywords: ["semua kamera", "all cameras", "daftar kamera", "status kamera"],
    response: `📹 **Status Semua Kamera CCTV:**

**🟢 ONLINE (${cameraPoints.filter(c => c.status === 'online').length} kamera):**
${cameraPoints.filter(c => c.status === 'online').map(cam => 
  `• ${cam.name} (${cam.location}) - ${cam.resolution}@${cam.fps}fps`
).join('\n')}

**🔧 MAINTENANCE (${cameraPoints.filter(c => c.status === 'maintenance').length} kamera):**
${cameraPoints.filter(c => c.status === 'maintenance').map(cam => 
  `• ${cam.name} (${cam.location}) - Expected: ${cam.nextMaintenance}`
).join('\n')}

**📊 Ringkasan:**
• Total Kamera: ${cameraPoints.length}
• Recording Aktif: ${cameraPoints.filter(c => c.recording).length}
• Night Vision: ${cameraPoints.filter(c => c.nightVision).length}
• Audio Enabled: ${cameraPoints.filter(c => c.audioEnabled).length}`
  },
  {
    id: "rtsp_streaming_info",
    label: "🔗 Info RTSP Streaming",
    description: "Informasi teknis tentang RTSP streaming dan koneksi",
    category: "streaming",
    icon: "📡",
    keywords: ["rtsp", "streaming", "koneksi", "url", "protocol"],
    response: `🔗 **Informasi RTSP Streaming:**

**🌐 Konfigurasi RTSP:**
• Protocol: RTSP over TCP/UDP
• Default Port: 554
• Authentication: Digest (Required)
• Timeout: 30 seconds
• Max Concurrent Streams: 16

**📊 Codec Support:**
• Primary: H.264 (High Profile)
• Secondary: H.265 (HEVC) - Selected cameras
• Fallback: MJPEG
• Audio: AAC, G.711

**🎬 Stream Profiles:**
• Main Stream: 1080p@25fps (4-6 Mbps)
• Sub Stream: 720p@15fps (1-2 Mbps)
• Mobile Stream: 480p@10fps (512 kbps)

**🔐 Akses RTSP:**
Format URL: \`rtsp://username:password@ip:554/stream1\`

Untuk credential akses, hubungi admin sistem.`
  },
  {
    id: "camera_by_location",
    label: "📍 Kamera per Lokasi",
    description: "Cari kamera berdasarkan lokasi atau zona tertentu",
    category: "monitoring",
    icon: "🗺️",
    keywords: ["lokasi", "zone", "area", "lantai", "floor"],
    response: `📍 **Kamera Berdasarkan Lokasi:**

**🏢 LANTAI 1:**
${cameraPoints.filter(c => c.floor === 1).map(cam => 
  `• ${cam.name} - ${cam.status === 'online' ? '✅' : cam.status === 'maintenance' ? '🔧' : '❌'} (${cam.coverage})`
).join('\n')}

**🏢 LANTAI 2:**
${cameraPoints.filter(c => c.floor === 2).map(cam => 
  `• ${cam.name} - ${cam.status === 'online' ? '✅' : cam.status === 'maintenance' ? '🔧' : '❌'} (${cam.coverage})`
).join('\n')}

**🏢 GROUND FLOOR:**
${cameraPoints.filter(c => c.floor === 0).map(cam => 
  `• ${cam.name} - ${cam.status === 'online' ? '✅' : cam.status === 'maintenance' ? '🔧' : '❌'} (${cam.coverage})`
).join('\n')}

**🎯 Coverage per Zona:**
• Entrance: ${cameraPoints.filter(c => c.zone === 'Entrance').length} kamera
• Parking: ${cameraPoints.filter(c => c.zone === 'Parking').length} kamera
• Security: ${cameraPoints.filter(c => c.zone === 'Security').length} kamera
• Critical: ${cameraPoints.filter(c => c.zone === 'Critical').length} kamera`
  },
  {
    id: "troubleshoot_offline",
    label: "🔧 Troubleshoot Offline",
    description: "Panduan troubleshooting untuk kamera offline",
    category: "troubleshooting",
    icon: "⚠️",
    keywords: ["offline", "tidak bisa akses", "error", "troubleshoot", "masalah"],
    response: `🔧 **Troubleshooting Kamera Offline:**

**🔍 LANGKAH DIAGNOSTIK:**

**1. Network Connectivity:**
• Ping IP kamera dari command prompt
• Test koneksi dengan telnet [IP] 554
• Periksa switch network dan kabel
• Cek power over ethernet (PoE)

**2. Power & Hardware:**
• Pastikan LED power menyala (hijau/biru)
• Cek adaptor power (jika tidak PoE)
• Periksa kabel ethernet dan connector
• Test dengan kabel ethernet lain

**3. Network Configuration:**
• Verifikasi IP address tidak conflict
• Cek subnet mask dan gateway
• Test DHCP reservation
• Periksa VLAN configuration

**4. Camera Settings:**
• Factory reset kamera (tombol reset 10 detik)
• Restore default IP: 192.168.1.168
• Update firmware jika perlu
• Cek RTSP port (default 554)

**⚡ QUICK ACTIONS:**
• Reboot kamera (unplug 30 detik)
• Restart network switch
• Flush DNS cache
• Check firewall rules

**📞 Jika masih bermasalah:**
Contact IT Support: Ext. 103 atau email support@system.com`
  },
  {
    id: "recording_management",
    label: "💾 Manajemen Recording",
    description: "Informasi akses, backup, dan manajemen rekaman",
    category: "recording",
    icon: "📹",
    keywords: ["recording", "rekaman", "backup", "playback", "storage"],
    response: `💾 **Manajemen Recording CCTV:**

**📊 Storage Status:**
• Kapasitas Total: 10TB
• Used: 6.8TB (68%)
• Available: 3.2TB
• Retention: 30 hari (local), 90 hari (cloud)

**📅 Recording Schedule:**
• Continuous Recording: 24/7 (All cameras)
• Motion Triggered: Additional backup
• High Priority: Entrance, Server Room
• Audio Recording: Selected cameras only

**🔍 Cara Akses Rekaman:**

**1. Web Interface:**
\`\`\`
URL: http://192.168.1.200:8080
Login: [Credential dari admin]
Menu: Playback > Search by Date/Camera
Export: MP4, AVI format
\`\`\`

**2. Mobile App:**
\`\`\`
App: "CCTV Mobile Viewer"
Platform: iOS/Android
Features: Live view, Playback, Download
Login: Same as web interface
\`\`\`

**3. Request Formal:**
• Email: recording-request@system.com
• Form: Include case number, time range
• Approval: Required for legal purposes
• Format: Certified timestamp & metadata

**⚙️ Export Limitations:**
• Single Camera: Max 4 jam continuous
• Multiple Cameras: Max 2 jam
• Format: MP4 (H.264) with metadata
• Size Limit: 2GB per file

**🔄 Backup Strategy:**
• Real-time: RAID-5 local storage
• Daily: Cloud sync (critical cameras)
• Weekly: External backup drive
• Monthly: Archive to cold storage`
  },
  {
    id: "night_vision_status",
    label: "🌙 Night Vision Status",
    description: "Status dan pengaturan night vision semua kamera",
    category: "monitoring",
    icon: "🌜",
    keywords: ["night vision", "malam", "infrared", "ir", "gelap"],
    response: `🌙 **Status Night Vision System:**

**✅ NIGHT VISION ENABLED:**
${cameraPoints.filter(c => c.nightVision).map(cam => 
  `• ${cam.name} (${cam.location})\n  Range: ${cam.type === 'outdoor' ? '0-30m' : '0-15m'} | Status: ${cam.status === 'online' ? 'Active' : 'Offline'}`
).join('\n')}

**❌ NO NIGHT VISION:**
${cameraPoints.filter(c => !c.nightVision).map(cam => 
  `• ${cam.name} (${cam.location}) - Indoor/Well-lit area`
).join('\n')}

**⚙️ Night Vision Settings:**
• Auto Mode: Light sensor triggered
• Manual Control: Available via admin panel
• IR Cut Filter: Automatic switch
• Visibility Range: 15-30 meters (outdoor)

**📊 Performance:**
• IR LED Lifespan: 50,000+ hours
• Power Consumption: +2W per camera
• Image Quality: Monochrome (B&W)
• Switch Time: <2 seconds

**🔧 Troubleshooting:**
• Blurry night image: Clean lens
• No IR illumination: Check LED status
• Poor range: Adjust IR intensity
• Day/night switching: Sensor calibration

**🌅 Automatic Schedule:**
• Night Mode: 18:30 - 06:00
• Day Mode: 06:00 - 18:30
• Transition: Smooth 2-second fade`
  },
  {
    id: "motion_detection_settings",
    label: "🚶 Motion Detection",
    description: "Konfigurasi dan status motion detection",
    category: "monitoring",
    icon: "🎯",
    keywords: ["motion", "deteksi gerakan", "alert", "notifikasi", "trigger"],
    response: `🚶 **Motion Detection Configuration:**

**🎯 STATUS PER KAMERA:**
${cameraPoints.map(cam => 
  `• ${cam.name}: ${cam.motionDetection ? '✅ Active' : '❌ Disabled'} | Sensitivity: ${cam.zone === 'Critical' ? 'High (85%)' : cam.zone === 'Parking' ? 'Medium (60%)' : 'Standard (70%)'}`
).join('\n')}

**⚙️ Detection Zones:**
• Entrance: Full frame coverage
• Parking: Vehicle detection only
• Corridors: Central area focus
• Critical Areas: Maximum sensitivity

**📱 Alert Configuration:**
• Email Alerts: ✅ Enabled
• SMS Notifications: ✅ VIP contacts only
• Push Notifications: ✅ Mobile app
• Sound Alerts: ❌ Disabled (office hours)

**📊 Detection Statistics (Last 24h):**
• Total Triggers: 47 events
• False Positives: 3 events (6.4%)
• Response Time: <5 seconds average
• Peak Hours: 08:00-09:00, 17:00-18:00

**🕐 Schedule Settings:**
• Active Hours: 24/7
• High Sensitivity: 22:00-06:00
• Standard Mode: 06:00-22:00
• Maintenance Window: Sundays 02:00-04:00

**🔧 Fine-tuning Options:**
• Minimum Object Size: 10% frame
• Detection Duration: 3 seconds minimum
• Cool-down Period: 30 seconds
• Pre/Post Recording: 10/20 seconds

**📞 Alert Response:**
• Level 1: Log only (low risk)
• Level 2: Email notification
• Level 3: SMS + Email (critical areas)
• Level 4: Security dispatch (emergency)`
  },
  {
    id: "bandwidth_monitoring",
    label: "📊 Bandwidth Usage",
    description: "Monitor penggunaan bandwidth dan optimasi jaringan",
    category: "system",
    icon: "📈",
    keywords: ["bandwidth", "network", "traffic", "usage", "speed"],
    response: `📊 **Bandwidth Monitoring & Usage:**

**🌐 Current Network Status:**
• Total Bandwidth: 100 Mbps
• CCTV Usage: 42 Mbps (42%)
• Available: 58 Mbps
• Network Health: ✅ Excellent

**📈 Usage per Camera Stream:**
${cameraPoints.filter(c => c.status === 'online').map(cam => 
  `• ${cam.name}: ${cam.bitrate} (${cam.codec})`
).join('\n')}

**⚡ Optimization Status:**
• H.265 Encoding: 2 cameras (25% bandwidth saving)
• Variable Bitrate: ✅ Enabled
• Dual Stream: ✅ Main + Sub streams
• Adaptive Quality: ✅ Auto-adjust

**📱 Stream Types:**
• Main Stream (Recording): 28 Mbps total
• Sub Stream (Live View): 8 Mbps total
• Mobile Stream (Remote): 6 Mbps total

**🎯 Recommendations:**
• Upgrade to H.265: Save 15 Mbps
• Implement smart ROI encoding
• Schedule quality based on activity
• Use edge storage for backup

**📊 Peak Usage Times:**
• Morning Rush: 08:00-09:30 (85% usage)
• Evening Peak: 17:00-18:30 (78% usage)
• Night Mode: 22:00-06:00 (35% usage)

**🔧 Troubleshooting:**
• Slow streaming: Check individual camera bitrate
• Buffering issues: Verify network stability
• Quality drops: Monitor bandwidth allocation
• Connection timeouts: Review RTSP settings

**📞 Network Alerts:**
• >80% Usage: Warning notification
• >90% Usage: Critical alert
• Packet Loss >1%: Investigation trigger
• Latency >100ms: Performance alert`
  }
];

export const defaultCCTVConfig: ChatbotConfig = {
  position: 'bottom-right',
  theme: 'light',
  size: 'normal',
  
  cctvFeatures: {
    cameraLocations: true,
    maintenanceSchedule: true,
    emergencyContacts: true,
    reportIssues: true,
    trafficInfo: true,
    rtspStreaming: true,
    multiplePoints: true,
    streamQuality: true,
    recordingAccess: true,
    systemStatus: true,
    nightVision: true,
    motionDetection: true,
    alertManagement: true,
  },
  
  publicInfo: {
    operationalHours: true,
    contactDirectory: true,
    serviceUpdates: true,
    announcements: true,
    faq: true,
  },
  
  integration: {
    embedAsWidget: true,
    fullPageMode: false,
    authRequired: false,
  },
  
  tts: {
    enabled: true,
    autoSpeak: false,
    language: 'id-ID',
    speed: 0.9,
  },

  systemConfig: {
    maxCameras: 32,
    supportedProtocols: ["RTSP", "HTTP", "HTTPS", "TCP", "UDP", "WebRTC"],
    rtspPort: 554,
    httpPort: 80,
    maxStreams: 16,
    retentionDays: 30,
  },
};

// Enhanced Knowledge Base for RTSP and Multiple Points
export const enhancedKnowledgeBase: KnowledgeEntry[] = [
  {
    id: "rtsp_multiple_streams",
    question: "Bagaimana mengelola multiple RTSP streams secara bersamaan?",
    answer: `Untuk mengelola multiple RTSP streams:

**🔄 Load Balancing:**
• Distribusikan beban ke multiple server
• Gunakan round-robin algorithm
• Monitor CPU/memory usage real-time
• Implementasi automatic failover

**📊 Bandwidth Management:**
• Alokasi bandwidth per camera
• Prioritas stream berdasarkan zona
• Adaptive bitrate control
• QoS (Quality of Service) settings

**⚙️ Stream Optimization:**
• Gunakan H.265 untuk efisiensi
• Dual stream architecture
• ROI (Region of Interest) encoding
• Dynamic resolution scaling

**🖥️ Viewing Clients:**
• Web browser dengan WebRTC
• VLC Media Player untuk testing
• Mobile apps dengan adaptive streaming
• NVR software dengan multi-view

**🔧 Troubleshooting:**
• Monitor concurrent connections
• Check network latency
• Verify stream health regularly
• Implement automatic restart`,
    category: "rtsp",
    keywords: ["multiple streams", "load balancing", "concurrent", "management"],
    relatedTopics: ["bandwidth", "performance", "monitoring"],
    priority: 1
  },
  {
    id: "camera_zones_coverage",
    question: "Bagaimana mengoptimalkan coverage dengan multiple camera points?",
    answer: `Optimasi coverage multiple camera points:

**📍 Zone Planning:**
• Mapping area dengan coverage overlap 10-15%
• Identifikasi blind spots dan critical points
• Pembagian zona berdasarkan prioritas keamanan
• Koordinasi antara camera indoor/outdoor

**🎯 Camera Placement:**
• Height: 3-4 meter untuk area umum
• Angle: 15-30 derajat untuk optimal view
• Overlap: Adjacent cameras 10-15% overlap
• Lighting: Pertimbangkan natural dan artificial light

**📊 Coverage Analysis:**
• Gunakan software untuk simulation
• Test dengan berbagai scenario
• Monitor blind spots dan weak coverage
• Regular review dan adjustment

**🔄 Redundancy:**
• Backup camera untuk area critical
• Multiple angle untuk area penting
• Automatic switching pada camera failure
• Mobile camera untuk temporary coverage

**📱 Monitoring:**
• Real-time coverage map
• Alert untuk coverage gaps
• Performance monitoring per zone
• Integration dengan access control`,
    category: "cameras",
    keywords: ["coverage", "zones", "placement", "optimization", "blind spots"],
    relatedTopics: ["planning", "security", "monitoring"],
    priority: 1
  },
  {
    id: "rtsp_authentication_security",
    question: "Bagaimana mengamankan RTSP streams dan access control?",
    answer: `Keamanan RTSP streams dan access control:

**🔐 Authentication Methods:**
• Digest Authentication (Recommended)
• Basic Authentication (dengan HTTPS)
• Token-based authentication
• Certificate-based access

**🌐 Network Security:**
• VPN untuk remote access
• VLAN segmentation untuk CCTV network
• Firewall rules untuk port filtering
• Network monitoring untuk intrusion detection

**🔒 Stream Encryption:**
• SRTP (Secure RTP) untuk stream encryption
• TLS/SSL untuk signaling
• End-to-end encryption untuk sensitive areas
• Encrypted storage untuk recordings

**👥 User Management:**
• Role-based access control (RBAC)
• Time-based access restrictions
• Audit logs untuk semua access
• Regular password policy enforcement

**🛡️ Security Best Practices:**
• Change default credentials immediately
• Use strong passwords (12+ characters)
• Regular security updates
• Monitor access logs
• Implement IP whitelisting
• Disable unused services`,
    category: "configuration",
    keywords: ["security", "authentication", "encryption", "access control"],
    relatedTopics: ["network", "users", "monitoring"],
    priority: 2
  },
  {
    id: "storage_scaling_multiple_cameras",
    question: "Bagaimana menghitung dan scaling storage untuk multiple cameras?",
    answer: `Storage calculation dan scaling untuk multiple cameras:

**📊 Storage Calculation:**
• Formula: Bitrate × Duration × Cameras ÷ 8 = GB
• Example: 4Mbps × 24h × 10 cameras ÷ 8 = 432 GB/day
• Factor kompression: H.264 (1x), H.265 (0.5x)
• Motion-only recording: 30-60% reduction

**🗄️ Storage Architecture:**
• Local: RAID-5/6 untuk redundancy
• NAS: Network attached storage untuk centralized
• Cloud: Backup untuk critical recordings
• Edge: Camera-side storage untuk reliability

**📈 Scaling Strategy:**
• Start dengan 30-day retention
• Add storage berdasarkan compliance requirement
• Implement tiered storage (hot/warm/cold)
• Automatic cleanup untuk old recordings

**⚙️ Optimization:**
• Smart recording (motion + schedule)
• Variable bitrate untuk space saving
• ROI encoding untuk important areas
• Deduplication untuk similar frames

**📊 Monitoring:**
• Real-time storage usage
• Predictive analytics untuk capacity planning
• Alert pada 80% usage
• Automated backup verification`,
    category: "recording",
    keywords: ["storage", "scaling", "calculation", "capacity planning"],
    relatedTopics: ["backup", "performance", "costs"],
    priority: 2
  },
  {
    id: "mobile_access_rtsp",
    question: "Bagaimana setup mobile access untuk RTSP streams?",
    answer: `Setup mobile access untuk RTSP streams:

**📱 Mobile Apps:**
• VLC Mobile - Universal RTSP player
• IP Cam Viewer - Multi-camera support
• tinyCam Monitor - Android dedicated
• Live Cams Pro - iOS specialized

**🔧 Configuration:**
• Port forwarding: 554 (RTSP), 80/443 (HTTP/HTTPS)
• Dynamic DNS untuk IP berubah
• Mobile-optimized streams (sub-stream)
• Adaptive bitrate untuk mobile network

**🌐 Web Access:**
• HTML5 player dengan WebRTC
• Progressive web app (PWA)
• Responsive design untuk mobile browser
• Touch-friendly controls

**📊 Optimization:**
• Low latency mode untuk real-time
• Buffer size adjustment
• Quality auto-adjustment
• Bandwidth monitoring

**🔐 Security:**
• SSL/TLS encryption
• VPN access recommended
• Two-factor authentication
• Session timeout controls

**📞 Troubleshooting:**
• Check mobile network speed
• Verify firewall/NAT settings
• Test dengan different apps
• Monitor server logs`,
    category: "access",
    keywords: ["mobile", "remote access", "apps", "streaming"],
    relatedTopics: ["security", "network", "optimization"],
    priority: 3
  }
];

// System status template
export const getSystemStatus = (): SystemStatus => ({
  serverStatus: 'online',
  totalCameras: cameraPoints.length,
  onlineCameras: cameraPoints.filter(c => c.status === 'online').length,
  recording: true,
  storage: {
    used: '6.8TB',
    total: '10TB',
    percentage: 68
  },
  network: {
    status: 'stable',
    bandwidth: '42/100 Mbps'
  },
  alerts: cameraPoints.filter(c => c.status !== 'online').length
});

// Utility functions
export const getCameraByZone = (zone: string): CameraPoint[] => {
  return cameraPoints.filter(cam => 
    cam.zone.toLowerCase().includes(zone.toLowerCase())
  );
};

export const getCamerasByFloor = (floor: number): CameraPoint[] => {
  return cameraPoints.filter(cam => cam.floor === floor);
};

export const getMaintenanceDue = (): CameraPoint[] => {
  const today = new Date();
  const soon = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  return cameraPoints.filter(cam => {
    if (!cam.nextMaintenance) return false;
    const maintenanceDate = new Date(cam.nextMaintenance);
    return maintenanceDate <= soon;
  });
};

export const searchCameraByKeyword = (keyword: string): CameraPoint[] => {
  const lowerKeyword = keyword.toLowerCase();
  return cameraPoints.filter(cam => 
    cam.name.toLowerCase().includes(lowerKeyword) ||
    cam.location.toLowerCase().includes(lowerKeyword) ||
    cam.description.toLowerCase().includes(lowerKeyword) ||
    cam.zone.toLowerCase().includes(lowerKeyword)
  );
};

// Quick action responses
export const getQuickActionResponse = (actionId: string): string => {
  const action = quickActions.find(a => a.id === actionId);
  return action ? action.response : "Action tidak ditemukan.";
};

// Response templates
export const responseTemplates = {
  cameraStatus: (camera: CameraPoint) => `
🎥 **${camera.name}** (${camera.id})
📍 **Lokasi:** ${camera.location}
📊 **Status:** ${camera.status === 'online' ? '✅ Online' : camera.status === 'maintenance' ? '🔧 Maintenance' : '❌ Offline'}
🎬 **Spec:** ${camera.resolution}@${camera.fps}fps (${camera.codec})
💾 **Recording:** ${camera.recording ? '✅ Active' : '❌ Stopped'}
🌙 **Night Vision:** ${camera.nightVision ? '✅ Yes' : '❌ No'}
🚶 **Motion Detection:** ${camera.motionDetection ? '✅ Active' : '❌ Disabled'}
🔊 **Audio:** ${camera.audioEnabled ? '✅ Enabled' : '❌ Disabled'}
🔗 **RTSP:** ${camera.rtspUrl || 'Not configured'}

📝 **Description:** ${camera.description}
🔧 **Last Maintenance:** ${camera.lastMaintenance || 'N/A'}
📅 **Next Due:** ${camera.nextMaintenance || 'N/A'}
  `.trim(),

  systemOverview: () => {
    const status = getSystemStatus();
    return `
🏢 **System Overview**
📊 **Server:** ${status.serverStatus === 'online' ? '✅ Online' : '❌ Offline'}
🎥 **Cameras:** ${status.onlineCameras}/${status.totalCameras} online
💾 **Storage:** ${status.storage.used}/${status.storage.total} (${status.storage.percentage}%)
🌐 **Network:** ${status.network.status} - ${status.network.bandwidth}
⚠️ **Alerts:** ${status.alerts} active

**📍 Camera Distribution:**
${[0, 1, 2].map(floor => {
  const cameras = getCamerasByFloor(floor);
  const floorName = floor === 0 ? 'Ground' : `Floor ${floor}`;
  const online = cameras.filter(c => c.status === 'online').length;
  return `• ${floorName}: ${online}/${cameras.length} cameras online`;
}).join('\n')}

**🔧 Maintenance Due Soon:**
${getMaintenanceDue().map(cam => `• ${cam.name} - ${cam.nextMaintenance}`).join('\n') || '• No maintenance due'}
    `.trim();
  },

  troubleshootingSteps: (issue: string) => `
🔧 **Troubleshooting: ${issue}**

**🔍 Initial Diagnosis:**
1. Check physical connections (power, ethernet)
2. Verify network connectivity (ping test)
3. Review system logs for errors
4. Check camera LED status indicators

**🌐 Network Tests:**
1. Ping camera IP address
2. Telnet to RTSP port (554)
3. Check switch port status
4. Verify VLAN configuration

**📹 Camera-Specific:**
1. Factory reset if accessible
2. Update firmware to latest version
3. Check RTSP credentials
4. Test with alternative viewer

**📞 Escalation:**
If issue persists after basic troubleshooting:
• Contact IT Support: Ext. 103
• Email: support@cctv-system.com
• Include: Camera ID, Error details, Steps taken
  `.trim()
};

// Common questions enhanced for RTSP and multiple points
export const commonQuestions = [
  "Bagaimana cara mengakses RTSP streaming dari multiple cameras?",
  "Berapa total titik kamera yang tersedia di sistem?",
  "Bagaimana cara melihat semua kamera secara bersamaan?",
  "Apa URL RTSP untuk setiap kamera?",
  "Bagaimana setting kualitas streaming untuk mobile?",
  "Cara troubleshoot kamera yang offline?",
  "Bagaimana akses recording dari multiple cameras?",
  "Apa codec yang digunakan untuk streaming?",
  "Bagaimana cara export video dari beberapa kamera sekaligus?",
  "Berapa bandwidth yang dibutuhkan untuk semua camera?",
  "Bagaimana cara akses via VPN?",
  "Apa spesifikasi teknis sistem RTSP?",
  "Bagaimana cara menambah kamera baru?",
  "Apa coverage area setiap kamera?",
  "Bagaimana cara backup recording otomatis?",
  "Bagaimana monitoring status semua kamera real-time?"
];

// Sample CCTV-related responses for the chatbot (updated)
export const cctvKnowledgeBase = {
  greetings: [
    "🎥 Selamat datang di Sistem CCTV RTSP Multi-Point! Saya siap membantu Anda dengan informasi tentang streaming, monitoring, dan manajemen kamera.",
    "👋 Halo! Saya asisten CCTV untuk sistem RTSP dengan multiple camera points. Bagaimana saya bisa membantu Anda hari ini?",
    "🔐 Selamat datang di layanan informasi CCTV! Silakan tanyakan tentang streaming RTSP, lokasi kamera, atau troubleshooting sistem."
  ],
  
  cameraLocations: {
    keywords: ["lokasi kamera", "dimana kamera", "posisi cctv", "camera location", "titik kamera"],
    response: "🎥 **Sistem CCTV RTSP - Lokasi Strategis:**\n\n📍 **Titik Kamera Utama:**\n- Pintu masuk utama (CAM-01)\n- Area parkir (CAM-02, CAM-03)\n- Lobby dan resepsionis (CAM-04)\n- Koridor lantai 1-3 (CAM-05 s/d CAM-12)\n\n📍 **Titik Kamera Khusus:**\n- Ruang server (CAM-13)\n- Area keamanan (CAM-14)\n- Emergency exit (CAM-15, CAM-16)\n- Tangga darurat (CAM-17, CAM-18)\n\n🔗 **RTSP Streaming:**\n- Live view tersedia 24/7\n- Multiple quality options\n- Remote access dengan otentikasi\n\nUntuk akses RTSP URL atau viewing khusus, hubungi control room."
  },
  
  maintenanceSchedule: {
    keywords: ["jadwal maintenance", "perawatan", "service kamera", "maintenance schedule"],
    response: "📋 **Jadwal Maintenance CCTV:**\n\n🔧 **Rutin Mingguan:**\n- Setiap Senin: Pembersihan lensa\n- Rabu: Pengecekan koneksi\n- Jumat: Update software\n\n🔧 **Maintenance Bulanan:**\n- Minggu pertama: Kalibrasi sistem\n- Minggu ketiga: Backup data\n\n⚠️ Selama maintenance, beberapa kamera mungkin temporary offline. Untuk informasi real-time, hubungi control room."
  },
  
  emergencyContacts: {
    keywords: ["kontak darurat", "emergency", "bantuan", "help", "nomor penting"],
    response: "🚨 **Kontak Darurat & Penting:**\n\n🔴 **Emergency:**\n- Polisi: 110\n- Pemadam Kebakaran: 113\n- Ambulans: 118\n\n🏢 **Internal:**\n- Control Room: Ext. 100\n- Security: Ext. 101\n- Maintenance: Ext. 102\n- IT Support: Ext. 103\n\n📞 **External:**\n- Kantor Pusat: (021) 1234-5678\n- WhatsApp Admin: +62 812-3456-7890"
  },
  
  reportIssues: {
    keywords: ["lapor masalah", "report issue", "kamera rusak", "tidak berfungsi"],
    response: "📝 **Cara Melaporkan Masalah CCTV:**\n\n📋 **Informasi yang Diperlukan:**\n- Lokasi kamera yang bermasalah\n- Jenis masalah (tidak merekam, gambar kabur, dll)\n- Waktu kejadian\n- Foto/screenshot jika memungkinkan\n\n📞 **Cara Lapor:**\n1. Hubungi Control Room: Ext. 100\n2. Email: support@cctv-system.com\n3. WhatsApp: +62 812-3456-7890\n4. Form online: [Link akan disediakan]\n\n⏰ Response time: 15 menit untuk emergency, 2 jam untuk non-emergency."
  },
  
  operationalHours: {
    keywords: ["jam operasional", "buka tutup", "operational hours", "working hours"],
    response: "🕐 **Jam Operasional:**\n\n📹 **Sistem CCTV:**\n- Monitoring: 24/7\n- Live viewing: 24/7\n- Akses rekaman: 06:00 - 22:00\n\n🏢 **Control Room:**\n- Senin-Jumat: 08:00 - 17:00\n- Sabtu: 08:00 - 12:00\n- Minggu: On-call emergency\n\n🔧 **Technical Support:**\n- Weekdays: 08:00 - 17:00\n- Emergency: 24/7 (on-call)\n\n📞 **Customer Service:**\n- Senin-Jumat: 08:00 - 16:00"
  },
  
  rtspStreaming: {
    keywords: ["rtsp", "streaming", "live view", "stream kamera", "akses live"],
    response: "📡 **RTSP Streaming System:**\n\n🔗 **Akses Streaming:**\n- Protocol: RTSP/TCP\n- Port: 554 (default)\n- Format: H.264/H.265\n- Audio: AAC (jika tersedia)\n\n📱 **Cara Akses:**\n1. VLC Media Player: File > Open Network Stream\n2. Browser: Chrome/Firefox dengan plugin\n3. Mobile App: IP Cam Viewer, VLC Mobile\n4. Software NVR: Blue Iris, iSpy\n\n🔐 **Autentikasi:**\n- Username/Password diperlukan\n- Hubungi admin untuk credentials\n- IP whitelisting untuk akses eksternal\n\n⚙️ **Quality Options:**\n- Main Stream: 1080p@25fps\n- Sub Stream: 720p@15fps\n- Mobile Stream: 480p@10fps"
  },

  multiplePoints: {
    keywords: ["berapa kamera", "jumlah titik", "multiple points", "total kamera", "coverage area"],
    response: "📊 **Coverage CCTV Multiple Points:**\n\n🎯 **Total Coverage:**\n- Jumlah kamera aktif: 18 titik\n- Area coverage: 95% gedung\n- Recording capacity: 30 hari\n- Live monitoring: 24/7\n\n📍 **Distribusi per Area:**\n- Lantai 1: 8 kamera (CAM-01 s/d CAM-08)\n- Lantai 2: 6 kamera (CAM-09 s/d CAM-14)\n- Lantai 3: 4 kamera (CAM-15 s/d CAM-18)\n\n🔄 **Redundancy:**\n- Backup recording di 2 server\n- Automatic failover system\n- Cloud backup untuk data penting\n\n📈 **Expansion Plan:**\n- Capacity untuk 32 kamera\n- Future: AI analytics integration"
  },

  streamQuality: {
    keywords: ["kualitas video", "resolusi", "fps", "bitrate", "quality settings"],
    response: "🎬 **Kualitas Streaming RTSP:**\n\n📺 **Main Stream (Recording):**\n- Resolusi: 1920x1080 (Full HD)\n- Frame Rate: 25 fps\n- Bitrate: 4-6 Mbps\n- Codec: H.264 High Profile\n\n📱 **Sub Stream (Live View):**\n- Resolusi: 1280x720 (HD)\n- Frame Rate: 15 fps\n- Bitrate: 1-2 Mbps\n- Codec: H.264 Main Profile\n\n📲 **Mobile Stream:**\n- Resolusi: 640x480 (VGA)\n- Frame Rate: 10 fps\n- Bitrate: 512 kbps\n- Codec: H.264 Baseline\n\n⚙️ **Settings:**\n- Night vision: Auto IR cut\n- Motion detection: Enabled\n- Audio recording: Optional\n- Compression: Variable bitrate"
  },

  recordingAccess: {
    keywords: ["akses rekaman", "playback", "download video", "backup recording"],
    response: "💾 **Akses Recording System:**\n\n📅 **Retention Policy:**\n- Local storage: 30 hari\n- Cloud backup: 90 hari\n- Critical events: 1 tahun\n- Motion only: Space saving mode\n\n🔍 **Cara Akses Rekaman:**\n1. **Web Interface:**\n   - Login: http://[IP-Server]:8080\n   - Search by date/time/camera\n   - Export format: MP4, AVI\n\n2. **Mobile App:**\n   - Download: \"CCTV Mobile View\"\n   - Login dengan user account\n   - Playback & download\n\n3. **Request Formal:**\n   - Email: admin@cctv-system.com\n   - Form permintaan rekaman\n   - Approval untuk keperluan legal\n\n⚡ **Export Options:**\n- Single camera: Max 2 jam\n- Multiple cameras: Max 1 jam\n- Format: MP4 (H.264)\n- Include metadata & timestamp"
  }
};
