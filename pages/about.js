import Head from "next/head";
import Layout from "../components/layout";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>Moopa - About</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-center items-center min-h-screen md:py-0 py-16"
        >
          <div className="max-w-screen-lg w-full px-4 py-10">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="text-lg mb-8">
              Moopa is a platform where you can watch and stream anime or read
              manga for free, without any ads or VPNs. Our mission is to provide
              a convenient and enjoyable experience for anime and manga
              enthusiasts all around the world.
            </p>
            <p className="text-lg mb-8">
              At our site, you will find a vast collection of anime and manga
              titles from different genres, including action, adventure, comedy,
              romance, and more. We take pride in our fast and reliable servers,
              which ensure smooth streaming and reading for all our users.
            </p>
            <p className="text-lg mb-8">
              We believe that anime and manga have the power to inspire and
              entertain people of all ages and backgrounds. Our service is
              designed to make it easy for fans to access the content they love,
              whether they are casual viewers or die-hard fans.
            </p>
            <p className="text-lg mb-8">
              Thank you for choosing our website as your go-to platform for
              anime and manga. We hope you enjoy your stay here, and feel free
              to contact us if you have any feedback or suggestions.
            </p>
            <Link href="/contact">
              <div className="bg-[#ffffff] text-black font-medium py-3 px-6 rounded-lg hover:bg-action transition duration-300 ease-in-out">
                Contact Us
              </div>
            </Link>
          </div>
        </motion.div>
      </Layout>
    </>
  );
}
