import { useState } from "react";

const useAlert = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const showAlert = (message, type = "success") => {
    setMessage(message);
    setType(type);
    setTimeout(() => {
      setMessage("");
      setType("");
      window.location.reload();
    }, 5000);
  };

  return { message, type, showAlert };
};

export default useAlert;
