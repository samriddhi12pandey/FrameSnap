import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Sparkles, X } from "lucide-react";

/**
 * Toast notification stack, rendered in a fixed overlay.
 *
 * @param {{ toasts: Array, remove: Function }} props
 */
export default function Toast({ toasts, remove }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              fontSize: 14,
              fontWeight: 500,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#FFFFFF",
            }}
          >
            {t.type === "success" ? (
              <CheckCircle size={15} />
            ) : t.type === "error" ? (
              <AlertCircle size={15} />
            ) : (
              <Sparkles size={15} />
            )}
            {t.message}
            <button
              onClick={() => remove(t.id)}
              style={{
                marginLeft: 4,
                opacity: 0.6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
