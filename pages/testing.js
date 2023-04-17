import { signIn, signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function Testing({ sesi, data, progress, statusWatch }) {
  const { data: session, status } = useSession();
  // console.log(progress);
  async function handleUpdate() {
    // const data = ;
    const res = await fetch("/api/update-user", {
      method: "POST",
      body: JSON.stringify({
        name: session?.user.name,
        newData: {
          recentWatch: {
            id: parseInt(9280220),
            title: {
              romaji: "something title here",
            },
            description:
              "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
            coverImage: {
              extraLarge: "this should be an image url",
            },
            episode: {
              id: "first-id-yeah",
              time: 12344,
            },
          },
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await res.json(); // parse the response body as JSON
    // console.log(data.dat.id);
    console.log(res.status);
  }

  console.log(statusWatch);
  return (
    <div>
      <button onClick={() => handleUpdate()}>Click for update</button>
      {!session && (
        <button onClick={() => signIn("AniListProvider")}>LOGIN</button>
      )}
      {session && <button onClick={() => signOut()}>LOGOUT</button>}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const res = await fetch(`${baseUrl}/api/get-media`, {
    method: "POST",
    body: JSON.stringify({
      username: session?.user.name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const prog = await res.json();

  const gat = prog.lists.map((item) => item.entries);
  const git = gat.map((item) => item.find((item) => item.media.id === 130003));
  const gut = git.find((item) => item?.media.id === 130003);

  let progress = null;
  let statusWatch = "CURRENT";

  if (gut?.status === "COMPLETED") {
    statusWatch = "REPEATING";
  }

  if (gut) {
    progress = gut?.progress;
  }

  return {
    props: {
      sesi: session,
      data: gut || null,
      progress: progress,
      statusWatch: statusWatch,
    },
  };
}
