import { Fragment, useEffect, useState } from "react";
import { Combobox, Dialog, Menu, Transition } from "@headlessui/react";
import useDebounce from "../lib/hooks/useDebounce";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSearch } from "../lib/context/isOpenState";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useAniList } from "../lib/anilist/useAnilist";
import { getFormat } from "../utils/getFormat";

export default function SearchPalette() {
  const { isOpen, setIsOpen } = useSearch();
  const { quickSearch } = useAniList();

  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const debounceSearch = useDebounce(query, 500);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("ANIME");

  const [nextPage, setNextPage] = useState(false);

  const router = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  function handleChange(event) {
    router.push(`/en/${type.toLowerCase()}/${event}`);
  }

  async function advance() {
    setLoading(true);
    const res = await quickSearch({
      search: debounceSearch,
      type,
    });
    setData(res?.data?.Page?.results);
    setNextPage(res?.data?.Page?.pageInfo?.hasNextPage);
    setLoading(false);
  }

  useEffect(() => {
    advance();
  }, [debounceSearch, type]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "KeyS" && e.ctrlKey) {
        // do your stuff
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setData(null);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[6969]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4  text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl max-h-[68dvh] transform text-left transition-all">
                <Combobox
                  as="div"
                  className="max-w-2xl mx-auto rounded-lg shadow-2xl relative flex flex-col"
                  onChange={(e) => {
                    handleChange(e);
                    setData(null);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex justify-between py-1 font-karla">
                    <div className="flex items-center px-2 gap-2">
                      <p>For quick access :</p>
                      <div className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
                        <span>CTRL</span>
                      </div>
                      <span>+</span>
                      <div className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
                        <span>S</span>
                      </div>
                    </div>
                    <div>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="capitalize bg-secondary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            {type.toLowerCase()}
                            <ChevronDownIcon
                              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                              // aria-hidden="true"
                            />
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
                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-primary shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setType("ANIME")}
                                    className={`${
                                      active
                                        ? "bg-secondary text-white"
                                        : "text-white"
                                    } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm`}
                                  >
                                    <PlayIcon className="w-6 h-6" />
                                    <span>Anime</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => setType("MANGA")}
                                    className={`${
                                      active
                                        ? "bg-secondary text-white"
                                        : "text-white"
                                    } group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm`}
                                  >
                                    <BookOpenIcon className="w-6 h-6" />
                                    <span>Manga</span>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="flex items-center text-base font-medium rounded bg-secondary">
                    <Combobox.Input
                      className="p-5 text-white w-full bg-transparent border-0 outline-none"
                      placeholder="Search something..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>
                  <Combobox.Options
                    static
                    className="bg-secondary rounded mt-2 max-h-[50dvh] overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-primary scrollbar-thumb-rounded"
                  >
                    {!loading ? (
                      <Fragment>
                        {data?.length > 0
                          ? data?.map((i) => (
                              <Combobox.Option
                                key={i.id}
                                value={i.id}
                                className={({ active }) =>
                                  `flex items-center gap-3 p-5 ${
                                    active ? "bg-primary/40 cursor-pointer" : ""
                                  }`
                                }
                              >
                                <div className="shrink-0">
                                  <Image
                                    src={i.coverImage.medium}
                                    alt="coverImage"
                                    width={100}
                                    height={100}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                </div>
                                <div className="flex flex-col w-full h-full">
                                  <h3 className="font-karla font-semibold">
                                    {i.title.userPreferred}
                                  </h3>
                                  <p className="text-sm text-white/50">
                                    {i.startDate.year} {getFormat(i.format)}
                                  </p>
                                </div>
                              </Combobox.Option>
                            ))
                          : !loading &&
                            debounceSearch !== "" && (
                              <p className="flex-center font-karla gap-3 p-5">
                                No results found.
                              </p>
                            )}
                        {nextPage && (
                          <button
                            type="button"
                            onClick={() => {
                              router.push(
                                `/en/search/${type.toLowerCase()}/${
                                  query !== "" ? `?search=${query}` : ""
                                }`
                              );
                              setIsOpen(false);
                              setQuery("");
                            }}
                            className="flex-center font-karla gap-2 py-4 hover:bg-primary/30 cursor-pointer"
                          >
                            <span>View More</span>
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        )}
                      </Fragment>
                    ) : (
                      <div className="flex-center gap-3 p-5">
                        <div className="flex justify-center">
                          <div className="lds-ellipsis">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Combobox.Options>
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
