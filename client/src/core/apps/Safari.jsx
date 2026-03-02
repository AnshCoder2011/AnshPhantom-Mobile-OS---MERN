import { useState, useRef } from "react";
import BrowserToolbar from "./BrowserToolbar";
import { motion, useMotionValue, animate } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import { useGesture } from "@use-gesture/react";

export default function Safari() {
  const iframeRef = useRef(null);
  const closeApp = useOSStore((s) => s.closeApp);

  const [url, setUrl] = useState("https://wikipedia.org");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Swipe-to-close logic
  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bind = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (down) {
        // Dragging up effect
        if (my < 0) {
          dragY.set(my);
          // Scale down slightly as we drag up
          const newScale = Math.max(0.9, 1 + my / 1000);
          dragScale.set(newScale);
        }
      } else {
        // Thresholds for closing
        if (my < -100 || vy > 0.5) {
          closeApp();
        } else {
          // Snap back
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

  const formatUrl = (value) => {
    const trimmed = value.trim();
    // Check if it's a URL (contains a dot and no spaces)
    const isUrl = trimmed.includes(".") && !trimmed.includes(" ");

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    if (isUrl) {
      return "https://" + trimmed;
    }

    // Otherwise, treat as a search term
    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;

    const formatted = formatUrl(input);
    setUrl(formatted);
    setLoading(true);
  };

  const goBack = () => {
    iframeRef.current?.contentWindow.history.back();
  };

  const goForward = () => {
    iframeRef.current?.contentWindow.history.forward();
  };

  const reload = () => {
    iframeRef.current?.contentWindow.location.reload();
  };

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full flex flex-col bg-white select-none touch-none"
    >
      {/* Top Toolbar */}
      <BrowserToolbar
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        goBack={goBack}
        goForward={goForward}
        reload={reload}
      />

      {/* Loading Indicator */}
      {loading && <div className="h-1 bg-blue-500 animate-pulse" />}

      {/* Browser View */}
      <div className="flex-1 w-full relative">
        <iframe
          ref={iframeRef}
          src={url}
          title="Safari Mini Browser"
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />

        {/* Swipe Handle Area */}
        <div
          {...bind()}
          className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 bg-white/10 backdrop-blur-[2px]"
        >
          <div className="w-32 h-1.5 bg-black/20 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
