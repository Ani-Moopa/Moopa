import { useState, useCallback } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

export const useNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const show = useCallback(
    (message) => {
      setNotificationMessage(message);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    },
    [setNotificationMessage, setShowNotification]
  );

  const NotificationComponent = () => {
    return (
      <AnimatePresence>
        {showNotification && (
          <m.div
            key="teasa"
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="z-50 fixed bottom-10 w-screen flex justify-center text-center"
          >
            <div className="bg-green-600 text-white  px-2 py-2 font-bold rounded-[30px]">
              {notificationMessage}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    );
  };

  return { Notification: NotificationComponent, show };
};
