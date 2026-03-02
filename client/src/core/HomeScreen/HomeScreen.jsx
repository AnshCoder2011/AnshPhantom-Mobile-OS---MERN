import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AppIcon from "./AppIcon";
import homeWallpaper from "../../assets/image.png";

export default function HomeScreen() {
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  // 1. Parallax Effect: Wallpaper moves slower than icons (10% ratio)
  // This creates a sense of depth between the apps and the background.
  const backgroundX = useTransform(x, (latest) => {
    return `calc(50% + ${latest * 0.1}px)`;
  });

  const [pageWidth, setPageWidth] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setPageWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const totalPages = 2;

  const snapToPage = (newPage) => {
    const clamped = Math.max(0, Math.min(newPage, totalPages - 1));
    setPage(clamped);

    animate(x, -clamped * pageWidth, {
      type: "spring",
      stiffness: 280,
      damping: 32,
      mass: 0.8,
    });
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Swipe threshold or velocity trigger
    if (offset < -100 || velocity < -500) {
      snapToPage(page + 1);
    } else if (offset > 100 || velocity > 500) {
      snapToPage(page - 1);
    } else {
      snapToPage(page);
    }
  };

  // 4. App Icons Layout: 12 apps per page, 4 columns
  const appsPage1 = [
    "Safari",
    "Photos",
    "Camera",
    "Mail",
    "Clock",
    "Maps",
    "Weather",
    "Notes",
    "App Store",
    "Music",
    "Settings",
    "Files",
  ];

  const appsPage2 = [
    "Instagram",
    "YouTube",
    "WhatsApp",
    "Calculator",
    "Calendar",
    "Reminders",
    "Contacts",
    "Stocks",
    "Health",
    "Wallet",
    "Shortcuts",
    "Translate",
  ];

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        backgroundImage: `url(${homeWallpaper})`,
        backgroundSize: "120% 120%", // Extra size for parallax movement
        backgroundPositionX: backgroundX,
        backgroundPositionY: "center",
      }}
    >
      {/* 2. Glass Overlay (Subtle tint for text readability) */}
      <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none" />

      {/* 3. Main Horizontal Paging Layer */}
      <motion.div
        className="flex h-full relative z-10 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{
          left: -(totalPages - 1) * pageWidth,
          right: 0,
        }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
      >
        {/* Page 1 */}
        <div className="w-full shrink-0 px-7 pt-20 flex flex-col gap-10">
          <CalendarWidget />
          <div className="grid grid-cols-4 gap-y-8 gap-x-5 px-1">
            {appsPage1.map((app) => (
              <AppIcon key={app} name={app} />
            ))}
          </div>
        </div>

        {/* Page 2 */}
        <div className="w-full flex-shrink-0 px-7 pt-20 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4">
            <AnalogClockWidget />
            <WeatherWidget />
          </div>
          <div className="grid grid-cols-4 gap-y-8 gap-x-5 px-1">
            {appsPage2.map((app) => (
              <AppIcon key={app} name={app} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4. Page Indicator (Dots) */}
      <div className="absolute bottom-[118px] left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: page === i ? 1 : 0.4,
              scale: page === i ? 1.2 : 1,
            }}
            className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"
          />
        ))}
      </div>

      {/* 5. The Glassmorphism Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-[94px] bg-white/25 backdrop-blur-[40px] border border-white/20 rounded-[2.5rem] flex justify-around items-center px-4 shadow-2xl z-30">
        <AppIcon name="Phone" dock />
        <AppIcon name="Safari" dock />
        <AppIcon name="Messages" dock />
        <AppIcon name="Music" dock />
      </div>
    </motion.div>
  );
}

// --- Sub-components (Widgets) ---

function CalendarWidget() {
  const today = new Date();
  const day = today.toLocaleDateString([], { weekday: "long" });
  const date = today.getDate();
  const month = today.toLocaleDateString([], { month: "long" });

  return (
    <div className="w-full h-32 rounded-[2.25rem] bg-white/20 backdrop-blur-3xl border border-white/20 shadow-xl p-6 flex flex-col justify-between text-white">
      <span className="text-xs uppercase tracking-[0.15em] font-bold text-white/70">
        {day}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-light">{date}</span>
        <span className="text-xl font-medium opacity-80">{month}</span>
      </div>
    </div>
  );
}

function AnalogClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();

  const hourAngle = h * 30 + m * 0.5;
  const minuteAngle = m * 6;
  const secondAngle = s * 6;

  return (
    <div className="w-full h-36 rounded-[2.25rem] bg-white/20 backdrop-blur-3xl border border-white/20 shadow-xl flex items-center justify-center">
      <div className="relative w-24 h-24 rounded-full border border-white/30 bg-gradient-to-b from-white/10 to-transparent">
        {/* Hour Hand */}
        <motion.div
          style={{ rotate: hourAngle }}
          className="absolute top-1/2 left-1/2 w-1 h-8 bg-white origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
        />
        {/* Minute Hand */}
        <motion.div
          style={{ rotate: minuteAngle }}
          className="absolute top-1/2 left-1/2 w-1 h-10 bg-white/70 origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
        />
        {/* Second Hand */}
        <motion.div
          style={{ rotate: secondAngle }}
          className="absolute top-1/2 left-1/2 w-[1px] h-11 bg-orange-500 origin-bottom -translate-x-1/2 -translate-y-full"
        />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm" />
      </div>
    </div>
  );
}

function WeatherWidget() {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative w-full h-36 rounded-[2.25rem] overflow-hidden group cursor-pointer shadow-2xl"
    >
      {/* 1. Deep Gradient Background with Mesh-like feel */}
      <div className="absolute inset-0 bg-linear-to-br from-[#5097ED] via-[#4481EB] rounded-[2.25rem] to-[#2B61D1]" />

      {/* 2. Glassmorphism Layers */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[2.25rem]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent rounded-[2.25rem]" />

      {/* 3. High-end "Inner Glow" Border */}
      <div className="absolute inset-0 rounded-[2.25rem] border border-white/20 pointer-events-none" />

      {/* 4. Content Layer */}
      <div className="relative h-full p-5 flex flex-col justify-between text-white select-none">
        {/* Top Section: Location & Icon */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-tight opacity-90 drop-shadow-sm">
              NOIDA
            </span>
            <span className="text-4xl font-light tracking-tighter mt-0.5">
              28°
            </span>
          </div>

          {/* Animated Weather Icon Container */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <SunIcon />
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full"
            />
          </div>
        </div>

        {/* Bottom Section: Condition & Range */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold tracking-wide">
            Mostly Sunny
          </span>
          <div className="flex gap-2 items-center text-[12px] font-medium opacity-80">
            <span>H:32°</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>L:24°</span>
          </div>
        </div>
      </div>

      {/* 5. Subtle Lighting Overlay (The "Premium" Shine) */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-12 pointer-events-none" />
    </motion.div>
  );
}

/* --- Premium SVG Icons --- */

function SunIcon() {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="4" fill="#FFD60A" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="11.5"
          y="2"
          width="1"
          height="3"
          rx="0.5"
          fill="#FFD60A"
          transform={`rotate(${angle} 12 12)`}
          className="origin-center"
        />
      ))}
    </motion.svg>
  );
}
