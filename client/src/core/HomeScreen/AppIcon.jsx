import { motion } from "framer-motion";
import { useOSStore } from "../../store/useOSStore";
import { useRef } from "react";

export default function AppIcon({ name, dock }) {
  const openApp = useOSStore((s) => s.openApp);
  const iconRef = useRef(null);

  const handleOpen = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      openApp(name, {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  const Icon = icons[name] || icons.Default;
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleOpen}
      className={`flex flex-col items-center gap-2 select-none cursor-pointer`}
    >
      <div
        ref={iconRef}
        className={`${
          dock ? "w-14 h-14" : "w-16 h-16"
        } rounded-2xl flex items-center justify-center`}
      >
        <Icon className="w-full h-full" />
      </div>

      {!dock && (
        <span className="text-xs text-center font-medium text-white">
          {name}
        </span>
      )}
    </motion.div>
  );
}

const icons = {
  Safari: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      {/* Background Gradient */}
      <defs>
        <linearGradient
          id="safari_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#029AFF" />
          <stop offset="1" stopColor="#026FFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#safari_grad)" />
      {/* Compass Dial */}
      <circle cx="30" cy="30" r="23" fill="white" />
      <circle cx="30" cy="30" r="20" stroke="#E5E5E5" strokeWidth="0.5" />
      {/* Needle */}
      <path d="M30 15 L33 27 L30 30 L27 27 Z" fill="#FF3B30" />{" "}
      {/* Red North */}
      <path d="M30 45 L27 33 L30 30 L33 33 Z" fill="#A2A2A2" />{" "}
      {/* Grey South */}
    </svg>
  ),
  Photos: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Simplified 'Color Wheel' - Use specific iOS colors */}
      <circle cx="30" cy="22" r="8" fill="#FF3B30" opacity="0.9" /> {/* Red */}
      <circle cx="38" cy="27" r="8" fill="#FF9500" opacity="0.9" />{" "}
      {/* Orange */}
      <circle cx="38" cy="37" r="8" fill="#FFCC00" opacity="0.9" />{" "}
      {/* Yellow */}
      <circle cx="30" cy="42" r="8" fill="#4CD964" opacity="0.9" />{" "}
      {/* Green */}
      <circle cx="22" cy="37" r="8" fill="#5AC8FA" opacity="0.9" />{" "}
      {/* Light Blue */}
      <circle cx="22" cy="27" r="8" fill="#007AFF" opacity="0.9" /> {/* Blue */}
    </svg>
  ),
  Camera: () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="60" rx="14" fill="#8E8E93" />{" "}
      <path
        d="M22 22 V18 C22 17.4 22.4 17 23 17 H37 C37.6 17 38 17.4 38 18 V22"
        fill="#E5E5E5"
      />
      <rect x="12" y="22" width="36" height="26" rx="6" fill="#E5E5E5" />
      <circle cx="30" cy="35" r="9" stroke="#8E8E93" stroke-width="1.5" />{" "}
      <circle cx="30" cy="35" r="6" fill="#333333" />{" "}
      <circle cx="30" cy="35" r="2.5" fill="#1A1A1A" />
      <circle
        cx="48"
        cy="27"
        r="1.8"
        fill="#FF3B30"
        stroke="white"
        stroke-width="0.5"
      />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="mail_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5AC8FA" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#mail_grad)" />
      {/* Envelope Outline */}
      <path
        d="M12 20 H48 V42 H12 Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20 L30 32 L48 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="black" />
      <circle cx="30" cy="30" r="26" fill="white" />
      {/* Hour Markers (Minimalist) */}
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="30"
          y1="8"
          x2="30"
          y2="11"
          stroke="black"
          strokeWidth="1"
          transform={`rotate(${i * 30} 30 30)`}
        />
      ))}
      {/* Minute Hand */}
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="12"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Hour Hand */}
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="18"
        stroke="black"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Second Hand (Red) */}
      <line x1="30" y1="35" x2="30" y2="10" stroke="#FF3B30" strokeWidth="1" />
      <circle cx="30" cy="30" r="1.5" fill="#FF3B30" />
    </svg>
  ),
  Maps: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Map Grid and Route (Simplified) */}
      <path d="M15 15 H45 V45 H15 Z" fill="#F2F2F2" stroke="#E5E5E5" />
      <path
        d="M25 15 V45 M35 15 V45 M15 25 H45 M15 35 H45"
        stroke="#D1D1D1"
        strokeWidth="0.5"
      />
      {/* Location Pin */}
      <path
        d="M30 20 C25 20, 22 24, 22 28 C22 34, 30 40, 30 40 C30 40, 38 34, 38 28 C38 24, 35 20, 30 20 Z"
        fill="#FF3B30"
      />
      <circle cx="30" cy="28" r="3" fill="white" />
    </svg>
  ),
  Weather: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="weather_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5AC8FA" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#weather_grad)" />
      {/* Sun and Cloud */}
      <circle cx="40" cy="25" r="8" fill="#FFCC00" />
      <path
        d="M20 35 C15 35, 12 38, 12 42 C12 46, 15 49, 20 49 H35 C40 49, 43 46, 43 42 C43 38, 40 35, 35 35 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  ),
  Notes: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="#FFCC00" /> {/* Yellow Pad */}
      {/* Lines */}
      <path
        d="M15 20 H45 M15 28 H45 M15 36 H45 M15 44 H45"
        stroke="#FF9500"
        strokeWidth="1"
      />
      {/* Red Vertical Line */}
      <line x1="12" y1="10" x2="12" y2="50" stroke="#FF3B30" strokeWidth="1" />
    </svg>
  ),
  "App Store": ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="appstore_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5AC8FA" />
          <stop offset="1" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#appstore_grad)" />
      {/* The 'A' logo made of rounded sticks */}
      <g transform="translate(15, 15) scale(1.25)">
        <rect
          x="0"
          y="20"
          width="24"
          height="4"
          rx="2"
          fill="white"
          transform="rotate(-60 0 20)"
        />
        <rect
          x="12"
          y="0"
          width="24"
          height="4"
          rx="2"
          fill="white"
          transform="rotate(60 12 0)"
        />
        <rect x="6" y="14" width="12" height="4" rx="2" fill="white" />
      </g>
    </svg>
  ),
  Music: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Single Note Logo - Use iOS Red/Pink */}
      <path
        d="M22 45 C18 45, 15 42, 15 38 C15 34, 18 31, 22 31 C23 31, 24 31, 25 32 V15 H42 V20 H28 V38 C28 42, 25 45, 22 45 Z"
        fill="#FF3B30"
      />
    </svg>
  ),
  Settings: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="#8E8E93" /> {/* System Grey */}
      {/* Gear (Bold and precise for Retina) */}
      <circle cx="30" cy="30" r="18" stroke="white" strokeWidth="4.5" />
      <circle cx="30" cy="30" r="6" fill="white" />
      {/* Teeth (simplified) */}
      {[...Array(8)].map((_, i) => (
        <rect
          key={i}
          x="28"
          y="8"
          width="4"
          height="6"
          rx="1"
          fill="white"
          transform={`rotate(${i * 45} 30 30)`}
        />
      ))}
    </svg>
  ),
  Files: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Folder Outline */}
      <path
        d="M12 20 C12 18, 14 17, 16 17 H28 L32 21 H44 C46 21, 48 22, 48 24 V42 C48 44, 46 45, 44 45 H16 C14 45, 12 44, 12 42 Z"
        stroke="#007AFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Phone: () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="phone_grad_perfect"
          x1="30"
          y1="0"
          x2="30"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#35de64" />
          <stop offset="1" stop-color="#29c452" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="13" fill="url(#phone_grad_perfect)" />

      <path
        d="M42.2 36.8C42.2 38.2 41.1 40.4 39.4 41.6C37.2 43.1 34.2 43.3 30.7 41.3C26.5 38.9 22.1 34.5 19.3 29.8C17.4 26.5 17.5 23.5 18.9 21.3C20.1 19.5 22.3 18.5 23.6 18.5C24.1 18.5 24.5 18.6 24.9 19.1C25.9 20.3 27.6 23.3 28.1 24.3C28.5 25.1 28.5 25.8 27.8 26.6C27.2 27.4 26.5 28.1 25.8 28.7C25.4 29.1 25.3 29.6 25.6 30.2C26.3 31.6 28.2 34.4 29.8 35.8C30.4 36.3 31 36.3 31.4 35.9C32 35.2 32.8 34.5 33.6 33.8C34.4 33.1 35.1 33.1 35.9 33.6C36.9 34.1 39.9 35.8 41.1 36.8C41.7 37.1 42.2 37.6 42.2 38.2V36.8Z"
        fill="white"
      />
    </svg>
  ),
  YouTube: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* YouTube Red Play Button */}
      <rect x="10" y="18" width="40" height="24" rx="6" fill="#FF0000" />
      <path d="M26 24 L36 30 L26 36 Z" fill="white" />
    </svg>
  ),
  Instagram: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="insta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="25%" stopColor="#FA7E1E" />
          <stop offset="50%" stopColor="#D62976" />
          <stop offset="75%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="url(#insta)" />
      <rect
        x="32"
        y="32"
        width="36"
        height="36"
        rx="12"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
      />
      <circle
        cx="50"
        cy="50"
        r="10"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
      />
      <circle cx="72" cy="28" r="5" fill="#fff" />
    </svg>
  ),
  WhatsApp: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="#25D366" />{" "}
      {/* WhatsApp Green */}
      {/* Chat Bubble with Phone (Simplified) */}
      <path
        d="M30 15 C22 15, 15 21, 15 28 C15 31, 16 33, 17 36 L15 45 L24 42 C26 43, 28 44, 30 44 C38 44, 45 38, 45 30 C45 22, 38 15, 30 15 Z"
        fill="white"
      />
      <path
        d="M25 25 C24 25, 23 26, 23 27 V33 C23 34, 24 35, 25 35 H35 C36 35, 37 34, 37 33 V27 C37 26, 36 25, 35 25 Z"
        fill="#25D366"
      />{" "}
      {/* Phone base */}
    </svg>
  ),
  Calculator: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="#FF9500" /> {/* Orange */}
      {/* Simplified Grid */}
      <line x1="30" y1="15" x2="30" y2="45" stroke="white" strokeWidth="1.5" />
      <line x1="15" y1="30" x2="45" y2="30" stroke="white" strokeWidth="1.5" />
      {/* Equals Sign (Bold and precise) */}
      <line
        x1="35"
        y1="35"
        x2="40"
        y2="35"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="40"
        x2="40"
        y2="40"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Day Name (Red) */}
      <text
        x="30"
        y="20"
        textAnchor="middle"
        fill="#FF3B30"
        fontSize="10"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        Monday
      </text>
      {/* Day Number (Large Black) */}
      <text
        x="30"
        y="48"
        textAnchor="middle"
        fill="black"
        fontSize="30"
        fontWeight="200"
        fontFamily="system-ui"
      >
        2
      </text>
    </svg>
  ),
  Reminders: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Checkbox and Lines */}
      {[20, 30, 40].map((y, i) => (
        <g key={i}>
          <circle cx="18" cy={y} r="3" stroke="#FF9500" strokeWidth="1.5" />
          <line
            x1="26"
            y1={y}
            x2="48"
            y2={y}
            stroke="#D1D1D1"
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  ),
  Contacts: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="contacts_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D1D1D1" />
          <stop offset="1" stopColor="#8E8E93" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#contacts_grad)" />
      {/* Person Silhouette and A-Z tabs */}
      <circle cx="30" cy="25" r="7" fill="white" />
      <path
        d="M20 40 C20 35, 23 33, 30 33 C37 33, 40 35, 40 40 V45 H20 Z"
        fill="white"
      />
      <rect
        x="50"
        y="10"
        width="4"
        height="40"
        rx="2"
        fill="white"
        opacity="0.5"
      />
    </svg>
  ),
  Stocks: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="black" />
      {/* Upward Line Chart (iOS Green) */}
      <path
        d="M10 45 L20 35 L30 38 L42 22 L50 25"
        stroke="#4CD964"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="10" y1="50" x2="50" y2="50" stroke="#333333" strokeWidth="1" />
    </svg>
  ),
  Health: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Heart Logo made of dots/circles */}
      <circle cx="30" cy="30" r="10" fill="#FF2D55" /> {/* Red/Pink base */}
      <circle cx="23" cy="25" r="7" fill="white" />
      <circle cx="37" cy="25" r="7" fill="white" />
    </svg>
  ),
  Wallet: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="black" />
      {/* Stacked Cards and Contactless Symbol */}
      <rect x="10" y="20" width="40" height="25" rx="3" fill="#007AFF" />
      <rect
        x="15"
        y="15"
        width="40"
        height="25"
        rx="3"
        fill="#FF9500"
        opacity="0.8"
      />
      <circle cx="42" cy="32" r="4" stroke="white" strokeWidth="1.5" />
      <path
        d="M38 32 A4 4 0 0 1 46 32"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Shortcuts: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <rect width="60" height="60" rx="14" fill="white" />
      {/* Simplified Overlapping squares logo (iOS Blue/Pink) */}
      <rect
        x="15"
        y="15"
        width="20"
        height="20"
        rx="5"
        fill="#5AC8FA"
        opacity="0.9"
      />
      <rect
        x="25"
        y="25"
        width="20"
        height="20"
        rx="5"
        fill="#FF2D55"
        opacity="0.9"
      />
    </svg>
  ),
  Translate: ({ className }) => (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="translate_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCC00" />
          <stop offset="1" stopColor="#FF9500" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#translate_grad)" />
      {/* Simplified Globe and 'A' character */}
      <circle cx="25" cy="25" r="12" stroke="white" strokeWidth="1.5" />
      <text
        x="40"
        y="45"
        fill="white"
        fontSize="20"
        fontWeight="bold"
        fontFamily="serif"
      >
        文
      </text>
    </svg>
  ),
  Messages: () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="sms_grad"
          x1="0"
          y1="0"
          x2="0"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#30D158" />
          <stop offset="1" stop-color="#34C759" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="14" fill="url(#sms_grad)" />
      <path
        d="M15 18 C15 16.3 16.3 15 18 15 H42 C43.7 15 45 16.3 45 18 V34 C45 35.7 43.7 37 42 37 H26 L18 45 L18 37 H18 C16.3 37 15 35.7 15 34 V18 Z"
        fill="white"
      />
    </svg>
  ),
  Default: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  ),
};
