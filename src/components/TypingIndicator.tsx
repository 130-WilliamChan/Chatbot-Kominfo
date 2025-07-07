import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-indicator-content">
        <div className="typing-avatar">
          <div className="typing-avatar-circle">
            <span>🤖</span>
          </div>
        </div>
        <div className="typing-bubble">
          <div className="typing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;