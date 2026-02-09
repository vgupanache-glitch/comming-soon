import React, { useEffect, useRef, useState } from "react";

const ComingSoon = () => {
  const logoRef = useRef(null);
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  /* 🔔 AUTO EVENT ON VISIT */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("PANACHE_VISIT", {
        detail: {
          page: "coming-soon",
          timestamp: Date.now(),
        },
      })
    );
  }, []);

  /* 🎥 3D Parallax Tilt */
  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 18;
      const y = (e.clientY / innerHeight - 0.5) * -18;

      logo.style.transform = `
        perspective(1200px)
        rotateX(${y}deg)
        rotateY(${x}deg)
        scale(1.06)
      `;
    };

    const reset = () => {
      logo.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", reset);
    };
  }, []);

  /* 🎶 Browser-safe autoplay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;
    audio.loop = true;
    audio.muted = true;

    audio.play().catch(() => {});

    const enableSound = () => {
      audio.muted = false;
      audio.play().catch(() => {});
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-purple-950 text-white">

      {/* 🎶 Audio */}
      <audio ref={audioRef} src="/music.mp3" preload="auto" />

      {/* 🌌 Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-pink-600/30 blur-3xl animate-pulse delay-200" />
        <div className="absolute top-10 right-1/3 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl animate-pulse delay-500" />
      </div>

      {/* 🧠 Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center gap-10">

        {/* LOGO */}
        <img
          ref={logoRef}
          src="/panache-logo.png"
          alt="Panache Logo"
          className="
            w-72 md:w-96
            transition-transform duration-200 ease-out
            drop-shadow-[0_0_80px_rgba(168,85,247,0.85)]
            animate-[pulse_2.5s_ease-in-out_infinite]
          "
        />

        {/* COMING SOON */}
        <span
          className="
            rounded-full
            border border-purple-400/40
            bg-purple-500/10
            px-10 py-4
            text-lg md:text-xl
            font-semibold
            tracking-widest
            text-purple-200
            backdrop-blur-xl
            shadow-[0_0_30px_rgba(168,85,247,0.35)]
            animate-pulse
          "
        >
          🚀 COMING SOON
        </span>

        {/* 🔊 SOUND HINT */}
        {!soundEnabled && (
          <span className="text-sm text-purple-300/70 animate-pulse select-none">
            🔊 Tap anywhere to enable sound
          </span>
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
