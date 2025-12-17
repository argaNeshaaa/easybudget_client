import { useState } from "react";
import ParticleBackground from "./ParticleBackground";
import "../../assets/styles/global.css"
function OverlayBackground() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="layerOverlaya absolute inset-0 scale-105 blur-md bg-pattern"> </div>

      <div className="layerOverlayb absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 z-1"></div>

      <div className="absolute inset-0 opacity-60 z-2">
        <ParticleBackground />
      </div>

      <div className="absolute inset-0  backdrop-blur-sm z-3"></div>
    </>
  );
}

export default OverlayBackground;
