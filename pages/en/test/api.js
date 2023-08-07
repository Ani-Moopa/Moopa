import { useEffect, useState } from "react";
// import getEpisode from "../../../lib/consumet/episode";

export default function TestAPI() {
  const [api, setApi] = useState();
  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await getEpisode(52352);
  //     setApi(data);
  //   }
  //   fetchData();
  // }, []);

  console.log(api);

  return (
    <div>
      <p className="next-button progress">Skip this shit</p>
    </div>
  );
}
