import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowRight } from "lucide-react";

/**
 * Drag-and-drop / click-to-browse upload area + upload button.
 *
 * @param {{
 *   isDark: boolean,
 *   onFile: (file: File) => void
 * }} props
 */
export default function UploadZone({ isDark, onFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const border = isDark ? "#2A2A2A" : "#E0E0E0";
  const surface = isDark ? "#1A1A1A" : "#FFFFFF";

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? "#FFFFFF" : border}`,
          borderRadius: 20,
          padding: "52px 32px",
          cursor: "pointer",
          transition: "all 0.3s",
          background: isDragging ? "rgba(255,255,255,0.04)" : surface,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isDragging && (
          <div
            className="shimmer"
            style={{ position: "absolute", inset: 0, borderRadius: 18 }}
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <motion.div animate={{ y: isDragging ? -4 : 0 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: isDark ? "#2A2A2A" : "#E5E5E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Upload size={24} color={isDark ? "#FFFFFF" : "#111111"} />
          </div>
          <p
            style={{
              fontWeight: 600,
              fontSize: 17,
              marginBottom: 6,
              color: isDark ? "#FFFFFF" : "#111111",
            }}
          >
            Drop your video here
          </p>
          <p style={{ color: isDark ? "#737373" : "#737373", fontSize: 14 }}>
            or click to browse · MP4, MOV, AVI, MKV, WebM
          </p>
        </motion.div>
      </div>

      {/* Upload Button */}
      <button
        className="btn-primary"
        style={{
          borderRadius: 12,
          padding: "14px 32px",
          fontSize: 15,
          marginTop: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} />
        Upload Video
        <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}
