import { ImageResponse } from "@vercel/og";
// import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const karla = fetch(
  new URL("../../assets/Karla-MediumItalic.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const outfit = fetch(
  new URL("../../assets/Outfit-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(request) {
  const Karla = await karla;
  const Outfit = await outfit;

  const { searchParams } = request.nextUrl;
  const hasTitle = searchParams.has("title");
  const title = hasTitle
    ? searchParams.get("title").length > 64
      ? searchParams.get("title").slice(0, 64) + "..."
      : searchParams.get("title")
    : "Watch Now";
  const image = searchParams.get("image");
  if (!title) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${image})`,
          //   paddingTop: 50,
          //   flexDirection: "column",
          //   justifyContent: "center",
          //   alignItems: "center",
        }}
        className="relative w-[1900px] h-[400px] text-[10px]"
      >
        <div
          className="w-[1900px] h-[400px]"
          style={{
            display: "flex",
            width: "100%",
            // justifyContent: "center",
            paddingLeft: 50,
            alignItems: "center",
            color: "white",
            position: "relative",
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,1) 15%, rgba(0,0,0,0))`,
          }}
        >
          <span
            style={{
              display: "flex",
              position: "absolute",
              top: 20,
              left: 30,
              fontSize: "40",
              color: "#FF7F57",
              fontFamily: "Outfit",
            }}
          >
            moopa
          </span>
          <h1
            className="font-inter text-[70px]"
            style={{
              width: "60%",
            }}
          >
            {title}
          </h1>
        </div>
        {/* {image && (
          <img
            src={image}
            width={1900}
            height={400}
            tw="object-cover z-10 absolute"
          />
        )} */}
        {/* <p className="">github.com/{username}</p> */}
      </div>
    ),
    {
      width: 1900,
      height: 400,
      fonts: [
        {
          name: "Karla",
          data: Karla,
          style: "normal",
        },
        {
          name: "Outfit",
          data: Outfit,
          style: "normal",
        },
      ],
    }
  );
}
