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

  // --- 🎆 AUTOMATIC FIREWORKS (ON LOAD) ---
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

  // --- 🧨 MANUAL FIREWORK TRIGGER (CLICK HANDLER) ---
  const handleManualFirework = () => {
    // Play a random burst from the bottom right corner
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.9, x: 1 }, // Bottom Right Origin
      colors: ['#ec4899', '#a855f7', '#06b6d4', '#ffffff'],
      zIndex: 100, // Very high to appear above everything
    });

    // Also fire a smaller one from the left for balance
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ec4899', '#a855f7'],
            zIndex: 100,
          });
    }, 200);
  };

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
    <div className="relative bg-[#050505] text-white selection:bg-pink-500/30 font-sans min-h-screen overflow-hidden flex flex-col justify-between">
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

      {/* --- FLOATING FIREWORK BUTTON (Bottom Right) --- */}
      <motion.button
        onClick={handleManualFirework}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-20 right-6 z-50 p-4  rounded-full shadow-[0_0_30px_rgba(236,72,153,0.6)] border border-white/20 hover:shadow-[0_0_50px_rgba(236,72,153,0.9)] transition-all group"
      >
        <span className="text-xl group-hover:animate-spin block">🎆</span>
      </motion.button>

      {/* --- FOOTER SECTION --- */}
      <footer className="fixed bottom-0 left-0 w-full z-40 py-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-white/40 uppercase mb-2">
            Designed & Developed by{' '}
            <a 
              href="https://www.linkedin.com/in/manjeet-kumar-50a463301/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500/80 hover:text-pink-400 transition-colors duration-300 border-b border-pink-500/20 hover:border-pink-400"
            >
              Manjeet
            </a>
            {' '}&{' '}
            <a 
              href="https://www.linkedin.com/in/harshitchoudhayin?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-500/80 hover:text-cyan-400 transition-colors duration-300 border-b border-cyan-500/20 hover:border-cyan-400"
            >
              Harshit
            </a>
          </p>
          <p className="text-[10px] text-white/20 font-sans tracking-wide">
            © {new Date().getFullYear()} VGU Panache Team. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* UI FEEDBACK FOR SOUND (Moved to Left to balance UI) */}
      {!soundEnabled && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-6 z-50 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl cursor-pointer active:scale-95 transition-transform"
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