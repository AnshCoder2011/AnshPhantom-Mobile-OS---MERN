import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import { useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";

// Import all songs
import haseen from "/music/haseen.mp3";
import palpal from "/music/palpal.mp3";
import forareason from "/music/forareason.mp3";
import samjhona from "/music/samjhona.mp3";
import dhundhla from "/music/dhundhla.mp3";
import sahiba from "/music/sahiba.mp3";
import tu from "/music/tu.mp3";
import maand from "/music/maand.mp3";

const playlist = [
  { name: "Haseen", artist: "Talwiinder", file: haseen },
  { name: "Pal Pal", artist: "Talwiinder", file: palpal },
  { name: "For A Reason", artist: "Karan Aujla", file: forareason },
  { name: "Jaana Samjhona", artist: "Aditya Rikhari", file: samjhona },
  { name: "Dhundhla", artist: "Talwiinder", file: dhundhla },
  { name: "Sahiba", artist: "Aditya Rikhari", file: sahiba },
  { name: "Tu", artist: "Talwiinder", file: tu },
  { name: "Maand", artist: "Hasan Raheem", file: maand },
];

export default function ControlCenter() {
  const isOpen = useOSStore((s) => s.isControlOpen);
  const closeControl = useOSStore((s) => s.closeControl);

  // Control Center Toggles
  const {
    isWifiOn,
    toggleWifi,
    isBluetoothOn,
    toggleBluetooth,
    isAirplaneModeOn,
    toggleAirplaneMode,
    isSignalOn,
    toggleSignal,
    isRotationLocked,
    toggleRotationLock,
    isDarkModeOn,
    toggleDarkMode,
    isTorchOn,
    toggleTorch,
    brightness,
    setBrightness,
    volume,
    setVolume,
    isMusicPlaying,
    toggleMusic,
    currentSongIndex,
    nextSong,
    prevSong,
    openApp,
  } = useOSStore();

  const y = useMotionValue(-600);
  const audioRef = useRef(null);
  const calcIconRef = useRef(null);

  const handleOpenCalc = () => {
    if (calcIconRef.current) {
      const rect = calcIconRef.current.getBoundingClientRect();
      // First close control center with animation
      animate(y, -600, { duration: 0.3 }).then(() => {
        closeControl();
        // Then open app with zoom origin
        openApp("Calculator", {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      });
    }
  };

  const currentSong = playlist[currentSongIndex];

  // When show changes → animate in
  useEffect(() => {
    if (isOpen) {
      animate(y, 0, {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      });
    }
  }, [isOpen]);

  // Audio setup and source switching
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentSong.file);
      audioRef.current.loop = false; // Disable loop to allow auto-next if desired
      audioRef.current.onended = () => nextSong(playlist.length);
    } else {
      audioRef.current.src = currentSong.file;
      if (isMusicPlaying) audioRef.current.play();
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.play().catch((e) => console.log("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  if (!isOpen) return null;

  const handleDragEnd = (_, info) => {
    if (info.offset.y < -120 || info.velocity.y < -800) {
      animate(y, -600, {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      }).then(closeControl);
    } else {
      animate(y, 0, {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      });
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: -600, bottom: 0 }}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
      style={{ y }}
      className="absolute inset-0 z-50 backdrop-blur-3xl bg-black/20 p-6 pt-14 text-white font-sans select-none"
    >
      <div className="absolute inset-0 -z-10" onClick={closeControl} />

      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        {/* 1. Connections */}
        <div className="col-span-2 row-span-2 bg-white/20 backdrop-blur-md rounded-[2.5rem] p-4 grid grid-cols-2 gap-4">
          <IconButton
            active={isAirplaneModeOn}
            color="bg-orange-400"
            onClick={toggleAirplaneMode}
            icon={<PlaneIcon />}
          />
          <IconButton
            active={isSignalOn}
            color="bg-green-500"
            onClick={toggleSignal}
            icon={<SignalIcon />}
          />
          <IconButton
            active={isWifiOn}
            color="bg-blue-500"
            onClick={toggleWifi}
            icon={<WifiIcon />}
          />
          <IconButton
            active={isBluetoothOn}
            color="bg-blue-600"
            onClick={toggleBluetooth}
            icon={<BluetoothIcon />}
          />
        </div>

        {/* 2. Media Player */}
        <div className="col-span-2 row-span-2 bg-white/20 backdrop-blur-md rounded-[2.5rem] p-5 flex flex-col justify-between overflow-hidden">
          <div className="text-center mt-2 overflow-hidden relative h-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSongIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p className="text-lg font-semibold truncate px-1 w-full text-center">
                  {currentSong.name}
                </p>
                <p className="text-xs opacity-60 truncate w-full text-center">
                  {currentSong.artist}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-between items-center px-1 pb-2">
            <button
              onClick={() => prevSong(playlist.length)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <FastForwardIcon className="rotate-180 w-5 h-5" />
            </button>
            <div
              onClick={toggleMusic}
              className="cursor-pointer p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              {isMusicPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </div>
            <button
              onClick={() => nextSong(playlist.length)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <FastForwardIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle Row */}
        <Square onClick={toggleRotationLock}>
          <IconButton
            active={isRotationLocked}
            color="bg-yellow-600"
            icon={<RotationIcon />}
          />
        </Square>
        <Square onClick={toggleDarkMode}>
          <IconButton
            active={isDarkModeOn}
            color="bg-indigo-500"
            icon={<MoonIcon />}
          />
        </Square>

        {/* Sliders */}
        <div className="row-span-2">
          <VerticalSlider
            icon={<SunIcon />}
            value={brightness}
            onChange={setBrightness}
          />
        </div>
        <div className="row-span-2">
          <VerticalSlider
            icon={<VolumeIcon />}
            value={volume}
            onChange={setVolume}
          />
        </div>

        {/* Mirror */}
        <div className="col-span-2 bg-white/20 backdrop-blur-md rounded-[1.5rem] p-4 flex items-center gap-3">
          <MirrorIcon />
          <span className="text-[11px] leading-tight font-medium">
            Screen
            <br />
            Mirroring
          </span>
        </div>

        {/* Bottom row */}
        <Square onClick={toggleTorch}>
          <IconButton
            active={isTorchOn}
            color="bg-yellow-400"
            icon={<TorchIcon />}
          />
        </Square>
        <Square>
          <TimerIcon />
        </Square>
        <Square onClick={handleOpenCalc}>
          <div
            ref={calcIconRef}
            className="w-full h-full flex items-center justify-center"
          >
            <CalcIcon />
          </div>
        </Square>
        <Square>
          <CameraIcon />
        </Square>
      </div>
    </motion.div>
  );
}

/* --- UI Helpers --- */

function IconButton({ icon, active, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-full aspect-square rounded-full flex items-center justify-center transition-all cursor-pointer
      ${active ? color : "bg-white/10"}`}
    >
      {icon}
    </div>
  );
}

function VerticalSlider({ icon, value, onChange }) {
  const sliderHeight = 155;
  const bind = useGesture({
    onDrag: ({ movement: [, my], first, memo }) => {
      if (first) return value;
      const delta = -my / sliderHeight;
      const newValue = Math.max(0, Math.min(1, memo + delta));
      onChange(newValue);
      return memo;
    },
  });

  return (
    <div
      {...bind()}
      className="w-full h-[155px] bg-white/20 backdrop-blur-md rounded-[1.5rem] overflow-hidden flex flex-col justify-end relative touch-none"
    >
      <div
        className="absolute bottom-0 w-full bg-white/40 pointer-events-none"
        style={{ height: `${value * 100}%` }}
      />
      <div className="z-10 w-full flex justify-center mb-4 opacity-80 pointer-events-none">
        {icon}
      </div>
    </div>
  );
}

function Square({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/20 backdrop-blur-md aspect-square rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
    >
      {children}
    </div>
  );
}

/* --- SVGs --- */

const PlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);
const SignalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="18" x2="12" y2="21"></line>
    <circle cx="12" cy="15" r="2"></circle>
    <path d="M7 11c-1.8 1.8-1.8 4.7 0 6.5"></path>
    <path d="M4.5 8.5c-3.1 3.1-3.1 8.1 0 11"></path>
    <path d="M17 11c1.8 1.8 1.8 4.7 0 6.5"></path>
    <path d="M19.5 8.5c3.1 3.1 3.1 8.1 0 11"></path>
  </svg>
);
const WifiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 13a10 10 0 0 1 14 0"></path>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
    <path d="M12 20h.01"></path>
  </svg>
);
const BluetoothIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m7 7 10 10-5 5V2l5 5L7 17" />
  </svg>
);
const PlayIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  </svg>
);
const PauseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const FastForwardIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z" />
    <path d="M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z" />
  </svg>
);
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="12" y1="2" x2="12" y2="4"></line>
    <line x1="12" y1="20" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="4" y2="12"></line>
    <line x1="20" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
  </svg>
);
const VolumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      transform="rotate(-15 12 12)"
    />
  </svg>
);
const RotationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
const MirrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
const TorchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 13v1" />
    <path d="M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z" />
    <path d="M6 6h12" />
  </svg>
);
const TimerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="10" x2="14" y1="2" y2="2" />
    <line x1="12" x2="15" y1="14" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);
const CalcIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
