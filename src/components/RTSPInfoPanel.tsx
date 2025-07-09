import React, { useState, useEffect } from 'react';
import './RTSPInfoPanel.css';
import { 
  cameraPoints, 
  quickActions, 
  getCamerasByFloor, 
  getSystemStatus,
  type CameraPoint,
  type SystemStatus 
} from '../config/cctvChatbotConfig';

interface RTSPInfoPanelProps {
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction?: (actionId: string) => void;
  selectedCamera?: string;
  onCameraSelect?: (cameraId: string) => void;
}

export const RTSPInfoPanel: React.FC<RTSPInfoPanelProps> = ({
  onClose,
  onSendMessage,
  onQuickAction,
  selectedCamera,
  onCameraSelect
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cameras' | 'streaming' | 'actions'>('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(getSystemStatus());
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<string | 'all'>('all');

  // Update system status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(getSystemStatus());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: CameraPoint['status']) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getFilteredCameras = () => {
    let filtered = cameraPoints;
    
    if (selectedFloor !== 'all') {
      filtered = getCamerasByFloor(selectedFloor as number);
    }
    
    if (selectedZone !== 'all') {
      filtered = filtered.filter(cam => cam.zone === selectedZone);
    }
    
    return filtered;
  };

  const uniqueZones = [...new Set(cameraPoints.map(cam => cam.zone))];
  const uniqueFloors = [...new Set(cameraPoints.map(cam => cam.floor))].sort();

  return (
    <div className="rtsp-info-panel">
      <div className="panel-header">
        <h3>🎥 CCTV RTSP Multi-Point System</h3>
        <div className="header-actions">
          <div className="system-health">
            <span className={`health-indicator ${systemStatus.serverStatus}`}>
              {systemStatus.serverStatus === 'online' ? '🟢' : '🔴'} {systemStatus.serverStatus}
            </span>
          </div>
          <button className="close-button" onClick={onClose} title="Close Panel">
            ✕
          </button>
        </div>
      </div>

      <div className="panel-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'cameras' ? 'active' : ''}`}
          onClick={() => setActiveTab('cameras')}
        >
          🎥 Cameras
        </button>
        <button 
          className={`tab-button ${activeTab === 'streaming' ? 'active' : ''}`}
          onClick={() => setActiveTab('streaming')}
        >
          📡 RTSP Streams
        </button>
        <button 
          className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          ⚡ Quick Actions
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎥</div>
                <div className="stat-info">
                  <div className="stat-number">{systemStatus.onlineCameras}/{systemStatus.totalCameras}</div>
                  <div className="stat-label">Cameras Online</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-info">
                  <div className="stat-number">{systemStatus.storage.percentage}%</div>
                  <div className="stat-label">Storage Used</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-info">
                  <div className="stat-number">{systemStatus.network.bandwidth.split('/')[0]}</div>
                  <div className="stat-label">Bandwidth</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <div className="stat-number">{systemStatus.alerts}</div>
                  <div className="stat-label">Alerts</div>
                </div>
              </div>
            </div>

            <div className="system-info">
              <h4>📊 System Details</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Server Status:</span>
                  <span className={`info-value ${systemStatus.serverStatus}`}>
                    {systemStatus.serverStatus === 'online' ? '✅ Online' : '❌ Offline'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Recording:</span>
                  <span className="info-value">
                    {systemStatus.recording ? '✅ Active' : '❌ Stopped'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Storage:</span>
                  <span className="info-value">{systemStatus.storage.used} / {systemStatus.storage.total}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Network:</span>
                  <span className={`info-value ${systemStatus.network.status}`}>
                    {systemStatus.network.status} ({systemStatus.network.bandwidth})
                  </span>
                </div>
              </div>
            </div>

            <div className="distribution-info">
              <h4>📍 Camera Distribution</h4>
              <div className="distribution-grid">
                {uniqueFloors.map(floor => {
                  const floorCameras = getCamerasByFloor(floor);
                  const onlineCameras = floorCameras.filter(c => c.status === 'online').length;
                  return (
                    <div key={floor} className="distribution-item">
                      <span className="distribution-label">
                        {floor === 0 ? 'Ground Floor' : `Floor ${floor}`}:
                      </span>
                      <span className="distribution-value">
                        {onlineCameras}/{floorCameras.length} online
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cameras' && (
          <div className="cameras-content">
            <div className="camera-filters">
              <div className="filter-group">
                <label>Floor:</label>
                <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}>
                  <option value="all">All Floors</option>
                  {uniqueFloors.map(floor => (
                    <option key={floor} value={floor}>
                      {floor === 0 ? 'Ground Floor' : `Floor ${floor}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Zone:</label>
                <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                  <option value="all">All Zones</option>
                  {uniqueZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="camera-list">
              {getFilteredCameras().map(camera => (
                <div 
                  key={camera.id} 
                  className={`camera-item ${selectedCamera === camera.id ? 'selected' : ''}`}
                  onClick={() => onCameraSelect?.(camera.id)}
                >
                  <div className="camera-status">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: getStatusColor(camera.status) }}
                    ></span>
                    <span className="camera-id">{camera.id}</span>
                  </div>
                  <div className="camera-details">
                    <h5 className="camera-name">{camera.name}</h5>
                    <p className="camera-location">📍 {camera.location}</p>
                    <div className="camera-specs">
                      <span className="spec-badge">📺 {camera.resolution}</span>
                      <span className="spec-badge">🎬 {camera.fps}fps</span>
                      <span className="spec-badge">💿 {camera.codec}</span>
                    </div>
                    <div className="camera-features">
                      {camera.nightVision && <span className="feature-tag">🌙 Night Vision</span>}
                      {camera.motionDetection && <span className="feature-tag">🚶 Motion</span>}
                      {camera.audioEnabled && <span className="feature-tag">🔊 Audio</span>}
                      {camera.recording && <span className="feature-tag recording">💾 Recording</span>}
                    </div>
                  </div>
                  <div className="camera-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(`Show details for ${camera.name}`);
                      }}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'streaming' && (
          <div className="streaming-content">
            <div className="rtsp-info">
              <h4>📡 RTSP Configuration</h4>
              <div className="rtsp-config">
                <div className="config-item">
                  <span className="config-label">Protocol:</span>
                  <span className="config-value">RTSP/TCP, RTSP/UDP</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Default Port:</span>
                  <span className="config-value">554</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Authentication:</span>
                  <span className="config-value">Digest (Required)</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Max Concurrent:</span>
                  <span className="config-value">16 streams</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Codecs:</span>
                  <span className="config-value">H.264, H.265, MJPEG</span>
                </div>
              </div>
            </div>

            <div className="stream-list">
              <h4>🎬 Active RTSP Streams</h4>
              {cameraPoints.filter(cam => cam.status === 'online' && cam.rtspUrl).map(camera => (
                <div key={camera.id} className="stream-item">
                  <div className="stream-header">
                    <span className="stream-camera">{camera.name}</span>
                    <span className="stream-bitrate">{camera.bitrate}</span>
                  </div>
                  <div className="stream-url">
                    <code>{camera.rtspUrl}</code>
                    <button 
                      className="copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(camera.rtspUrl || '');
                        // Show toast or feedback
                      }}
                      title="Copy RTSP URL"
                    >
                      📋
                    </button>
                  </div>
                  <div className="stream-specs">
                    <span className="spec">🎥 {camera.resolution}</span>
                    <span className="spec">🎬 {camera.fps}fps</span>
                    <span className="spec">💿 {camera.codec}</span>
                    {camera.audioEnabled && <span className="spec">🔊 Audio</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="stream-tips">
              <h4>💡 RTSP Access Tips</h4>
              <ul>
                <li>Use VLC Media Player for testing: <code>Media → Open Network Stream</code></li>
                <li>Mobile apps: IP Cam Viewer, tinyCam Monitor</li>
                <li>Web browsers: Chrome/Firefox with WebRTC support</li>
                <li>For remote access, configure VPN or port forwarding</li>
                <li>Contact admin for username/password credentials</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-content">
            <h4>⚡ Quick Actions</h4>
            <div className="actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="action-button"
                  onClick={() => {
                    onQuickAction?.(action.id);
                    onSendMessage(action.label);
                  }}
                  title={action.description}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-label">{action.label.replace(/^[\u{1F4F9}\u{1F517}\u{1F4CD}\u{1F527}\u{1F4BE}\u{1F319}\u{1F6B6}\u{1F4CA}]+\s*/u, '')}</div>
                  <div className="action-category">{action.category}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RTSPInfoPanel;
