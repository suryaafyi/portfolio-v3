"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import LiquidText, { Words } from "./LiquidText";

export default function Hero() {
  const reduce = useReducedMotion();

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.4 : 0.95,
      delay: reduce ? 0 : delay,
      ease: [0.2, 0.7, 0.2, 1],
    } as Transition,
  });

  return (
    <header className="hero">
      <LiquidText>
        <motion.div className="eyebrow" {...reveal(0)}>
          <Words text="Product Designer & Developer — Chennai, IN" />
        </motion.div>
        <motion.h1 className="statement" data-hover {...reveal(0.12)}>
          <Words text="I design and build digital products that" />{" "}
          <span className="liq-w">
            <em className="scribble">ship</em>.
          </span>
        </motion.h1>
        <motion.p className="sub" {...reveal(0.24)}>
          <Words text="A hybrid of design taste and front-end engineering — I take products from first sketch all the way to deployed." />
        </motion.p>
      </LiquidText>
      <motion.div className="status" {...reveal(0.36)}>
        <span className="ping" aria-hidden />
        Available for select freelance projects
      </motion.div>
    </header>
  );
}
