import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Camera, Download,
  Trash2, ZoomIn, Archive, Clock, Layers, BarChart2,
  Scissors, LayoutGrid, Monitor, ArrowRight,
} from "lucide-react";
import { formatTime, formatSize } from "../utils/frameUtils.js";

/**
 * Full workspace: stats bar, video player, extraction tools, frame gallery.
 *
 * @param {{
 *   isDark: boolean,
 *   videoUrl: string,
 *   videoMeta: object,
 *   player: object,        // from useVideoPlayer
 *   extractor: object,     // from useFrameExtractor
 *   onZoom: Function
 * }} props
 */
export default function Workspace({ isDark, videoUrl, videoMeta, player, extractor, onZoom }) {
  const [customTs, setCustomTs] = useState("");

  const border = isDark ? "#2A2A2A" : "#E0E0E0";
  const surface = isDark ? "#1A1A1A" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#111111";
  const muted = isDark ? "#737373" : "#737373";

  const {
    videoRef, isPlaying, currentTime, duration,
    togglePlay, seek, seekTo, videoEvents,
  } = player;

  const {
    frames, extracting, progress, format, setFormat, quality, setQuality,
    multiInterval, setMultiInterval, bulkLoading, exportedCount,
    extractCurrentFrame, extractAtTimestamp, extractMultiple,
    downloadFrame, downloadAll, deleteFrame,
  } = extractor;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px 60px" }}
    >
      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { icon: <Clock size={16} />, label: "Duration", value: formatTime(duration) },
          { icon: <Camera size={16} />, label: "Frames Captured", value: frames.length },
          { icon: <Download size={16} />, label: "Downloaded", value: exportedCount },
          { icon: <BarChart2 size={16} />, label: "Status", value: extracting ? "Processing…" : "Ready" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass"
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: muted, fontSize: 12, marginBottom: 6 }}>
              {s.icon}{s.label}
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, fontFamily: "Syne", color: text }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

        {/* LEFT: video player + extraction tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Video player */}
          <div className="glass" style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, overflow: "hidden", position: "relative" }}>
            <video
              ref={videoRef}
              src={videoUrl}
              style={{ width: "100%", display: "block", borderRadius: "20px 20px 0 0", background: "#000", maxHeight: 480, objectFit: "contain" }}
              {...videoEvents}
            />
            {/* Time overlay */}
            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#94A3B8", fontFamily: "monospace" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Controls */}
            <div style={{ padding: "16px 20px 20px" }}>
              {/* Timeline */}
              <input
                type="range" min={0} max={duration || 100} step={0.001} value={currentTime}
                style={{
                  background: `linear-gradient(to right, #FFFFFF ${(currentTime / (duration || 1)) * 100}%, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 0)`,
                  marginBottom: 14,
                }}
                onChange={(e) => seekTo(+e.target.value)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className="btn-ghost"
                  style={{ borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 5, fontSize: 13, border: `1px solid ${border}`, color: text }}
                  onClick={() => seek(-5)}>
                  <SkipBack size={15} />5s
                </button>
                <button className="btn-primary"
                  style={{ borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={togglePlay}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="btn-ghost"
                  style={{ borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 5, fontSize: 13, border: `1px solid ${border}`, color: text }}
                  onClick={() => seek(5)}>
                  5s<SkipForward size={15} />
                </button>
                <div style={{ marginLeft: "auto", color: muted, fontSize: 12 }}>
                  ← → seek · Space play · C capture
                </div>
              </div>
            </div>
          </div>

          {/* Extraction tools */}
          <div className="glass" style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: text }}>
              <Scissors size={16} color={muted} /> Extraction Tools
            </h3>

            {/* Progress bar */}
            {extracting && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: muted, marginBottom: 6 }}>
                  <span>Processing…</span><span>{progress}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: "#FFFFFF", borderRadius: 999 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Format + Quality */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 6, fontWeight: 500 }}>Format</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["png", "jpg"].map((f) => (
                    <button key={f} onClick={() => setFormat(f)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
                        border: `1px solid ${format === f ? "#FFFFFF" : border}`,
                        background: format === f ? (isDark ? "#FFFFFF" : "#111111") : "transparent",
                        color: format === f ? (isDark ? "#111111" : "#FFFFFF") : muted,
                        transition: "all 0.2s",
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: muted, display: "block", marginBottom: 6, fontWeight: 500 }}>
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input type="range" min={0.5} max={1} step={0.01} value={quality}
                  style={{ background: `linear-gradient(to right, #FFFFFF ${(quality - 0.5) / 0.5 * 100}%, ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 0)` }}
                  onChange={(e) => setQuality(+e.target.value)}
                />
              </div>
            </div>

            <div style={{ height: 1, background: border, margin: "16px 0" }} />

            {/* Actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button className="btn-primary"
                style={{ borderRadius: 10, padding: "10px 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}
                onClick={() => extractCurrentFrame(videoRef.current)}
                disabled={extracting}>
                <Camera size={15} /> Capture Frame
              </button>

              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="number" placeholder="Timestamp (s)" value={customTs}
                  onChange={(e) => setCustomTs(e.target.value)}
                  style={{ width: 130, padding: "9px 12px", borderRadius: 10, border: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: text, fontSize: 13, fontFamily: "inherit", outline: "none" }}
                />
                <button className="btn-ghost"
                  style={{ borderRadius: 10, padding: "9px 14px", fontSize: 13, border: `1px solid ${border}`, color: text, display: "flex", alignItems: "center" }}
                  onClick={() => extractAtTimestamp(videoRef.current, customTs, duration)}>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: muted, fontWeight: 500 }}>Every</span>
                <input type="number" min={0.5} step={0.5} value={multiInterval}
                  onChange={(e) => setMultiInterval(+e.target.value)}
                  style={{ width: 64, padding: "9px 10px", borderRadius: 10, border: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: text, fontSize: 13, fontFamily: "inherit", outline: "none", textAlign: "center" }}
                />
                <span style={{ fontSize: 12, color: muted, fontWeight: 500 }}>sec</span>
                <button className="btn-ghost"
                  style={{ borderRadius: 10, padding: "9px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, border: `1px solid ${border}`, color: text }}
                  onClick={() => extractMultiple(videoRef.current, duration)}
                  disabled={extracting}>
                  <Layers size={14} /> Bulk Extract
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: video info + latest frame */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Video info */}
          <div className="glass" style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8, color: text }}>
              <Monitor size={15} color={muted} /> Video Details
            </h3>
            {[
              ["File", videoMeta?.name?.substring(0, 22) + (videoMeta?.name?.length > 22 ? "…" : "")],
              ["Size", formatSize(videoMeta?.size || 0)],
              ["Duration", formatTime(duration)],
              ["Resolution", videoRef.current?.videoWidth ? `${videoRef.current.videoWidth}×${videoRef.current.videoHeight}` : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "7px 0", borderBottom: `1px solid ${border}` }}>
                <span style={{ color: muted }}>{k}</span>
                <span style={{ fontWeight: 500, color: text }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Latest frame preview */}
          {frames[0] && (
            <div className="glass" style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 16 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, marginBottom: 12, color: muted }}>Latest Frame</h3>
              <div
                style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer" }}
                onClick={() => onZoom(frames[0])}
                onMouseEnter={(e) => { e.currentTarget.querySelector(".zoom-overlay").style.background = "rgba(0,0,0,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.querySelector(".zoom-overlay").style.background = "rgba(0,0,0,0)"; }}
              >
                <img src={frames[0].dataUrl} alt="latest" style={{ width: "100%", display: "block", borderRadius: 10 }} />
                <div className="zoom-overlay"
                  style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ZoomIn size={24} color="white" />
                </div>
                <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#94A3B8" }}>
                  {formatTime(frames[0].timestamp)}
                </div>
              </div>
              <button className="btn-primary"
                style={{ width: "100%", borderRadius: 10, padding: "9px", fontSize: 13, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                onClick={() => downloadFrame(frames[0])}>
                <Download size={14} /> Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Frame Gallery ─────────────────────────────────────────────────── */}
      {frames.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", gap: 10, color: text }}>
              <LayoutGrid size={18} color={muted} /> Frame Gallery
              <span style={{ fontSize: 14, fontWeight: 400, color: muted, fontFamily: "DM Sans" }}>· {frames.length} frames</span>
            </h2>
            <button className="btn-primary"
              style={{ borderRadius: 10, padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}
              onClick={downloadAll}
              disabled={bulkLoading}>
              <Archive size={14} /> {bulkLoading ? "Preparing…" : "Download All ZIP"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            <AnimatePresence>
              {frames.map((frame, idx) => (
                <motion.div
                  key={frame.id} layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  className="glass"
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", position: "relative", cursor: "pointer" }}
                  whileHover={{ y: -3, borderColor: "#A3A3A3" }}
                >
                  <div onClick={() => onZoom(frame)} style={{ position: "relative" }}>
                    <img src={frame.dataUrl} alt={`frame-${idx}`}
                      style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
                    <div
                      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                    >
                      <ZoomIn size={20} color="rgba(255,255,255,0.8)" />
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 11, color: muted, marginBottom: 2 }}>#{String(frames.length - idx).padStart(3, "0")}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace", color: text }}>{formatTime(frame.timestamp)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => downloadFrame(frame)}
                        style={{ width: 30, height: 30, border: `1px solid ${border}`, background: "transparent", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: muted, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A3A3A3"; e.currentTarget.style.color = text; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; }}
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => deleteFrame(frame.id)}
                        style={{ width: 30, height: 30, border: `1px solid ${border}`, background: "transparent", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: muted, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
