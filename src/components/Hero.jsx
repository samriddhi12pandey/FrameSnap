import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Hero heading + short description.
 * The upload zone is rendered separately by UploadZone.
 *
 * @param {{ isDark: boolean }} props
 */
export default function Hero({ isDark }) {
  const border = isDark ? "#2A2A2A" : "#E0E0E0";
  const muted = isDark ? "#737373" : "#737373";

  return (
    <>
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
          border: `1px solid ${border}`,
          borderRadius: 999,
          padding: "5px 14px",
          marginBottom: 28,
          fontSize: 13,
          color: muted,
          fontWeight: 500,
        }}
      >
        <Sparkles size={13} />
        Frame-perfect extraction · No limits
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "Syne",
          fontWeight: 800,
          fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: 20,
          color: isDark ? "#FFFFFF" : "#111111",
        }}
      >
        Extract Perfect Frames{" "}
        <span className="gradient-text">From Any Video</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
          color: muted,
          lineHeight: 1.7,
          marginBottom: 40,
          maxWidth: 560,
          margin: "0 auto 40px",
        }}
      >
        Upload a video, choose the exact moment, and download high-quality
        images instantly. No server uploads — everything runs in your browser.
      </motion.p>
    </>
  );
}
