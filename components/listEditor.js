import { useState } from "react";
import useAlert from "./useAlert";
import { motion as m } from "framer-motion";

const ListEditor = ({ animeId, session, stats, prg, max }) => {
  const { message, type, showAlert } = useAlert();
  const [status, setStatus] = useState(stats ?? "");
  const [progress, setProgress] = useState(prg ?? 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting", status, progress);
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
        showAlert("Something went wrong", "error");
        return;
      }
      console.log("Saved media list entry", data);
      //   success();
      showAlert("Media list entry saved", "success");
    } catch (error) {
      showAlert("Something went wrong", "error");
      console.error(error);
    }
  };

  return (
    <div className="relative bg-secondary rounded-md w-full sm:w-auto">
      {message && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-1 mb-4 rounded-md text-sm sm:text-base`}
        >
          {message}
        </m.div>
      )}
      <div className="absolute font-karla -top-8 rounded-md bg-secondary px-2 py-1 text-sm">
        List Editor
      </div>
      <form
        onSubmit={handleSubmit}
        className="px-7 py-5 text-inherit flex flex-col gap-3 font-karla antialiased shrink-0"
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-sm px-2 py-1 bg-[#363642] w-[50%] sm:w-[150px] text-sm sm:text-base"
            >
              <option value="">Select a status</option>
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
  );
};

export default ListEditor;
