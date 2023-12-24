import { UserData } from "@/components/watch/new-player/player";
import { useState } from "react";

function useWatchStorage() {
  // Get initial value from local storage or empty object
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage?.getItem("artplayer_settings");
    return storedSettings ? JSON.parse(storedSettings) : {};
  });

  const getSettings = (id: string): UserData | undefined => {
    return settings[id];
  };

  // Function to update settings
  const updateSettings = (id: string, data?: any) => {
    // Update state
    const updatedSettings = { ...settings, [id]: data };
    setSettings(updatedSettings);

    // Update local storage
    localStorage.setItem("artplayer_settings", JSON.stringify(updatedSettings));
  };

  return [getSettings, updateSettings];
}

export default useWatchStorage;
