import { useState, useEffect, useRef } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAniList } from "../lib/useAnilist";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const router = useRouter();

  const { aniAdvanceSearch } = useAniList();
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      searchBoxRef.current.querySelector("input").focus();
    }
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.code === "Space") {
        setIsOpen((prev) => !prev);
        setData(null);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const handleClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  async function search() {
    const data = await aniAdvanceSearch({
      search: query,
      type: "ANIME",
      perPage: 10,
    });
    setData(data);
  }

  useEffect(() => {
    if (query) {
      search();
    }
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    if (data?.media.length) {
      router.push(`/anime/${data?.media[0].id}`);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 w-screen flex justify-center z-50"
        >
          <div
            ref={searchBoxRef}
            className={` bg-[#1c1c1fef] text-white p-4 ${
              isOpen ? "flex" : "hidden"
            } flex-col w-[80%] backdrop-blur-sm rounded-b-lg`}
          >
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-full rounded-lg px-4 py-2 mb-2 bg-[#474747]"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <div className="flex flex-col gap-2 p-2 font-karla">
              {data?.media.map((i) => (
                <Link
                  key={i.id}
                  href={i.type === "ANIME" ? `/anime/${i.id}` : `/`}
                  className="flex hover:bg-[#3e3e3e] rounded-md"
                >
                  <Image
                    src={i.coverImage.extraLarge}
                    alt="search results"
                    width={500}
                    height={500}
                    className="object-cover w-14 h-14 rounded-md"
                  />
                  <div className="flex items-center justify-between w-full px-5">
                    <div>
                      <h1>{i.title.userPreferred}</h1>
                      <h5 className="text-sm font-light text-[#878787] flex gap-2">
                        {i.status
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                        {i.status && i.season && <>&#183;</>}{" "}
                        {i.season
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                        {(i.status || i.season) && i.episodes && <>&#183;</>}{" "}
                        {i.episodes || 0} Episodes
                      </h5>
                    </div>
                    <div className="text-sm text-[#b5b5b5] ">
                      <h1>
                        {i.type
                          ?.toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </h1>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {query && (
              <button className="flex items-center gap-2 justify-center">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <Link href={`/search/${query}`}>More Results...</Link>
              </button>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
