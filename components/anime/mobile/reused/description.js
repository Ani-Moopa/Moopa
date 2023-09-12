export default function Description({
  info,
  readMore,
  setReadMore,
  className,
}) {
  return (
    <div className={`${className} relative md:py-2 z-40`}>
      <div
        className={`${
          info?.description?.replace(/<[^>]*>/g, "").length > 240
            ? ""
            : "pointer-events-none"
        } ${
          readMore ? "hidden" : ""
        } absolute z-30 flex items-end justify-center top-0 w-full h-full transition-all duration-200 ease-linear md:opacity-0 md:hover:opacity-100 bg-gradient-to-b from-transparent to-primary to-95%`}
      >
        <button
          type="button"
          disabled={readMore}
          onClick={() => setReadMore(!readMore)}
          className="text-center font-bold text-gray-200 py-1 w-full"
        >
          Read {readMore ? "Less" : "More"}
        </button>
      </div>
      <p
        className={`${
          readMore
            ? "text-start md:h-[90px] md:overflow-y-scroll md:scrollbar-thin md:scrollbar-thumb-secondary md:scrollbar-thumb-rounded"
            : "md:line-clamp-2 line-clamp-3 md:text-start text-center"
        } text-sm md:text-base font-light antialiased font-karla leading-6`}
        style={{
          scrollbarGutter: "stable",
        }}
        dangerouslySetInnerHTML={{
          __html: readMore
            ? info?.description
            : info?.description?.replace(/<[^>]*>/g, ""),
        }}
      />
    </div>
  );
}
