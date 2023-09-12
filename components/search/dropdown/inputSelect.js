import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import React from "react";
import { useRouter } from "next/router";

export default function InputSelect({
  data,
  label,
  keyDown,
  selected,
  setSelected,
  query,
  setQuery,
  inputRef,
}) {
  const router = useRouter();

  function handleChange(event) {
    setSelected(event);
    router.push(`/en/search/${event.value.toLowerCase()}`);
  }

  return (
    <Combobox value={selected} onChange={(e) => handleChange(e)}>
      <div className="relative mt-1 z-[55] w-full">
        <div className="flex items-center gap-2 mb-2 relative">
          <span className="font-bold text-lg">{label}</span>
          <Combobox.Button className="py-[2px] bg-secondary/70 rounded text-sm font-karla flex items-center px-2">
            {selected.name}
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-secondary text-left shadow-md focus:outline-none sm:text-sm">
          <input
            type="text"
            value={query || ""}
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-secondary text-gray-300 focus:ring-0 outline-none"
            onKeyDown={keyDown}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95 translate-y-5"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95 translate-y-5"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className="absolute z-[55] mt-1 max-h-60 w-full rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            style={{ scrollbarGutter: "stable" }}
          >
            {data.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                Nothing found.
              </div>
            ) : (
              data.map((item) => (
                <Combobox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-2 mx-2 rounded-md ${
                      active ? "bg-white/5 text-white" : "text-gray-300"
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <React.Fragment>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium text-white" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pl-3 pr-1 ${
                            active ? "text-white" : "text-action"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </React.Fragment>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
