import { prisma } from "@/lib/prisma";

export const getRemovedMedia = async (): Promise<any | null> => {
  try {
    const removedMedia = await prisma.removedMedia.findMany();
    return removedMedia;
  } catch (error) {
    return null;
  }
};
