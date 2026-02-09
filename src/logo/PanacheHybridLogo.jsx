import { motion, useTransform } from "framer-motion";

/**
 * 
 */
const PanacheHybridLogo = ({ mouseX, mouseY }) => {
  // Create 3D rotation strings from the spring values
  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);

  return (
    <div className="relative flex items-center justify-center py-20" style={{ perspective: "1200px" }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
      >
        {/* OUTER GLOW RING */}
        <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
        
        {/* BACK LAYER (Shadow/Depth) */}
        <motion.div 
          style={{ translateZ: "-20px" }}
          className="absolute text-[120px] md:text-[160px] font-black italic text-white/5 select-none"
        >
          PA
        </motion.div>

        {/* MIDDLE LAYER (The Red Dot) */}
        <motion.div
          style={{ translateZ: "20px" }}
          className="absolute bottom-[35%] right-[25%] w-4 h-4 md:w-6 md:h-6 bg-red-600 rounded-full shadow-[0_0_30px_#dc2626]"
        />

        {/* FRONT LAYER (Main Text) */}
        <motion.div
          style={{ translateZ: "50px" }}
          className="relative text-[100px] md:text-[140px] font-black italic tracking-tighter text-white drop-shadow-2xl"
        >
          PA<span className="opacity-0">.</span>
        </motion.div>

        {/* FLOATING PARTICLES (Adds to 'Ultra' feel) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ translateZ: `${30 + (i * 20)}px` }}
            className="absolute w-1 h-1 bg-white rounded-full"
            // Random positioning
            css={{
                top: `${20 * i}%`,
                left: `${30 * i}%`
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PanacheHybridLogo;