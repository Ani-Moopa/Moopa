import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (name, setting, animeWatched) => {
  const user = await prisma.user.create({
    data: {
      name,
      setting,
      animeWatched,
    },
  });

  return user;
};

export const updateUser = async (name, setting, animeWatched) => {
  const user = await prisma.user.update({
    where: {
      name: name,
    },
    data: {
      setting,
      animeWatched,
    },
  });

  return user;
};

export const getUser = async (name) => {
  const user = await prisma.user.findUnique({
    where: {
      name: name,
    },
  });
  return user;
};
