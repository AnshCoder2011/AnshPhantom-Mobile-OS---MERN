import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useOSStore } from "../../../store/useOSStore";
import { motion, useMotionValue, animate } from "framer-motion";
import { useGesture } from "@use-gesture/react";

export default function Maps() {
  const closeApp = useOSStore((s) => s.closeApp);
  const isWifiOn = useOSStore((s) => s.isWifiOn);
  const isSignalOn = useOSStore((s) => s.isSignalOn);
  const userLocation = useOSStore((s) => s.userLocation);
  const setUserLocation = useOSStore((s) => s.setUserLocation);

  // Swipe-to-close logic
  const dragY = useMotionValue(0);
  const dragScale = useMotionValue(1);

  const bindExit = useGesture({
    onDrag: ({ movement: [, my], velocity: [, vy], down }) => {
      if (down) {
        if (my < 0) {
          dragY.set(my);
          const newScale = Math.max(0.9, 1 + my / 1000);
          dragScale.set(newScale);
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
    if (!isWifiOn || !isSignalOn) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          console.log("Location permission denied");
        },
      );
    }
  }, [isWifiOn, isSignalOn]);

  if (!isWifiOn || !isSignalOn) {
    return (
      <motion.div
        style={{ y: dragY, scale: dragScale }}
        className="w-full h-full flex items-center justify-center bg-black text-white relative overflow-hidden"
      >
        No Internet Connection
        {/* Home Indicator */}
        <div
          {...bindExit()}
          className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 bg-black/50 backdrop-blur-md border-t border-white/10"
        >
          <div className="w-32 h-1.5 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    );
  }

  if (!userLocation) {
    return (
      <motion.div
        style={{ y: dragY, scale: dragScale }}
        className="w-full h-full flex items-center justify-center bg-black text-white relative overflow-hidden"
      >
        Getting Location...
        {/* Home Indicator */}
        <div
          {...bindExit()}
          className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 bg-black/50 backdrop-blur-md border-t border-white/10"
        >
          <div className="w-32 h-1.5 bg-white/20 rounded-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ y: dragY, scale: dragScale }}
      className="w-full h-full relative overflow-hidden select-none touch-none"
    >
      <MapContainer
        center={userLocation}
        zoom={15}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation}>
          <Popup>You are here 📍</Popup>
        </Marker>
      </MapContainer>

      {/* Home Indicator (Swipe to Close) */}
      <div
        {...bindExit()}
        className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center cursor-grab active:cursor-grabbing z-50 bg-black/50 backdrop-blur-md border-t border-white/10"
      >
        <div className="w-32 h-1.5 bg-white/20 rounded-full" />
      </div>
    </motion.div>
  );
}
