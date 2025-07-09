# RTSP CCTV System Integration Guide

## 🎥 Sistem RTSP Multiple Points Overview

Chatbot ini telah dikonfigurasi khusus untuk sistem CCTV yang menggunakan protocol RTSP dengan multiple titik kamera. Sistem ini mendukung streaming real-time, recording, dan akses remote untuk monitoring keamanan.

## 📡 RTSP Configuration

### Technical Specifications
- **Protocol**: RTSP (Real Time Streaming Protocol)
- **Transport**: TCP/UDP
- **Default Port**: 554
- **Video Codec**: H.264/H.265
- **Audio Codec**: AAC (Optional)
- **Stream Format**: Multiple quality options

### Stream Quality Options

#### Main Stream (Recording)
```
Resolution: 1920x1080 (Full HD)
Frame Rate: 25 fps
Bitrate: 4-6 Mbps
Codec: H.264 High Profile
Usage: Recording & high-quality viewing
```

#### Sub Stream (Live View)
```
Resolution: 1280x720 (HD)
Frame Rate: 15 fps  
Bitrate: 1-2 Mbps
Codec: H.264 Main Profile
Usage: Live monitoring & multi-view
```

#### Mobile Stream
```
Resolution: 640x480 (VGA)
Frame Rate: 10 fps
Bitrate: 512 kbps  
Codec: H.264 Baseline
Usage: Mobile apps & low bandwidth
```

## 📍 Multiple Camera Points

### Current Deployment
- **Total Active Cameras**: 18 points
- **Coverage Area**: 95% building coverage
- **Recording Capacity**: 30 days local + 90 days cloud
- **Monitoring**: 24/7 with automatic failover

### Camera Distribution
```
Lantai 1: 8 Kamera
├── CAM-01: Pintu Masuk Utama (1080p)
├── CAM-02: Area Parkir A (1080p)
├── CAM-03: Area Parkir B (720p)
├── CAM-04: Lobby Resepsionis (1080p)
├── CAM-05: Koridor Utama L1 (720p)
├── CAM-06: Ruang Tunggu (720p)
├── CAM-07: Cafeteria (720p)
└── CAM-08: Emergency Exit A (720p)

Lantai 2: 6 Kamera
├── CAM-09: Koridor Utama L2 (720p)
├── CAM-10: Ruang Meeting (1080p)
├── CAM-11: Area Workstation (720p)
├── CAM-12: Ruang Server (1080p)
├── CAM-13: Storage Room (720p)
└── CAM-14: Emergency Exit B (720p)

Lantai 3: 4 Kamera
├── CAM-15: Koridor L3 (720p)
├── CAM-16: Rooftop Access (720p)
├── CAM-17: Tangga Darurat A (720p)
└── CAM-18: Tangga Darurat B (720p)
```

## 🔗 RTSP Access Methods

### 1. VLC Media Player
```bash
# Open Network Stream
rtsp://username:password@[camera-ip]:554/stream1

# Example URLs
rtsp://admin:password123@192.168.1.100:554/main
rtsp://admin:password123@192.168.1.100:554/sub
```

### 2. Web Browser (with Plugin)
```html
<!-- HTML5 Video with RTSP support -->
<video controls>
  <source src="rtsp://[camera-ip]:554/stream" type="application/x-rtsp">
</video>
```

### 3. Mobile Applications
- **Android**: IP Cam Viewer, VLC for Android
- **iOS**: IP Cam Viewer Pro, VLC for iOS
- **Custom App**: "CCTV Mobile View" (Available on Play Store)

### 4. NVR Software
- **Blue Iris**: Professional NVR software
- **iSpy**: Open source surveillance
- **Milestone**: Enterprise solution
- **Hikvision iVMS**: Manufacturer software

## 💾 Recording & Storage System

### Retention Policy
```
Local Storage (NVR):
├── Regular Recording: 30 days
├── Motion Events: 45 days
└── Critical Events: 60 days

Cloud Backup:
├── Important Events: 90 days
├── Emergency Footage: 1 year
└── Legal Requests: 2 years
```

### Access Methods

#### Web Interface
```
URL: http://[nvr-ip]:8080
Login: Required (username/password)
Features:
- Live view all cameras
- Playback by date/time
- Export video clips
- Search by motion events
- Download in MP4 format
```

#### Mobile App Access
```
App: "CCTV Mobile View"
Features:
- Remote live viewing
- Push notifications for events
- Quick playback
- Basic export functionality
- Multiple camera views
```

#### API Access (for developers)
```bash
# Get camera list
GET /api/cameras
Authorization: Bearer [token]

# Get live stream URL
GET /api/camera/{id}/stream
Authorization: Bearer [token]

# Request recording
GET /api/recording/{camera_id}?start={timestamp}&end={timestamp}
Authorization: Bearer [token]
```

## 🔐 Security & Authentication

### Access Control
- **Username/Password**: Required for all RTSP streams
- **IP Whitelisting**: External access restricted by IP
- **VPN Access**: Recommended for remote viewing
- **Role-based Permissions**: Different access levels

### Network Security
```
Firewall Rules:
├── Port 554: RTSP streaming (internal only)
├── Port 8080: Web interface (VPN only)
├── Port 443: HTTPS admin panel
└── VPN Tunnel: External access required

Security Features:
├── SSL/TLS encryption for web access
├── Token-based API authentication
├── Failed login attempt monitoring
└── Audit logs for all access
```

## 🚀 Integration dengan Website

### Embedded Player
```html
<!DOCTYPE html>
<html>
<head>
    <title>CCTV Live View</title>
</head>
<body>
    <!-- RTSP Chatbot Integration -->
    <script src="cctv-chatbot-integration.js"></script>
    <script>
        CCTVChatbot.init({
            position: 'bottom-right',
            features: {
                rtspStreaming: true,
                multiplePoints: true,
                recordingAccess: true,
                streamQuality: true
            },
            customization: {
                primaryColor: '#2196F3',
                brandName: 'CCTV Security System'
            }
        });
    </script>
    
    <!-- Live Camera Grid -->
    <div class="camera-grid">
        <div class="camera-view" data-camera="CAM-01">
            <video controls autoplay muted>
                <source src="rtsp://admin:pass@192.168.1.101:554/main" type="application/x-rtsp">
            </video>
        </div>
        <!-- More cameras... -->
    </div>
</body>
</html>
```

### JavaScript Integration
```javascript
// Initialize chatbot with RTSP features
CCTVChatbot.init({
    position: 'bottom-right',
    theme: 'auto',
    
    // RTSP specific features
    features: {
        rtspStreaming: true,
        multiplePoints: true,
        recordingAccess: true,
        streamQuality: true,
        cameraStatus: true
    },
    
    // Custom RTSP configuration
    rtspConfig: {
        serverIP: '192.168.1.100',
        webPort: 8080,
        rtspPort: 554,
        totalCameras: 18,
        recordingDays: 30
    },
    
    // Event callbacks
    onCameraSelect: function(cameraId) {
        console.log('Camera selected:', cameraId);
        // Open live view for specific camera
    },
    
    onRecordingRequest: function(cameraId, startTime, endTime) {
        console.log('Recording requested:', {cameraId, startTime, endTime});
        // Handle recording export request
    }
});

// API methods for camera control
CCTVChatbot.showCameraList();
CCTVChatbot.openRecordingPanel();
CCTVChatbot.checkCameraStatus();
```

## 📊 Monitoring & Analytics

### System Status Dashboard
```javascript
// Real-time camera status
const cameraStatus = {
    online: 17,      // Cameras currently online
    offline: 1,      // Cameras offline
    maintenance: 0,  // Cameras in maintenance
    recording: 17,   // Cameras actively recording
    storage: {
        used: '2.1TB',
        total: '4TB',
        percentage: 52.5
    }
};

// Update chatbot with current status
CCTVChatbot.updateStatus(cameraStatus);
```

### Performance Metrics
- **Stream Latency**: < 2 seconds average
- **Recording Uptime**: 99.8% availability
- **Storage Efficiency**: H.264 compression
- **Bandwidth Usage**: Adaptive based on quality
- **Motion Detection**: AI-enhanced accuracy

## 🔧 Maintenance & Troubleshooting

### Common Issues & Solutions

#### RTSP Stream Not Loading
```bash
# Check camera connectivity
ping [camera-ip]

# Test RTSP URL
ffplay rtsp://username:password@[camera-ip]:554/stream

# Check firewall
telnet [camera-ip] 554
```

#### Recording Playback Issues
```bash
# Check storage space
df -h /var/recordings

# Verify recording service
systemctl status recording-service

# Check file permissions
ls -la /var/recordings/
```

#### Network Performance
```bash
# Monitor bandwidth usage
iftop -i eth0

# Check stream quality
ffprobe rtsp://[camera-ip]:554/stream

# Network latency test
mtr [camera-ip]
```

### Scheduled Maintenance
```
Weekly Tasks:
├── Camera lens cleaning
├── Network connectivity check
├── Storage space verification
└── System health monitoring

Monthly Tasks:
├── Firmware updates
├── Password rotation
├── Backup verification
└── Performance optimization

Quarterly Tasks:
├── Full system backup
├── Security audit
├── Hardware inspection
└── Capacity planning
```

## 📞 Support & Contacts

### Technical Support
- **Control Room**: Ext. 100 (24/7)
- **IT Support**: Ext. 103 (08:00-17:00)
- **Emergency**: +62 812-3456-7890

### Remote Support
- **TeamViewer**: For technical assistance
- **VPN Access**: For system administration
- **Email Support**: admin@cctv-system.com

### Documentation
- **User Manual**: Available in chatbot
- **API Documentation**: /docs/api
- **Video Tutorials**: /docs/videos
- **FAQ**: Built into chatbot responses

---

**Note**: Sistem ini telah dioptimalkan untuk kebutuhan monitoring keamanan dengan fokus pada reliability, security, dan ease of use. Chatbot menyediakan akses mudah ke semua informasi dan fungsi sistem RTSP.
