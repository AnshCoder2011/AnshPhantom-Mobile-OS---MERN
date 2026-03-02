import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AppIcon from "./AppIcon";
import homeWallpaper from "../../assets/image.png";

export default function HomeScreen() {
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  const [pageWidth, setPageWidth] = useState(0);
  const [page, setPage] = useState(0); // current page index

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
      stiffness: 320,
      damping: 35,
    });
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -80 || velocity < -500) {
      snapToPage(page + 1);
    } else if (offset > 80 || velocity > 500) {
      snapToPage(page - 1);
    } else {
      snapToPage(page);
    }
  };

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
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden text-white"
      style={{
        backgroundImage: `url(${homeWallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] z-0" />
      <motion.div
        className="flex h-full relative z-10"
        drag="x"
        dragConstraints={{
          left: -(totalPages - 1) * pageWidth,
          right: 0,
        }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        style={{ x }}
      >
        {/* Page 1 */}
        <div className="w-full shrink-0 px-6 pt-24 flex flex-col gap-15">
          <CalendarWidget />
          <div className="grid grid-cols-4 gap-y-5 gap-x-7">
            {appsPage1.map((app) => (
              <AppIcon key={app} name={app} />
            ))}
          </div>
        </div>

        {/* Page 2 */}
        <div className="w-full flex-shrink-0 px-6 pt-24 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <AnalogClockWidget />
            <WeatherWidget />
          </div>
          <div className="grid grid-cols-4 gap-y-4 gap-x-7">
            {appsPage2.map((app) => (
              <AppIcon key={app} name={app} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Page Indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              page === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex justify-around items-center px-6">
        <AppIcon name="Phone" dock />
        <AppIcon name="Safari" dock />
        <AppIcon name="Messages" dock />
        <AppIcon name="Music" dock />
      </div>
    </div>
  );
}

function CalendarWidget() {
  const today = new Date();

  const day = today.toLocaleDateString([], { weekday: "long" });
  const date = today.getDate();
  const month = today.toLocaleDateString([], { month: "long" });

  return (
    <div className="w-full h-28 rounded-3xl bg-gradient-to-b from-white/25 to-white/10 backdrop-blur-3xl ring-1 ring-white/25 shadow-xl p-6 flex flex-col justify-between">
      <span className="text-sm uppercase tracking-wider text-white/60">
        {day}
      </span>

      <div className="flex items-end gap-3">
        <span className="text-4xl font-semibold">{date}</span>
        <span className="text-lg text-white/70 mb-1">{month}</span>
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
  const minuteAngle = m * 6 + s * 0.1;
  const secondAngle = s * 6;

  return (
    <div className="w-full h-32 rounded-3xl bg-gradient-to-b from-white/25 to-white/10 backdrop-blur-3xl ring-1 ring-white/25 shadow-xl p-5 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="dialGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#dialGlow)"
          stroke="white"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <circle cx="50" cy="50" r="1.8" fill="white" />

        <g stroke="white" strokeWidth="1.2" opacity="0.5">
          <line x1="50" y1="6" x2="50" y2="10" />
          <line x1="94" y1="50" x2="90" y2="50" />
          <line x1="50" y1="94" x2="50" y2="90" />
          <line x1="6" y1="50" x2="10" y2="50" />
        </g>

        <g transform={`rotate(${hourAngle} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="30"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g transform={`rotate(${minuteAngle} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g transform={`rotate(${secondAngle} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="#ff6b6b"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function WeatherWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const isDay = now.getHours() >= 6 && now.getHours() < 18;
  return (
    <div className="w-full h-32 rounded-3xl bg-gradient-to-b from-white/25 to-white/10 backdrop-blur-3xl ring-1 ring-white/25 shadow-xl p-5 text-white flex items-center justify-between overflow-hidden">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs uppercase tracking-wider text-white/70">
          Weather
        </span>
        <span className="text-lg truncate">Noida</span>
        <span className="text-2xl font-semibold">28°C</span>
        <span className="text-sm text-white/80 truncate">Sunny</span>
      </div>
      <div className="w-16 h-16 relative shrink-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          {isDay ? (
            <>
              <circle cx="50" cy="45" r="16" fill="#ffd166" />
              <g stroke="#ffd166" strokeWidth="2" opacity="0.9">
                <line x1="50" y1="20" x2="50" y2="28" />
                <line x1="50" y1="72" x2="50" y2="80" />
                <line x1="25" y1="45" x2="33" y2="45" />
                <line x1="67" y1="45" x2="75" y2="45" />
              </g>
            </>
          ) : (
            <>
              <path
                d="M60 40a18 18 0 1 1-20 26 18 18 0 0 0 20-26z"
                fill="#a3bffa"
              />
              <circle cx="70" cy="40" r="10" fill="#a3bffa" opacity="0.7" />
            </>
          )}
          <g fill="#d1d5db">
            <ellipse cx="38" cy="65" rx="22" ry="10" />
            <ellipse cx="58" cy="67" rx="20" ry="9" />
          </g>
        </svg>
      </div>
    </div>
  );
}
