import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="twitter:title"
          content="Moopa - Free Anime and Manga Streaming"
        />
        <meta
          name="twitter:description"
          content="Discover your new favorite anime or manga title! Moopa offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using Moopa today!"
        />
        <meta name="twitter:image" content="/preview.png" />
        <meta
          name="description"
          content="Discover your new favorite anime or manga title! Moopa offers a vast library of high-quality content, accessible on multiple devices and without any interruptions. Start using Moopa today!"
        />
      </Head>
    </>
  );
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/en",
      permanent: false,
    },
  };
}
