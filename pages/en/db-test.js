import { PrismaClient } from "@prisma/client";
import { useState } from "react";
const prisma = new PrismaClient();

export async function getServerSideProps() {
  const user = await prisma.user.findMany({
    where: {
      setting: {
        path: ["language"],
        equals: "id",
      },
    },
  });
  return {
    props: {
      user,
    },
  };
}

const settings = {
  isAdult: false,
  theme: "dark",
  language: "en",
};

export default function DbTest({ user }) {
  const [add, setUser] = useState();

  console.log(user);

  async function handleCreate(e) {
    e.preventDefault();
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ name: add, setting: settings }),
    });
    const json = await res.json();
    console.log(json);
  }
  //   console.log(add);
  return (
    <div>
      <form onSubmit={handleCreate}>
        <input type="text" onChange={(e) => setUser(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <h1>hello gaes</h1>
    </div>
  );
}

const user = [
  {
    id: String,
    name: String,
    setting: {
      isAdult: Boolean,
      theme: String,
      language: String,
    },
    watchList: [
      {
        id: String,
        title: String,
        episodes: [
          {
            id: String,
            title: String,
            episode: Number,
            url: String,
            timeWatched: Number,
            duration: Number,
          },
        ],
      },
    ],
  },
];
