import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { setCookie } from "nookies";

const ChapterSelector = ({ chaptersData, data, setFirstEp, userManga }) => {
  const [selectedProvider, setSelectedProvider] = useState(
    chaptersData[0]?.providerId || ""
  );
  const [selectedChapter, setSelectedChapter] = useState("");
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(10);

  useEffect(() => {
    const selectedChapters = chaptersData.find(
      (c) => c.providerId === selectedProvider
    );
    if (selectedChapters) {
      setSelectedChapter(selectedChapters);
      setFirstEp(selectedChapters);
    }
    setChapters(selectedChapters?.chapters || []);
  }, [selectedProvider, chaptersData]);

  // Get current posts
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = chapters.slice(
    indexOfFirstChapter,
    indexOfLastChapter
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  function saveManga() {
    localStorage.setItem(
      "manga",
      JSON.stringify({ manga: selectedChapter, data: data })
    );
    setCookie(null, "manga", data.id, {
      maxAge: 24 * 60 * 60,
      path: "/",
    });
  }

  // console.log(selectedChapter);

  // Create page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(chapters.length / chaptersPerPage); i++) {
    pageNumbers.push(i);
  }

  // Custom function to handle pagination display
  const getDisplayedPageNumbers = (currentPage, totalPages, margin) => {
    const pageRange = [...Array(totalPages).keys()].map((i) => i + 1);

    if (totalPages <= 10) {
      return pageRange;
    }

    if (currentPage <= margin) {
      return [...pageRange.slice(0, margin), "...", totalPages];
    }

    if (currentPage > totalPages - margin) {
      return [1, "...", ...pageRange.slice(-margin)];
    }

    return [
      1,
      "...",
      ...pageRange.slice(currentPage - 2, currentPage + 1),
      "...",
      totalPages,
    ];
  };

  const displayedPageNumbers = getDisplayedPageNumbers(
    currentPage,
    pageNumbers.length,
    9
  );

  // console.log(currentChapters);

  return (
    <div className="flex flex-col items-center z-40">
      <div className="flex flex-col w-full">
        <label htmlFor="provider" className="text-sm md:text-base font-medium">
          Select a Provider
        </label>
        <div className="relative w-full">
          <select
            id="provider"
            className="w-full text-xs md:text-base cursor-pointer mt-2 p-2 focus:outline-none rounded-md appearance-none bg-secondary"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            {/* <option value="">--Select a provider--</option> */}
            {chaptersData.map((provider, index) => (
              <option key={index} value={provider.providerId}>
                {provider.providerId}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute md:right-5 right-3 md:bottom-2 m-auto md:w-6 md:h-6 bottom-[0.5rem] h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 w-full py-5 flex justify-between gap-5">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`w-24 py-1 shrink-0 rounded-md font-karla ${
            currentPage === 1
              ? "bg-[#1D1D20] text-[#313135]"
              : `bg-secondary hover:bg-[#363639]`
          }`}
        >
          Previous
        </button>
        <div className="flex gap-5 overflow-x-scroll scrollbar-thin scrollbar-thumb-secondary scrollbar-thumb- w-[420px] lg:w-auto">
          {displayedPageNumbers.map((number, index) =>
            number === "..." ? (
              <span key={index + 2} className="w-10 py-1 text-center">
                ...
              </span>
            ) : (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 shrink-0 py-1 rounded-md hover:bg-[#363639] ${
                  number === currentPage ? "bg-[#363639]" : "bg-secondary"
                }`}
              >
                {number}
              </button>
            )
          )}
        </div>
        <button
          onClick={nextPage}
          disabled={currentPage === pageNumbers.length}
          className={`w-24 py-1 shrink-0 rounded-md font-karla ${
            currentPage === pageNumbers.length
              ? "bg-[#1D1D20] text-[#313135]"
              : `bg-secondary hover:bg-[#363639]`
          }`}
        >
          Next
        </button>
      </div>
      <div className="mt-4 w-full">
        {currentChapters.map((chapter, index) => {
          const isRead = chapter.number <= userManga?.progress;
          return (
            <div key={index} className="p-2 border-b hover:bg-[#232325]">
              <Link
                href={`/en/manga/read/${selectedProvider}?id=${
                  data.id
                }&chapterId=${encodeURIComponent(chapter.id)}`}
                onClick={saveManga}
              >
                <h2
                  className={`text-lg font-medium ${
                    isRead ? "text-[#424245]" : ""
                  }`}
                >
                  {chapter.title}
                </h2>
                <p
                  className={`text-[#59595d] ${isRead ? "text-[#313133]" : ""}`}
                >
                  Updated At: {new Date(chapter.updatedAt).toLocaleString()}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChapterSelector;
