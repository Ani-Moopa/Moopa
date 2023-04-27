import { useState } from "react";
import useAlert from "./useAlert";
import { motion as m } from "framer-motion";

const ListEditor = ({ animeId, session, stats, prg, max }) => {
  const { message, type, showAlert } = useAlert();
  const [status, setStatus] = useState(stats ?? "");
  const [progress, setProgress] = useState(prg ?? 0);

  console.log(progress);

  //   function success() {
  //     window.location.reload();
  //   }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            progress: progress ? parseInt(progress) : null,
            status: status || null,
          },
        }),
      });
      const { data } = await response.json();
      console.log("Saved media list entry", data);
      //   success();
      showAlert("Media list entry saved", "success");
    } catch (error) {
      showAlert("Something went wrong", "error");
      console.error(error);
    }
  };

  return (
    <div className="relative">
      {message && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-1 mb-4 rounded-md`}
        >
          {message}
        </m.div>
      )}
      <form
        onSubmit={handleSubmit}
        className="px-10 py-5 text-inherit font-karla antialiased shrink-0"
      >
        <div className="flex justify-between items-center gap-14">
          <label htmlFor="status" className="font-karla font-bold">
            Status:
          </label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md px-2 py-1"
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
          <label htmlFor="progress" className="font-karla font-bold">
            Progress:
          </label>
          <input
            type="number"
            name="progress"
            id="progress"
            value={progress}
            max={max}
            onChange={(e) => setProgress(e.target.value)}
            className="rounded-md px-2 py-1"
            min="0"
          />
        </div>
        <button
          type="submit"
          className="bg-[#3a3a3a] text-white rounded-md mt-2 py-1 px-4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ListEditor;
