import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import UploadZone from "./components/UploadZone.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import ZoomModal from "./components/ZoomModal.jsx";
import Workspace from "./components/Workspace.jsx";

import { useToast } from "./hooks/useToast.js";
import { useVideoPlayer } from "./hooks/useVideoPlayer.js";
import { useFrameExtractor } from "./hooks/useFrameExtractor.js";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [video, setVideo] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [zoom, setZoom] = useState(null);

  const isDark = theme === "dark";
  const toast = useToast();
  const player = useVideoPlayer();
  const extractor = useFrameExtractor(toast);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (!video) return;
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); player.togglePlay(); }
      if (e.code === "ArrowLeft") player.seek(-0.1);
      if (e.code === "ArrowRight") player.seek(0.1);
      if (e.code === "KeyC") extractor.extractCurrentFrame(player.videoRef.current);
      if (e.code === "Escape") setZoom(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [video, player, extractor]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("video/")) {
      toast.add("Please upload a valid video file.", "error");
      return;
    }
    const url = URL.createObjectURL(file);
    setVideo(url);
    setVideoMeta({ name: file.name, size: file.size, type: file.type });
    player.reset();
    extractor.clearFrames();
    setActiveSection("workspace");
    toast.add("Video loaded successfully!", "success");
  };

  const handleNewVideo = () => {
    setVideo(null);
    setVideoMeta(null);
    player.reset();
    extractor.clearFrames();
    setActiveSection("hero");
  };

  const bg = isDark ? "#111111" : "#F5F5F5";
  const text = isDark ? "#FFFFFF" : "#111111";

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}>
      {/* Hidden canvas for frame capture */}
      <canvas ref={extractor.canvasRef} style={{ display: "none" }} />

      {/* Global overlays */}
      <Toast toasts={toast.toasts} remove={toast.remove} />
      <ZoomModal
        frame={zoom}
        onClose={() => setZoom(null)}
        onDownload={extractor.downloadFrame}
      />

      {/* Fixed header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
        hasVideo={!!video}
        onNewVideo={handleNewVideo}
      />

      <div style={{ paddingTop: 60 }}>
        <AnimatePresence mode="wait">

          {/* ── Hero / Landing ── */}
          {activeSection === "hero" && (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                minHeight: "calc(100vh - 60px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ maxWidth: 720, textAlign: "center", position: "relative" }}>
                <Hero isDark={isDark} />
                <UploadZone isDark={isDark} onFile={handleFile} />
              </div>

              {/* Footer sits below upload area */}
              <Footer isDark={isDark} />
            </motion.section>
          )}

          {/* ── Workspace ── */}
          {activeSection === "workspace" && video && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Workspace
                isDark={isDark}
                videoUrl={video}
                videoMeta={videoMeta}
                player={player}
                extractor={extractor}
                onZoom={setZoom}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
