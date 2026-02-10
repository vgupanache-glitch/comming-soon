import { useRef } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import HybridLogoCard from "./HybridLogoCard";

import p from "../../../public/p.svg";
import a1 from "../../../public/a1.svg";
import n from "../../../public/n.svg";
import a2 from "../../../public/a2.svg";
import c from "../../../public/c.svg";
import h from "../../../public/h.svg";
import e from "../../../public/e.svg";




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