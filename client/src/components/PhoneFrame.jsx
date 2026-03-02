export default function PhoneFrame({ children }) {
  return (
    <div className="flex items-center cursor-grab justify-center h-screen bg-neutral-900 relative">
      {/* LEFT VOLUME BUTTONS */}
      <div className="absolute left-[calc(50%-210px)] top-[220px] w-1 h-14 bg-neutral-600 rounded-r-md" />
      <div className="absolute left-[calc(50%-210px)] top-[300px] w-1 h-20 bg-neutral-600 rounded-r-md" />

      {/* RIGHT POWER BUTTON */}
      <div className="absolute right-[calc(50%-210px)] top-[260px] w-1 h-24 bg-neutral-600 rounded-l-md" />

      {/* PHONE BODY */}
      <div className="w-[390px] h-[800px] bg-black rounded-[50px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] border-neutral-700 relative">
        {children}
      </div>
    </div>
  );
}
