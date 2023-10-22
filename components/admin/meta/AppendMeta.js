import Loading from "@/components/shared/loading";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

// Define a function to convert the data
function convertData(episodes) {
  const convertedData = episodes.map((episode) => ({
    episode: episode.episode,
    title: episode?.title,
    description: episode?.description || null,
    img: episode?.img?.hd || episode?.img?.mobile || null, // Use hd if available, otherwise use mobile
  }));

  return convertedData;
}

export default function AppendMeta({ api }) {
  const [id, setId] = useState();
  const [resultData, setResultData] = useState(null);

  const [query, setQuery] = useState("");
  const [tmdbId, setTmdbId] = useState();
  const [hasilQuery, setHasilQuery] = useState([]);
  const [season, setSeason] = useState();

  const [override, setOverride] = useState();

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setResultData(null);
      const res = await fetch(`${api}/meta/tmdb/${query}`);
      const json = await res.json();
      const data = json.results.filter((i) => i.type === "TV Series");
      setHasilQuery(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api}/meta/tmdb/info/${tmdbId}?type=TV%20Series
`);
      const json = await res.json();
      const data = json.seasons;
      setHasilQuery(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStore = async () => {
    try {
      setLoading(true);
      if (!resultData && !id) {
        console.log("No data to store");
        setLoading(false);
        return;
      }
      const data = await fetch("/api/v2/admin/meta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          data: resultData,
        }),
      });
      if (data.status === 200) {
        const json = await data.json();
        toast.success(json.message);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOverride = async () => {
    setResultData(JSON.parse(override));
  };

  return (
    <>
      <div className="container mx-auto p-4 scrol">
        <h1 className="text-3xl font-semibold mb-4">Append Data Page</h1>
        <div>
          <div className="space-y-3 mb-4">
            <label>Search Anime:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md text-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleSearch}
            >
              Find Anime{" "}
            </button>
          </div>
          <div className="space-y-3 mb-4">
            <label>Get Episodes:</label>
            <input
              type="number"
              placeholder="TMDB ID"
              className="w-full px-3 py-2 border rounded-md text-black"
              value={tmdbId}
              onChange={(e) => setTmdbId(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleDetail}
            >
              Get Details
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <label>Override Result:</label>
            <textarea
              rows="5"
              className="w-full px-3 py-2 border rounded-md text-black"
              value={override}
              onChange={(e) => setOverride(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleOverride}
            >
              Override{" "}
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Anime ID:
            </label>
            <input
              type="number"
              placeholder="AniList ID"
              className="w-full px-3 py-2 border rounded-md text-black"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleStore}
            >
              Store Data {season && `Season ${season}`}
            </button>
          </div>

          {!loading && hasilQuery?.some((i) => i?.season) && (
            <div className="border rounded-md p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">
                Which season do you want to format?
              </h2>
              <div className="w-full flex gap-2">
                {hasilQuery?.map((season, index) => (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    key={index}
                    onClick={() => {
                      setLoading(true);
                      const data = hasilQuery[index].episodes;
                      const convertedData = convertData(data);
                      setSeason(index + 1);
                      setResultData(convertedData);
                      console.log(convertedData);
                      setLoading(false);
                    }}
                  >
                    <p>{season.season} </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && resultData && (
            <div className="border rounded-md p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Season {season}</h2>
              <pre>{JSON.stringify(resultData, null, 2)}</pre>
            </div>
          )}
          {!loading && hasilQuery && (
            <div className="border rounded-md p-4 mt-4">
              {/* <h2 className="text-lg font-semibold mb-2">
                Result Data,{" "}
                {hasilQuery.length > 0 && `${hasilQuery.length} Seasons`}:
              </h2> */}
              <div className="flex flex-wrap gap-10">
                {!hasilQuery.every((i) => i?.episodes) &&
                  hasilQuery?.map((i, index) => (
                    <div
                      key={i.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <p className="font-karla font-semibold">
                        {i.releaseDate}
                      </p>
                      <Image
                        src={i.image}
                        alt="query-image"
                        width={500}
                        height={500}
                        className="w-[160px] h-[210px] object-cover"
                      />
                      <button
                        className="bg-blue-500 text-white w-[160px] py-1 rounded-md hover:bg-blue-600 text-sm"
                        onClick={() => {
                          setTmdbId(i.id);
                        }}
                      >
                        <p className="line-clamp-1 px-1">{i.title}</p>
                      </button>
                    </div>
                  ))}
              </div>
              <pre>{JSON.stringify(hasilQuery, null, 2)}</pre>
            </div>
          )}

          {loading && <Loading />}
        </div>
        <div>
          {/* {resultData && (
            <div className="border rounded-md p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Result Data:</h2>
              <pre>{JSON.stringify(resultData, null, 2)}</pre>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
