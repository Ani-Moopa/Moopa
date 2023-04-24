import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Content({ ids, providers }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.eucrypt.my.id/meta/anilist-manga/info/${ids}?provider=${providers}`
      );
      const data = res.data;
      setData(data);
      setError(null); // Reset error state if data is successfully fetched
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, [providers, fetchData]);
  useEffect(() => {
    // console.log("Data changed:", data);
  }, [data]);

  if (error) {
    // Handle 404 Not Found error
    return <div>Chapters Not Available</div>;
  }
  //   console.log(isLoading);
  return (
    <>
      <div className="flex h-[540px] flex-col gap-5 overflow-y-scroll">
        {isLoading ? (
          <p>Loading...</p>
        ) : data.chapters?.length > 0 ? (
          data.chapters?.map((chapter, index) => {
            return (
              <div key={index}>
                <Link
                  href={`/manga/chapter/[chapter]`}
                  as={`/manga/chapter/read?id=${chapter.id}&provider=${providers}`}
                >
                  Chapters {index + 1}
                </Link>
              </div>
            );
          })
        ) : (
          <p>No Chapters Available</p>
        )}
      </div>
    </>
  );
}
