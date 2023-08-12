import dotenv from "dotenv";
import { useEffect, useRef, useState } from "react";
import { LeftBar } from "../../../../components/manga/leftBar";
import { useRouter } from "next/router";
import RightBar from "../../../../components/manga/rightBar";
import FirstPanel from "../../../../components/manga/panels/firstPanel";
import SecondPanel from "../../../../components/manga/panels/secondPanel";
import ThirdPanel from "../../../../components/manga/panels/thirdPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]";
import BottomBar from "../../../../components/manga/mobile/bottomBar";
import TopBar from "../../../../components/manga/mobile/topBar";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import nookies from "nookies";
import ShortCutModal from "../../../../components/manga/modals/shortcutModal";
import ChapterModal from "../../../../components/manga/modals/chapterModal";
import getAnifyPage from "../../../../lib/anify/page";

export default function Read({ data, currentId, sessions }) {
  const [info, setInfo] = useState();
  const [chapter, setChapter] = useState([]);
  const [layout, setLayout] = useState(1);

  const [visible, setVisible] = useState(true);
  const [mobileVisible, setMobileVisible] = useState(true);
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [isChapOpen, setIsChapOpen] = useState(false);

  const [seekPage, setSeekPage] = useState(0);

  const [paddingX, setPaddingX] = useState(208);
  const [scaleImg, setScaleImg] = useState(1);

  const [nextChapterId, setNextChapterId] = useState(null);
  const [prevChapterId, setPrevChapterId] = useState(null);

  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const hasRun = useRef(false);

  const router = useRouter();

  // console.log(cookies);

  useEffect(() => {
    hasRun.current = false;
  }, [currentId]);

  useEffect(() => {
    const get = JSON.parse(localStorage.getItem("manga"));
    const chapters = get.manga;
    const currentChapter = chapters.chapters?.find((x) => x.id === currentId);

    setCurrentChapter(currentChapter);
    setInfo(get.data);
    setChapter(chapters);

    if (Array.isArray(chapters?.chapters)) {
      const currentIndex = chapters.chapters.findIndex(
        (chapter) => chapter.id === currentId
      );
      if (currentIndex !== -1) {
        const nextChapter = chapters.chapters[currentIndex - 1];
        const prevChapter = chapters.chapters[currentIndex + 1];
        setNextChapterId(nextChapter ? nextChapter.id : null);
        setPrevChapterId(prevChapter ? prevChapter.id : null);
      }
    }
  }, [currentId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight" && event.ctrlKey && nextChapterId) {
        router.push(
          `/en/manga/read/${chapter.providerId}?id=${
            info.id
          }&chapterId=${encodeURIComponent(nextChapterId)}`
        );
      } else if (event.key === "ArrowLeft" && event.ctrlKey && prevChapterId) {
        router.push(
          `/en/manga/read/${chapter.providerId}?id=${
            info.id
          }&chapterId=${encodeURIComponent(prevChapterId)}`
        );
      }
      if (event.code === "Slash" && event.ctrlKey) {
        setIsKeyOpen(!isKeyOpen);
      }
      if (event.key === "f" || event.key === "F") {
        setVisible(!visible);
      }
      if (event.code === "ArrowUp" && event.shiftKey) {
        setPaddingX(paddingX - 50);
      } else if (event.code === "ArrowDown" && event.shiftKey) {
        setPaddingX(paddingX + 50);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextChapterId, prevChapterId, visible, isKeyOpen, paddingX]);

  return (
    <>
      <Head>
        <title>
          {info
            ? `Manga - ${
                info.title.romaji || info.title.english || info.title.native
              }`
            : "Getting Info..."}
        </title>
        <meta id="CoverImage" data-manga-cover={info?.coverImage} />
      </Head>
      <div className="w-screen flex justify-evenly relative">
        <ToastContainer pauseOnFocusLoss={false} />
        <ShortCutModal isOpen={isKeyOpen} setIsOpen={setIsKeyOpen} />
        <ChapterModal
          id={info?.id}
          currentId={currentId}
          data={chapter}
          isOpen={isChapOpen}
          setIsOpen={setIsChapOpen}
        />

        {mobileVisible && (
          <>
            <TopBar info={info} />
            <BottomBar
              id={info?.id}
              prevChapter={prevChapterId}
              nextChapter={nextChapterId}
              currentPage={currentPage}
              chapter={chapter}
              page={data}
              setSeekPage={setSeekPage}
              setIsOpen={setIsChapOpen}
            />
          </>
        )}
        {visible && (
          <LeftBar
            data={chapter}
            page={data}
            info={info}
            currentId={currentId}
            setSeekPage={setSeekPage}
          />
        )}
        {layout === 1 && (
          <FirstPanel
            aniId={info?.id}
            data={data}
            hasRun={hasRun}
            currentId={currentId}
            seekPage={seekPage}
            setSeekPage={setSeekPage}
            visible={visible}
            setVisible={setVisible}
            chapter={chapter}
            nextChapter={nextChapterId}
            prevChapter={prevChapterId}
            paddingX={paddingX}
            session={sessions}
            mobileVisible={mobileVisible}
            setMobileVisible={setMobileVisible}
            setCurrentPage={setCurrentPage}
          />
        )}
        {layout === 2 && (
          <SecondPanel
            aniId={info?.id}
            data={data}
            hasRun={hasRun}
            currentChapter={currentChapter}
            currentId={currentId}
            seekPage={seekPage}
            setSeekPage={setSeekPage}
            visible={visible}
            setVisible={setVisible}
            session={sessions}
          />
        )}
        {layout === 3 && (
          <ThirdPanel
            aniId={info?.id}
            data={data}
            hasRun={hasRun}
            currentId={currentId}
            currentChapter={currentChapter}
            seekPage={seekPage}
            setSeekPage={setSeekPage}
            visible={visible}
            setVisible={setVisible}
            session={sessions}
            scaleImg={scaleImg}
            setMobileVisible={setMobileVisible}
            mobileVisible={mobileVisible}
          />
        )}
        {visible && (
          <RightBar
            id={info?.id}
            hasRun={hasRun}
            session={sessions}
            data={chapter}
            currentId={currentId}
            currentChapter={currentChapter}
            layout={layout}
            setLayout={setLayout}
            paddingX={paddingX}
            setPaddingX={setPaddingX}
            setIsKeyOpen={setIsKeyOpen}
            scaleImg={scaleImg}
            setScaleImg={setScaleImg}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  dotenv.config();

  const cookies = nookies.get(context);

  const key = process.env.API_KEY;

  const query = context.query;
  const providerId = query.params[0];
  const chapterId = query.chapterId;
  const mediaId = query.id;

  if (!cookies.manga || cookies.manga !== mediaId) {
    return {
      redirect: {
        destination: `/en/manga/${mediaId}`,
      },
    };
  }

  const session = await getServerSession(context.req, context.res, authOptions);

  const data = await getAnifyPage(mediaId, providerId, chapterId, key);

  if (data.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data,
      currentId: chapterId,
      sessions: session,
    },
  };
}
