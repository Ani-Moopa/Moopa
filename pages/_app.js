import { useRouter } from "next/router";
import { AnimatePresence, motion as m } from "framer-motion";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import SearchPalette from "@/components/searchPalette";
import { SearchProvider } from "@/lib/context/isOpenState";
import Head from "next/head";
import { WatchPageProvider } from "@/lib/context/watchPageProvider";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { unixTimestampToRelativeTime } from "@/utils/getTimes";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

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
        if (
          data &&
          data?.message !== "No broadcast" &&
          data?.message !== "unauthorized"
        ) {
          toast(
            `${data.message} ${
              data?.startAt ? unixTimestampToRelativeTime(data.startAt) : ""
            }`,
            {
              position: "top-center",
              autoClose: false,
              closeOnClick: true,
              draggable: true,
              theme: "colored",
              className: "toaster",
              style: {
                background: "#232329",
                color: "#fff",
              },
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
    getBroadcast();
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <SessionProvider session={session}>
        <SearchProvider>
          <WatchPageProvider>
            <AnimatePresence mode="wait">
              <SkeletonTheme baseColor="#232329" highlightColor="#2a2a32">
                <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
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
