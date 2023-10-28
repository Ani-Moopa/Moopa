import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard({
  animeCount,
  infoCount,
  metaCount,
  report,
}) {
  const [message, setMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [unixTimestamp, setUnixTimestamp] = useState(null);

  const [broadcast, setBroadcast] = useState();
  const [reportId, setReportId] = useState();

  useEffect(() => {
    async function getBroadcast() {
      const res = await fetch("/api/v2/admin/broadcast", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Broadcast-Key": "get-broadcast",
        },
      });
      const data = await res.json();
      if (data) {
        setBroadcast(data);
      }
    }
    getBroadcast();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let unixTime;

    if (selectedTime) {
      unixTime = Math.floor(new Date(selectedTime).getTime() / 1000);
      setUnixTimestamp(unixTime);
    }

    const res = await fetch("/api/v2/admin/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Broadcast-Key": "get-broadcast",
      },
      body: JSON.stringify({
        message,
        startAt: unixTime,
        show: true,
      }),
    });

    const data = await res.json();

    console.log({ message, unixTime, data });
  };

  const handleRemove = async () => {
    try {
      const res = await fetch("/api/v2/admin/broadcast", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Broadcast-Key": "get-broadcast",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResolved = async () => {
    try {
      console.log(reportId);
      if (!reportId) return toast.error("reportId is required");
      const res = await fetch("/api/v2/admin/bug-report", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(`error while resolving ${error}`);
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
          <p className="flex items-center gap-2 font-semibold">
            Broadcast
            <span className="relative w-5 h-5 flex-center shrink-0">
              <span
                className={`absolute animate-ping inline-flex h-full w-full rounded-full ${
                  broadcast?.show === true ? "bg-green-500" : "hidden"
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  broadcast?.show === true ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </span>
          </p>
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none text-black"
                />
              </div>
              <div className="flex font-karla font-semibold gap-2">
                <button
                  title="Broadcast"
                  type="submit"
                  className="bg-image text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-300"
                >
                  Broadcast
                </button>
                <button
                  title="Remove"
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition duration-300"
                >
                  Remove
                </button>
              </div>
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
                  className="odd:bg-primary/80 even:bg-primary/40 hover:odd:bg-image/20 hover:even:bg-image/20 p-2 flex justify-between items-center"
                >
                  <Link
                    href={i.url}
                    className="flex font-inter items-center gap-2 group"
                  >
                    {i.desc}{" "}
                    <span className="w-4 h-4 text-image group-hover:text-white">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
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
                    <button
                      type="button"
                      title="Resolved"
                      onClick={() => {
                        setReportId(i?.id);
                        handleResolved();
                      }}
                      className="w-6 h-6 hover:text-green-500"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
