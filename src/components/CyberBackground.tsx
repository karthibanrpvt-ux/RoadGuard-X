import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Data Stream Particles
    const particles: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1 + Math.random() * 3,
        length: 50 + Math.random() * 150,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.strokeStyle = '#00baff';
      ctx.lineWidth = 1;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.length);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, `rgba(0, 186, 255, ${p.opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.stroke();

        p.y += p.speed;
        if (p.y > height) {
          p.y = -p.length;
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[-1] opacity-40"
      />
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-[-2] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,186,255,0.05)_0%,_transparent_70%)]" />
    </>
  );
};

export default CyberBackground;
