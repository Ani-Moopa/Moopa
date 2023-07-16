import { parseCookies } from "nookies";

export default function Home() {
  return <></>;
}

export async function getServerSideProps(context) {
  const cookie = parseCookies(context);

  if (cookie.lang === "en") {
    return {
      redirect: {
        destination: "/en",
        permanent: false,
      },
    };
  } else if (cookie.lang === "id") {
    return {
      redirect: {
        destination: "/id",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/en",
        permanent: false,
      },
    };
  }
}
