import React, { useState } from "react";

export default function AdminDashboard({
  animeCount,
  infoCount,
  metaCount,
  report,
}) {
  const [message, setMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [unixTimestamp, setUnixTimestamp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTime) {
      const unixTime = Math.floor(new Date(selectedTime).getTime() / 1000);
      setUnixTimestamp(unixTime);
    }
  };
  return (
    <div className="flex flex-col gap-5 px-5 py-10 h-full">
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Stats</p>
        <div className="grid grid-cols-3 gap-5">
          <div className="flex-center flex-col bg-secondary rounded p-5">
            <p className="font-karla text-4xl">{animeCount}</p>
            <p className="font-karla text-xl">Anime</p>
          </div>
          <div className="flex-center flex-col bg-secondary rounded p-5">
            <p className="font-karla text-4xl">{infoCount}</p>
            <p className="font-karla text-xl">detail info</p>
          </div>
          <div className="flex-center flex-col bg-secondary rounded p-5">
            <p className="font-karla text-4xl">{metaCount}</p>
            <p className="font-karla text-xl">Metadata</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 h-full">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Broadcast</p>
          <div className="flex flex-col justify-between bg-secondary rounded p-5 h-full">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-txt font-light mb-2"
                >
                  Message
                </label>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none text-black"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="selectedTime"
                  className="block text-txt font-light mb-2"
                >
                  Select Time
                </label>
                <input
                  type="datetime-local"
                  id="selectedTime"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none text-black"
                />
              </div>
              <button
                type="submit"
                className="bg-image text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-300"
              >
                Submit
              </button>
            </form>
            {unixTimestamp && (
              <p>
                Unix Timestamp: <strong>{unixTimestamp}</strong>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Recent Reports</p>
          <div className="bg-secondary rounded p-5 h-full">
            <div className="rounded overflow-hidden w-full h-full">
              {report?.map((i, index) => (
                <div
                  key={index}
                  className="odd:bg-primary/80 even:bg-primary/40 p-2 flex justify-between items-center"
                >
                  {i.desc}{" "}
                  {i.severity === "Low" && (
                    <span className="relative w-5 h-5 flex-center shrink-0">
                      {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span> */}
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                  {i.severity === "Medium" && (
                    <span className="relative w-5 h-5 flex-center shrink-0">
                      {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span> */}
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                  {i.severity === "High" && (
                    <span className="relative w-5 h-5 flex-center shrink-0">
                      {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span> */}
                      <span className="relative animate-pulse inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                  {i.severity === "Critical" && (
                    <span className="relative w-5 h-5 flex-center shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-900 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-900"></span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">a</div>
    </div>
  );
}
