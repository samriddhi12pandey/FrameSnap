import { useState, useRef, useEffect } from "react";

/**
 * Custom hook encapsulating video player state and controls.
 *
 * @returns {object}
 */
export function useVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
  };

  const seek = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, currentTime + delta));
  };

  const seekTo = (time) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = time;
    setCurrentTime(time);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // Video element event handler props – spread these directly onto <video>
  const videoEvents = {
    onTimeUpdate: (e) => setCurrentTime(e.target.currentTime),
    onLoadedMetadata: (e) => setDuration(e.target.duration),
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onEnded: () => setIsPlaying(false),
  };

  return {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    seekTo,
    reset,
    videoEvents,
  };
}
