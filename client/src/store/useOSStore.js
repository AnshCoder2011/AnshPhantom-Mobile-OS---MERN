import { create } from "zustand";

export const useOSStore = create((set) => ({
  // 🔐 LOCK
  isUnlocked: false,
  showPasscode: false,

  // 📱 CONTROL CENTER
  isControlOpen: false,
  openControl: () => set({ isControlOpen: true }),
  closeControl: () => set({ isControlOpen: false }),

  // 📂 APPS (OPEN/CLOSE LOGIC)
  activeApp: null, // "Calculator", "Safari", etc.P
  appOriginRect: null, // { x, y, width, height } for zoom effect
  openApp: (appName, rect) => set({ activeApp: appName, appOriginRect: rect }),
  closeApp: () => set({ activeApp: null }),

  // 🗺 MAP STATE
  userLocation: null,
  setUserLocation: (coords) => set({ userLocation: coords }),

  // Control Center Toggles
  isWifiOn: true,
  toggleWifi: () => set((state) => ({ isWifiOn: !state.isWifiOn })),
  isBluetoothOn: true,
  toggleBluetooth: () =>
    set((state) => ({ isBluetoothOn: !state.isBluetoothOn })),
  isAirplaneModeOn: false,
  toggleAirplaneMode: () =>
    set((state) => ({ isAirplaneModeOn: !state.isAirplaneModeOn })),
  isSignalOn: true,
  toggleSignal: () => set((state) => ({ isSignalOn: !state.isSignalOn })),
  isRotationLocked: false,
  toggleRotationLock: () =>
    set((state) => ({ isRotationLocked: !state.isRotationLocked })),
  isDarkModeOn: false,
  toggleDarkMode: () => set((state) => ({ isDarkModeOn: !state.isDarkModeOn })),
  isTorchOn: false,
  toggleTorch: () => set((state) => ({ isTorchOn: !state.isTorchOn })),

  // Control Center Sliders
  brightness: 0.5,
  setBrightness: (value) => set({ brightness: value }),
  volume: 0.5,
  setVolume: (value) => set({ volume: value }),

  // Music Player
  isMusicPlaying: false,
  currentSongIndex: 0,
  toggleMusic: () =>
    set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
  nextSong: (total) =>
    set((state) => ({
      currentSongIndex: (state.currentSongIndex + 1) % total,
      isMusicPlaying: true,
    })),
  prevSong: (total) =>
    set((state) => ({
      currentSongIndex: (state.currentSongIndex - 1 + total) % total,
      isMusicPlaying: true,
    })),

  // 🔢 PASSCODE
  passcode: "",
  correctPasscode: "2011",

  revealPasscode: () => set({ showPasscode: true }),

  addDigit: (digit) =>
    set((state) => ({
      passcode:
        state.passcode.length < 4 ? state.passcode + digit : state.passcode,
    })),

  deleteDigit: () =>
    set((state) => ({
      passcode: state.passcode.slice(0, -1),
    })),

  checkPasscode: (input) =>
    set((state) => {
      if (input === state.correctPasscode) {
        return {
          isUnlocked: true,
          showPasscode: false,
          passcode: "",
        };
      }
      return { passcode: "" };
    }),

  reset: () =>
    set({
      isUnlocked: false,
      showPasscode: false,
      isControlOpen: false,
      passcode: "",
    }),
}));
