// PageTransition.jsx
import { motion } from "framer-motion";

/**
 * forward: boolean
 *  - true  => navigasi maju (ex: "/" -> "/login")
 *  - false => navigasi mundur (ex: "/login" -> "/")
 */
export function PageTransition({ children, forward = true }) {
  const variants = {
    initial: (forward) => ({
      // new page masuk dari kiri saat forward, dari kanan saat backward
      x: forward ? "100%" : "-100%",
      opacity: 1,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
    },
    exit: (forward) => ({
      // old page keluar ke kanan saat forward, keluar ke kiri saat backward
      x: forward ? "100%" : "-100%",
      opacity: 1,
      transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
    }),
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      // pass the `forward` as custom so variants can use it
      custom={forward}
    >
      {children}
    </motion.div>
  );
}
