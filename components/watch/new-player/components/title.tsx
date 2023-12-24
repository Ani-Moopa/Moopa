import { useWatchProvider } from "@/lib/context/watchPageProvider";
import { useMediaRemote } from "@vidstack/react";
import { ChevronLeftIcon } from "@vidstack/react/icons";
import { Navigation } from "../player";

type TitleProps = {
  navigation?: Navigation;
};

export function Title({ navigation }: TitleProps) {
  const { dataMedia } = useWatchProvider();
  const remote = useMediaRemote();

  return (
    <div className="media-fullscreen:flex hidden text-start flex-1 text-sm font-medium text-white">
      {/* <p className="pt-4 h-full">
      </p> */}
      <button
        type="button"
        className="flex items-center gap-2 text-sm font-karla w-full"
        onClick={() => remote.toggleFullscreen()}
      >
        <ChevronLeftIcon className="font-extrabold w-7 h-7" />
        <span className="max-w-[75%] text-base xl:text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {dataMedia?.title?.romaji}
        </span>
        <span className="text-base xl:text-2xl font-normal">/</span>
        <span className="text-base xl:text-2xl font-normal">
          Episode {navigation?.playing.number}
        </span>
        {/* <span className="absolute top-5 left-[1s0%] w-[24%] h-[1px] bg-white" /> */}
      </button>
    </div>
  );
}
