import MobileNav from "@/components/shared/MobileNav";
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import Link from "next/link";

function Error({ statusCode }: any) {
  return (
    <>
      <Head>
        <title>An Error Has Occurred</title>
      </Head>
      <Navbar withNav shrink />
      <MobileNav hideProfile />
      <div className="w-screen h-screen flex-center flex-col gap-5">
        <div className="relative text-3xl">(╯°□°）╯︵ ┻━┻</div>
        <div className="flex items-center gap-2 text-xl">
          <span>
            {statusCode
              ? `An error ${statusCode} occurred on server.`
              : "An error occurred on client."}
          </span>
        </div>
        <Link
          href="/en"
          className="rounded ring-action/50 ring-1 p-2 font-karla bg-action bg-opacity-0 hover:bg-opacity-20 hover:scale-105 text-white transition-all duration-300"
        >
          Back to home
        </Link>
      </div>
      <Footer />
    </>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
