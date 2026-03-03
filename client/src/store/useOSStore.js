import { create } from "zustand";

const loadNotes = () => {
  try {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useOSStore = create((set, get) => ({
  // 🔐 LOCK
  isUnlocked: false,
  showPasscode: false,

  // 📱 CONTROL CENTER
  isControlOpen: false,
  openControl: () => set({ isControlOpen: true }),
  closeControl: () => set({ isControlOpen: false }),

  // 📂 APPS
  activeApp: null,
  appOriginRect: null,
  openApp: (appName, rect) => set({ activeApp: appName, appOriginRect: rect }),
  closeApp: () => set({ activeApp: null }),

  // 🗺 MAP
  userLocation: null,
  setUserLocation: (coords) => set({ userLocation: coords }),

  // 🎛 Toggles
  isWifiOn: true,
  toggleWifi: () => set((s) => ({ isWifiOn: !s.isWifiOn })),
  isBluetoothOn: true,
  toggleBluetooth: () => set((s) => ({ isBluetoothOn: !s.isBluetoothOn })),
  isAirplaneModeOn: false,
  toggleAirplaneMode: () =>
    set((s) => ({ isAirplaneModeOn: !s.isAirplaneModeOn })),
  isSignalOn: true,
  toggleSignal: () => set((s) => ({ isSignalOn: !s.isSignalOn })),
  isRotationLocked: false,
  toggleRotationLock: () =>
    set((s) => ({ isRotationLocked: !s.isRotationLocked })),
  isDarkModeOn: false,
  toggleDarkMode: () => set((s) => ({ isDarkModeOn: !s.isDarkModeOn })),
  isTorchOn: false,
  toggleTorch: () => set((s) => ({ isTorchOn: !s.isTorchOn })),

  // 🎚 Sliders
  brightness: 0.5,
  setBrightness: (value) => set({ brightness: value }),
  volume: 0.5,
  setVolume: (value) => set({ volume: value }),

  // 🎵 Music
  isMusicPlaying: false,
  currentSongIndex: 0,
  toggleMusic: () => set((s) => ({ isMusicPlaying: !s.isMusicPlaying })),
  nextSong: (total) =>
    set((s) => ({
      currentSongIndex: (s.currentSongIndex + 1) % total,
      isMusicPlaying: true,
    })),
  prevSong: (total) =>
    set((s) => ({
      currentSongIndex: (s.currentSongIndex - 1 + total) % total,
      isMusicPlaying: true,
    })),

  // 📝 NOTES
  notes: loadNotes(),
  activeNoteId: null,

  addNote: () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
      createdAt: new Date().toISOString(),
    };

    const updated = [newNote, ...get().notes];
    localStorage.setItem("notes", JSON.stringify(updated));

    set({
      notes: updated,
      activeNoteId: newNote.id,
    });
  },

  setActiveNote: (id) => set({ activeNoteId: id }),

  updateNote: (id, content) => {
    const updated = get().notes.map((note) =>
      note.id === id
        ? {
            ...note,
            content,
            title: content.split("\n")[0] || "Untitled",
          }
        : note,
    );

    localStorage.setItem("notes", JSON.stringify(updated));
    set({ notes: updated });
  },

  // Add these to your useOSStore.js actions:
  togglePin: (id) => {
    const updated = get().notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note,
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    set({ notes: updated });
  },
  setSearchTerm: (term) => set({ searchTerm: term }),

  deleteNote: (id) => {
    const updated = get().notes.filter((note) => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(updated));

    set({
      notes: updated,
      activeNoteId: null,
    });
  },

  // 🔢 PASSCODE
  passcode: "",
  correctPasscode: "2011",

  revealPasscode: () => set({ showPasscode: true }),

  addDigit: (digit) =>
    set((s) => ({
      passcode: s.passcode.length < 4 ? s.passcode + digit : s.passcode,
    })),

  deleteDigit: () =>
    set((s) => ({
      passcode: s.passcode.slice(0, -1),
    })),

  checkPasscode: (input) =>
    set((s) => {
      if (input === s.correctPasscode) {
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
