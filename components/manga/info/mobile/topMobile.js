import Image from "next/image";

export default function TopMobile({ info }) {
  return (
    <div className="md:hidden">
      <Image
        src={info.coverImage}
        width={500}
        height={500}
        alt="cover image"
        className="md:hidden absolute top-0 left-0 -translate-y-24 w-full h-[30rem] object-cover rounded-sm shadow-lg brightness-75"
      />
      <div className="absolute top-0 left-0 w-full -translate-y-24 h-[32rem] bg-gradient-to-t from-primary to-transparent from-50%"></div>
    </div>
  );
}
