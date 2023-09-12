import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function MultiSelector({
  data,
  other,
  label,
  selected,
  setSelected,
  inputRef,
}) {
  // const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");

  const filteredMain =
    query === ""
      ? data
      : data.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredOther =
    query === ""
      ? other
      : other.filter((item) =>
          item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox value={selected} onChange={setSelected} multiple>
      <div className="relative mt-1 min-w-full lg:min-w-[160px] w-full">
        <div className="font-bold text-lg mb-2">{label}</div>
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-secondary text-left shadow-md focus:outline-none sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-secondary text-gray-300 focus:ring-0 outline-none"
            displayValue={(item) => item?.map((item) => item?.name).join(", ")}
            placeholder="Any"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
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
            className="absolute z-50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 scrollbar-thumb-rounded-lg mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            // style={{ scrollbarGutter: "stable" }}
          >
            {filteredOther.length === 0 &&
            filteredMain.length === 0 &&
            query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                Nothing found.
              </div>
            ) : (
              <div className="space-y-1">
                <span className="px-3 font-karla font-bold text-sm text-gray-200">
                  GENRES
                </span>
                <div>
                  {filteredMain.map((item) => (
                    <Combobox.Option
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
                              selected
                                ? "font-medium text-white"
                                : "font-normal"
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
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </React.Fragment>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
                <span className="px-3 font-karla font-bold text-sm text-gray-200">
                  TAGS
                </span>
                <div>
                  {filteredOther.map((item) => (
                    <Combobox.Option
                      key={item.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-2 ml-2 mr-1 rounded-md ${
                          active ? "bg-white/5 text-white" : "text-gray-300"
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <React.Fragment>
                          <span
                            className={`block truncate ${
                              selected
                                ? "font-medium text-white"
                                : "font-normal"
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
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </React.Fragment>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
