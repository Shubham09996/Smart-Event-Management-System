// components/BackgroundFlow.jsx
import { useState } from "react";

export default function BackgroundFlow({ children }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Cursor Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            500px circle at ${cursor.x}px ${cursor.y}px,
            rgba(99,102,241,0.15),
            transparent 70%
          )`,
        }}
      />

      {children}
    </div>
  );
}
