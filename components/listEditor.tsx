import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";

interface ListEditorProps {
  animeId: number;
  session: any; // replace 'any' with the appropriate type
  stats?: string;
  prg?: number;
  max?: number;
  info?: AniListInfoTypes; // replace 'any' with the appropriate type
  close: () => void;
}

const ListEditor: React.FC<ListEditorProps> = ({
  animeId,
  session,
  stats = "CURRENT",
  prg = 0,
  max,
  info = undefined,
  close,
}) => {
  const [status, setStatus] = useState<string>(stats ?? "CURRENT");
  const [progress, setProgress] = useState<number>(prg ?? 0);
  const isAnime: boolean = info?.type === "ANIME";

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // console.log("Submitting", status?.name, progress);
    try {
      const response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          query: `
            mutation ($mediaId: Int!, $progress: Int, $status: MediaListStatus) {
              SaveMediaListEntry (mediaId: $mediaId, progress: $progress, status: $status) {
                id
                mediaId
                progress
                status
              }
            }
          `,
          variables: {
            mediaId: animeId,
            progress: progress,
            status: status || null,
          },
        }),
      });
      const { data } = await response.json();
      if (data.SaveMediaListEntry === null) {
        toast.error("Something went wrong");
        return;
      }
      console.log("Saved media list entry", data);
      toast.success("Media list entry saved");
      close();
      setTimeout(() => {
        // window.location.reload();
        router.reload();
      }, 1000);
      // showAlert("Media list entry saved", "success");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="absolute font-karla font-bold -top-8 rounded-sm px-2 py-1 text-sm">
        List Editor
      </div>
      <div className="relative bg-secondary rounded-sm w-screen md:w-auto">
        <div className="md:flex">
          {info?.bannerImage && (
            <div>
              <Image
                src={info.coverImage.large}
                alt="image"
                height={500}
                width={500}
                className="object-cover w-[120px] h-[180px] rounded-l-sm hidden md:block"
              />
              <Image
                src={
                  info.bannerImage ||
                  info.coverImage.extraLarge ||
                  info.coverImage.large
                }
                alt="image"
                height={500}
                width={500}
                className="object-cover h-[50px] rounded-t-sm md:hidden"
              />
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="px-7 py-5 text-inherit flex flex-col justify-between gap-3 font-karla antialiased shrink-0 relative"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-4 sm:gap-24">
                <label
                  htmlFor="status"
                  className="font-karla font-bold text-sm sm:text-base"
                >
                  Status:
                </label>
                <select
                  name="status"
                  id="status"
                  value={status || "CURRENT"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-sm px-2 py-1 bg-[#363642] w-[50%] sm:w-[150px] text-sm sm:text-base"
                >
                  <option value="CURRENT">
                    {isAnime ? "Watching" : "Reading"}
                  </option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DROPPED">Dropped</option>
                  <option value="PLANNING">
                    Plan to {isAnime ? "watch" : "read"}
                  </option>
                </select>
              </div>
              <div className="flex justify-between items-center mt-2">
                <label
                  htmlFor="progress"
                  className="font-karla font-bold text-sm sm:text-base"
                >
                  Progress:
                </label>
                <input
                  type="number"
                  name="progress"
                  id="progress"
                  value={progress}
                  max={max}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="rounded-sm px-2 py-1 bg-[#363642] w-[50%] sm:w-[150px] text-sm sm:text-base"
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
              title="Save"
              className="bg-[#363642] text-white rounded-sm mt-2 py-1 text-sm sm:text-base"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListEditor;
