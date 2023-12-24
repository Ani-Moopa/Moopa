import Head from "next/head";
import Image from "next/image";
import Footer from "@/components/shared/footer";
import { Navbar } from "@/components/shared/NavBar";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Custom404() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Not Found</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/svg/c.svg" />
      </Head>
      <Navbar withNav shrink />
      <div className="min-h-screen w-screen flex flex-col items-center justify-center ">
        <Image
          width={500}
          height={500}
          src="/svg/404.svg"
          alt="404"
          className="w-[26vw] md:w-[15vw]"
        />
        <h1 className="text-2xl sm:text-4xl xl:text-6xl font-bold my-4">
          Oops! Page not found
        </h1>
        <p className="text-base sm:text-lg xl:text-xl text-gray-300 mb-6 text-center">
          The page you're looking for doesn't seem to exist.
        </p>
        <div className="flex gap-5 font-karla">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="flex items-center gap-2 py-2 px-4 ring-1 ring-action/70 rounded hover:text-white transition-all duration-200 ease-out"
          >
            <span>
              <ArrowLeftIcon className="w-5 h-5" />
            </span>
            Go back
          </button>
          <button
            type="button"
            onClick={() => {
              router.push("/en");
            }}
            className="bg-action xl:text-xl text-white font-bold py-2 px-4 rounded hover:bg-opacity-80 hover:text-white transition-all duration-200 ease-out"
          >
            Home Page
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
