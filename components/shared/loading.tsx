export default function Loading() {
  return (
    <div className="flex-center flex-col font-karla z-40 gap-2">
      {/* <div className="flex flex-col gap-5 items-center justify-center w-full z-50"> */}
      {/* <Image
          src="/wait-animation.gif"
          width="0"
          height="0"
          className="w-[30%] h-[30%]"
        /> */}
      <p>Please Wait...</p>
      <div className="loader"></div>
      {/* </div> */}
    </div>
  );
}
