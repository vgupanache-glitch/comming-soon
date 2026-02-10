import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import confetti from "canvas-confetti";

import NoiseOverlay from "../components/common/NoiseOverlay";
import Hero from "../components/home/Hero";
import Countdown from "../components/home/Countdown";

const ComingSoon = () => {
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // --- MOUSE SPOTLIGHT ENGINE ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // --- PHYSICS SCROLL ENGINE ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const particleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // --- 🎆 FIREWORKS ---
  useEffect(() => {
    const fireSkyShort = (xOrigin) => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: xOrigin, y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#06b6d4', '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 5,
        scalar: 0.8,
        gravity: 1.2,
        startVelocity: 35,
        ticks: 200
      });
    };

    fireSkyShort(0.2);
    const t1 = setTimeout(() => fireSkyShort(0.8), 400);
    const t2 = setTimeout(() => fireSkyShort(0.5), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // --- 🎶 MOBILE & TAB-AWARE AUDIO ENGINE ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;
    audio.loop = true;

    // Function to handle play/pause based on visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        audio.pause(); // Stops music when switching tabs or minimizing Chrome
        setIsTabActive(false);
      } else {
        setIsTabActive(true);
        // Only resume if the user had already enabled sound previously
        if (soundEnabled) {
          audio.play().catch(() => {});
        }
      }
    };

    const enableSound = () => {
      audio.muted = false;
      audio.play().catch((e) => console.log("Autoplay prevented:", e));
      setSoundEnabled(true);
      // Remove listeners after first interaction
      window.removeEventListener("click", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("click", enableSound);
    window.addEventListener("touchstart", enableSound);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("click", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };
  }, [soundEnabled]);

  // --- MOUSE TRACKING ---
  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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

      <motion.div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{ background: backgroundStyle }}
      />

      <Countdown targetDate="2026-02-12T00:00:00" />

      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
      />

      {/* Parallax Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yParallax }} className="relative w-full h-[120vh]">
          <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-pink-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </motion.div>

        <motion.div style={{ x: bgTextX }} className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%]">
          <div className="text-[25vw] font-black text-white/[0.02] whitespace-nowrap uppercase italic tracking-tighter leading-none select-none">
            Panache 2026 • Innovation • Culture • Panache 2026
          </div>
        </motion.div>
      </div>

      <div className="relative z-20">
        <Hero />
      </div>

      {/* UI FEEDBACK FOR SOUND */}
      {!soundEnabled && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-pink-400 animate-pulse">
             Tap for Sound
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ComingSoon;