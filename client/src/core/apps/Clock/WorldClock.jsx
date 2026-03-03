import { useEffect, useState } from "react";

const cities = [
  { name: "New York", zone: "America/New_York", offset: "-5HRS" },
  { name: "London", zone: "Europe/London", offset: "+0HRS" },
  { name: "Tokyo", zone: "Asia/Tokyo", offset: "+9HRS" },
  { name: "Delhi", zone: "Asia/Kolkata", offset: "+5.5HRS" },
];

const WorldClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-6 space-y-1">
      {cities.map((city) => {
        const cityTime = new Date(
          time.toLocaleString("en-US", { timeZone: city.zone }),
        );
        return (
          <div
            key={city.name}
            className="flex justify-between items-center py-4 border-b border-zinc-900"
          >
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase">{`Today, ${city.offset}`}</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                {city.name}
              </h2>
            </div>

            <div className="text-4xl font-light tabular-nums">
              {cityTime
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(" ", "")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorldClock;
