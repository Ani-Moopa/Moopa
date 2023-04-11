import { useState, useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

const ScrollTracker = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  //   console.log(id);

  function handleUnload() {
    const currentChapter = localStorage.getItem("currentChapterId");
    const scrollData = JSON.parse(localStorage.getItem("watchedManga")) || [];
    const scroll = localStorage.getItem("scrollPercentage");
    if (scroll < 5) {
      return;
    }

    const existingDataIndex = scrollData.findIndex(
      (data) => data.id === currentChapter
    );
    if (existingDataIndex !== -1) {
      // Update existing data
      scrollData[existingDataIndex].timestamp = Date.now();
      scrollData[existingDataIndex].percentage = parseFloat(
        localStorage.getItem("scrollPercentage")
      );
    } else {
      // Add new data
      scrollData.push({
        timestamp: Date.now(),
        percentage: parseFloat(localStorage.getItem("scrollPercentage")),
        id: currentChapter,
      });
    }

    localStorage.setItem("watchedManga", JSON.stringify(scrollData));
  }

  function handlePageHide() {
    localStorage.setItem("scrollPercentage", scrollPercentage);
    handleUnload;
  }

  // console.log(data?.id);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percentage = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(percentage);
      localStorage.setItem("scrollPercentage", percentage);
    }

    function handlePageshow() {
      const currentChapter = localStorage.getItem("currentChapterId");
      const lastScrollPercentage =
        JSON.parse(localStorage.getItem("watchedManga"))
          ?.filter((data) => data.id === currentChapter)
          .map((data) => data.percentage) || 0;

      if (lastScrollPercentage >= 95) {
        return;
      }

      const scrollTop =
        (lastScrollPercentage / 100) *
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight);
      document.documentElement.scrollTop = scrollTop;
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("pageshow", handlePageshow);
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pageshow", handlePageshow);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  useEffect(() => {
    if (scrollPercentage > 5) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  }, [scrollPercentage]);

  function handleScrollTop(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // console.log(scrollPercentage);

  return (
    <>
      <AnimatePresence>
        {scrolling && (
          <m.div
            key="back-to-top-button"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="fixed lg:right-10 lg:bottom-10 cursor-pointer text-white bottom-9 right-20 rounded-md z-40 bg-[#121212] hover:bg-[#2d303a] p-2 lg:p-3"
            onClick={handleScrollTop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          </m.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-0 w-screen z-40">
        <div className="h-1 w-full relative">
          <div
            className="absolute top-0 left-0 bg-[#ff8a57] h-1"
            style={{ width: `${scrollPercentage}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default ScrollTracker;
