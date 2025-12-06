import React, { useEffect, useRef } from "react";

export default function MatrixCanvas({ opacity = 0.12, fullScreen = true }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    const updateCanvas = () => {
      const container = canvas.parentElement;
      let w, h;
      if (fullScreen) {
        w = window.innerWidth;
        h = window.innerHeight;
      } else {
        const rect = container.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
      }
      canvas.width = w;
      canvas.height = h;

      const cols = Math.floor(w / 14) + 1;
      const ypos = Array(cols).fill(0);

      const draw = () => {
        ctx.fillStyle = `rgba(0,0,0,${opacity})`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#00FF41";
        ctx.font = "14px monospace";
        for (let i = 0; i < ypos.length; i++) {
          const text = String.fromCharCode(0x30a0 + Math.random() * 96);
          ctx.fillText(text, i * 14, ypos[i] * 14);
          if (ypos[i] * 14 > h && Math.random() > 0.975) ypos[i] = 0;
          ypos[i]++;
        }
      };
      draw(); // Initial draw

      const id = setInterval(draw, 45);

      if (fullScreen) {
        const onResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        return () => {
          clearInterval(id);
          window.removeEventListener("resize", onResize);
        };
      } else {
        // For non-fullscreen mode, just clear on unmount
        return () => {
          clearInterval(id);
        };
      }
    };

    updateCanvas();
  }, [opacity, fullScreen]);

  const canvasStyle = fullScreen
    ? { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }
    : { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" };

  return (
    <canvas
      ref={ref}
      style={canvasStyle}
    />
  );
}
