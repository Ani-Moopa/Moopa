import { useEffect } from "react";

interface SkipData {
  startTime: number;
  endTime: number;
  text: string;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const generateVTTContent = (
  chapters: SkipData[],
  videoDuration: number
): string => {
  let vtt = "WEBVTT\n\n";
  let lastEndTime = 0;

  chapters.forEach((item) => {
    const start = formatTime(item.startTime);
    const end = formatTime(item.endTime);
    vtt += `${start} --> ${end}\n${item.text}\n\n`;
    lastEndTime = Math.max(lastEndTime, item.endTime);
  });

  if (lastEndTime < videoDuration) {
    const start = formatTime(lastEndTime);
    const end = formatTime(videoDuration);
    vtt += `${start} --> ${end}\n\n`;
  }

  return vtt;
};

const useChapterTracks = (
  track: { skip?: SkipData[] },
  duration: number,
  setChapters: (url: string) => void
) => {
  useEffect(() => {
    if (track?.skip && track.skip.length > 0) {
      const videoDuration = Math.round(duration);
      const vttContent = generateVTTContent(track.skip, videoDuration);
      const vttBlob = new Blob([vttContent], { type: "text/vtt" });
      const vttUrl = URL.createObjectURL(vttBlob);

      setChapters(vttUrl);

      return () => {
        URL.revokeObjectURL(vttUrl);
        setChapters("");
      };
    }
  }, [track?.skip, duration, setChapters]);
};

export default useChapterTracks;
