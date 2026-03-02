import { useEffect, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import wallpaper from "../../assets/wallpaper.png";
import PasscodePad from "./PasscodePad";

export default function LockScreen() {
  const revealPasscode = useOSStore((s) => s.revealPasscode);
  const showPasscode = useOSStore((s) => s.showPasscode);
  const isUnlocked = useOSStore((s) => s.isUnlocked);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const bind = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy] }) => {
      // Swipe up logic with velocity check for snappiness
      if ((my < -100 || vy > 0.5) && !showPasscode) {
        revealPasscode();
      }
    },
  });

  // Decide if we should hide internal elements (clock, etc)
  // They should be hidden if passcode is showing OR if we are in the middle of unlocking
  const shouldHideUI = showPasscode || isUnlocked;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      {...bind()}
      className="absolute inset-0 w-full h-full bg-cover bg-center text-white overflow-hidden select-none touch-none z-10"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Dynamic Overlay: Blurs more when passcode is showing */}
      <motion.div
        className="absolute inset-0 bg-black/20"
        animate={{ backdropFilter: shouldHideUI ? "blur(20px)" : "blur(0px)" }}
      />

      {/* TOP SECTION: LOCK & CLOCK */}
      <motion.div
        className="relative z-10 flex flex-col items-center pt-14"
        animate={{
          y: shouldHideUI ? -150 : 0,
          opacity: shouldHideUI ? 0 : 1,
          scale: shouldHideUI ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Lock Icon */}
        <div className="mb-2 opacity-80">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <p className="text-lg font-medium tracking-wide uppercase opacity-90">
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        <h1 className="text-[90px] font-bold tracking-tighter leading-tight mt-[-10px]">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </h1>
      </motion.div>

      {/* BOTTOM QUICK ACTIONS */}
      <AnimatePresence>
        {!shouldHideUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 w-full flex justify-between px-12 z-10"
          >
            {/* Flashlight Button */}
            <div className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center active:bg-white active:text-black transition-colors duration-300">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6H6l2 4V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10l2-4z" />
                <line x1="6" y1="6" x2="18" y2="6" />
              </svg>
            </div>

            <p className="self-center text-[13px] font-medium opacity-60 tracking-tight">
              Swipe up to unlock
            </p>

            {/* Camera Button */}
            <div className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center active:bg-white active:text-black transition-colors duration-300">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <rect x="2" y="6" width="20" height="14" rx="3" />
                <path d="M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PasscodePad />
    </motion.div>
  );
}
