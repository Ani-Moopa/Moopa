import { ReactNode, createContext, useContext, useState } from "react";

interface PageState {
  theaterMode: boolean;
  aspectRatio: string;
}

interface PlayerState {
  currentTime: number;
  isPlaying: boolean;
  autoPlay: boolean;
  autoNext: boolean;
}

interface RatingModalState {
  isOpen: boolean;
  isFullscreen: boolean;
}

interface WatchPageContextProps {
  pageState: PageState;
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  userData: object;
  setUserData: React.Dispatch<React.SetStateAction<object>>;
  dataMedia: object;
  setDataMedia: React.Dispatch<React.SetStateAction<object>>;
  ratingModalState: RatingModalState;
  setRatingModalState: React.Dispatch<React.SetStateAction<RatingModalState>>;
  track: object;
  setTrack: React.Dispatch<React.SetStateAction<object>>;
}

interface WatchPageProviderProps {
  children: ReactNode;
}

export const WatchPageContext = createContext<WatchPageContextProps>(
  {} as WatchPageContextProps
);

export const WatchPageProvider = ({ children }: WatchPageProviderProps) => {
  const [pageState, setPageState] = useState({
    theaterMode: false,
    aspectRatio: "16/9"
  });
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    isPlaying: false,
    autoPlay: false,
    autoNext: false
  });

  const [userData, setUserData] = useState({});
  const [dataMedia, setDataMedia] = useState({});
  const [ratingModalState, setRatingModalState] = useState({
    isOpen: false,
    isFullscreen: false
  });

  const [track, setTrack] = useState({});

  return (
    <WatchPageContext.Provider
      value={{
        pageState,
        setPageState,
        playerState,
        setPlayerState,
        userData,
        setUserData,
        dataMedia,
        setDataMedia,
        ratingModalState,
        setRatingModalState,
        track,
        setTrack
      }}
    >
      {children}
    </WatchPageContext.Provider>
  );
};

export function useWatchProvider() {
  return useContext(WatchPageContext);
}
