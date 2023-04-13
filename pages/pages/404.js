import Head from "next/head";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Not Found</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>
      <Navbar className="dark:bg-black" />
      <div className="flex h-[800px] w-screen items-center justify-center gap-10 bg-slate-50 text-2xl dark:bg-[#121212]">
        <div className="flex items-center gap-8 font-karla font-semibold">
          <h1>404</h1>
          <div className="h-[45px] w-[2px] bg-black dark:bg-white" />
          <h1>Nothing to see here.</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}
