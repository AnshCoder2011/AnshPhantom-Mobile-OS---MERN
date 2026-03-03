import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useOSStore } from "../../../store/useOSStore";
import {
  PhoneCall,
  PhoneOff,
  Delete,
  MicOff,
  Grid3X3,
  Volume2,
  UserPlus,
  Video,
  Users,
} from "lucide-react";

export default function Phone() {
  const closeApp = useOSStore((s) => s.closeApp);

  const [number, setNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callTime, setCallTime] = useState(0);

  const [callLogs] = useState([
    { name: "Harshit Noob", time: "Yesterday", type: "Incoming" },
    { name: "Ankit Sir", time: "2 days ago", type: "Outgoing" },
    { name: "Harshit chor", time: "3 days ago", type: "Missed" },
    { name: "Ambani", time: "Last Week", type: "Incoming" },
    { name: "Virat Kohli", time: "3 days ago", type: "Incoming" },
    { name: "Donald Trump", time: "Last Week", type: "Incoming" },
    { name: "Modi Ji", time: "Last sec", type: "Incoming" },
  ]);

  // Swipe-to-close
  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bindExit = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (isCalling) return;

      if (down) {
        if (my < 0) {
          dragY.set(my);
          dragScale.set(Math.max(0.9, 1 + my / 1000));
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

  useEffect(() => {
    let interval;
    if (isCalling) {
      interval = setInterval(() => {
        setCallTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const dialNumbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "*",
    "0",
    "#",
  ];

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full bg-black text-white flex flex-col relative select-none touch-none overflow-hidden"
    >
      {!isCalling ? (
        <>
          {/* TOP HALF - CALL LOGS */}
          <div className="flex-1 overflow-y-auto pt-12 px-4 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-4">Recents</h2>

            {callLogs.map((log, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-white/5"
              >
                <div>
                  <div className="font-medium">{log.name}</div>
                  <div className="text-xs opacity-50">{log.type}</div>
                </div>
                <div className="text-xs opacity-40">{log.time}</div>
              </div>
            ))}
          </div>

          {/* BOTTOM HALF - DIAL PAD */}
          <div className="flex-1 px-6 pt-4 pb-20">
            <div className="text-center text-2xl tracking-widest min-h-[40px]">
              {number}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {dialNumbers.map((digit) => (
                <button
                  key={digit}
                  onClick={() => setNumber((prev) => prev + digit)}
                  className="w-16 h-16 rounded-full bg-white/10 text-xl active:scale-90 transition"
                >
                  {digit}
                </button>
              ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                onClick={() => setNumber((prev) => prev.slice(0, -1))}
                className="p-3 rounded-full bg-white/10"
              >
                <Delete size={18} />
              </button>

              <button
                onClick={() => number && setIsCalling(true)}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
              >
                <PhoneCall size={24} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* CALLING SCREEN */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
            <div className="text-3xl">{number}</div>
            <div className="opacity-60">{formatTime(callTime)}</div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-8 mt-8 text-center">
              <Action icon={<MicOff size={22} />} label="Mute" />
              <Action icon={<Grid3X3 size={22} />} label="Keypad" />
              <Action icon={<Volume2 size={22} />} label="Speaker" />
              <Action icon={<UserPlus size={22} />} label="Add Call" />
              <Action icon={<Video size={22} />} label="FaceTime" />
              <Action icon={<Users size={22} />} label="Contacts" />
            </div>

            {/* End Call */}
            <button
              onClick={() => {
                setIsCalling(false);
                setNumber("");
              }}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mt-10"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        </>
      )}

      {!isCalling && (
        <div
          {...bindExit()}
          className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 bg-black/50 backdrop-blur-md border-t border-white/10"
        >
          <div className="w-32 h-1.5 bg-white/20 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}

function Action({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs opacity-60">{label}</span>
    </div>
  );
}
