import { useState, useRef, useCallback } from "react";
import {
  formatTime,
  timestampToFilename,
  generateFrameId,
  loadJSZip,
  triggerDownload,
} from "../utils/frameUtils.js";

/**
 * Custom hook encapsulating all frame extraction, management,
 * and download logic.
 *
 * @param {{ add: Function }} toast - toast notification handle
 * @returns {object}
 */
export function useFrameExtractor(toast) {
  const [frames, setFrames] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(0.92);
  const [multiInterval, setMultiInterval] = useState(2);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [exportedCount, setExportedCount] = useState(0);

  const canvasRef = useRef(null);

  /**
   * Core frame capture: draws the current video frame (or a specific
   * timestamp) onto a hidden canvas and converts it to a dataURL.
   *
   * @param {HTMLVideoElement} videoEl
   * @param {number|null} t - optional timestamp in seconds
   * @returns {Promise<object|null>}
   */
  const captureFrame = useCallback(
    (videoEl, t = null) => {
      const canvas = canvasRef.current;
      if (!videoEl || !canvas) return Promise.resolve(null);

      return new Promise((resolve) => {
        const doCapture = () => {
          canvas.width = videoEl.videoWidth;
          canvas.height = videoEl.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoEl, 0, 0);
          const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
          const dataUrl = canvas.toDataURL(mimeType, quality);
          const ts = t !== null ? t : videoEl.currentTime;
          const frame = {
            id: generateFrameId(),
            dataUrl,
            timestamp: ts,
            width: videoEl.videoWidth,
            height: videoEl.videoHeight,
            format,
          };
          setFrames((prev) => [frame, ...prev]);
          resolve(frame);
        };

        if (t !== null) {
          videoEl.currentTime = t;
          videoEl.onseeked = () => {
            doCapture();
            videoEl.onseeked = null;
          };
        } else {
          doCapture();
        }
      });
    },
    [format, quality]
  );

  /**
   * Extract the frame at the current video position.
   * @param {HTMLVideoElement} videoEl
   */
  const extractCurrentFrame = async (videoEl) => {
    setExtracting(true);
    setProgress(0);
    await new Promise((res) => setTimeout(res, 300));
    await captureFrame(videoEl);
    setProgress(100);
    setExtracting(false);
    toast.add("Frame extracted!", "success");
  };

  /**
   * Seek to a specific timestamp and extract a frame.
   * @param {HTMLVideoElement} videoEl
   * @param {string} customTs - raw string from input
   * @param {number} duration
   */
  const extractAtTimestamp = async (videoEl, customTs, duration) => {
    const t = parseFloat(customTs);
    if (isNaN(t) || t < 0 || t > duration) {
      toast.add("Invalid timestamp.", "error");
      return;
    }
    setExtracting(true);
    await captureFrame(videoEl, t);
    setExtracting(false);
    toast.add(`Frame at ${formatTime(t)} extracted!`, "success");
  };

  /**
   * Extract one frame every N seconds across the full video duration.
   * @param {HTMLVideoElement} videoEl
   * @param {number} duration
   */
  const extractMultiple = async (videoEl, duration) => {
    setExtracting(true);
    const times = [];
    for (let t = 0; t < duration; t += multiInterval) times.push(+t.toFixed(3));
    toast.add(`Extracting ${times.length} frames…`, "info");

    for (let i = 0; i < times.length; i++) {
      await captureFrame(videoEl, times[i]);
      setProgress(Math.round(((i + 1) / times.length) * 100));
    }
    setExtracting(false);
    toast.add(`${times.length} frames extracted!`, "success");
  };

  /**
   * Download a single frame as a file.
   * @param {object} frame
   */
  const downloadFrame = (frame) => {
    triggerDownload(
      frame.dataUrl,
      `frame_${timestampToFilename(frame.timestamp)}.${frame.format}`
    );
    setExportedCount((p) => p + 1);
    toast.add("Frame downloaded!", "success");
  };

  /**
   * Bundle all captured frames into a ZIP and download it.
   */
  const downloadAll = async () => {
    if (!frames.length) return;
    setBulkLoading(true);
    toast.add("Preparing ZIP download…", "info");

    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      frames.forEach((f, i) => {
        const base64 = f.dataUrl.split(",")[1];
        zip.file(
          `frame_${String(i + 1).padStart(3, "0")}_${timestampToFilename(f.timestamp)}.${f.format}`,
          base64,
          { base64: true }
        );
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "frames.zip");
      setExportedCount((p) => p + frames.length);
      toast.add("ZIP downloaded!", "success");
    } catch {
      // Fallback: download individually if JSZip fails
      frames.forEach((f) => downloadFrame(f));
    }

    setBulkLoading(false);
  };

  /**
   * Remove a single frame from the gallery by ID.
   * @param {number} id
   */
  const deleteFrame = (id) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
    toast.add("Frame removed.", "info");
  };

  /**
   * Clear all frames and reset related state.
   */
  const clearFrames = () => {
    setFrames([]);
    setProgress(0);
    setExportedCount(0);
  };

  return {
    // state
    frames,
    extracting,
    progress,
    format,
    setFormat,
    quality,
    setQuality,
    multiInterval,
    setMultiInterval,
    bulkLoading,
    exportedCount,
    canvasRef,
    // actions
    extractCurrentFrame,
    extractAtTimestamp,
    extractMultiple,
    downloadFrame,
    downloadAll,
    deleteFrame,
    clearFrames,
  };
}
