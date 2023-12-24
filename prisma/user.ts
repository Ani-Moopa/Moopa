import { Prisma, UserProfile, WatchListEpisode } from "@prisma/client";

import { prisma } from "../lib/prisma";

interface UpdateUserEpisodeParams {
  name: string;
  id: string;
  watchId: string;
  title: string;
  image: string;
  number: number;
  duration: number;
  timeWatched: number;
  aniTitle: string;
  provider: string;
  nextId: string;
  nextNumber: number;
  dub: boolean;
}

export const createUser = async (name: string): Promise<UserProfile | null> => {
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

export const updateUser = async (
  name: string,
  setting: any
): Promise<{ name: string; setting: any } | null> => {
  try {
    await prisma.userProfile.updateMany({
      where: {
        name: name,
      },
      data: {
        setting,
      },
    });
    return { name: name, setting: setting };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating user");
  }
};

export const getUser = async (
  name: string,
  list = true
): Promise<any | null> => {
  try {
    if (!name) {
      const user = await prisma.userProfile.findMany({
        include: {
          WatchListEpisode: list,
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

export const deleteUser = async (name: string): Promise<UserProfile | null> => {
  try {
    const user = await prisma.userProfile.delete({
      where: {
        name: name,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
};

export const createList = async (
  name: string,
  id: string,
  title: string
): Promise<UserProfile | null> => {
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

export const getEpisode = async (
  name: string,
  id: string
): Promise<WatchListEpisode[] | null> => {
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
  nextId,
  nextNumber,
  dub,
}: UpdateUserEpisodeParams) => {
  try {
    await prisma.watchListEpisode.updateMany({
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
        nextId: nextId,
        nextNumber: nextNumber,
        dub: dub,
        createdDate: new Date(),
      },
    });

    // return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating user episode");
  }
};

export const deleteEpisode = async (
  name: string,
  id: string
): Promise<{ success?: boolean; message?: string } | null> => {
  try {
    const user = await prisma.watchListEpisode.deleteMany({
      where: {
        watchId: id,
        userProfileId: name,
      },
    });
    if (user) {
      return { success: true };
    } else {
      return { message: "Episode not found" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting episode");
  }
};

export const deleteList = async (
  name: string,
  id: string
): Promise<{ success?: boolean; message?: string } | null> => {
  try {
    const user = await prisma.watchListEpisode.deleteMany({
      where: {
        aniId: id,
        userProfileId: name,
      },
    });
    if (user) {
      return { success: true };
    } else {
      return { message: "Episode not found" };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting list");
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
