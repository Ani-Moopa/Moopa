// @ts-nocheck

import type { ReactElement } from "react";

// import EpiDataDummy from "@/components/test/episodeDummy.json";

import {
  Menu,
  Tooltip,
  useCaptionOptions,
  type MenuPlacement,
  type TooltipPlacement,
  useVideoQualityOptions,
  useMediaState,
  usePlaybackRateOptions
} from "@vidstack/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  SettingsMenuIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SettingsIcon,
  // EpisodesIcon,
  SettingsSwitchIcon,
  // PlaybackSpeedCircleIcon,
  OdometerIcon
} from "@vidstack/react/icons";

import { buttonClass, tooltipClass } from "./buttons";
import { useWatchProvider } from "@/lib/context/watchPageProvider";
import React from "react";

export interface SettingsProps {
  placement: MenuPlacement;
  offset?: number;
  tooltipPlacement: TooltipPlacement;
}

export const menuClass =
  "fixed bottom-0 animate-out fade-out slide-out-to-bottom-2 data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[200px] lg:max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden";

export const submenuClass =
  "hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block";

export const contentMenuClass =
  "flex cust-scroll h-[var(--menu-height)] max-h-[180px] lg:max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-secondary p-1 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden";

export function Settings({
  placement,
  offset,
  tooltipPlacement
}: SettingsProps) {
  const { track } = useWatchProvider();
  const isFullscreen = useMediaState("fullscreen");
  const isSubtitleAvailable = track?.epiData?.subtitles?.length > 0;

  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <SettingsIcon className="h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90" />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content
          offset={offset}
          className={tooltipClass}
          placement={tooltipPlacement}
        >
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      {!isFullscreen ? (
        <Menu.Portal>
          <Menu.Content className={contentMenuClass} placement={placement}>
            <AutoPlay />
            <AutoNext />
            <SpeedSubmenu />
            {isSubtitleAvailable && <CaptionSubmenu />}
            <QualitySubmenu />
          </Menu.Content>
        </Menu.Portal>
      ) : (
        <Menu.Content className={contentMenuClass} placement={placement}>
          <AutoPlay />
          <AutoNext />
          <SpeedSubmenu />
          {isSubtitleAvailable && <CaptionSubmenu />}
          <QualitySubmenu />
        </Menu.Content>
      )}
    </Menu.Root>
  );
}

// export function Episodes({ placement }: { placement: MenuPlacement }) {
//   return (
//     <Menu.Root className="parent">
//       <Tooltip.Root>
//         <Tooltip.Trigger asChild>
//           <Menu.Button className={buttonClass}>
//             <EpisodesIcon className="w-10 h-10" />
//           </Menu.Button>
//         </Tooltip.Trigger>
//       </Tooltip.Root>
//       <Menu.Content
//         className={`bg-secondary/95 border border-white/10 max-h-[240px] overflow-y-scroll cust-scroll rounded overflow-hidden z-30 -translate-y-5 -translate-x-2`}
//         placement={placement}
//       >
//         <EpisodeSubmenu />
//       </Menu.Content>
//     </Menu.Root>
//   );
// }

function SpeedSubmenu() {
  const options = usePlaybackRateOptions(),
    hint =
      options.selectedValue === "1" ? "Normal" : options.selectedValue + "x";
  return (
    <Menu.Root>
      <SubmenuButton
        label="Playback Rate"
        hint={hint}
        icon={OdometerIcon}
        disabled={options.disabled}
      >
        Speed ({hint})
      </SubmenuButton>
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? "Off";
  return (
    <Menu.Root>
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

// function EpisodeSubmenu() {
//   return (
//     // <div className="h-full w-[320px]">
//     <div className="flex flex-col h-full w-[360px] font-karla">
//       {/* {EpiDataDummy.map((epi, index) => ( */}
//         <div
//           key={index}
//           className={`flex gap-1 hover:bg-secondary px-3 py-2 ${
//             index === 0
//               ? "pt-4"
//               // : index === EpiDataDummy.length - 1
//               ? "pb-4"
//               : ""
//           }`}
//         >
//           <Image
//             src={epi.img}
//             alt="thumbnail"
//             width={100}
//             height={100}
//             className="object-cover w-[120px] h-[64px] rounded-md"
//           />
//           <div className="flex flex-col pl-2">
//             <h1 className="font-semibold">{epi.title}</h1>
//             <p className="line-clamp-2 text-sm font-light">
//               {epi?.description}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//     // </div>
//   );
// }

function AutoPlay() {
  const [options, setOptions] = React.useState([
    {
      label: "On",
      value: "on",
      selected: false
    },
    {
      label: "Off",
      value: "off",
      selected: true
    }
  ]);

  const { autoplay, setAutoPlay } = useWatchProvider();

  // console.log({ autoplay });

  return (
    <Menu.Root>
      <SubmenuButton
        label="Autoplay Video"
        hint={
          autoplay
            ? options.find((option) => option.value === autoplay)?.value
            : options.find((option) => option.selected)?.value
        }
        icon={SettingsSwitchIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={
            autoplay
              ? options.find((option) => option.value === autoplay)?.value
              : options.find((option) => option.selected)?.value
          }
          onChange={(value) => {
            setOptions((options) =>
              options.map((option) =>
                option.value === value
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              )
            );
            setAutoPlay(value);
            localStorage.setItem("autoplay", value);
          }}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function AutoNext() {
  const [options, setOptions] = React.useState([
    {
      label: "On",
      value: "on",
      selected: false
    },
    {
      label: "Off",
      value: "off",
      selected: true
    }
  ]);

  const { autoNext, setAutoNext } = useWatchProvider();

  return (
    <Menu.Root>
      <SubmenuButton
        label="Autoplay Next"
        hint={
          autoNext
            ? options.find((option) => option.value === autoNext)?.value
            : options.find((option) => option.selected)?.value
        }
        icon={SettingsSwitchIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={
            autoNext
              ? options.find((option) => option.value === autoNext)?.value
              : options.find((option) => option.selected)?.value
          }
          onChange={(value) => {
            setOptions((options) =>
              options.map((option) =>
                option.value === value
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              )
            );
            setAutoNext(value);
            localStorage.setItem("autoNext", value);
          }}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function QualitySubmenu() {
  const options = useVideoQualityOptions({ sort: "descending" }),
    autoQuality = useMediaState("autoQuality"),
    currentQualityText = options.selectedQuality?.height + "p" ?? "",
    hint = !autoQuality ? currentQualityText : `Auto (${currentQualityText})`;

  // console.log({ options });

  return (
    <Menu.Root>
      <SubmenuButton
        label="Quality"
        hint={hint}
        disabled={options.disabled}
        icon={SettingsMenuIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

export interface RadioProps extends Menu.RadioProps {}

function Radio({ children, ...props }: RadioProps) {
  return (
    <Menu.Radio
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      {...props}
    >
      <RadioButtonIcon className="h-4 w-4 text-white group-data-[checked]:hidden" />
      <RadioButtonSelectedIcon
        className="text-media-brand hidden h-4 w-4 group-data-[checked]:block"
        type="radio-button-selected"
      />
      <span className="ml-2">{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: ReactElement;
}

function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled
}: SubmenuButtonProps) {
  return (
    <Menu.Button
      className="ring-media-focus data-[open]:bg-secondary parent left-0 z-10 flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none ring-inset data-[open]:sticky data-[open]:-top-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      disabled={disabled}
    >
      <ChevronLeftIcon className="parent-data-[open]:block -ml-0.5 mr-1.5 hidden h-[18px] w-[18px]" />
      <div className="contents parent-data-[open]:hidden">
        <Icon className="w-5 h-5" />
      </div>
      <span className="ml-1.5 parent-data-[open]:ml-0">{label}</span>
      <span className="ml-auto text-sm text-white/50">{hint}</span>
      <ChevronRightIcon className="parent-data-[open]:hidden ml-0.5 h-[18px] w-[18px] text-sm text-white/50" />
    </Menu.Button>
  );
}
