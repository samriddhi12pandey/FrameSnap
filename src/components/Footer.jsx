import { Film, Twitter, Github, Linkedin } from "lucide-react";

/**
 * Site footer with logo, social links, and copyright.
 *
 * @param {{ isDark: boolean }} props
 */
export default function Footer({ isDark }) {
  const border = isDark ? "#2A2A2A" : "#E0E0E0";
  const text = isDark ? "#FFFFFF" : "#111111";
  const muted = isDark ? "#737373" : "#737373";

  const socialIcons = [<Twitter size={16} />, <Github size={16} />, <Linkedin size={16} />];

  return (
    <footer
      style={{
        width: "100%",
        maxWidth: 1100,
        borderTop: `1px solid ${border}`,
        marginTop: 80,
        paddingTop: 32,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
       
        <span
          style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: text }}
        >
        </span>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 8 }}>
        {socialIcons.map((icon, i) => (
          <button
            key={i}
            style={{
              width: 34,
              height: 34,
              border: `1px solid ${border}`,
              background: "transparent",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: muted,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#A3A3A3";
              e.currentTarget.style.color = text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = muted;
            }}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Copyright */}
      <span style={{ color: muted, fontSize: 13 }}>
        © 2026 Samriddhi's Project · Open-source
      </span>
    </footer>
  );
}
