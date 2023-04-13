import "vidstack/styles/base.css";

import { MediaOutlet, MediaPlayer } from "@vidstack/react";

export default function StackPlayer() {
  return (
    <MediaPlayer src="https://media-files.vidstack.io/hls/index.m3u8" controls>
      <MediaOutlet />
    </MediaPlayer>
  );
}
