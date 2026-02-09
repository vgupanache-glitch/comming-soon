import React from "react";

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-purple-950 text-white">
      
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-pink-600/30 blur-3xl animate-pulse delay-200" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        
        {/* Logo / Title */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-widest text-purple-400 md:text-6xl">
          PANACHE
        </h1>

        <h2 className="mb-2 text-xl font-semibold tracking-wide md:text-2xl">
          Season <span className="text-pink-400">16</span>
        </h2>

        {/* Divider */}
        <div className="my-6 h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />

        {/* Main Message */}
        <p className="max-w-2xl text-lg text-zinc-300 md:text-xl">
          The wait is almost over.  
          Get ready for a celebration of <span className="text-purple-300 font-semibold">culture</span>,{" "}
          <span className="text-pink-300 font-semibold">creativity</span>, and{" "}
          <span className="text-indigo-300 font-semibold">energy</span>.
        </p>

        {/* Coming Soon */}
        <div className="mt-10">
          <span className="rounded-full border border-purple-400/40 bg-purple-500/10 px-8 py-3 text-lg font-medium tracking-wider text-purple-300 backdrop-blur">
            🚀 COMING SOON
          </span>
        </div>

        {/* Footer Text */}
        <p className="mt-10 text-sm tracking-wide text-zinc-400">
          © {new Date().getFullYear()} Panache • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
