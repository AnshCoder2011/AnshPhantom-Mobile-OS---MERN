import { useOSStore } from "../../../store/useOSStore";
import { motion } from "framer-motion";
import { Pin } from "lucide-react";

const NotesList = () => {
  const { notes, setActiveNote, searchTerm } = useOSStore();

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      n.content.toLowerCase().includes((searchTerm || "").toLowerCase()),
  );

  const pinned = filtered.filter((n) => n.pinned);
  const others = filtered.filter((n) => !n.pinned);

  const NoteCard = ({ note }) => (
    <motion.div
      whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      onClick={() => setActiveNote(note.id)}
      className="px-4 py-3 cursor-pointer border-b border-white/5 last:border-none"
    >
      <div className="flex items-center gap-2">
        {note.pinned && (
          <Pin size={10} className="text-[#EAB308] fill-[#EAB308]" />
        )}
        <h2 className="font-bold text-base truncate">
          {note.title || "New Note"}
        </h2>
      </div>
      <div className="flex gap-2 items-center opacity-40">
        <span className="text-xs whitespace-nowrap">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <p className="text-sm truncate">
          {note.content || "No additional text"}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide">
      {pinned.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider ml-4 mb-2">
            Pinned
          </h3>
          <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-xl">
            {pinned.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider ml-4 mb-2">
          Notes
        </h3>
        <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-xl">
          {others.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-white/20">No Results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesList;
