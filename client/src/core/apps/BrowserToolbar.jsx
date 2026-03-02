export default function BrowserToolbar({
  input,
  setInput,
  onSubmit,
  goBack,
  goForward,
  reload,
}) {
  return (
    <div className="flex items-center gap-2 p-3 border-b bg-gray-100">
      {/* Back Button */}
      <button onClick={goBack} className="px-2 py-1 text-lg">
        ←
      </button>

      {/* Forward Button */}
      <button onClick={goForward} className="px-2 py-1 text-lg">
        →
      </button>

      {/* Address Bar */}
      <form onSubmit={onSubmit} className="flex-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search or enter website"
          className="w-full px-3 py-2 rounded-full bg-white border outline-none text-sm"
        />
      </form>

      {/* Reload Button */}
      <button onClick={reload} className="px-2 py-1 text-lg">
        ⟳
      </button>
    </div>
  );
}
