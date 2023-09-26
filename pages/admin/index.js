import AdminDashboard from "@/components/admin/dashboard";
import AdminLayout from "@/components/admin/layout";
import AppendMeta from "@/components/admin/meta/AppendMeta";
import {
  countKeysWithPrefix,
  countNumericKeys,
  getValuesWithPrefix,
} from "@/utils/getRedisWithPrefix";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import React, { useState } from "react";

export async function getServerSideProps(context) {
  const sessions = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!sessions) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const admin = sessions?.user?.name === process.env.ADMIN_USERNAME;
  const api = process.env.API_URI;

  if (!admin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const [anime, info, meta, report] = await Promise.all([
    countNumericKeys(),
    countKeysWithPrefix("anime:"),
    countKeysWithPrefix("meta:"),
    getValuesWithPrefix("report:"),
  ]);

  return {
    props: {
      session: sessions,
      animeCount: anime || 0,
      infoCount: info || 0,
      metaCount: meta || 0,
      report: report || [],
      api,
    },
  };
}

export default function Admin({
  animeCount,
  infoCount,
  metaCount,
  report,
  api,
}) {
  const [page, setPage] = useState(1);

  return (
    <AdminLayout page={page} setPage={setPage}>
      <div className="h-full">
        {page == 1 && (
          <AdminDashboard
            animeCount={animeCount}
            infoCount={infoCount}
            metaCount={metaCount}
            report={report}
          />
        )}
        {page == 2 && <AppendMeta api={api} />}
        {page == 3 && <p className="flex-center h-full">Coming Soon!</p>}
        {page == 4 && <p className="flex-center h-full">Coming Soon!</p>}
      </div>
    </AdminLayout>
  );
}
