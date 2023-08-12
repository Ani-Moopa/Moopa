import { Prisma } from "@prisma/client";
// const prisma = new PrismaClient();

import { prisma } from "../lib/prisma";

export const createUser = async (name) => {
  try {
    const checkUser = await prisma.userProfile.findUnique({
      where: {
        name: name,
      },
    });
    if (!checkUser) {
      const user = await prisma.userProfile.create({
        data: {
          name: name,
        },
      });

      return user;
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this name"
        );
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.log("An unknown Prisma error occurred:", error.message);
    }
    console.error(error);
    throw new Error("Error creating user");
  }
};

export const updateUser = async (name, anime) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error("Error updating user");
  }
};

export const getUser = async (name) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user");
  }
};

export const deleteUser = async (name) => {
  try {
    const user = await prisma.userProfile.delete({
      where: {
        name: name,
      },
    });
    console.log({ user });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
};

export const createList = async (name, id, title) => {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error("Error creating list");
  }
};

export const getEpisode = async (name, id) => {
  try {
    const episode = await prisma.watchListEpisode.findMany({
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
  } catch (error) {
    console.error(error);
    throw new Error("Error getting episode");
  }
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
  try {
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

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating user episode");
  }
};

export const deleteEpisode = async (name, id) => {
  try {
    const user = await prisma.watchListEpisode.deleteMany({
      where: {
        watchId: id,
        userProfileId: name,
      },
    });
    if (user) {
      return user;
    } else {
      return { message: "Episode not found" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting episode");
  }
};

// export const updateTimeWatched = async (id, timeWatched) => {
//   try {
//     const user = await prisma.watchListEpisode.update({
//       where: {
//         id: id,
//       },
//       data: {
//         timeWatched: timeWatched,
//       },
//     });
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error updating time watched");
//   }
// };
