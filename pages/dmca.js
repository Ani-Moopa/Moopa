import Head from "next/head";
import Layout from "../components/layout";

export default function DMCA() {
  return (
    <>
      <Head>
        <title>Moopa - DMCA</title>
        <meta name="DMCA" content="DMCA" />
        <meta property="og:title" content="DMCA" />
        <meta
          property="og:description"
          content="Moopa.live is committed to respecting the intellectual
                  property rights of others and complying with the Digital
                  Millennium Copyright Act (DMCA)."
        />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/1068758633464201268/1081591948705546330/logo.png"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/c.svg" />
      </Head>
      <Layout>
        <div className="min-h-screen z-20 flex w-screen justify-center items-center">
          <div className="w-[75%] text-2xl gap-7 flex flex-col my-[10rem]">
            <div className="flex">
              <h1 className="text-4xl font-bold font-karla rounded-md bg-[#212121] p-3">
                DMCA - Disclaimer
              </h1>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3 text-[#cdcdcd]">
                <p>
                  Moopa.live is committed to respecting the intellectual
                  property rights of others and complying with the Digital
                  Millennium Copyright Act (DMCA). We take copyright
                  infringement seriously and will respond to notices of alleged
                  copyright infringement that comply with the DMCA and any other
                  applicable laws.
                </p>
                <p>
                  If you believe that any content on our website is infringing
                  upon your copyrights, please send us an email. Please allow up
                  to 2-5 business days for a response. Please note that emailing
                  your complaint to other parties such as our Internet Service
                  Provider, Hosting Provider, and other third parties will not
                  expedite your request and may result in a delayed response due
                  to the complaint not being filed properly.
                </p>
              </div>
              <p className="text-white">
                In order for us to process your complaint, please provide the
                following information:
              </p>
              <div className="text-xl ml-5 text-[#cdcdcd]">
                <ul className="flex flex-col gap-1">
                  <li>
                    · Your name, address, and telephone number. We reserve the
                    right to verify this information.
                  </li>
                  <li>
                    · Identification of the copyrighted work claimed to have
                    been infringed.
                  </li>
                  <li>
                    · The exact and complete URL link where the infringing
                    material is located.
                  </li>
                  <li>
                    · The exact and complete URL link where the infringing
                    material is located.
                  </li>
                  <li>
                    · The exact and complete URL link where the infringing
                    material is located.
                  </li>
                  <li>· Please write to us in English or Indonesian.</li>
                </ul>
              </div>
              <p className="text-[#cdcdcd]">
                Please note that anonymous or incomplete messages will not be
                dealt with. Thank you for your understanding.
              </p>
              <h1 className="text-white font-karla">DISCLAIMER:</h1>
              <p className="text-[#cdcdcd]">
                None of the files listed on Moopa.live are hosted on our
                servers. All links point to content hosted on third-party
                websites. Moopa.live does not accept responsibility for content
                hosted on third-party websites and has no involvement in the
                downloading/uploading of movies. We only post links that are
                available on the internet. If you believe that any content on
                our website infringes upon your intellectual property rights and
                you hold the copyright for that content, please report it to{" "}
                <a
                  href="mailto:contact@moopa.live?subject=[Moopa]%20-%20Your%20Subject"
                  className="font-semibold"
                >
                  contact@moopa.live
                </a>{" "}
                and the content will be immediately removed.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
