import captionStyles from "./captions.module.css";
import styles from "./video-layout.module.css";

import {
  Captions,
  Controls,
  Gesture,
  Spinner,
  Time,
  useMediaState
} from "@vidstack/react";

import * as Buttons from "../buttons";
import * as Menus from "../menus";
import * as Sliders from "../sliders";
import { TimeGroup } from "../time-group";
import { Title } from "../title";
import { ChapterTitleComponent } from "../chapter-title";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import { Navigation } from "../../player";
import { useEffect, useState } from "react";
import RateModal from "@/components/shared/RateModal";

export interface VideoLayoutProps {
  thumbnails?: string;
  navigation?: Navigation;
  host?: boolean;
  session?: any;
}

function isMobileDevice() {
  if (typeof window !== "undefined") {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  }
  return false;
}

export function VideoLayout({
  thumbnails,
  navigation,
  host = true,
  session
}: VideoLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  const { track, setRatingModalState, ratingModalState } = useWatchProvider();
  const isFullscreen = useMediaState("fullscreen");

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    setRatingModalState((prev: any) => {
      return {
        ...prev,
        isFullscreen: isFullscreen
      };
    });
  }, [isFullscreen]);

  return (
    <>
      <Gestures host={host} />
      <Captions
        className={`${captionStyles.captions} media-preview:opacity-0 media-controls:bottom-[28px] sm:media-controls:bottom-[85px] media-captions:opacity-100 absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300`}
      />
      {ratingModalState.isFullscreen && (
        <RateModal
          toggle={ratingModalState.isOpen}
          setToggle={setRatingModalState}
          position="top"
          session={session}
        />
      )}

      {/* TOP CONTROLS */}
      <Controls.Root
        className={`${styles.controls} media-paused:bg-black/10 duration-200 media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/30 via-transparent to-black/30 opacity-0 transition-opacity`}
      >
        <Controls.Group className="flex justify-between items-center w-full px-2 pt-2">
          <Title navigation={navigation} />

          <div className="flex-1" />
          <div className="flex sm:hidden items-center">
            {!!track?.subtitles?.length && (
              <Buttons.Caption tooltipPlacement="top" />
            )}
            <Buttons.Mute offset={10} tooltipPlacement="bottom" />
            <Buttons.PIP offset={10} tooltipPlacement="bottom" />
            <Menus.Settings
              offset={10}
              placement="bottom end"
              tooltipPlacement="bottom end"
            />
          </div>
        </Controls.Group>
        <div className="flex-1" />

        <Controls.Group
          className={`hidden media-paused:opacity-100 media-paused:scale-100 backdrop-blur-sm scale-[160%] opacity-0 duration-200 ease-out sm:flex shadow bg-white/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        >
          <Buttons.MobilePlayButton tooltipPlacement="top center" host={host} />
        </Controls.Group>

        {/* MOBILE CENTER */}
        <Controls.Group
          className={`duration-200 ease-out flex sm:hidden gap-5 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20`}
        >
          <Buttons.SeekBackwardButton offset={10} tooltipPlacement="top" />
          <div className="backdrop-blur-sm shadow bg-white/10 rounded-full">
            <Buttons.MobilePlayButton
              tooltipPlacement="top center"
              host={host}
            />
          </div>
          <Buttons.SeekForwardButton offset={10} tooltipPlacement="top" />
        </Controls.Group>

        {/* LOADING */}
        <div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
          <Spinner.Root
            className="text-white opacity-0 transition-opacity duration-200 ease-linear media-buffering:animate-spin media-buffering:opacity-100"
            size={84}
          >
            <Spinner.Track className="opacity-25" width={8} />
            <Spinner.TrackFill className="opacity-75" width={8} />
          </Spinner.Root>
        </div>

        <Controls.Group className="flex px-4">
          <div className="flex-1" />
          {host && (
            <>
              <Buttons.SkipOpButton tooltipPlacement="top end" />
              <Buttons.SkipEdButton tooltipPlacement="top end" />
              <Buttons.PlayNextButton
                navigation={navigation}
                tooltipPlacement="top end"
              />
            </>
          )}
        </Controls.Group>

        {/* DESKTOP CONTROLS */}
        <Controls.Group className="hidden sm:flex w-full items-center px-2">
          <Sliders.Time thumbnails={thumbnails} host={host} />
        </Controls.Group>
        <Controls.Group className="hidden -mt-0.5 sm:flex w-full items-center px-2 pb-2">
          <Buttons.PreviousEpisode
            navigation={navigation}
            tooltipPlacement="top start"
          />
          <Buttons.Play tooltipPlacement="top" />
          <Buttons.NextEpisode navigation={navigation} tooltipPlacement="top" />
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <ChapterTitleComponent />
          <div className="flex-1" />
          {!!track?.subtitles?.length && (
            <Buttons.Caption tooltipPlacement="top" />
          )}
          <Buttons.SeekBackwardButton tooltipPlacement="top" />
          <Buttons.SeekForwardButton tooltipPlacement="top" />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          {!isMobile && !isFullscreen && (
            <Buttons.TheaterButton tooltipPlacement="top" />
          )}
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>

        {/* MOBILE CONTROLS */}
        <Controls.Group className="flex sm:hidden w-full items-center px-2 pb-1 z-40">
          <div className="flex items-center mr-1 z-40">
            <Buttons.PreviousEpisode
              navigation={navigation}
              offset={10}
              tooltipPlacement="top start"
            />
            <Buttons.NextEpisode
              offset={10}
              navigation={navigation}
              tooltipPlacement="top"
            />
          </div>
          <div className="text-xs">
            <Time className="time" type="current" />
          </div>
          <Sliders.Time thumbnails={thumbnails} host={host} />
          <div className="text-xs">
            <Time className="time" type="duration" />
          </div>
          <div className="flex ml-1">
            <Buttons.Fullscreen offset={10} tooltipPlacement="top end" />
          </div>
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures({ host }: { host?: boolean }) {
  const isMobile = isMobileDevice();
  return (
    <>
      {isMobile ? (
        <>
          {host && (
            <Gesture
              className="absolute inset-0 z-10"
              event="dblpointerup"
              action="toggle:paused"
            />
          )}
          <Gesture
            className="absolute inset-0"
            event="pointerup"
            action="toggle:controls"
          />
        </>
      ) : (
        <>
          {host && (
            <Gesture
              className="absolute inset-0"
              event="pointerup"
              action="toggle:paused"
            />
          )}
          <Gesture
            className="absolute inset-0 z-10"
            event="dblpointerup"
            action="toggle:fullscreen"
          />
        </>
      )}

      <Gesture
        className="absolute top-0 left-0 w-1/5 h-full z-20"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute top-0 right-0 w-1/5 h-full z-20"
        event="dblpointerup"
        action="seek:10"
      />
    </>
  );
}
