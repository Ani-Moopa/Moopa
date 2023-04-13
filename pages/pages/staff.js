import Head from "next/head";
import { useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Twitter from "../components/media/twitter";
import Instagram from "../components/media/instagram";
import Discord from "../components/media/discord";
import AniList from "../components/media/aniList";

export default function Staff() {
  const dev = {
    name: "Factiven",
    desc: "“Bawah gw gay”",
    coverImage:
      "https://cdn.discordapp.com/attachments/986579286397964290/1058308027075276890/1160925.jpg",
    iClass: "bg-center rounded-t-lg",
    socials: {
      twitter: "https://twitter.com/Factivens",
      ig: "https://www.instagram.com/dvnabny/",
      discord: "Factiven#9110",
      aniList: "https://anilist.co/user/DevanAbinaya/",
    },
  };

  const [copied, setCopied] = useState(false);

  const handleClickDev = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(dev.socials.discord).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      });
    } else {
      // Fallback action if navigator.clipboard is not supported
      const textarea = document.createElement("textarea");
      textarea.value = dev.socials.discord;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  };

  const DevCard = () => {
    return (
      <div className="scale-95 antialiased xl:mx-28 xl:scale-100">
        <div
          className={`h-[116px] shrink bg-[#dadada50] bg-cover xl:w-[38rem] ${dev.iClass}`}
          style={{
            backgroundImage: `url(${
              dev.coverImage ||
              `https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png`
            })`,
          }}
        ></div>
        <div className="flex h-auto flex-col gap-8 rounded-b-[10px] bg-white px-[30px] pb-[30px] pt-5 shadow-md dark:bg-[#181818] xl:w-[38rem] xl:px-[40px] xl:pb-[40px]">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="font-karla text-[30px] font-bold">{dev.name}</h1>
              <div className="flex gap-5">
                <div className="tooltip relative inline-block">
                  <svg
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_292_346)">
                      <path
                        d="M22.5508 22V26L32.7005 16L22.5508 6V10L28.6406 16L22.5508 22Z"
                        className="fill-black dark:fill-white"
                      />
                      <path
                        d="M10.3704 22V26L0.220703 16L10.3704 6V10L4.2806 16L10.3704 22Z"
                        className="fill-black dark:fill-white"
                      />
                      <path
                        d="M10.3711 20H14.431L22.5508 12H18.4909L10.3711 20Z"
                        className="fill-black dark:fill-white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_292_346">
                        <path
                          d="M0.220703 10C0.220703 4.47715 4.69786 0 10.2207 0H22.6999C28.2227 0 32.6999 4.47715 32.6999 10V22C32.6999 27.5228 28.2227 32 22.6999 32H10.2207C4.69785 32 0.220703 27.5228 0.220703 22V10Z"
                          className="fill-white dark:fill-black"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="tooltiptext absolute bottom-10 -right-12 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                    Lead Developer
                  </span>
                </div>
                <div className="tooltip relative inline-block">
                  <svg
                    width="28"
                    height="26"
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M26.524 3.63947C23.2599 8.42076 13.4283 18.0917 13.4283 18.0917L13.4244 18.0879C13.4013 18.1128 13.3804 18.1388 13.3557 18.1632C12.7377 18.7709 11.8993 19.0168 11.0939 18.9231C11.3529 19.9913 11.0796 21.164 10.2533 21.9987C10.2533 21.9987 6.11896 27.0357 1.53711 23.8621C1.53711 23.8621 4.00781 23.1801 4.22278 21.216C4.22278 21.216 3.89291 19.2368 5.70663 17.4027C6.51975 16.5804 7.65724 16.2982 8.70017 16.5382C8.6166 15.756 8.86675 14.9457 9.47591 14.3461C9.5001 14.3217 9.52704 14.3011 9.55233 14.2778L9.54848 14.274C9.54848 14.274 19.3741 4.59768 24.2342 1.38614C24.8774 0.932763 25.7757 0.985847 26.353 1.55406C26.9319 2.12335 26.9852 3.00681 26.524 3.63947ZM9.488 18.1383C9.08007 17.7363 8.55118 17.5072 7.98546 17.5072C7.41754 17.5072 6.88095 17.7326 6.47687 18.1415C5.08318 19.5509 5.29209 21.1662 5.29759 21.2166C5.17774 22.3107 4.54824 23.2429 3.89181 23.8036C4.12382 23.8453 4.35857 23.8664 4.59827 23.8664C7.20972 23.8664 9.40993 21.3422 9.43027 21.3184C9.43082 21.3184 10.9361 19.5656 9.488 18.1383ZM9.78378 16.2543C9.78378 16.6855 9.94267 17.0918 10.2533 17.3967C10.5639 17.7022 10.9944 17.8793 11.4331 17.8793C11.8718 17.8793 12.2682 17.7028 12.569 17.4059L13.4233 16.5555C13.4667 16.5116 13.5261 16.4521 13.574 16.4038L11.2665 14.1305C11.216 14.1787 11.1538 14.2377 11.1087 14.2816L10.2527 15.1141C9.94267 15.4186 9.78378 15.8232 9.78378 16.2543ZM25.5767 2.3216C25.4398 2.18672 25.2798 2.16668 25.1957 2.16668C25.0792 2.16668 24.9681 2.20135 24.8466 2.28693C21.4281 4.54568 14.9511 10.6107 12.0362 13.3927L14.3228 15.6455C17.1486 12.7768 23.3193 6.39222 25.6306 3.00735C25.7867 2.79393 25.7642 2.50522 25.5767 2.3216Z"
                      className="fill-black dark:fill-white"
                    />
                  </svg>
                  <span className="tooltiptext absolute bottom-10 -right-11 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                    Lead Designer
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="font-robot text-xl font-light italic">{dev.desc}</p>

          {dev.socials && (
            <div className="pt-3">
              <div className="flex items-center gap-4">
                <div className="flex scale-90 gap-5">
                  {dev.socials.twitter && (
                    <div>
                      <a href={dev.socials.twitter}>
                        <Twitter className="fill-[#585858] " />
                      </a>
                    </div>
                  )}
                  {dev.socials.ig && (
                    <div className="pt-[1px]">
                      <a href={dev.socials.ig}>
                        <Instagram className="fill-[#585858] " />
                      </a>
                    </div>
                  )}
                  {dev.socials.discord && (
                    <div className="relative inline-block scale-95 pl-[1px] pt-[2px]">
                      <a onClick={handleClickDev}>
                        <Discord className="fill-[#585858] " />
                      </a>
                      {copied && (
                        <span className="absolute bottom-12  w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                          Discord Tag copied to clipboard
                        </span>
                      )}
                    </div>
                  )}
                  {dev.socials.aniList && (
                    <div className="pt-[2px] xl:pt-[5px] ">
                      <a href={dev.socials.aniList}>
                        <AniList />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const staff = [
    {
      id: 1,
      name: "rapiips_",
      desc: "Time is precious, waste it wisely",
      coverImage:
        "https://media.discordapp.net/attachments/1068758633464201268/1072001529889959946/anime-girl-morning-breakfast-4k-wallpaper-uhdpaper.com-850i.jpg?width=1246&height=701",
      bgPosition: "50% 25%",
      socials: {
        ig: "https://www.instagram.com/rapiips_/",
        discord: "Pipip#5048",
      },
      tags: {
        moral: "Pendukung Moral",
      },
    },
    {
      id: 2,
      name: "Isantuyskl",
      desc: "Sedang mencari.",
      coverImage:
        "https://cdn.discordapp.com/attachments/986579286397964290/1058420833376280656/23264b905fcd7ed378a6b3c5d8f2a047_7598772829043055595.png",
      bgPosition: "50% 15%",
      socials: {
        ig: "https://www.instagram.com/isantuyskl/",
        discord: "X-San#5418",
        aniList: "https://anilist.co/user/isantuyskl/",
      },
      tags: {
        moral: "Pendukung Moral",
        design: "Idea Proposer",
      },
    },
    {
      id: 3,
      name: "kha//sak?",
      desc: "if you don't like it, ignore it\nI know your future, you can't defeat me..",
      socials: {
        ig: "https://www.instagram.com/khasakh_1364/",
        discord: "sakh#0835",
      },
      tags: {
        design: "Idea Proposer",
      },
    },
  ];

  const StaffCard = () => {
    const [copySuccess, setCopySuccess] = useState("");

    // your function to copy here

    const copyStaff = async (copyMe) => {
      try {
        await navigator.clipboard.writeText(copyMe);
        setCopySuccess("Copied!");
      } catch (err) {
        setCopySuccess("Failed to copy!");
      }
    };

    return (
      <div className="flex scale-95 flex-col flex-wrap gap-20 antialiased xl:mx-28 xl:scale-100 xl:flex-row xl:gap-20">
        {staff.map((post) => (
          <div key={post.id}>
            <div
              className={`h-[116px] shrink rounded-t-lg bg-[#dadada50] bg-cover dark:brightness-95 xl:w-[38rem]`}
              style={{
                backgroundImage: `url(${post.coverImage || ``})`,
                backgroundPosition: `${post.bgPosition}`,
              }}
            >
              {/* <img src={post.coverImage || `https://cdn.discordapp.com/attachments/986579286397964290/1058415946945003611/gray_pfp.png`} alt="Profile Picture" className={`object-cover object-[center_top] h-[116px] w-full rounded-t-lg ${post.iClass}`}/> */}
            </div>
            <div className="flex h-auto flex-col gap-8 rounded-b-lg bg-white px-[30px] pb-[30px] pt-5 shadow-md dark:bg-[#181818] xl:w-[38rem] xl:px-[40px] xl:pb-[40px]">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="font-karla text-[30px] font-bold">
                    {post.name}
                  </h1>
                  {post.tags && (
                    <div className="flex gap-5">
                      {post.tags.dev && (
                        <div className="tooltip relative inline-block">
                          <svg
                            width="33"
                            height="32"
                            viewBox="0 0 33 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_292_346)">
                              <path
                                d="M22.5508 22V26L32.7005 16L22.5508 6V10L28.6406 16L22.5508 22Z"
                                className="fill-black dark:fill-white"
                              />
                              <path
                                d="M10.3704 22V26L0.220703 16L10.3704 6V10L4.2806 16L10.3704 22Z"
                                className="fill-black dark:fill-white"
                              />
                              <path
                                d="M10.3711 20H14.431L22.5508 12H18.4909L10.3711 20Z"
                                className="fill-black dark:fill-white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_292_346">
                                <path
                                  d="M0.220703 10C0.220703 4.47715 4.69786 0 10.2207 0H22.6999C28.2227 0 32.6999 4.47715 32.6999 10V22C32.6999 27.5228 28.2227 32 22.6999 32H10.2207C4.69785 32 0.220703 27.5228 0.220703 22V10Z"
                                  className="fill-white dark:fill-black"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="tooltiptext absolute bottom-10 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                            {post.tags.dev}
                          </span>
                        </div>
                      )}

                      {post.tags.moral && (
                        <div className="tooltip relative inline-block">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="none"
                            viewBox="0 0 30 30"
                          >
                            <g clipPath="url(#clip0_306_199)">
                              <path
                                className="fill-black dark:fill-white"
                                d="M28.896 16.376a11.061 11.061 0 01-2.361-3.916 11.72 11.72 0 00-3.877-8.658A11.781 11.781 0 0013.633.823a11.795 11.795 0 00-8.289 4.64A11.733 11.733 0 003.192 14.7H1.085a.438.438 0 00-.403.603.436.436 0 00.403.27h4.22v7.258h-4.22a.438.438 0 00-.437.436.435.435 0 00.437.436h6.47c.422 1.761.645 3.565.664 5.376a.435.435 0 00.441.408.437.437 0 00.432-.418 25.572 25.572 0 00-.629-5.367h8.13a2.15 2.15 0 001.688-.832 2.138 2.138 0 00.379-1.84 2.006 2.006 0 001.158-1.298 1.998 1.998 0 00-.296-1.713 1.876 1.876 0 00.438-2.191 1.875 1.875 0 00-.483-.629 2.03 2.03 0 00-1.31-3.397h-4.87c.79-3.232-.505-7.62-4.251-6.134a.432.432 0 00-.206.465 9.48 9.48 0 01.257 3.13c-.558 1.886-3.045 3.755-3.714 5.437h-1.3a10.848 10.848 0 011.893-8.623 10.92 10.92 0 0116.092-1.63 10.873 10.873 0 013.593 8.066 10.412 10.412 0 002.57 4.424c.32.474.662.862-.011 1.282-.757.422-1.54.794-2.347 1.112a.437.437 0 00-.274.463c.184 1.368.2 2.753.047 4.125-.129.65-1.596 1.087-3.662 1.087a1.774 1.774 0 00-1.799 1.111 1.763 1.763 0 00-.12.74v2.22a.436.436 0 00.745.31.436.436 0 00.128-.31v-2.225a.92.92 0 01.64-.943.928.928 0 01.406-.036c5.27-.027 4.81-1.877 4.52-5.86 1.484-.66 4.16-1.495 2.392-3.636zm-22.721-1.24c.559-1.643 3.247-3.635 3.752-5.597a8.696 8.696 0 00-.154-3.198c1.556-.396 2.607.59 2.827 2.78a8.192 8.192 0 01-.285 2.991.436.436 0 00.419.56h5.432a1.077 1.077 0 01.976 1.085 1.03 1.03 0 01-.654 1.076.437.437 0 00-.31.744.438.438 0 00.31.127.882.882 0 01.787.913c.01.71-.698.845-.803 1.313.013.45.61.682.57 1.19a1.28 1.28 0 01-1.052 1.218.433.433 0 00-.31.247c-.147.344.236.641.182.996a1.28 1.28 0 01-1.27 1.249H6.175v-7.695zm-3.202 5.807a.436.436 0 01.737-.293c.081.077.13.181.136.293a.435.435 0 01-.726.277.435.435 0 01-.143-.277h-.004z"
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_306_199">
                                <path
                                  fill="#fff"
                                  d="M0 0H29V29H0z"
                                  transform="translate(.479 .5)"
                                ></path>
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="tooltiptext absolute bottom-10 -right-14 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                            {post.tags.moral}
                          </span>
                        </div>
                      )}

                      {post.tags.design && (
                        <div className="tooltip relative inline-block">
                          <svg
                            width="28"
                            height="26"
                            viewBox="0 0 28 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M26.524 3.63947C23.2599 8.42076 13.4283 18.0917 13.4283 18.0917L13.4244 18.0879C13.4013 18.1128 13.3804 18.1388 13.3557 18.1632C12.7377 18.7709 11.8993 19.0168 11.0939 18.9231C11.3529 19.9913 11.0796 21.164 10.2533 21.9987C10.2533 21.9987 6.11896 27.0357 1.53711 23.8621C1.53711 23.8621 4.00781 23.1801 4.22278 21.216C4.22278 21.216 3.89291 19.2368 5.70663 17.4027C6.51975 16.5804 7.65724 16.2982 8.70017 16.5382C8.6166 15.756 8.86675 14.9457 9.47591 14.3461C9.5001 14.3217 9.52704 14.3011 9.55233 14.2778L9.54848 14.274C9.54848 14.274 19.3741 4.59768 24.2342 1.38614C24.8774 0.932763 25.7757 0.985847 26.353 1.55406C26.9319 2.12335 26.9852 3.00681 26.524 3.63947ZM9.488 18.1383C9.08007 17.7363 8.55118 17.5072 7.98546 17.5072C7.41754 17.5072 6.88095 17.7326 6.47687 18.1415C5.08318 19.5509 5.29209 21.1662 5.29759 21.2166C5.17774 22.3107 4.54824 23.2429 3.89181 23.8036C4.12382 23.8453 4.35857 23.8664 4.59827 23.8664C7.20972 23.8664 9.40993 21.3422 9.43027 21.3184C9.43082 21.3184 10.9361 19.5656 9.488 18.1383ZM9.78378 16.2543C9.78378 16.6855 9.94267 17.0918 10.2533 17.3967C10.5639 17.7022 10.9944 17.8793 11.4331 17.8793C11.8718 17.8793 12.2682 17.7028 12.569 17.4059L13.4233 16.5555C13.4667 16.5116 13.5261 16.4521 13.574 16.4038L11.2665 14.1305C11.216 14.1787 11.1538 14.2377 11.1087 14.2816L10.2527 15.1141C9.94267 15.4186 9.78378 15.8232 9.78378 16.2543ZM25.5767 2.3216C25.4398 2.18672 25.2798 2.16668 25.1957 2.16668C25.0792 2.16668 24.9681 2.20135 24.8466 2.28693C21.4281 4.54568 14.9511 10.6107 12.0362 13.3927L14.3228 15.6455C17.1486 12.7768 23.3193 6.39222 25.6306 3.00735C25.7867 2.79393 25.7642 2.50522 25.5767 2.3216Z"
                              className="fill-black dark:fill-white"
                            />
                          </svg>
                          <span className="tooltiptext absolute bottom-10 -right-11 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                            {post.tags.design}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="font-robot text-xl font-light italic">
                “{post.desc || "description not provided"}”
              </p>
              {post.socials && (
                <div className="pt-3">
                  <div className="items center flex gap-4 ">
                    <div className="flex scale-90 gap-5 ">
                      {post.socials.twitter && (
                        <div>
                          <a href={post.socials.twitter}>
                            <Twitter className="fill-[#585858] " />
                          </a>
                        </div>
                      )}
                      {post.socials.ig && (
                        <div className="pt-[1px]">
                          <a href={post.socials.ig}>
                            <Instagram className="fill-[#585858] " />
                          </a>
                        </div>
                      )}
                      {post.socials.discord && (
                        <div className="tooltip relative inline-block scale-95 pl-[1px] pt-[2px]">
                          <a onClick={() => copyStaff(post.socials.discord)}>
                            <Discord className="fill-[#585858] " />
                          </a>
                          <span className="tooltiptext  absolute bottom-12 w-max rounded-md bg-[#18191c] py-2 px-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-out">
                            Tap to copy Discord Tag
                          </span>
                        </div>
                      )}
                      {post.socials.aniList && (
                        <div className="pt-[2px] xl:pt-[5px] ">
                          <a href={post.socials.aniList}>
                            <AniList />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Moopa - Staff</title>
        <meta name="staff" content="Our beloved staff-san" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>

      <Navbar className="dark:bg-black" />

      <section className="flex h-auto flex-col gap-10 bg-[#F9F9F9] p-5 pt-10 dark:bg-[#111111] xl:gap-16 xl:px-20 xl:py-10">
        <div>
          <h1 className="font-roboto text-[23px] font-bold italic dark:text-gray-200">
            MAIN CHARACTER
          </h1>
        </div>

        {/* MAIN CHAR */}
        {DevCard()}

        <div>
          <h1 className="font-roboto text-[23px] font-bold italic dark:text-gray-200">
            SIDE CHARACTER
          </h1>
        </div>

        {/* SIDE CHAR */}
        {StaffCard()}
      </section>

      <Footer />
    </>
  );
}
