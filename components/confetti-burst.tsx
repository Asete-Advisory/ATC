"use client";

import { useEffect, useRef } from "react";

type ConfettiBurstProps = {
  /** Muda o valor para disparar uma nova explosão. */
  fireKey: number;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  shape: "rect" | "circle";
  wobble: number;
};

// Paleta da marca: teal, azul do CTA do header, navy claro, branco e um dourado de recompensa.
const colors = ["#3fc1dd", "#2f6fd6", "#9fdcff", "#ffffff", "#f5c451", "#f5c451"];
const DURATION = 3200;
const GRAVITY = 0.32;
const DRAG = 0.985;

export function ConfettiBurst({ fireKey, className }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fireKey) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    // Espera um frame: o canvas pode montar antes de o <dialog> ficar visível.
    const begin = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 640 ? 110 : 180;

      // Dois canhões nas laterais inferiores, mirando o centro, mais um estouro central.
      const origins = [
        { x: width * 0.08, y: height * 0.9, angle: -Math.PI / 3 },
        { x: width * 0.92, y: height * 0.9, angle: (-2 * Math.PI) / 3 },
        { x: width * 0.5, y: height * 0.35, angle: -Math.PI / 2 },
      ];

      const particles: Particle[] = Array.from({ length: count }, (_, index) => {
        const origin = origins[index % origins.length];
        const isCenter = index % origins.length === 2;
        const spread = isCenter ? Math.PI : Math.PI / 4;
        const angle = origin.angle + (Math.random() - 0.5) * spread;
        const speed = isCenter
          ? 4 + Math.random() * 7
          : 13 + Math.random() * 9 * Math.min(height / 800, 1.2);

        return {
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 6,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.3 ? "rect" : "circle",
          wobble: Math.random() * Math.PI * 2,
        };
      });

      const start = performance.now();

      const draw = (now: number) => {
        const elapsed = now - start;
        context.clearRect(0, 0, width, height);
        const fade = Math.max(0, 1 - Math.max(0, elapsed - DURATION * 0.6) / (DURATION * 0.4));

        for (const particle of particles) {
          particle.vx *= DRAG;
          particle.vy = particle.vy * DRAG + GRAVITY;
          particle.wobble += 0.12;
          particle.x += particle.vx + Math.sin(particle.wobble) * 0.6;
          particle.y += particle.vy;
          particle.rotation += particle.spin;

          context.save();
          context.globalAlpha = fade;
          context.translate(particle.x, particle.y);
          context.rotate(particle.rotation);
          context.fillStyle = particle.color;

          if (particle.shape === "rect") {
            // Achata no eixo Y para simular o papel girando.
            const flip = Math.abs(Math.cos(particle.wobble));
            context.fillRect(
              -particle.size / 2,
              (-particle.size * 0.4 * flip) / 2,
              particle.size,
              particle.size * 0.4 * flip + 1,
            );
          } else {
            context.beginPath();
            context.arc(0, 0, particle.size * 0.32, 0, Math.PI * 2);
            context.fill();
          }

          context.restore();
        }

        if (elapsed < DURATION) {
          frame = requestAnimationFrame(draw);
        } else {
          context.clearRect(0, 0, width, height);
        }
      };

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(begin);

    return () => {
      cancelAnimationFrame(frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [fireKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "pointer-events-none absolute inset-0 size-full"}
    />
  );
}
