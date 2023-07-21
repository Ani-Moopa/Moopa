import { useEffect, useState } from "react";

export default function ChangeView({ view, setView, episode }) {
  // const [view, setView] = useState(1);
  // const episode = null;
  return (
    <div className="flex gap-3 rounded-sm items-center p-2">
      <div
        className={
          episode?.length > 0
            ? episode?.some((item) => item?.title === null)
              ? "pointer-events-none"
              : "cursor-pointer"
            : "pointer-events-none"
        }
        onClick={() => {
          setView(1);
          localStorage.setItem("view", 1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="31"
          height="20"
          fill="none"
          viewBox="0 0 31 20"
        >
          <rect
            width="31"
            height="20"
            className={`${
              episode?.length > 0
                ? episode?.some((item) => item?.title === null)
                  ? "fill-[#1c1c22]"
                  : view === 1
                  ? "fill-action"
                  : "fill-[#3A3A44]"
                : "fill-[#1c1c22]"
            }`}
            rx="3"
          ></rect>
        </svg>
      </div>
      <div
        className={
          episode?.length > 0
            ? episode?.some((item) => item?.title === null)
              ? "pointer-events-none"
              : "cursor-pointer"
            : "pointer-events-none"
        }
        onClick={() => {
          setView(2);
          localStorage.setItem("view", 2);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="20"
          fill="none"
          className={`${
            episode?.length > 0
              ? episode?.some((item) => item?.title === null)
                ? "fill-[#1c1c22]"
                : view === 2
                ? "fill-action"
                : "fill-[#3A3A44]"
              : "fill-[#1c1c22]"
          }`}
          viewBox="0 0 33 20"
        >
          <rect width="33" height="7" y="1" rx="3"></rect>
          <rect width="33" height="7" y="12" rx="3"></rect>
        </svg>
      </div>
      <div
        className={
          episode?.length > 0 ? `cursor-pointer` : "pointer-events-none"
        }
        onClick={() => {
          setView(3);
          localStorage.setItem("view", 3);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="20"
          fill="none"
          className={`${
            episode?.length > 0
              ? view === 3
                ? "fill-action"
                : "fill-[#3A3A44]"
              : "fill-[#1c1c22]"
          }`}
          viewBox="0 0 33 20"
        >
          <rect width="29" height="4" x="2" y="2" rx="2"></rect>
          <rect width="29" height="4" x="2" y="8" rx="2"></rect>
          <rect width="16" height="4" x="2" y="14" rx="2"></rect>
        </svg>
      </div>
    </div>
  );
}
