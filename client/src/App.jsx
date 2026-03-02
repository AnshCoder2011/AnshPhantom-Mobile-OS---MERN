import PhoneFrame from "./components/PhoneFrame";
import LockScreen from "./core/LockScreen/LockScreen";
import { useOSStore } from "./store/useOSStore";
import StatusBar from "./components/StatusBar";

import ControlCenter from "./core/ControlCenter/ControlCenter";
import HomeScreen from "./core/HomeScreen/HomeScreen";
import { AnimatePresence, motion } from "framer-motion";
import Calculator from "./core/apps/Calculator";
import Safari from "./core/apps/Safari";
import Camera from "./core/apps/camera/Camera";
import Photos from "./core/apps/photos/Photos";
import AppPlaceholder from "./core/apps/AppPlaceholder";
import Maps from "./core/apps/maps/Maps";
import Phone from "./core/apps/phone/Phone";
import Music from "./core/apps/Music/Music";


function App() {
  const isUnlocked = useOSStore((s) => s.isUnlocked);
  const activeApp = useOSStore((s) => s.activeApp);
  const appOriginRect = useOSStore((s) => s.appOriginRect);

  return (
    <PhoneFrame>
      <StatusBar />
      <AnimatePresence>
        {!isUnlocked ? (
          <LockScreen key="lock-screen" />
        ) : (
          <HomeScreen key="home-screen" />
        )}
      </AnimatePresence>

      {/* App Overlays with Zoom-from-Icon Animation */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp}
            initial={{
              clipPath: `inset(${appOriginRect?.y}px ${
                400 - (appOriginRect?.x + appOriginRect?.width)
              }px ${800 - (appOriginRect?.y + appOriginRect?.height)}px ${
                appOriginRect?.x
              }px round 20px)`,
              opacity: 0,
              scale: 0.2,
            }}
            animate={{
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              opacity: 1,
              scale: 1,
            }}
            exit={{
              clipPath: `inset(${appOriginRect?.y}px ${
                400 - (appOriginRect?.x + appOriginRect?.width)
              }px ${800 - (appOriginRect?.y + appOriginRect?.height)}px ${
                appOriginRect?.x
              }px round 20px)`,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="absolute inset-0 z-[60] bg-black overflow-hidden"
          >
            {activeApp === "Calculator" && <Calculator />}
            {activeApp === "Safari" && <Safari />}
            {activeApp === "Camera" && <Camera />}
            {activeApp === "Photos" && <Photos />}
            {activeApp === "Phone" && <Phone />}
            {activeApp === "Maps" && <Maps />}
            {activeApp === "Music" && <Music />}

            {!["Calculator", "Safari", "Camera", "Photos", "Maps", "Phone", "Music"].includes(
              activeApp,
            ) && <AppPlaceholder name={activeApp} />}
          </motion.div>
        )}
      </AnimatePresence>

      <ControlCenter />
    </PhoneFrame>
  );
}

export default App;
