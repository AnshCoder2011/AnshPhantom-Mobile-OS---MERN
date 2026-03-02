import { useEffect, useState } from "react";
import { useGesture } from "@use-gesture/react";
import { motion } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import wallpaper from "../../assets/wallpaper.png";
import PasscodePad from "./PasscodePad";


export default function LockScreen() {
  const revealPasscode = useOSStore((s) => s.revealPasscode);
  const showPasscode = useOSStore((s) => s.showPasscode);

  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Swipe gesture
  const bind = useGesture({
    onDrag: ({ movement: [, my] }) => {
      if (my < -80 && !showPasscode) {
        revealPasscode();
      }
    },
  });

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full bg-cover bg-center text-white relative overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
      initial={{ y: 0 }}
      animate={{ y: showPasscode ? -100 : 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      {...bind()}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

     

      {/* LOCK ICON */}
      <div className="absolute top-20 w-full flex justify-center z-10">
        <div className="text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
      </div>

      {/* CLOCK SECTION */}
      <div className="flex flex-col items-center justify-center h-full z-10 relative">
        <h1 className="text-7xl font-stretch-semi-condensed tracking-tight">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </h1>
        <p className="mt-2 text-lg font-light">
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        {!showPasscode && (
          <p className="absolute bottom-24 text-sm opacity-80 animate-pulse">
            Swipe up to unlock
          </p>
        )}
      </div>

      {/* BOTTOM QUICK ACTIONS */}
      <div className="absolute bottom-8 w-full flex justify-between px-10 z-10">
        <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6H6l2 4V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10l2-4z"></path>
            <line x1="6" y1="6" x2="18" y2="6"></line>
            <line x1="10" y1="14" x2="14" y2="14"></line>

            <line x1="12" y1="2" x2="12" y2="4"></line>
            <line x1="7" y1="3" x2="9" y2="5"></line>
            <line x1="17" y1="3" x2="15" y2="5"></line>
          </svg>
        </div>

        <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
      </div>

      {/* HOME INDICATOR BAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-white rounded-full z-10"
      />
      <PasscodePad />
    </motion.div>
  );
}
