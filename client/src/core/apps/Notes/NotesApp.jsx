import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOSStore } from "../../../store/useOSStore";
import NotesList from "./NotesList";
import NotesEditor from "./NotesEditor";
import BottomGestureBar from "../../../components/system/BottomGestureBar";
import { Plus, Search } from "lucide-react";

const NotesApp = () => {
  const { activeNoteId, addNote, setSearchTerm } = useOSStore();

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {!activeNoteId ? (
          <motion.div
            key="list-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header Area */}
            <div className="pt-14 px-6">
              <h1 className="text-3xl font-bold mb-4">Notes</h1>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  size={18}
                />
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:bg-white/15 transition-all text-sm"
                />
              </div>
            </div>

            <NotesList />

            {/* Bottom Toolbar (iOS Style) */}
            <div className="absolute bottom-0 w-full h-20 bg-white/5 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-8 pb-4">
              <div className="text-[#EAB308] text-xs font-medium">
                {useOSStore.getState().notes.length} Notes
              </div>
              <button
                onClick={addNote}
                className="text-[#EAB308] p-2 active:scale-90 transition-transform"
              >
                <Plus size={28} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        ) : (
          <NotesEditor key="editor" />
        )}
      </AnimatePresence>

      <BottomGestureBar />
    </div>
  );
};

export default NotesApp;
