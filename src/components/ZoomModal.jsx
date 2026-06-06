import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { formatTime } from "../utils/frameUtils.js";

/**
 * Fullscreen zoom overlay for a single frame.
 *
 * @param {{
 *   frame: object|null,
 *   onClose: Function,
 *   onDownload: Function
 * }} props
 */
export default function ZoomModal({ frame, onClose, onDownload }) {
  return (
    <AnimatePresence>
      {frame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}
          >
            <img
              src={frame.dataUrl}
              alt="frame"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: 12,
                display: "block",
              }}
            />
            {/* Actions */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 8,
              }}
            >
              <button
                className="btn-primary"
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onClick={() => onDownload(frame)}
              >
                <Download size={14} />
                Download
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                  borderRadius: 8,
                  padding: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>
            {/* Timestamp badge */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(0,0,0,0.7)",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                color: "#94A3B8",
              }}
            >
              {formatTime(frame.timestamp)} · {frame.width}×{frame.height}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
