import { useOSStore } from "../../../store/useOSStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Trash2, Pin } from "lucide-react";

const NoteEditor = () => {
  const {
    notes,
    activeNoteId,
    updateNote,
    deleteNote,
    setActiveNote,
    togglePin,
  } = useOSStore();
  const note = notes.find((n) => n.id === activeNoteId);
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setContent(note?.content || "");
  }, [activeNoteId]);

  const handleChange = (e) => {
    setContent(e.target.value);
    updateNote(activeNoteId, e.target.value);
  };

  if (!note) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="absolute inset-0 bg-black flex flex-col z-20"
    >
      <div className="pt-14 px-4 h-28 flex items-center justify-between">
        <button
          onClick={() => setActiveNote(null)}
          className="flex items-center text-[#EAB308] font-medium"
        >
          <ChevronLeft size={28} />
          <span>Notes</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => togglePin(note.id)}
            className={note.pinned ? "text-[#EAB308]" : "text-white/30"}
          >
            <Pin size={20} fill={note.pinned ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => deleteNote(activeNoteId)}
            className="text-white/30"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => setActiveNote(null)}
            className="text-[#EAB308] font-bold"
          >
            Done
          </button>
        </div>
      </div>

      <textarea
        autoFocus
        value={content}
        onChange={handleChange}
        className="flex-1 bg-transparent px-8 py-2 resize-none outline-none text-lg leading-relaxed text-white/90 placeholder:text-white/10"
        placeholder="Start writing..."
      />
    </motion.div>
  );
};

export default NoteEditor;
