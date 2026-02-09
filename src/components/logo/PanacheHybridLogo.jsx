import { useRef } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import HybridLogoCard from "./HybridLogoCard";

import p from "../../assets/p.png";
import a1 from "../../assets/a1.png";
import n from "../../assets/n.png";
import a2 from "../../assets/a2.png";
import c from "../../assets/c.png";
import h from "../../assets/h.png";
import e from "../../assets/e.png";


const PanacheHybridLogo = ({ mouseX, mouseY }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const letters = [
    { l: p },
    { l: a1 },
    { l: n },
    { l: a2 },
    { l: c },
    { l: h },
    { l: e },
  ];

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-1 md:gap-3 py-4 md:py-20 perspective-800" // Lower perspective = deeper 3D effect
      style={{ perspective: "700px" }}
    >
      <motion.div
        className="flex md:gap-2"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ x: "-100vw" }}
        animate={{ x: isInView ? 0 : "-100vw" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {letters.map((item, i) => (
          <HybridLogoCard
            key={i}
            letter={item.l}
            delay={i * 0.05}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PanacheHybridLogo;