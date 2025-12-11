import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    const followerParticles = [];
    const numParticles = 120;
    const numFollowers = 12;
    let mouse = { x: 0, y: 0 };

    // 🖥️ Responsif terhadap ukuran layar
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);
    resize();

    // 🌌 Partikel utama (bergerak random)
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        baseSpeedX: 0, // kecepatan awal (untuk pemulihan)
        baseSpeedY: 0,
        alpha: 0.25 + Math.random() * 0.4,
      });
    }

    // 🌠 Partikel pengikut cursor
    for (let i = 0; i < numFollowers; i++) {
      followerParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: 6 + Math.random() * 3,
        alpha: 0.25 + Math.random() * 0.3,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 🔹 Partikel utama: bergerak random + menjauh saat cursor mendekat
      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 120; // radius pengaruh cursor

        if (dist < radius) {
          // arah menjauh
          const angle = Math.atan2(dy, dx);
          const force = (radius - dist) / radius;
          p.x += Math.cos(angle) * force * 3; // gerak menjauh halus
          p.y += Math.sin(angle) * force * 3;
        }

        // gerak random alami
        p.x += p.speedX;
        p.y += p.speedY;

        // bouncing halus di tepi
        if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });

      // ✨ Partikel pengikut cursor (tidak diubah)
      followerParticles.forEach((f, i) => {
        const targetX = mouse.x;
        const targetY = mouse.y;
        const dx = targetX - f.x;
        const dy = targetY - f.y;

        f.x += dx * (0.01 + i * 0.002);
        f.y += dy * (0.01  + i * 0.002);

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 2.5);
        gradient.addColorStop(0, `rgba(220,230,255,${f.alpha})`);
        gradient.addColorStop(1, `rgba(150,100,255,0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    drawParticles();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
    
  );
};

export default ParticleBackground;
