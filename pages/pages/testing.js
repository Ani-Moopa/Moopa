// import { getUser } from "./api/get-user";
import { signIn, getSession, signOut, useSession } from "next-auth/react";

export default function Testing({ user }) {
  const { data: session, status } = useSession();
  async function handleUpdate() {
    const lastPlayed = {
      id: "apahisya",
      time: 812989929,
    };
    const res = await fetch("/api/watched-episode", {
      method: "POST",
      body: JSON.stringify({
        username: session?.user.name,
        id: 150672,
        newData: lastPlayed,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // const data = await res.json(); // parse the response body as JSON
    // console.log(data.dat.id);
    console.log(res.status);
  }

  console.log(session);
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
  const session = await getSession(context);
  // const user = await getUser("Factiven");
  // console.log(user);
  return {
    props: {
      session: session?.user || null,
    },
  };
}
