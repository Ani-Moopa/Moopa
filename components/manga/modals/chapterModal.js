import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

export default function ChapterModal({
  id,
  currentId,
  data,
  isOpen,
  setIsOpen,
}) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md max-h-[25rem] transform rounded-2xl bg-secondary px-3 py-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="font-medium leading-6 text-gray-200"
                  >
                    Select a Chapter
                  </Dialog.Title>
                  <div className="bg-[#161617] rounded-lg mt-3 flex flex-col overflow-y-scroll scrollbar-thin max-h-[15rem] text-sm">
                    {data &&
                      data?.chapters?.map((c) => (
                        <Link
                          key={c.id}
                          href={`/en/manga/read/${
                            data.providerId
                          }?id=${id}&chapterId=${encodeURIComponent(c.id)}`}
                          className="p-2 hover:bg-[#424245] rounded-sm"
                          onClick={closeModal}
                        >
                          <h1
                            className={`${c.id === currentId && "text-action"}`}
                          >
                            {c.title}
                          </h1>
                        </Link>
                      ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
