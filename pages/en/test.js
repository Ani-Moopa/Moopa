import VideoPlayer from "../../components/videoPlayer";

export default function Test() {
  return (
    <div className="flex-center w-screen h-screen">
      <div className="h-full aspect-video bg-black">
        <VideoPlayer />
      </div>
    </div>
  );
}
