import { useEffect, useState } from "react";

export default function SecretPage({ cheatCode, onCheatCodeEntered }) {
  const [typedCode, setTypedCode] = useState("");
  const [timer, setTimer] = useState(null);

  const handleKeyPress = (e) => {
    const newTypedCode = typedCode + e.key;

    if (newTypedCode === cheatCode) {
      onCheatCodeEntered();
      setTypedCode("");
    } else {
      setTypedCode(newTypedCode);

      // Reset the timer if the user stops typing for 2 seconds
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        setTypedCode("");
      }, 2000);
      setTimer(newTimer);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedCode]);

  return;
}
