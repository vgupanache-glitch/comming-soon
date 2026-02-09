import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

import NoiseOverlay from "../components/common/NoiseOverlay";
import Hero from "../components/home/Hero";
import Countdown from "../components/home/Countdown";

const ComingSoon = () => {
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // --- MOUSE SPOTLIGHT ENGINE ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // --- PHYSICS SCROLL ENGINE ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax Animations
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const particleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  /* 🎶 Browser-safe autoplay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;
    audio.loop = true;
    audio.muted = true;

    audio.play().catch(() => { });

    const enableSound = () => {
      audio.muted = false;
      audio.play().catch(() => { });
      setSoundEnabled(true);
    };

    window.addEventListener("click", enableSound, { once: true });
    window.addEventListener("touchstart", enableSound, { once: true });
    window.addEventListener("keydown", enableSound, { once: true });

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("touchstart", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

  // Dynamic Background Gradient
  const backgroundStyle = useMotionTemplate`
      radial-gradient(
        600px circle at ${mouseX}px ${mouseY}px,
        rgba(236, 72, 153, 0.15),
        transparent 80%
      )
    `;

  return (
    <div className="relative bg-[#050505] text-white selection:bg-pink-500/30 font-sans min-h-screen overflow-hidden">
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      <NoiseOverlay />

      {/* --- GRID BACKGROUND --- */}
      {/* <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="fixed inset-0 z-0 opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        /> */}

      {/* --- MOUSE SPOTLIGHT --- */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{ background: backgroundStyle }}
      />

{/* // Set date to yesterday to force fireworks immediately */}
      <Countdown targetDate="2026-02-12T00:00:00" />

      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
      />

      {/* Fixed Parallax Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yParallax }} className="relative w-full h-[120vh]">
          {/* Glowing Orbs */}
          <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-pink-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </motion.div>

        {/* Floating Particles */}
        <motion.div style={{ y: particleY }} className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 rounded-full blur-[1px]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </motion.div>

        {/* Huge Scrolling Text */}
        <motion.div style={{ x: bgTextX }} className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%]">
          <div className="text-[25vw] font-black text-white/[0.02] whitespace-nowrap uppercase italic tracking-tighter leading-none select-none">
            Panache 2026 • Innovation • Culture • Panache 2026
          </div>
        </motion.div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-20">
        <Hero />
      </div>

      {/* 🔊 SOUND HINT */}
      {!soundEnabled && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <span className="text-sm text-purple-300/70 animate-pulse select-none">
            🔊 Tap anywhere to enable sound
          </span>
        </div>
      )}
    </div>
  );

};

export default ComingSoon;