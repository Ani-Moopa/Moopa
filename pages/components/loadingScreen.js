import React from "react";
import Typewriter from "typewriter-effect";

const LoadingScreen = () => {
  return (
    <main className="z-50 flex h-screen items-center bg-white pb-56 dark:bg-[#121212] md:justify-center md:pb-48">
      <div className="flex w-screen flex-col items-center md:justify-center">
        <img
          src="https://media.discordapp.net/attachments/997882702751596674/1066581397533368401/Qiqi_1.png?width=701&height=701"
          alt="qiqi"
          className="translate-y-16 scale-[75%] md:scale-[85%]"
        />
        <div className="font-outfit text-2xl font-medium md:text-4xl">
          <i>
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Please wait...")
                  .pauseFor(1500)
                  .deleteAll()
                  .start();
              }}
            />
          </i>
        </div>
      </div>
    </main>
  );
};

export default LoadingScreen;
