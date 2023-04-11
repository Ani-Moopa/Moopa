import Head from "next/head";
import Layout from "../components/layout";
import UnderConstruction from "../components/underConst";

export default function About() {
  const clientId = process.env.ANILIST_CLIENT_ID;

  return (
    <>
      <Head>
        <title>Moopa - About</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>
      <Layout>
        <div className="mb-[6rem] bg-[#121212] text-white flex min-h-screen w-screen flex-col justify-center gap-8 px-6 pt-nav lg:items-center lg:gap-14">
          <h1 className="place-items-start font-karla text-[3rem] font-bold">
            Hi !
          </h1>
          <div className="flex flex-col gap-3 font-roboto text-xl text-[#cdcdcd] lg:mx-52 lg:gap-10 lg:text-2xl">
            <div>
              <p className="inline-block font-extrabold text-[#ffffff]">
                Welcome to our website!
              </p>{" "}
              Moopa is a platform where you can watch and stream anime or read
              manga for free, without any ads or VPNs. Our mission is to provide
              a convenient and enjoyable experience for anime and manga
              enthusiasts all around the world.
            </div>
            <p>
              At our site, you will find a vast collection of anime and manga
              titles from different genres, including action, adventure, comedy,
              romance, and more. We take pride in our fast and reliable servers,
              which ensure smooth streaming and reading for all our users.
            </p>
            <p>
              It is important to note that we do not store any files on our
              servers. Instead, we only link to media hosted on third-party
              services. This is to ensure that we comply with copyright laws and
              respect the intellectual property rights of content creators.
            </p>
            <p>
              We are committed to providing a safe and secure environment for
              our users. Our website is regularly monitored to prevent any
              malicious activities, and we take proactive measures to ensure the
              safety of our community.
            </p>
            <p>
              Thank you for choosing our website as your go-to platform for
              anime and manga. We hope you enjoy your stay here, and feel free
              to contact us if you have any feedback or suggestions.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
