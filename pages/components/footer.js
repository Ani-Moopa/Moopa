import Twitter from "./media/twitter";
import Instagram from "./media/instagram";
import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <section className=" text-white z-40 bg-black md:flex md:h-[14rem] md:items-center md:justify-between">
      <div className="mx-auto flex w-[78%] flex-col space-y-10 py-10 md:flex-row md:items-center md:justify-between md:space-y-0 md:py-0">
        <div className="md:flex md:flex-col md:gap-y-[3.88rem]">
          <h1 className="font-outfit text-[2.56rem]">moopa</h1>
          <p className="flex items-center gap-1 font-karla text-[0.81rem] text-[#CCCCCC]">
            &copy; {new Date().getFullYear()} moopa.my.id | Website Made by
            Factiven
          </p>
        </div>
        <div className="">
          <Image
            src="https://i1210.photobucket.com/albums/cc417/kusanagiblog/NarutoVSSasuke.gif"
            alt="gambar"
            title="request nya rapip yulistian"
            width={210}
            height={85}
          />
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-[9.06rem] ">
          <div className="flex flex-col gap-10 font-karla font-bold md:flex-row md:gap-[5.94rem]">
            <ul className="flex flex-col gap-y-[0.7rem] ">
              <li className="cursor-pointer hover:text-cyan-500">
                <a href="https://github.com/AniList/ApiV2-GraphQL-Docs">API</a>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <Link href="/staff">Staff</Link>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <Link href="/contact">Contact</Link>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <Link href="/dmca">DMCA</Link>
              </li>
            </ul>
            <ul className="flex flex-col gap-y-[0.7rem]">
              <li className="cursor-pointer hover:text-cyan-500">
                <a href="https://discord.gg/v5fjSdKwr2">Discord</a>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <a href="https://www.instagram.com/dvnabny/">Instagram</a>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <a href="https://twitter.com/Factivens">Twitter</a>
              </li>
              <li className="cursor-pointer hover:text-cyan-500">
                <a href="https://github.com/DevanAbinaya">Github</a>
              </li>
            </ul>
          </div>
          <div className="flex gap-[0.69rem]">
            <div>
              <Link href="https://twitter.com/Factivens">
                <Twitter className="fill-[#4CFFFF]" />
              </Link>
            </div>
            <div>
              <Link href="https://www.instagram.com/dvnabny/">
                <Instagram className="fill-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
