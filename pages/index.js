import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { aniListData } from "../lib/AniList";
import React, { useState, useEffect } from "react";
import ReactHtmlParser from "kt-react-html-parser";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/footer";
import Image from "next/image";
import Content from "../components/hero/content";
import { useRouter } from "next/router";

export default function Home({ detail, populars, topDesc }) {
  const [isVisible, setIsVisible] = useState(false);
  const [recently, setRecently] = useState(null);
  const popular = populars.data;
  const data = detail.data[0];
  const router = useRouter();

  const handleShowClick = () => {
    setIsVisible(true);
  };

  const handleHideClick = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    function fetchData() {
      const recent = JSON.parse(localStorage.getItem("recentWatch"));
      if (recent) {
        setRecently(recent);
      }
    }
    fetchData();
  }, []);

  function handleRemove() {
    localStorage.removeItem("recentWatch");
    setRecently(null);
  }

  const slideLeft = () => {
    var slider = document.getElementById("recentslider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById("recentslider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const handleFormSubmission = (inputValue) => {
    router.push(`/search?hasil=${encodeURIComponent(inputValue)}`);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const inputValue = event.target.value;
      handleFormSubmission(inputValue);
    }
  };

  return (
    <>
      <Head>
        <title>Moopa</title>
        <meta charSet="UTF-8"></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Moopa - Free Anime and Manga Streaming"
        />
        <meta
          name="twitter:description"
          content="Discover your new favorite anime or manga title! Moopa offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using Moopa today!"
        />
        <meta
          name="twitter:image"
          content="https://cdn.discordapp.com/attachments/1084446049986420786/1093300833422168094/image.png"
        />
        <link rel="icon" href="/c.svg" />
      </Head>
      <div className="z-50">
        {!isVisible && (
          <button
            onClick={handleShowClick}
            className="fixed bottom-[30px] right-[20px] z-[100] flex h-[51px] w-[50px] cursor-pointer items-center justify-center rounded-[8px] bg-[#101925] shadow-menu md:hidden"
            id="bars"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[42px] w-[61.5px] text-[#8BA0B2] fill-orange-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Mobile Menu */}
        <div>
          {isVisible && (
            <div className="fixed bottom-[25px] right-[15px] z-50 flex h-[66px] w-[255px] items-center justify-center gap-8 rounded-[10px] text-[11px] bg-[#101925] shadow-menu md:hidden">
              <div className="flex gap-7">
                <button className="group flex flex-col items-center">
                  <Link href="/" className="">
                    <svg
                      width="28"
                      height="24"
                      viewBox="0 0 28 24"
                      className=" group-hover:fill-cyan-700 fill-white"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_224_286)">
                        <path d="M14.0937 -0.571411C14.0937 -0.571411 5.91783 6.54859 1.34879 10.4046C1.08049 10.6499 0.876953 11.0073 0.876953 11.4286C0.876953 12.1659 1.46774 12.7619 2.19863 12.7619H4.84199V22.0953C4.84199 22.8326 5.43278 23.4286 6.16367 23.4286H10.1287C10.8596 23.4286 11.4504 22.8313 11.4504 22.0953V16.7619H16.7371V22.0953C16.7371 22.8313 17.3279 23.4286 18.0588 23.4286H22.0238C22.7547 23.4286 23.3455 22.8326 23.3455 22.0953V12.7619H25.9888C26.7197 12.7619 27.3105 12.1659 27.3105 11.4286C27.3105 11.0073 27.107 10.6499 26.8043 10.4046C22.267 6.54859 14.0937 -0.571411 14.0937 -0.571411Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_224_286">
                          <rect
                            width="27"
                            height="24"
                            fill="white"
                            transform="translate(0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                  <Link
                    href="/"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-cyan-700"
                  >
                    home
                  </Link>
                </button>
                <button className="group flex flex-col items-center">
                  <Link href="/about">
                    <svg
                      width="27"
                      height="25"
                      viewBox="0 0 27 25"
                      className=" group-hover:fill-cyan-700 fill-white"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_224_292)">
                        <path d="M21.3402 0.5H5.65974C4.31427 0.500087 3.02394 0.996857 2.07261 1.88103C1.12127 2.7652 0.586852 3.96435 0.586914 5.21469V19.7853C0.586852 21.0356 1.12127 22.2348 2.07261 23.119C3.02394 24.0031 4.31427 24.4999 5.65974 24.5H21.3402C22.6856 24.4999 23.976 24.0031 24.9273 23.119C25.8786 22.2348 26.4131 21.0356 26.413 19.7853V5.21469C26.4131 3.96435 25.8786 2.7652 24.9273 1.88103C23.976 0.996857 22.6856 0.500087 21.3402 0.5ZM13.5 4.93182C13.8482 4.93182 14.1887 5.02779 14.4782 5.20759C14.7678 5.3874 14.9935 5.64297 15.1268 5.94197C15.2601 6.24098 15.2949 6.57 15.227 6.88742C15.159 7.20484 14.9913 7.49642 14.7451 7.72527C14.4988 7.95412 14.1851 8.10996 13.8435 8.1731C13.5019 8.23624 13.1479 8.20384 12.8261 8.07999C12.5043 7.95613 12.2293 7.7464 12.0358 7.4773C11.8424 7.2082 11.7391 6.89182 11.7391 6.56818C11.7391 6.13419 11.9246 5.71798 12.2548 5.4111C12.5851 5.10422 13.0329 4.93182 13.5 4.93182ZM15.9212 20.1364H11.2255C10.9142 20.1364 10.6156 20.0214 10.3954 19.8168C10.1753 19.6123 10.0516 19.3348 10.0516 19.0455C10.0516 18.7561 10.1753 18.4787 10.3954 18.2741C10.6156 18.0695 10.9142 17.9545 11.2255 17.9545H12.326V11.4091H11.2255C10.9142 11.4091 10.6156 11.2942 10.3954 11.0896C10.1753 10.885 10.0516 10.6075 10.0516 10.3182C10.0516 10.0289 10.1753 9.75138 10.3954 9.54679C10.6156 9.34221 10.9142 9.22727 11.2255 9.22727H14.6739V17.9545H15.9212C16.2325 17.9545 16.5311 18.0695 16.7512 18.2741C16.9714 18.4787 17.0951 18.7561 17.0951 19.0455C17.0951 19.3348 16.9714 19.6123 16.7512 19.8168C16.5311 20.0214 16.2325 20.1364 15.9212 20.1364Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_224_292">
                          <rect
                            width="27"
                            height="24"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                  <Link
                    href="/about"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-cyan-700"
                  >
                    about
                  </Link>
                </button>
                <button className="group flex gap-[1.5px] flex-col items-center ">
                  <div>
                    <Link href="/search">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="group-hover:fill-cyan-700 fill-white w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                  <Link
                    href="/search"
                    className="font-karla font-bold text-[#8BA0B2] group-hover:text-cyan-700"
                  >
                    search
                  </Link>
                </button>
              </div>
              <button onClick={handleHideClick}>
                <svg
                  width="20"
                  height="21"
                  className="fill-orange-500"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2.44043"
                    y="0.941467"
                    width="23.5842"
                    height="3.45134"
                    rx="1.72567"
                    transform="rotate(45 2.44043 0.941467)"
                  />
                  <rect
                    x="19.1172"
                    y="3.38196"
                    width="23.5842"
                    height="3.45134"
                    rx="1.72567"
                    transform="rotate(135 19.1172 3.38196)"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-auto w-screen bg-[#141519] text-white">
        <div className="flex items-center justify-center">
          <div className="flex w-full items-center justify-between px-5 md:mx-[94px]">
            <div className="flex items-center md:gap-16 md:pt-7">
              <h1 className=" font-outfit text-[40px] font-bold text-[#FF7F57]">
                moopa
              </h1>
              <ul className="hidden gap-10 pt-2 font-outfit text-[14px] md:flex">
                <Link href="/search">
                  <li>AniList Index</li>
                </Link>
                <Link href="/test">
                  <li>Manga</li>
                </Link>
                <li>Anime</li>
              </ul>
            </div>
            <div className="relative flex scale-75 items-center">
              <div className="search-box ">
                <input
                  className="search-text"
                  type="text"
                  placeholder="Search Anime"
                  onKeyDown={handleKeyDown}
                />
                <a href="#" className="search-btn">
                  <i className="fas fa-search"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PC / TABLET */}
        <div className="mt-10 hidden justify-center lg:flex">
          <div className="relative grid grid-rows-2 items-center md:flex md:h-[760px] md:w-[80%] md:justify-between">
            <div className="row-start-2 flex h-full flex-col gap-7 md:w-[55%] md:justify-center">
              <h1 className="w-[85%] font-outfit font-extrabold md:text-[45px] line-clamp-2">
                {data.title.english || data.title.romaji || data.title.native}
              </h1>
              <div className="font-roboto font-light md:text-[24px] line-clamp-5">
                {ReactHtmlParser(data.description)}
              </div>

              <div className="md:pt-5">
                <Link
                  href={`/anime/${data.id}`}
                  legacyBehavior
                  className="flex"
                >
                  <a className="rounded-sm p-3 font-karla font-light ring-1 ring-[#FF7F57]">
                    START WATCHING
                  </a>
                </Link>
              </div>
            </div>
            <div className="z-10 row-start-1 flex justify-center ">
              <div className="relative  md:h-[662px] md:w-[460px] md:scale-100">
                <div className="absolute bg-gradient-to-t from-[#141519] to-transparent md:h-[662px] md:w-[460px]" />

                <Image
                  draggable={false}
                  src={data.coverImage.extraLarge}
                  alt={data.title.english || data.title.romaji}
                  width={460}
                  height={662}
                  priority
                  className="rounded-tl-xl  rounded-tr-xl object-cover bg-blend-overlay md:h-[662px] md:w-[460px] "
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}

        <div className="mt-16 flex flex-col items-center">
          <div className="w-screen flex-none lg:w-[87%]">
            {recently && (
              <div>
                <div className="flex items-center gap-5 lg:gap-10">
                  <h1 className="px-5 font-outfit text-[20px] font-extrabold lg:text-[27px]">
                    Recently Watched
                  </h1>
                  <div
                    className="cursor-pointer font-outfit font-light text-[#8f8f8f]"
                    onClick={() => handleRemove()}
                  >
                    Clear all
                  </div>
                </div>
                <div className="relative z-10 flex items-center py-10 lg:gap-2">
                  <MdChevronLeft
                    onClick={slideLeft}
                    size={40}
                    className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
                  />
                  <div
                    id="recentslider"
                    className="scroll flex h-full w-full items-center overflow-x-scroll scroll-smooth whitespace-nowrap overflow-y-hidden scrollbar-hide lg:gap-5"
                  >
                    {recently.map((anime, index) => {
                      const url = encodeURIComponent(anime.title);

                      return (
                        <Link
                          href={`/anime/${anime.id}`}
                          key={index}
                          className="shrink-0 "
                        >
                          <Image
                            src={anime.image}
                            alt={anime.title || "cover image"}
                            width={209}
                            height={300}
                            className="z-20 h-[230px] w-[168px] object-cover p-2 duration-300 ease-in-out hover:scale-105 lg:h-[290px] lg:w-[209px]"
                          />
                        </Link>
                      );
                    })}
                  </div>
                  <MdChevronRight
                    onClick={slideRight}
                    size={40}
                    className="mb-5 cursor-pointer opacity-50 hover:opacity-100"
                  />
                </div>
              </div>
            )}

            {detail && (
              <Content
                ids="trendingAnime"
                section="Trending Now"
                data={detail.data}
              />
            )}

            {popular && (
              <Content
                ids="popularAnime"
                section="Popular Anime"
                data={popular}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const trendingDetail = await aniListData({
    sort: "TRENDING_DESC",
    page: 1,
  });
  const popularDetail = await aniListData({
    sort: "POPULARITY_DESC",
    page: 1,
  });
  const genreDetail = await aniListData({ sort: "TYPE", page: 1 });
  const newTrend = await trendingDetail.props;
  const trends = newTrend.data[0];
  const topDesc = trends.description.slice(0, 350) + "...";

  return {
    props: {
      topDesc: topDesc,
      genre: genreDetail.props,
      detail: trendingDetail.props,
      populars: popularDetail.props,
    },
  };
}
