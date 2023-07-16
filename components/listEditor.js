import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const ListEditor = ({ animeId, session, stats, prg, max, image = null }) => {
  const [status, setStatus] = useState(stats ?? "");
  const [progress, setProgress] = useState(prg ?? 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting", status?.name, progress);
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
        toast.error("Something went wrong", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
      console.log("Saved media list entry", data);
      toast.success("Media list entry saved", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // showAlert("Media list entry saved", "success");
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
          {image && (
            <div>
              <Image
                src={image.coverImage.large}
                alt="image"
                height={500}
                width={500}
                className="object-cover w-[120px] h-[180px] rounded-l-sm hidden md:block"
              />
              <Image
                src={
                  image.bannerImage ||
                  image.coverImage.extraLarge ||
                  image.coverImage.large
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
                  value={status?.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-sm px-2 py-1 bg-[#363642] w-[50%] sm:w-[150px] text-sm sm:text-base"
                >
                  <option value="CURRENT">Watching</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DROPPED">Dropped</option>
                  <option value="PLANNING">Plan to watch</option>
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
                  onChange={(e) => setProgress(e.target.value)}
                  className="rounded-sm px-2 py-1 bg-[#363642] w-[50%] sm:w-[150px] text-sm sm:text-base"
                  min="0"
                />
              </div>
            </div>
            <button
              type="submit"
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
