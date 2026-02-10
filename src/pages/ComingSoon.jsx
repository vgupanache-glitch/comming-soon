import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import confetti from "canvas-confetti";

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

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const particleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // --- 🎆 WELCOME FIREWORKS ---
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

  // --- MOUSE TRACKING ---
  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // --- 🎶 AUDIO ENGINE (Enhanced) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Load preference from session so it persists on refresh
    const hasInteracted = sessionStorage.getItem("audioAllowed") === "true";

    audio.volume = 0.6;
    audio.loop = true;

    const startAudio = () => {
      audio.muted = false;
      audio.play()
        .then(() => {
          setSoundEnabled(true);
          sessionStorage.setItem("audioAllowed", "true");
        })
        .catch((err) => console.log("Playback blocked:", err));
    };

    if (hasInteracted) {
      startAudio();
    }

    // Interaction listeners to unlock audio
    const unlock = () => {
      startAudio();
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const backgroundStyle = useMotionTemplate`
      radial-gradient(
        600px circle at ${mouseX}px ${mouseY}px,
        rgba(236, 72, 153, 0.15),
        transparent 80%
      )
    `;

  return (
    <div className="relative bg-[#050505] text-white selection:bg-pink-500/30 font-sans min-h-screen overflow-hidden">
      {/* Ensure the source path is correct relative to your public folder */}
      <audio ref={audioRef} src="/music.mp3" preload="auto" />
      
      <NoiseOverlay />

      <motion.div
        className="pointer-events-none fixed inset-0 z-10"
        style={{ background: backgroundStyle }}
      />

      <Countdown targetDate="2026-02-12T00:00:00" />

      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 origin-left z-50 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
      />

      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: yParallax }} className="relative w-full h-[120vh]">
          <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] bg-pink-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </motion.div>

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

        <motion.div style={{ x: bgTextX }} className="absolute top-1/2 left-0 -translate-y-1/2 w-[200%]">
          <div className="text-[25vw] font-black text-white/[0.02] whitespace-nowrap uppercase italic tracking-tighter leading-none select-none">
            Panache 2026 • Innovation • Culture • Panache 2026
          </div>
        </motion.div>
      </div>

      <div className="relative z-20">
        <Hero />
      </div>

      {!soundEnabled && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <span className="text-xs uppercase tracking-widest text-purple-300/80 animate-pulse">
            🔊 Tap to enable Panache Soundscape
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ComingSoon;