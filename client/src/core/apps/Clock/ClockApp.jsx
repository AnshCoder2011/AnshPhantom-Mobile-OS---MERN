import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useOSStore } from "../../../store/useOSStore";
import DigitalClock from "./DigitalClock";
import Stopwatch from "./Stopwatch";
import WorldClock from "./WorldClock";
import { Clock, Globe, Timer } from "lucide-react";

const tabs = [
  { id: "World", label: "World Clock", icon: Globe },
  { id: "Clock", label: "Alarm", icon: Clock },
  { id: "Stopwatch", label: "Stopwatch", icon: Timer },
];

const ClockApp = () => {
  const closeApp = useOSStore((s) => s.closeApp);
  const [activeTab, setActiveTab] = useState("Clock");

  const y = useMotionValue(0);
  // Fixed: Swipe UP to close logic
  const scale = useTransform(y, [0, -200], [1, 0.85]);
  const opacity = useTransform(y, [0, -200], [1, 0]);

  const handleDragEnd = (_, info) => {
    // If swiped up significantly or with high velocity
    if (info.offset.y < -120 || info.velocity.y < -500) {
      closeApp();
    } else {
      animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <motion.div
      style={{ y, scale, opacity }}
      drag="y"
      dragConstraints={{ top: -300, bottom: 0 }} // Constraints fixed for swipe up
      onDragEnd={handleDragEnd}
      className="relative w-full h-full bg-black text-white flex flex-col overflow-hidden font-sans"
    >
      {/* Top Header */}
      <div className="pt-14 px-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {tabs.find((t) => t.id === activeTab).label}
        </h1>
        <button className="text-orange-500 text-lg font-medium">Edit</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "Clock" && <DigitalClock />}
            {activeTab === "World" && <WorldClock />}
            {activeTab === "Stopwatch" && <Stopwatch />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Premium Blurred Tab Bar */}
      <div className="absolute bottom-0 w-full bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 pb-8 pt-2">
        <div className="flex justify-around items-end">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 group w-20"
              >
                <Icon
                  size={26}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors ${isActive ? "text-orange-500" : "text-zinc-500"}`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${isActive ? "text-orange-500" : "text-zinc-500"}`}
                >
                  {tab.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gesture Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-32 h-1.5 bg-white/20 rounded-full" />
      </div>
    </motion.div>
  );
};

export default ClockApp;
