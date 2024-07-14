import MobileNav from "@/components/shared/MobileNav";
import { Navbar } from "@/components/shared/NavBar";
import { useState } from "react";

export default function RemovedPage() {
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      <Navbar />
      <MobileNav hideProfile />
      <div className="flex flex-col items-center justify-center h-dvh font-karla">
        <div className="flex-col flex-center container space-y-2">
          <div className="size-24 lg:size-32 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path
                fill="currentColor"
                d="m955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48M480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8zm32 352a48.01 48.01 0 0 1 0-96a48.01 48.01 0 0 1 0 96"
              ></path>
            </svg>
          </div>
          <div className="font-karla font-bold lg:text-3xl text-center">
            This content has been removed from the site.
          </div>
          <p
            className="hover:text-action text-zinc-500 cursor-pointer"
            onClick={() => {
              setReadMore((prev) => !prev);
            }}
          >
            Why am I seeing this?
          </p>
          <p
            className={`opacity-0 ${
              readMore ? "opacity-100" : ""
            } transition-all duration-200 p-2 bg-secondary rounded-md font-roboto text-sm lg:text-base text-zinc-300`}
          >
            Unfortunately, the media you were trying to access has been removed
            from our site due to copyright infringement. We take intellectual
            property rights seriously and strive to maintain a platform that
            respects the creative works of others. If you have any questions or
            concerns, please feel free to contact our support team for further
            assistance. Thank you for your understanding and cooperation in
            upholding a fair and lawful online environment.
          </p>
        </div>
      </div>
    </>
  );
}
