-- DropForeignKey
ALTER TABLE "WatchListEpisode" DROP CONSTRAINT "WatchListEpisode_userProfileId_fkey";

-- AddForeignKey
ALTER TABLE "WatchListEpisode" ADD CONSTRAINT "WatchListEpisode_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("name") ON DELETE CASCADE ON UPDATE CASCADE;
