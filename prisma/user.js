// import { prisma } from "../lib/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (name, setting) => {
  const checkUser = await prisma.userProfile.findUnique({
    where: {
      name: name,
    },
  });
  if (!checkUser) {
    const user = await prisma.userProfile.create({
      data: {
        name: name,
        setting,
      },
    });

    return user;
  } else {
    return null;
  }
};

export const updateUser = async (name, anime) => {
  const checkAnime = await prisma.watchListItem.findUnique({
    where: {
      title: anime.title,
      userProfileId: name,
    },
  });
  if (checkAnime) {
    const checkEpisode = await prisma.watchListEpisode.findUnique({
      where: {
        url: anime.id,
      },
    });
    if (checkEpisode) {
      return null;
    } else {
      const user = await prisma.watchListItem.update({
        where: {
          title: anime.title,
          userProfileId: name,
        },
      });
    }
  } else {
    const user = await prisma.userProfile.update({
      where: { name: name },
      data: {
        watchList: {
          create: {
            title: anime.title,
            episodes: {
              create: {
                url: anime.id,
              },
            },
          },
        },
      },
      include: {
        watchList: true,
      },
    });

    return user;
  }
};

export const getUser = async (name) => {
  if (!name) {
    const user = await prisma.userProfile.findMany({
      include: {
        WatchListEpisode: true,
      },
    });
    return user;
  } else {
    const user = await prisma.userProfile.findFirst({
      where: {
        name: name,
      },
      include: {
        WatchListEpisode: {
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });
    return user;
  }
};

export const deleteUser = async (name) => {
  const user = await prisma.userProfile.delete({
    where: {
      name: name,
    },
  });
  return user;
};

export const createList = async (name, id, title) => {
  const checkEpisode = await prisma.watchListEpisode.findFirst({
    where: {
      userProfileId: name,
      watchId: id,
    },
  });
  if (checkEpisode) {
    return null;
  } else {
    const episode = await prisma.userProfile.update({
      where: { name: name },
      data: {
        WatchListEpisode: {
          create: [
            {
              watchId: id,
            },
          ],
        },
      },
      include: {
        WatchListEpisode: true,
      },
    });
    return episode;
  }
};

export const getEpisode = async (name, id) => {
  console.log({ name, id });
  const episode = await prisma.watchListEpisode.findMany({
    // where: {
    //   AND: [{ userProfileId: name }, { watchId: id }],
    // },
    where: {
      AND: [
        {
          userProfileId: name,
        },
        {
          watchId: {
            equals: id,
          },
        },
      ],
    },
  });
  return episode;
};

export const updateUserEpisode = async ({
  name,
  id,
  watchId,
  title,
  image,
  number,
  duration,
  timeWatched,
  aniTitle,
  provider,
}) => {
  const user = await prisma.watchListEpisode.updateMany({
    where: {
      userProfileId: name,
      watchId: watchId,
    },
    data: {
      title: title,
      aniTitle: aniTitle,
      image: image,
      aniId: id,
      provider: provider,
      duration: duration,
      episode: number,
      timeWatched: timeWatched,
      createdDate: new Date(),
    },
  });

  // const user = name;

  return user;
};

export const updateTimeWatched = async (id, timeWatched) => {
  const user = await prisma.watchListEpisode.update({
    where: {
      id: id,
      // userProfileId: name,
    },
    data: {
      timeWatched: timeWatched,
    },
  });
  return user;
};
