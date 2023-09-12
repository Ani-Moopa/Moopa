import { Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

export default function HistoryOptions({ remove, watchId, aniId }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group/delete w-6 h-6 shrink-0 bg-primary p-1 rounded-full hover:text-action scale-100 hover:scale-105 transition-all duration-200 ease-out">
          <XMarkIcon />
          <span className="absolute font-karla bg-secondary shadow-black shadow-2xl py-1 px-2 whitespace-nowrap text-white text-sm rounded-md right-7 -bottom-[2px] z-40 duration-300 transition-all ease-out group-hover/delete:visible group-hover/delete:scale-100 group-hover/delete:translate-x-0 group-hover/delete:opacity-100 opacity-0 translate-x-10 scale-50 invisible">
            Remove from history
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 mt-1 w-56 origin-top-right rounded-md bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-white/10 text-white" : "text-gray-100"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => remove(null, aniId)}
                >
                  Delete All Episodes
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-white/10 text-white" : "text-gray-100"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => remove(watchId, null)}
                >
                  Delete Just This Episode
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
