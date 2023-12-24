import React, { createContext, useContext, useState } from "react";

export const WatchPageContext = createContext();

export const WatchPageProvider = ({ children }) => {
  const [theaterMode, setTheaterMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16/9");
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    isPlaying: false,
  });
  const [autoplay, setAutoPlay] = useState(null);
  const [autoNext, setAutoNext] = useState(null);
  const [marked, setMarked] = useState(0);

  const [userData, setUserData] = useState(null);
  const [dataMedia, setDataMedia] = useState(null);

  const [track, setTrack] = useState(null);

  return (
    <WatchPageContext.Provider
      value={{
        theaterMode,
        setTheaterMode,
        aspectRatio,
        setAspectRatio,
        playerState,
        setPlayerState,
        userData,
        setUserData,
        autoplay,
        setAutoPlay,
        marked,
        setMarked,
        track,
        setTrack,
        dataMedia,
        setDataMedia,
        autoNext,
        setAutoNext,
      }}
    >
      {children}
    </WatchPageContext.Provider>
  );
};

export function useWatchProvider() {
  return useContext(WatchPageContext);
}
