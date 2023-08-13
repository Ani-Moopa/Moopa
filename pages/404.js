import Head from "next/head";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Not Found</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/madara.svg" />
      </Head>
      <Navbar className="bg-[#0c0d10]" />
      <div className="min-h-screen w-screen flex flex-col items-center justify-center ">
        <img src="/404.svg" alt="404" className="w-[26vw] md:w-[15vw]" />
        <h1 className="text-2xl sm:text-4xl xl:text-6xl font-bold my-4">
          Oops! Page not found
        </h1>
        <p className="text-base sm:text-lg xl:text-xl text-gray-300 mb-6 text-center">
          The page you're looking for doesn't seem to exist.
        </p>
        <Link href={`/en/`}>
          <div className="bg-[#fa7d56] xl:text-xl text-white font-bold py-2 px-4 rounded hover:bg-[#fb6f44]">
            Go back Home
          </div>
        </Link>
      </div>
      <Footer />
    </>
  );
}
