import { useRouter } from "next/router";
import { AnimatePresence, motion as m } from "framer-motion";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import SearchPalette from "@/components/searchPalette";
import { SearchProvider } from "@/lib/context/isOpenState";
import Head from "next/head";
import { WatchPageProvider } from "@/lib/context/watchPageProvider";
import { useEffect, useState } from "react";
import { unixTimestampToRelativeTime } from "@/utils/getTimes";
import SecretPage from "@/components/secret";
import { Toaster, toast } from "sonner";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function getBroadcast() {
      try {
        const res = await fetch("/api/v2/admin/broadcast", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Broadcast-Key": "get-broadcast",
          },
        });
        const data = await res.json();
        if (data?.show === true) {
          toast.message(
            `🚧${data.message} ${
              data?.startAt ? unixTimestampToRelativeTime(data.startAt) : ""
            }🚧`,
            {
              position: "bottom-right",
              important: true,
              duration: 100000,
              className: "flex-center font-karla text-white",
              // description: `🚧${info}🚧`,
            }
          );
          // toast.message(`Announcement`, {
          //   position: "top-center",
          //   important: true,
          //   // duration: 10000,
          //   description: `🚧${info}🚧`,
          // });
        }
        setInfo(
          `${data.message} ${
            data?.startAt ? unixTimestampToRelativeTime(data.startAt) : ""
          }`
        );
      } catch (err) {
        console.log(err);
      }
    }
    getBroadcast();
  }, []);

  const handleCheatCodeEntered = () => {
    alert("Cheat code entered!"); // You can replace this with your desired action
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <SessionProvider session={session}>
        <SearchProvider>
          <WatchPageProvider>
            <AnimatePresence mode="wait">
              <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
                <Toaster richColors theme="dark" closeButton />
                <SecretPage
                  cheatCode={"aofienaef"}
                  onCheatCodeEntered={handleCheatCodeEntered}
                />
                {/* {info && (
                  <div className="relative px-3 flex items-center justify-center font-karla w-full py-2 bg-secondary/80 text-white text-center">
                    <span className="line-clamp-1 mr-5">🚧{info}🚧</span>
                    <span
                      onClick={() => setInfo()}
                      className="absolute right-3 cursor-pointer"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </span>
                  </div>
                )} */}
                <m.div
                  key={`route-${router.route}`}
                  transition={{ duration: 0.5 }}
                  initial="initialState"
                  animate="animateState"
                  exit="exitState"
                  variants={{
                    initialState: {
                      opacity: 0,
                    },
                    animateState: {
                      opacity: 1,
                    },
                    exitState: {},
                  }}
                  className="z-50 w-screen"
                >
                  <NextNProgress
                    color="#FF7E2C"
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                    showOnShallow={true}
                  />

                  <SearchPalette />
                  <Component {...pageProps} />
                </m.div>
              </SkeletonTheme>
            </AnimatePresence>
          </WatchPageProvider>
        </SearchProvider>
      </SessionProvider>
    </>
  );
}
