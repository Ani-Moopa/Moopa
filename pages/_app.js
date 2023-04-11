import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { AnimatePresence, motion as m } from "framer-motion";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <AnimatePresence mode="wait">
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
            <Component {...pageProps} />
          </m.div>
        </AnimatePresence>
      </ThemeProvider>
    </SessionProvider>
  );
}
