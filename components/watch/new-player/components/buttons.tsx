import { useWatchProvider } from "@/lib/context/watchPageProvider";
import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  useMediaState,
  type TooltipPlacement,
  useMediaRemote,
  useMediaStore,
  SeekButton,
  ToggleButton
} from "@vidstack/react";
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  ReplayIcon,
  TheatreModeExitIcon,
  NextIcon,
  TheatreModeIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  PreviousIcon,
  SeekForward10Icon,
  SeekBackward10Icon
} from "@vidstack/react/icons";
import { useRouter } from "next/router";
import { Navigation } from "../player";

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement;
  offset?: number | undefined;
  navigation?: Navigation;
  host?: boolean;
}

export const buttonClass =
  "group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset sm:hover:bg-white/20 data-[focus]:ring-4 z-30";

export const tooltipClass =
  "animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden";

export function Play({ tooltipPlacement, offset }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    tooltipText = isPaused ? "Play" : "Pause",
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          <Icon className="w-8 h-8" />
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {tooltipText}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SeekForwardButton({
  tooltipPlacement,
  offset
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton seconds={10} className={buttonClass}>
          <SeekForward10Icon className="w-8 h-8" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        Forward 10 Seconds
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SeekBackwardButton({
  tooltipPlacement,
  offset
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton seconds={-10} className={buttonClass}>
          <SeekBackward10Icon className="w-8 h-8" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        Backward 10 Seconds
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function NextEpisode({
  tooltipPlacement,
  offset,
  navigation
}: MediaButtonProps) {
  const router = useRouter();
  const { dataMedia, track } = useWatchProvider();
  function handleNext() {
    router.push(
      `/en/anime/watch/${dataMedia.id}/${track?.provider}?id=${
        navigation?.next?.id
      }&num=${navigation?.next?.number}${
        track?.isDub ? `&dub=${track?.isDub}` : ""
      }`
    );
  }

  return (
    navigation?.next && (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            onClick={handleNext}
            onTouchEnd={handleNext}
            className={buttonClass}
          >
            <NextIcon className="w-7 h-7" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          offset={offset}
          className={tooltipClass}
          placement={tooltipPlacement}
        >
          Next Episode
        </Tooltip.Content>
      </Tooltip.Root>
    )
  );
}

export function PreviousEpisode({
  tooltipPlacement,
  offset,
  navigation
}: MediaButtonProps) {
  const router = useRouter();
  const { dataMedia, track } = useWatchProvider();
  function handlePrev() {
    router.push(
      `/en/anime/watch/${dataMedia.id}/${track?.provider}?id=${
        navigation?.prev?.id
      }&num=${navigation?.prev?.number}${
        track?.isDub ? `&dub=${track?.isDub}` : ""
      }`
    );
  }

  return (
    navigation?.prev && (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div
            onClick={handlePrev}
            onTouchEnd={handlePrev}
            className={buttonClass}
          >
            <PreviousIcon className="w-7 h-7" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          offset={offset}
          className={tooltipClass}
          placement={tooltipPlacement}
        >
          Previous Episode
        </Tooltip.Content>
      </Tooltip.Root>
    )
  );
}

export function MobilePlayButton({ tooltipPlacement, host }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <PlayButton
      className={`${
        host ? "" : "pointer-events-none"
      } group ring-media-focus relative inline-flex h-16 w-16 media-paused:cursor-pointer cursor-default items-center justify-center rounded-full outline-none`}
    >
      <Icon className="w-10 h-10" />
    </PlayButton>
  );
}

export function Mute({ tooltipPlacement, offset }: MediaButtonProps) {
  const volume = useMediaState("volume"),
    isMuted = useMediaState("muted");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={buttonClass}>
          {isMuted || volume == 0 ? (
            <MuteIcon className="w-8 h-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="w-8 h-8" />
          ) : (
            <VolumeHighIcon className="w-8 h-8" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {isMuted ? "Unmute" : "Mute"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Caption({ tooltipPlacement, offset }: MediaButtonProps) {
  const track = useMediaState("textTrack"),
    isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={buttonClass}>
          {isOn ? (
            <ClosedCaptionsOnIcon className="w-8 h-8" />
          ) : (
            <ClosedCaptionsIcon className="w-8 h-8" />
          )}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {isOn ? "Closed-Captions On" : "Closed-Captions Off"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function TheaterButton({ tooltipPlacement, offset }: MediaButtonProps) {
  const playerState = useMediaState("currentTime"),
    isPlaying = useMediaState("playing");

  const { setPlayerState, setTheaterMode, theaterMode } = useWatchProvider();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setPlayerState((prev: any) => ({
              ...prev,
              currentTime: playerState,
              isPlaying: isPlaying
            }));
            setTheaterMode((prev: any) => !prev);
          }}
        >
          {!theaterMode ? (
            <TheatreModeIcon className="w-8 h-8" />
          ) : (
            <TheatreModeExitIcon className="w-8 h-8" />
          )}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        Theatre Mode
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement, offset }: MediaButtonProps) {
  const isActive = useMediaState("pictureInPicture");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={buttonClass}>
          {isActive ? (
            <PictureInPictureExitIcon className="w-8 h-8" />
          ) : (
            <PictureInPictureIcon className="w-8 h-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {isActive ? "Exit PIP" : "Enter PIP"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PlayNextButton({
  tooltipPlacement,
  navigation
}: MediaButtonProps) {
  // const remote = useMediaRemote();
  const router = useRouter();
  const { dataMedia, track } = useWatchProvider();
  return (
    <button
      title="next-button"
      type="button"
      onClick={() => {
        if (navigation?.next) {
          router.push(
            `/en/anime/watch/${dataMedia.id}/${track.provider}?id=${
              navigation?.next?.id
            }&num=${navigation?.next?.number}${
              track?.isDub ? `&dub=${track?.isDub}` : ""
            }`
          );
        }
      }}
      className="next-button text-sm hidden"
    >
      Next Episode
    </button>
  );
}

export function SkipOpButton({ tooltipPlacement, offset }: MediaButtonProps) {
  const remote = useMediaRemote();
  const { track } = useWatchProvider();
  const op = track?.skip?.find((item: any) => item.text === "Opening");

  return (
    <button
      type="button"
      onClick={() => {
        remote.seek(op?.endTime);
      }}
      className="op-button hidden text-sm hover:bg-white/80 bg-white px-4 py-2 text-primary font-karla font-semibold rounded-md"
    >
      Skip Opening
    </button>
  );
}

export function SkipEdButton({ tooltipPlacement, offset }: MediaButtonProps) {
  const remote = useMediaRemote();
  const { duration } = useMediaStore();
  const { track } = useWatchProvider();
  const ed = track?.skip?.find((item: any) => item.text === "Ending");

  const endTime =
    Math.round(duration) === ed?.endTime ? ed?.endTime - 1 : ed?.endTime;

  // console.log(endTime);

  return (
    <button
      title="ed-button"
      type="button"
      onClick={() => remote.seek(endTime)}
      className="ed-button hidden text-sm cursor-pointer hover:bg-white/80 bg-white px-4 py-2 text-primary font-karla font-semibold rounded-md"
    >
      Skip Ending
    </button>
  );
}

export function Fullscreen({ tooltipPlacement, offset }: MediaButtonProps) {
  const isActive = useMediaState("fullscreen");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={buttonClass}>
          {isActive ? (
            <FullscreenExitIcon className="w-8 h-8" />
          ) : (
            <FullscreenIcon className="w-8 h-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {isActive ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
