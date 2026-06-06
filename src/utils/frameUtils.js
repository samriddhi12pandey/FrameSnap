/**
 * Format a time value (in seconds) into MM:SS.mmm display string.
 * @param {number} s - seconds
 * @returns {string}
 */
export function formatTime(s) {
  if (isNaN(s)) return "00:00.000";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

/**
 * Format a byte count into a human-readable size string.
 * @param {number} b - bytes
 * @returns {string}
 */
export function formatSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

/**
 * Convert a timestamp string to a safe filename fragment.
 * @param {number} timestamp
 * @returns {string}
 */
export function timestampToFilename(timestamp) {
  return formatTime(timestamp).replace(/[:.]/g, "-");
}

/**
 * Generate a unique frame ID.
 * @returns {number}
 */
export function generateFrameId() {
  return Date.now() + Math.random();
}

/**
 * Dynamically load JSZip from CDN and return the constructor.
 * Resolves with window.JSZip or rejects on failure.
 * @returns {Promise<typeof window.JSZip>}
 */
export function loadJSZip() {
  return new Promise((resolve, reject) => {
    if (window.JSZip) {
      resolve(window.JSZip);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error("Failed to load JSZip"));
    document.head.appendChild(script);
  });
}

/**
 * Trigger a browser download for a given Blob/URL.
 * @param {string} url
 * @param {string} filename
 */
export function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
