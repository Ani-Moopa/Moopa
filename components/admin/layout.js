import {
  CloudArrowUpIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Navigation = [
  {
    name: "Dashboard",
    page: 1,
    icon: <HomeIcon />,
    current: false,
  },
  {
    name: "Metadata",
    page: 2,
    icon: <CloudArrowUpIcon />,
    current: false,
  },
  {
    name: "Users",
    page: 3,
    icon: <UserIcon />,
    current: false,
  },
  {
    name: "Settings",
    page: 4,
    icon: <Cog6ToothIcon />,
    current: false,
  },
];

export default function AdminLayout({ children, page, setPage }) {
  return (
    <div className="relative w-screen h-screen">
      <div className="absolute flex flex-col gap-5 top-0 left-0 py-2 bg-secondary w-[14rem] h-full">
        <div className="flex flex-col px-3">
          <p className="text-sm font-light text-action font-outfit">moopa</p>
          <h1 className="text-2xl font-bold text-white">
            Admin <br />
            Dashboard
          </h1>
        </div>
        <div className="flex flex-col px-1">
          {Navigation.map((item, index) => (
            <button
              title="Dashboard"
              key={item.name}
              onClick={() => {
                setPage(item.page);
              }}
              className={`flex items-center gap-2 p-2 group ${
                page == item.page ? "bg-image/50" : "text-txt"
              } hover:bg-image rounded transition-colors duration-200 ease-in-out`}
            >
              <div
                className={`w-5 h-5 ${
                  page == item.page ? "text-action" : "text-txt"
                } group-hover:text-action`}
              >
                {item.icon}
              </div>
              <p>{item.name}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="ml-[14rem] overflow-x-hidden h-full">{children}</div>
    </div>
  );
}
