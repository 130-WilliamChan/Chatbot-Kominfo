import React, { useState, useEffect } from 'react';
import FullModeChatbot from './FullModeChatbot';
import { defaultCCTVConfig } from '../config/cctvChatbotConfig';
import type { ChatbotConfig } from '../config/cctvChatbotConfig';
import './ChatbotWidget.css';

interface ChatbotWidgetProps {
  config?: Partial<ChatbotConfig>;
  onToggle?: (isOpen: boolean) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  config = {},
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const finalConfig = { ...defaultCCTVConfig, ...config };

  useEffect(() => {
    if (onToggle) {
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  const restoreWidget = () => {
    setIsMinimized(false);
  };

  const getPositionClass = () => {
    return `widget-position-${finalConfig.position}`;
  };

  const getThemeClass = () => {
    if (finalConfig.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light';
    }
    return `theme-${finalConfig.theme}`;
  };

  const getSizeClass = () => {
    return `size-${finalConfig.size}`;
  };

  return (
    <div className={`chatbot-widget ${getPositionClass()} ${getThemeClass()}`}>
      {/* Widget Toggle Button */}
      {!isOpen && (
        <button
          className="widget-toggle-btn"
          onClick={toggleWidget}
          aria-label="Buka chatbot CCTV"
          title="Bantuan Informasi CCTV & Layanan Publik"
        >
          <div className="widget-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="widget-pulse"></div>
        </button>
      )}

      {/* Widget Container */}
      {isOpen && (
        <div className={`widget-container ${getSizeClass()} ${isMinimized ? 'minimized' : ''}`}>
          {/* Widget Header */}
          <div className="widget-header">
            <div className="header-info">
              <div className="header-title">
                🎥 Asisten CCTV
              </div>
              <div className="header-subtitle">
                Informasi & Layanan Publik
              </div>
            </div>
            <div className="header-controls">
              {!isMinimized && (
                <button
                  className="control-btn minimize-btn"
                  onClick={minimizeWidget}
                  aria-label="Minimize"
                  title="Kecilkan"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h12v2H6z"/>
                  </svg>
                </button>
              )}
              {isMinimized && (
                <button
                  className="control-btn restore-btn"
                  onClick={restoreWidget}
                  aria-label="Restore"
                  title="Pulihkan"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6v12h16V6H4zm2 2h12v8H6V8z"/>
                  </svg>
                </button>
              )}
              <button
                className="control-btn close-btn"
                onClick={toggleWidget}
                aria-label="Tutup"
                title="Tutup chatbot"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Widget Content */}
          {!isMinimized && (
            <div className="widget-content">
              <FullModeChatbot />
            </div>
          )}

          {/* Quick Actions for minimized state */}
          {isMinimized && (
            <div className="widget-quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => {
                  restoreWidget();
                  // You can add logic to trigger specific actions
                }}
                title="Lokasi Kamera"
              >
                📍
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => {
                  restoreWidget();
                  // You can add logic to trigger specific actions
                }}
                title="Emergency"
              >
                🚨
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => {
                  restoreWidget();
                  // You can add logic to trigger specific actions
                }}
                title="Jam Operasional"
              >
                🕐
              </button>
            </div>
          )}

          {/* Status Indicator */}
          <div className="widget-status">
            <div className="status-indicator online"></div>
            <span className="status-text">Online</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
