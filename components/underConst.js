import Footer from "./footer";
import StickerWIP from "./media/sticker";
import Navbar from "./navbar";

function UnderConstruction() {
  return (
    <>
      <div className="my-[5rem] flex h-[698px] items-center justify-center">
        <div className="flex scale-75 flex-col items-center justify-center gap-14 md:scale-90 md:flex-row md:pb-0">
          <div className="scale-110 md:scale-125">
            <StickerWIP />
          </div>
          <h1 className="text-center font-karla text-4xl text-red-600 drop-shadow-sm transition-colors duration-500 dark:text-red-400 md:w-[820px] md:text-5xl">
            {"> Sabar yahhh, pagenya masih dibikin..."} {":)"}
          </h1>
        </div>
      </div>
    </>
  );
}

export default UnderConstruction;
