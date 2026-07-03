import { useEffect, useRef } from "react";

interface BackgroundEffectsProps {
  isUnlocked: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  fadeSpeed: number;
  life: number;
  maxLife: number;
  type: "heart" | "sparkle" | "star" | "confetti";
  rotation?: number;
  rotationSpeed?: number;
  sway?: number;
  swaySpeed?: number;
}

export default function BackgroundEffects({ isUnlocked }: BackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hasExplodedRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial pool of peaceful floating particles
    const particles: Particle[] = [];
    const colors = [
      "rgba(244, 63, 94, opacity)", // Rose
      "rgba(236, 72, 153, opacity)", // Pink
      "rgba(168, 85, 247, opacity)", // Purple
      "rgba(234, 179, 8, opacity)",  // Gold
      "rgba(59, 130, 246, opacity)"  // Blue
    ];

    const createPeacefulParticle = (fromBottom = false): Particle => {
      const typeRand = Math.random();
      let type: "heart" | "sparkle" | "star" = "star";
      if (typeRand < 0.35) {
        type = "heart";
      } else if (typeRand < 0.7) {
        type = "sparkle";
      }

      const size = type === "heart" ? 8 + Math.random() * 12 : 2 + Math.random() * 5;
      const x = Math.random() * canvas.width;
      const y = fromBottom ? canvas.height + 20 : Math.random() * canvas.height;

      const speedY = type === "heart" ? -(0.3 + Math.random() * 0.7) : -(0.1 + Math.random() * 0.4);
      const speedX = (Math.random() - 0.5) * 0.3;

      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        color: randomColor,
        opacity: 0.1 + Math.random() * 0.5,
        fadeSpeed: 0.001 + Math.random() * 0.003,
        life: 0,
        maxLife: 300 + Math.random() * 400,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02
      };
    };

    // Populate initial particles
    for (let i = 0; i < 60; i++) {
      particles.push(createPeacefulParticle(false));
    }

    // Helper to draw hearts on canvas
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.beginPath();
      
      const width = size;
      const height = size;
      
      context.moveTo(0, height / 4);
      context.bezierCurveTo(width / 2, -height / 2, width, height / 3, 0, height);
      context.bezierCurveTo(-width, height / 3, -width / 2, -height / 2, 0, height / 4);
      
      context.fillStyle = color;
      context.fill();
      context.restore();
    };

    // Helper to draw sparkles/stars
    const drawSparkle = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string
    ) => {
      context.save();
      context.beginPath();
      for (let i = 0; i < 4; i++) {
        context.lineTo(
          x + Math.cos((i * Math.PI) / 2) * size,
          y + Math.sin((i * Math.PI) / 2) * size
        );
        context.lineTo(
          x + Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35),
          y + Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35)
        );
      }
      context.closePath();
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = size * 1.5;
      context.fill();
      context.restore();
    };

    // Trigger Heart & Confetti Explosion
    const triggerExplosion = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Add 120 intense particles radiating outwards
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 6.5;
        const typeRand = Math.random();
        let type: "heart" | "confetti" | "sparkle" = "confetti";
        
        if (typeRand < 0.45) {
          type = "heart";
        } else if (typeRand < 0.7) {
          type = "sparkle";
        }

        const size = type === "heart" ? 10 + Math.random() * 15 : 4 + Math.random() * 8;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: centerX,
          y: centerY,
          size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - (0.5 + Math.random() * 1.5), // slightly float up
          color: randomColor,
          opacity: 0.9,
          fadeSpeed: 0.008 + Math.random() * 0.012, // fade faster than ambient
          life: 0,
          maxLife: 150 + Math.random() * 100,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.05
        });
      }
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle the transition burst trigger
      if (isUnlocked && !hasExplodedRef.current) {
        triggerExplosion();
        hasExplodedRef.current = true;
      }

      // Draw light rays centered behind the main card (soft ambient glows)
      const gradientCenter = {
        x: canvas.width / 2,
        y: canvas.height * 0.45
      };

      const radialGlow = ctx.createRadialGradient(
        gradientCenter.x,
        gradientCenter.y,
        50,
        gradientCenter.x,
        gradientCenter.y,
        Math.max(canvas.width, canvas.height) * 0.6
      );
      
      // Soft radial glow depth
      radialGlow.addColorStop(0, "rgba(23, 14, 52, 0.45)");
      radialGlow.addColorStop(0.5, "rgba(11, 8, 22, 0.2)");
      radialGlow.addColorStop(1, "rgba(5, 4, 10, 0.0)");
      
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Physics behavior
        if (p.type === "confetti" || p.life > 0 && isUnlocked && p.fadeSpeed > 0.005) {
          // explosion physics: add air friction and gravity
          p.speedX *= 0.98;
          p.speedY = p.speedY * 0.98 + 0.04; // mild gravity for confetti
        } else {
          // peaceful float physics
          if (p.sway !== undefined && p.swaySpeed !== undefined) {
            p.sway += p.swaySpeed;
            p.x += Math.sin(p.sway) * 0.2;
          }
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Fade handling
        if (p.life > p.maxLife * 0.6) {
          p.opacity -= p.fadeSpeed;
        }

        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        // Remove dead particles
        if (p.opacity <= 0 || p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
          particles.splice(i, 1);
          // Replace with a peaceful one if we are below baseline, and not during explosion transition
          if (particles.length < 70 && !isUnlocked) {
            particles.push(createPeacefulParticle(true));
          }
          continue;
        }

        // Draw particle
        const renderColor = p.color.replace("opacity", p.opacity.toFixed(3));
        
        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size, renderColor, p.rotation || 0);
        } else if (p.type === "sparkle") {
          drawSparkle(ctx, p.x, p.y, p.size, renderColor);
        } else if (p.type === "star") {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = renderColor;
          ctx.fill();
          ctx.restore();
        } else if (p.type === "confetti") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          ctx.beginPath();
          ctx.rect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.fillStyle = renderColor;
          ctx.fill();
          ctx.restore();
        }
      }

      particlesRef.current = particles;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isUnlocked]);

  return (
    <canvas
      ref={canvasRef}
      id="background-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
