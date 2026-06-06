import { Film, Sun, Moon, RotateCcw } from "lucide-react";

/**
 * Top navigation bar.
 *
 * @param {{ isDark: boolean, onToggleTheme: Function, hasVideo: boolean, onNewVideo: Function }} props
 */
export default function Header({ isDark, onToggleTheme, hasVideo, onNewVideo }) {
  const border = isDark ? "#2A2A2A" : "#E0E0E0";
  const text = isDark ? "#FFFFFF" : "#111111";

  return (
    <nav
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: `1px solid ${border}`,
        background: isDark ? "rgba(17,17,17,0.90)" : "rgba(245,245,245,0.90)",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Film size={16} color="#111111" />
          </div>
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.01em",
              color: text,
            }}
          >
            FrameSnap
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hasVideo && (
            <button
              className="btn-ghost"
              style={{
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                border: `1px solid ${border}`,
                color: text,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onClick={onNewVideo}
            >
              <RotateCcw size={13} />
              New Video
            </button>
          )}
          <button
            onClick={onToggleTheme}
            style={{
              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
              border: `1px solid ${border}`,
              borderRadius: 8,
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: text,
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
