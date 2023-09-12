import { Fragment, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function SingleSelector({ data, label, selected, setSelected }) {
  // const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1 min-w-full lg:min-w-[160px] w-full">
        <div className="font-bold text-lg mb-2">{label}</div>
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-secondary text-left shadow-md focus:outline-none sm:text-sm">
          {/* <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-secondary text-gray-300 focus:ring-0 outline-none"
            displayValue={(item) => item.name}
            placeholder="Any"
            onChange={(event) => setQuery(event.target.value)}
          /> */}
          <Listbox.Button className="w-full border-none py-2 text-start pl-3 text-sm leading-5 bg-secondary text-gray-400">
            <span>{selected?.name || "Any"}</span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </Listbox.Button>
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
          <Listbox.Options
            className="absolute z-50 scrollbar-thin scrollbar-thumb-white/10 scrollbar-thumb-rounded-lg mt-1 max-h-80 w-full overflow-auto rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            style={{ scrollbarGutter: "stable" }}
          >
            {filteredData.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                Nothing found.
              </div>
            ) : (
              filteredData.map((item) => (
                <Listbox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-2 ml-2 mr-1 rounded-md ${
                      active ? "bg-white/5 text-action" : "text-gray-300"
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
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
