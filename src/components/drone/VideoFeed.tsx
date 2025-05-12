import React, { useRef, useEffect, useState } from 'react';
import { DroneData } from '../../models/types';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

interface VideoFeedProps {
  drone: DroneData;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  drone, 
  isFullScreen = false,
  onToggleFullScreen
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (drone.status === 'inactive') {
      videoElement.pause();
      setIsPlaying(false);
      return;
    }

    // Reset video if drone changes
    videoElement.src = drone.videoFeed;
    videoElement.load();
    
    if (isPlaying) {
      videoElement.play().catch(err => {
        console.error("Video play error:", err);
        setVideoError(true);
      });
    } else {
      videoElement.pause();
    }

    return () => {
      videoElement.pause();
    };
  }, [drone.id, drone.videoFeed, drone.status]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        setVideoError(true);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full h-full'}`}>
      {/* Video overlay with drone info */}
      <div className="absolute top-2 left-2 z-10 flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${drone.status === 'active' ? 'bg-[var(--color-accent-green)] status-active' : drone.status === 'warning' ? 'bg-[var(--color-accent-yellow)] status-active' : 'bg-[var(--color-accent-red)]'}`}></div>
        <span className="text-xs bg-black/50 px-2 py-1 rounded-md">
          {drone.name} - {drone.status.toUpperCase()}
        </span>
      </div>
      
      {/* Video time/coordinates overlay */}
      <div className="absolute top-2 right-2 z-10">
        <span className="text-xs bg-black/50 px-2 py-1 rounded-md font-mono">
          {new Date().toLocaleTimeString()} | LAT: {drone.position.lat.toFixed(4)} LON: {drone.position.lng.toFixed(4)}
        </span>
      </div>
      
      {/* Battery and altitude overlay */}
      <div className="absolute bottom-12 left-2 z-10 flex flex-col space-y-1">
        <div className="bg-black/50 px-2 py-1 rounded-md flex items-center">
          <div className="w-16 h-2 bg-[var(--color-bg-tertiary)] rounded-full mr-2">
            <div 
              className={`h-full rounded-full ${
                drone.battery > 50 ? 'bg-[var(--color-accent-green)]' : 
                drone.battery > 20 ? 'bg-[var(--color-accent-yellow)]' : 
                'bg-[var(--color-accent-red)]'
              }`} 
              style={{ width: `${drone.battery}%` }}
            ></div>
          </div>
          <span className="text-xs">{drone.battery.toFixed(0)}%</span>
        </div>
        
        <div className="text-xs bg-black/50 px-2 py-1 rounded-md">
          ALT: {drone.altitude.toFixed(0)}m | SPD: {drone.speed.toFixed(0)}km/h
        </div>
      </div>
      
      {/* Video controls */}
      <div className="absolute bottom-2 right-2 z-10 flex items-center space-x-2">
        <button 
          onClick={togglePlay}
          className="bg-black/50 hover:bg-black/70 p-1 rounded-full"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button 
          onClick={toggleMute}
          className="bg-black/50 hover:bg-black/70 p-1 rounded-full"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        {onToggleFullScreen && (
          <button 
            onClick={onToggleFullScreen}
            className="bg-black/50 hover:bg-black/70 p-1 rounded-full"
          >
            <Maximize size={16} />
          </button>
        )}
      </div>
      
      {/* Actual video element */}
      {videoError ? (
        <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
          <div className="text-center">
            <div className="text-sm font-semibold mb-1">Video Feed Unavailable</div>
            <div className="text-xs">{drone.name} feed cannot be displayed</div>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-md"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        >
          <source src={drone.videoFeed} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      )}
      
      {/* Status lines overlay - decorative */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <div className="w-full h-full opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-[var(--color-accent-blue)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-accent-blue)]"></div>
          <div className="absolute top-0 left-0 bottom-0 w-px bg-[var(--color-accent-blue)]"></div>
          <div className="absolute top-0 right-0 bottom-0 w-px bg-[var(--color-accent-blue)]"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;