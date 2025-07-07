import React, { useEffect, useRef, useState } from 'react';
import './VideoAvatar.css';

interface VideoAvatarProps {
  state: 'idle' | 'speaking' | 'listening' | 'thinking' | 'happy' | 'sad';
  size?: 'small' | 'medium' | 'large';
}

const VideoAvatar: React.FC<VideoAvatarProps> = ({ state, size = 'medium' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Map states to video files
  const getVideoSource = (state: string) => {
    // Handle 'sad' as fallback to 'idle' since there's no sad.mp4
    const videoState = state === 'sad' ? 'idle' : state;
    return `/avatars/video/states/${videoState}.mp4`;
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Reset loaded state for new videos
      setVideoLoaded(false);
      
      // Set new source
      video.src = getVideoSource(state);
      
      // Start playing when loaded
      video.onloadeddata = () => {
        setVideoLoaded(true);
        video.play().catch(err => {
          console.error('Failed to play video:', err);
        });
      };
    }
    
    // Cleanup function
    return () => {
      if (video) {
        video.onloadeddata = null;
      }
    };
  }, [state]);

  return (
    <div className={`video-avatar-container ${size} ${state} ${videoLoaded ? 'loaded' : 'loading'}`}>
      <div className="video-content-wrapper">
        <video 
          ref={videoRef}
          className="avatar-video"
          playsInline
          autoPlay
          muted
          loop
          poster={`/avatars/video/states/idle.mp4`}
        />
      </div>
      
      {/* Optional state indicator for debugging */}
      <div className="avatar-state-indicator">
        {state}
      </div>
    </div>
  );
};

export default VideoAvatar;