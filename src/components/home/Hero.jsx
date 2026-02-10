import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, animate } from "framer-motion";
import { ArrowRight, Bell, Check } from "lucide-react";
import PanacheHybridLogo from "../logo/PanacheHybridLogo";
import ActiveScrollReveal from "../common/ActiveScrollReveal";

// --- SCRAMBLE TEXT COMPONENT ---
const ScrambleText = ({ text }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

  useEffect(() => {
    let interval;
    let iteration = 0;
    
    clearInterval(interval);
    interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
};

const Hero = () => {
  const heroRef = useRef(null);
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  
  // Mouse Physics
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const smoothMX = useSpring(mX, { stiffness: 300, damping: 20 });
  const smoothMY = useSpring(mY, { stiffness: 100, damping: 55 });

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mX.set(e.clientX - (rect.left + rect.width / 2));
    mY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    animate(mX, 0);
    animate(mY, 0);
  };

  const handleNotify = (e) => {
    e.preventDefault();
    if(email) {
        setNotified(true);
        setTimeout(() => setNotified(false), 3000); // Reset after 3s
        setEmail("");
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <ActiveScrollReveal direction="down">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-pink-200">
              S16 Website Loading
            </span>
          </div>
        </div>
      </ActiveScrollReveal>

      {/* 3D LOGO CONTAINER */}
      <div className="mb-8 scale-75 md:scale-100 z-50">
        <PanacheHybridLogo mouseX={smoothMX} mouseY={smoothMY} />
      </div>

      <ActiveScrollReveal delay={0.2} direction="up">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-xl md:text-3xl font-light text-gray-300 tracking-wide font-mono">
             <span className="text-pink-500">&gt;</span> <ScrambleText text="THE ANNUAL CULTURAL FEST" />
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed px-6">
            Prepare for an convergence of art, technology, and culture. 
            VGU Jaipur is about to witness the extraordinary.
          </p>

          {/* NOTIFY ME INPUT */}
          {/* <div className="flex flex-col items-center gap-4 mt-8">
            <form onSubmit={handleNotify} className="relative group w-full max-w-sm">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex items-center bg-[#0a0a0a] rounded-xl p-1">
                    <input 
                        type="email" 
                        placeholder="Enter your email for updates" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent text-white text-sm px-4 py-3 outline-none placeholder:text-gray-600"
                    />
                    <button 
                        type="submit"
                        className="bg-white text-black p-2.5 rounded-lg hover:bg-pink-500 hover:text-white transition-colors duration-300"
                    >
                        {notified ? <Check size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </form>
            {notified && <span className="text-xs text-green-400 font-mono">You're on the list! 🚀</span>}
          </div> */}
        </div>
      </ActiveScrollReveal>
    </section>
  );
};

export default Hero;