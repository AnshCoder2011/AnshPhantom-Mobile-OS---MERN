import { motion, useMotionValue, animate } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import { useGesture } from "@use-gesture/react";

export default function AppPlaceholder({ name }) {
  const closeApp = useOSStore((s) => s.closeApp);

  // Swipe-to-close logic
  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bind = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (down) {
        if (my < 0) {
          dragY.set(my);
          const newScale = Math.max(0.9, 1 + my / 1000);
          dragScale.set(newScale);
        }
      } else {
        if (my < -100 || vy > 0.5) {
          closeApp();
        } else {
          animate(dragY, 0, { type: "spring", stiffness: 300, damping: 30 });
          animate(dragScale, 1, {
            type: "spring",
            stiffness: 300,
            damping: 30,
          });
        }
      }
    },
  });

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white select-none touch-none p-12 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mb-6 ring-1 ring-white/20">
        <span className="text-4xl">📦</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-white/40 leading-relaxed">
        This app is currently in development.
        <br />
        Swipe up to go back home.
      </p>

      {/* Swipe Handle Area */}
      <div
        {...bind()}
        className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center cursor-grab active:cursor-grabbing z-50"
      >
        <div className="w-32 h-1.5 bg-white/20 rounded-full" />
      </div>
    </motion.div>
  );
}
