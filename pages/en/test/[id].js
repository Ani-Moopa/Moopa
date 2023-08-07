import io from "socket.io-client";
import { useEffect, useState } from "react";
import VideoPlayerTest from "../../../components/test/videoPlayer";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const socket = io.connect("https://socket.moopa.live");

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { id } = context.params;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomId: id,
      sessions: session,
    },
  };
}

export default function Test({ roomId, sessions }) {
  const [message, setMessage] = useState("");

  const [messageRecieved, setMessageReceived] = useState([]);
  const [watchData, setWatchData] = useState({
    isPlay: false,
    room: roomId,
    time: null,
  });
  const [isPlay, setIsPlay] = useState(false);

  const joinRoom = (props) => {
    // setRoom(props);
    if (roomId !== "") {
      socket.emit("join room", roomId);
    }
  };

  const sendMessage = () => {
    socket.emit(
      "send_message",
      JSON.stringify({
        content: message,
        room: roomId,
        user: sessions?.user?.name,
      })
    );
  };

  useEffect(() => {
    if (roomId) {
      socket.emit("join room", roomId);
    }
  }, [roomId]);

  // console.log(messageRecieved);
  // console.log({ roomId });
  // const [log, setLog] = useState();

  useEffect(() => {
    const handleReceivedMessage = (data) => {
      const parsedData = JSON.parse(data);
      setMessageReceived((prev) => [
        ...prev,
        { message: parsedData.content, user: parsedData.user },
      ]);
    };

    socket.on("received_message", handleReceivedMessage);

    // Other socket listeners...

    return () => {
      socket.off("received_message", handleReceivedMessage);
      // Clean up other socket listeners if needed
    };
  }, [socket]);

  useEffect(() => {
    socket.on("play_video", (data) => {
      setWatchData(JSON.parse(data));
      setIsPlay(true);
    });

    socket.on("pause_video", (data) => {
      setWatchData(JSON.parse(data));
      setIsPlay(false);
    });

    socket.on("user_joined", (data) => {
      //   alert("User joined room: " + data);
    });
  }, [socket]);

  return (
    <div className="flex lg:flex-row flex-col w-screen h-screen">
      <div className="h-auto w-auto aspect-video bg-black">
        <VideoPlayerTest
          socket={socket}
          isPlay={isPlay}
          watchdata={watchData}
          room={roomId}
        />
      </div>
      <div className="lg:w-[30%] h-full flex flex-col">
        <input
          placeholder="Type message..."
          onChange={(e) => setMessage(e.target.value)}
          className="text-black"
        />
        <button onClick={sendMessage} className="bg-slate-800">
          Send Message
        </button>
        <div className="flex flex-col gap-2 h-full">
          {messageRecieved.map((a) => (
            <p key={a.message + 1}>
              {a?.user ? a.user : "guest"}: {a.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
