import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAniList } from "../../lib/anilist/useAnilist";
import { toast } from "react-toastify";
import AniList from "../media/aniList";
import { signIn } from "next-auth/react";

export default function RightBar({
  id,
  hasRun,
  session,
  currentChapter,
  paddingX,
  setPaddingX,
  layout,
  setLayout,
  setIsKeyOpen,
  scaleImg,
  setScaleImg,
}) {
  const { markProgress } = useAniList(session);

  const [status, setStatus] = useState("CURRENT");
  const [progress, setProgress] = useState(0);
  const [volumeProgress, setVolumeProgress] = useState(0);

  useEffect(() => {
    if (currentChapter?.number) {
      setProgress(currentChapter.number);
    }
  }, [currentChapter]);

  const saveProgress = async () => {
    if (session) {
      const parsedProgress = parseFloat(progress);
      const parsedVolumeProgress = parseFloat(volumeProgress);

      if (
        parsedProgress === parseInt(parsedProgress) &&
        parsedVolumeProgress === parseInt(parsedVolumeProgress)
      ) {
        markProgress(id, progress, status, volumeProgress);
        hasRun.current = true;
      } else {
        toast.error("Progress must be a whole number!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }
  };

  const changeMode = (e) => {
    setLayout(Number(e.target.value));
    // console.log(e.target.value);
  };

  return (
    <div className="hidden lg:flex flex-col gap-5 shrink-0 w-[16rem] bg-secondary py-5 px-3 relative">
      <div
        className="fixed right-5 bottom-5 group cursor-pointer"
        title="Keyboard Shortcuts"
        onClick={() => setIsKeyOpen(true)}
      >
        <ExclamationCircleIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <h1 className="font-karla font-bold xl:text-lg">Reading mode</h1>
        <div className="flex relative">
          <select
            className="bg-[#161617] text-sm xl:text-base cursor-pointer w-full p-1 px-3 font-karla rounded-md appearance-none"
            defaultValue={layout}
            onChange={changeMode}
          >
            <option value={1}>Vertical</option>
            <option value={2}>Right to Left</option>
            <option value={3}>Right to Left {"(1 Page)"}</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 text-white absolute inset-0 my-auto mx-52" />
        </div>
      </div>
      {/* Zoom */}
      <div className="flex flex-col gap-3 w-full">
        <h1 className="font-karla font-bold xl:text-lg">Scale Image</h1>
        <div className="grid grid-cols-3 text-sm xl:text-base gap-5 place-content-evenly justify-items-center">
          <button
            type="button"
            onClick={() => {
              setPaddingX(paddingX - 50);
              setScaleImg(scaleImg + 0.1);
            }}
            className="bg-[#161617] w-full flex-center p-1 rounded-md"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setPaddingX(paddingX + 50);
              setScaleImg(scaleImg - 0.1);
            }}
            className="bg-[#161617] w-full flex-center p-1 rounded-md"
          >
            -
          </button>
          <button
            type="button"
            onClick={() => {
              setPaddingX(208);
              setScaleImg(1);
            }}
            className="bg-[#161617] w-full flex-center p-1 rounded-md"
          >
            reset
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <h1 className="font-karla font-bold xl:text-lg">Tracking</h1>
        {session ? (
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <label className="font-karla font-semibold text-gray-500 text-xs">
                Status
              </label>
              <div className="relative">
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-2 py-1 font-karla rounded-md bg-[#161617] appearance-none text-sm"
                >
                  <option value="CURRENT">Reading</option>
                  <option value="PLANNING">Plan to Read</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REPEATING">Rereading</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DROPPED">Dropped</option>
                </select>
                <ChevronDownIcon className="w-5 h-5 text-white absolute inset-0 my-auto mx-52" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-karla font-semibold text-gray-500 text-xs">
                Chapter Progress
              </label>
              <input
                id="chapter-progress"
                type="number"
                placeholder="0"
                min={0}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full px-2 py-1 rounded-md bg-[#161617] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="font-karla font-semibold text-gray-500 text-xs">
                Volume Progress
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                onChange={(e) => setVolumeProgress(e.target.value)}
                className="w-full px-2 py-1 rounded-md bg-[#161617] text-sm"
              />
            </div>
            <button
              type="button"
              onClick={saveProgress}
              className="w-full bg-[#424245] py-1 my-5 rounded-md text-white text-sm xl:text-base shadow-md font-karla font-semibold"
            >
              Save Progress
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => signIn("AniListProvider")}
            className="flex-center gap-2 bg-[#363639] hover:bg-[#363639]/50 text-white hover:text-txt p-2 rounded-md cursor-pointer shadow-md"
          >
            <span className="font-karla">Login to AniList</span>
            <div className="flex-center w-5 h-5">
              <AniList />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
