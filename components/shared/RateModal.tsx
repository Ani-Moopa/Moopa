import { useAniList } from "@/lib/anilist/useAnilist";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  toggle: boolean;
  position: "top" | "bottom";
  setToggle: (prev: any) => void;
  session: any;
};

export default function RateModal({
  toggle,
  position,
  setToggle,
  session,
}: Props) {
  const [startRate, setStartRate] = useState(false);

  const { dataMedia } = useWatchProvider();

  async function handleSubmit(event: any) {
    event.preventDefault();
    const data = new FormData(event.target);
    const rating = data.get("rating");
    const notes = data.get("notes");
    try {
      const { markComplete } = useAniList(session);
      await markComplete(dataMedia?.id, { notes, scoreRaw: rating });
      toast.success("Successfully rated!");
      setToggle((prev: any) => {
        return {
          ...prev,
          isOpen: false,
        };
      });
    } catch (error) {
      toast.error("Failed to rate!");
    }
  }

  function handleClose() {
    setToggle((prev: any) => {
      return {
        ...prev,
        isOpen: false,
      };
    });
  }
  return (
    <>
      <div
        className={`w-full h-[20dvh] fixed bg-gradient-to-${
          position === "top"
            ? `b top-0 from-black/20`
            : "t -bottom-5 from-black/40"
        } to-transparent z-10 transition-all duration-200 ease-in-out ${
          toggle ? "" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        style={{ width: startRate ? "300px" : "240px" }}
        className={`${
          position === "top"
            ? toggle
              ? `top-5`
              : `-top-48`
            : toggle
            ? `bottom-10`
            : `-bottom-48`
        } fixed text-white font-semibold z-50 font-karla transition-all duration-300 ease-in-out left-1/2 transform -translate-x-1/2 bg-secondary p-3 rounded flex flex-col justify-center items-center gap-4`}
      >
        <p className="text-lg">What do you think?</p>
        <div
          className={`flex gap-2 font-medium text-center transition-all duration-200 ${
            startRate
              ? "scale-50 hidden pointer-events-none"
              : "scale-100 opacity-100"
          }`}
        >
          <button
            onClick={() => setStartRate(true)}
            className="w-[100px] py-1 bg-action/10 rounded text-action"
          >
            Rate Now
          </button>
          <button
            onClick={handleClose}
            className="w-[100px] py-1 border border-opacity-0 hover:border-opacity-10 rounded border-white"
          >
            Close
          </button>
        </div>
        {startRate && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-3 w-full"
          >
            <input
              type="number"
              min={1}
              max={100}
              required
              name="rating"
              placeholder="rate from 1-100"
              className="appearance-none w-full text-white placeholder-zinc-400 bg-white/10 py-1 px-2 rounded text-sm"
            />
            <input
              type="text"
              name="notes"
              placeholder="notes"
              className="appearance-none w-full text-white placeholder-zinc-400 bg-white/10 py-1 px-2 rounded text-sm"
            />
            <div className="flex gap-2 w-full">
              <button
                type="submit"
                className="w-full py-1 bg-action/10 hover:bg-action/20 rounded text-action"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-1 rounded hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
