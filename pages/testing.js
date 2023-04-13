import { getUser } from "./api/getUser";

export default function Testing({ user }) {
  async function handleUpdate() {
    const res = await fetch("/api/update-user", {
      method: "POST",
      body: JSON.stringify({
        name: "Factiven",
        newData: {
          settings: {
            tracking: false,
          },
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.status);
  }

  console.log(user.settings);
  return <button onClick={() => handleUpdate()}>Click for update</button>;
}

export async function getServerSideProps(context) {
  const user = await getUser("Factiven");
  console.log(user);
  return {
    props: {
      user: user,
    },
  };
}
