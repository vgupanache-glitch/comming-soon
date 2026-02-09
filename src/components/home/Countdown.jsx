import React, { useEffect, useState } from "react";
import { TfiAlarmClock } from "react-icons/tfi";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Countdown = ({ targetDate = "2026-02-12T00:00:00" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00", hours: "00", minutes: "00", seconds: "00"
  });
  const [isFinished, setIsFinished] = useState(false);

  // --- 🎆 FIREWORKS ENGINE ---
  const launchFireworks = () => {
    const duration = 3 * 1000; // Fire for 3 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Shoot from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      // Shoot from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();

    // 1. CHECK IMMEDIATE STATUS (If user comes late)
    if (now >= target) {
      setIsFinished(true);
      launchFireworks(); // <--- FIRE IMMEDIATELY
      return;
    }

    // 2. START COUNTDOWN
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = target - currentTime;

      if (difference <= 0) {
        // --- TIMER HITS ZERO ---
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        setIsFinished(true);
        launchFireworks(); // <--- FIRE WHEN TIMER ENDS
      } else {
        // --- UPDATE NUMBERS ---
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto pointer-events-none" // pointer-events-none lets clicks pass through
    >
      <div className="relative overflow-hidden group pointer-events-auto"> {/* Enable clicks only on the box */}
        
        {/* Animated Glow Border */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${isFinished ? 'from-green-500 to-emerald-500' : 'from-pink-500/20 to-purple-500/20'} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse`} />
        
        {/* Main Glass Container */}
        <div className="relative bg-[#0a0a0a]/90 border border-white/10 px-6 py-3 md:px-8 md:py-4 rounded-full backdrop-blur-xl shadow-2xl flex items-center justify-center min-w-[300px]">
          
          <AnimatePresence mode="wait">
            {!isFinished ? (
              // --- STATE 1: COUNTDOWN ---
              <motion.div 
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 md:gap-8"
              >
                <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/10 text-pink-500">
                  <TfiAlarmClock className="text-lg animate-pulse" />
                </div>
                
                <div className="flex gap-4 md:gap-8 divide-x divide-white/10">
                  <TimeUnit value={timeLeft.days} label="DAYS" />
                  <TimeUnit value={timeLeft.hours} label="HRS" />
                  <TimeUnit value={timeLeft.minutes} label="MIN" />
                  <TimeUnit value={timeLeft.seconds} label="SEC" isLast />
                </div>
              </motion.div>
            ) : (
              // --- STATE 2: EVENT STARTED / FIREWORKS ---
              <motion.div 
                key="live"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-lg md:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 tracking-widest uppercase">
                  Event Live
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
};

const TimeUnit = ({ value, label, isLast }) => (
  <div className={`flex flex-col items-center ${!isLast ? 'pr-4 md:pr-8 pl-1' : 'pl-1'}`}>
    <span className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-mono tracking-tighter tabular-nums">
      {value}
    </span>
    <span className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-[0.2em] mt-1">
      {label}
    </span>
  </div>
);

export default Countdown;