import Head from "next/head";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/shared/footer";
import { NewNavbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";

export default function Home() {
  return (
    <>
      <Head>
        <title>Under Construction</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/svg/c.svg" />
      </Head>
      <main className="flex flex-col h-screen">
        <NewNavbar />
        <MobileNav hideProfile />
        {/* Create an under construction page with tailwind css */}
        <div className="h-full w-screen flex-center flex-grow flex-col">
          <Image
            width={500}
            height={500}
            src="/work-on-progress.gif"
            alt="work-on-progress"
            className="w-[26vw] md:w-[15vw]"
          />
          <h1 className="text-2xl sm:text-4xl xl:text-6x font-bold my-4">
            🚧 Page Under Construction 🚧
          </h1>
          <p className="text-base sm:text-lg xl:text-x text-gray-300 mb-6 text-center">
            "Please be patient, as we're still working on this page and it will
            be available soon."
          </p>
          <Link href={`/en/`}>
            <div className="bg-action xl:text-xl text-white font-bold py-2 px-4 rounded hover:bg-[#fb6f44]">
              Go back home
            </div>
          </Link>
        </div>
        <Footer />
      </main>
    </>
  );
}
