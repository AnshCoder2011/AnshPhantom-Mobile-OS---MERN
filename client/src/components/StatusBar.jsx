import { useDrag } from "@use-gesture/react";
import { useOSStore } from "../store/useOSStore";
import { useState, useEffect } from "react";

export default function StatusBar() {
  const openControl = useOSStore((s) => s.openControl);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const bind = useDrag(({ movement: [, my], last }) => {
    if (last && my > 60) {
      openControl();
    }
  });

  return (
    <div
      {...bind()}
      style={{ touchAction: "none" }}
      className="absolute top-0 w-full px-6 pt-4 flex justify-between text-sm z-40 text-white"
    >
      <span>
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>

      <span>
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
          <rect x="2" y="7" width="16" height="10" rx="2.5" />

          <path d="M22 10.5v3" stroke-width="2.5" />

          <rect
            x="4.5"
            y="9.5"
            width="5.5"
            height="5"
            rx="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </span>
    </div>
  );
}
