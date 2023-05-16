import { ImageResponse } from "@vercel/og";

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
        }}
        className="relative w-[1900px] h-[400px] text-[10px]"
      >
        <div
          className="w-[1900px] h-[400px]"
          style={{
            display: "flex",
            width: "100%",
            paddingLeft: 100,
            alignItems: "center",
            color: "white",
            position: "relative",
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.93), rgba(0,0,0,0.8) , rgba(0,0,0,0.2))`,
            filter: "brightness(20%)",
          }}
        >
          <span
            style={{
              display: "flex",
              position: "absolute",
              top: 10,
              left: 25,
              fontSize: "40",
              color: "#FF7F57",
              fontFamily: "Outfit",
              filter: "brightness(100%)",
            }}
          >
            moopa
          </span>
          <h1
            style={{
              width: "70%",
              fontSize: "70px",
              filter: "brightness(100%)",
            }}
          >
            {title}
          </h1>
        </div>
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
