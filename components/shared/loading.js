import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col gap-5 items-center justify-center w-full z-[800]">
        {/* <Image
          src="/wait-animation.gif"
          width="0"
          height="0"
          className="w-[30%] h-[30%]"
        /> */}
        <div className="flex flex-col items-center font-karla gap-2">
          <p>Please Wait...</p>
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
}
