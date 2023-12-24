import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";

const web = {
  version: "v4.3.1",
};

const logs = [
  {
    version: "v4.3.1",
    pre: true,
    notes: null,
    highlights: true,
    changes: [
      "Fix: Auto Next Episode forcing to play sub even if dub is selected",
      "Fix: Episode metadata not showing after switching to dub",
      "Fix: Profile picture weirdly cropped",
      "Fix: Weird padding on the navbar in profile page",
    ],
  },
  {
    version: "v4.3.0",
    pre: true,
    notes: null,
    highlights: false,
    changes: [
      "Added changelogs section",
      "Added recommendations based on user lists",
      "New Player!",
      "And other minor bug fixes!",
    ],
  },
];

export default function ChangeLogs() {
  let [isOpen, setIsOpen] = useState(false);
  let completeButtonRef = useRef(null);

  function closeModal() {
    localStorage.setItem("version", web.version);
    setIsOpen(false);
  }

  function getVersion() {
    let version = localStorage.getItem("version");
    if (version !== web.version) {
      setIsOpen(true);
    }
  }

  useEffect(() => {
    getVersion();
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModal}
          initialFocus={completeButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-100"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xl">Changelogs</p>
                      <div className="flex gap-2 items-center">
                        {/* Github Icon */}
                        <Link
                          href="/github"
                          className="w-5 h-5 hover:opacity-75"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#fff"
                            viewBox="0 0 20 20"
                          >
                            <g>
                              <g
                                fill="none"
                                fillRule="evenodd"
                                stroke="none"
                                strokeWidth="1"
                              >
                                <g
                                  fill="#fff"
                                  transform="translate(-140 -7559)"
                                >
                                  <g transform="translate(56 160)">
                                    <path d="M94 7399c5.523 0 10 4.59 10 10.253 0 4.529-2.862 8.371-6.833 9.728-.507.101-.687-.219-.687-.492 0-.338.012-1.442.012-2.814 0-.956-.32-1.58-.679-1.898 2.227-.254 4.567-1.121 4.567-5.059 0-1.12-.388-2.034-1.03-2.752.104-.259.447-1.302-.098-2.714 0 0-.838-.275-2.747 1.051a9.396 9.396 0 00-2.505-.345 9.375 9.375 0 00-2.503.345c-1.911-1.326-2.751-1.051-2.751-1.051-.543 1.412-.2 2.455-.097 2.714-.639.718-1.03 1.632-1.03 2.752 0 3.928 2.335 4.808 4.556 5.067-.286.256-.545.708-.635 1.371-.57.262-2.018.715-2.91-.852 0 0-.529-.985-1.533-1.057 0 0-.975-.013-.068.623 0 0 .655.315 1.11 1.5 0 0 .587 1.83 3.369 1.21.005.857.014 1.665.014 1.909 0 .271-.184.588-.683.493-3.974-1.355-6.839-5.199-6.839-9.729 0-5.663 4.478-10.253 10-10.253"></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </Link>
                        {/* Discord Icon */}
                        <Link
                          href="/discord"
                          className="w-6 h-6 hover:opacity-75"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid"
                            viewBox="0 -28.5 256 256"
                          >
                            <path
                              fill="#fff"
                              d="M216.856 16.597A208.502 208.502 0 00164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 00-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0079.735 175.3a136.413 136.413 0 01-21.846-10.632 108.636 108.636 0 005.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 005.355 4.237 136.07 136.07 0 01-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36zM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18z"
                            ></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">
                      Hi! Welcome to the new changelogs section. Here you can
                      see a lists of the latest changes and updates to the site.
                    </p>
                    <p className="inline-block text-sm italic my-2 text-gray-400">
                      *This update is still in it's pre-release state, please
                      expect to see some bugs. If you find any, please report
                      them.
                    </p>
                  </div>

                  {logs.map((x) => (
                    <ChangelogsVersions
                      notes={x.notes}
                      version={x.version}
                      pre={x.pre}
                      key={x.version}
                    >
                      {x.changes.map((i, index) => (
                        <p key={index}>- {i}</p>
                      ))}
                    </ChangelogsVersions>
                  ))}

                  {/* <div className="my-2 flex items-center justify-evenly">
                    <div className="w-full h-[1px] bg-gradient-to-r from-white/5 to-white/40" />
                    <p className="relative flex flex-1 whitespace-nowrap font-bold mx-2 font-inter">
                      v4.3.0
                      <span className="flex text-xs font-light font-roboto ml-1 italic">
                        pre
                      </span>
                    </p>
                    <div className="w-full h-[1px] bg-gradient-to-l from-white/5 to-white/40" />
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-gray-200">
                    <div>
                      <p className="inline-block italic mb-2 text-gray-400">
                        *This update is still in it's pre-release state, please
                        expect to see some bugs. If you find any, please report
                        them.
                      </p>

                      <p>- Added changelogs section</p>
                      <p>- Added recommendations based on user lists</p>
                      <p>- New Player!</p>
                      <p>- And other minor bug fixes!</p>
                    </div>
                  </div> */}

                  <div className="mt-2 text-gray-400 text-sm">
                    <p>
                      see more changelogs{" "}
                      <Link href="/changelogs" className="text-blue-500">
                        here
                      </Link>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1" />
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-action/10 px-4 py-2 text-sm font-medium text-action/90 hover:bg-action/20 focus:outline-none"
                      onClick={closeModal}
                      ref={completeButtonRef}
                    >
                      Got it, thanks!
                    </button>
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

type ChangelogsVersionsProps = {
  version?: string;
  pre: boolean;
  notes?: string | null;
  highlights?: boolean;
  children: React.ReactNode;
};

export function ChangelogsVersions({
  version,
  pre,
  notes,
  highlights,
  children,
}: ChangelogsVersionsProps) {
  return (
    <>
      <div className="my-2 flex items-center justify-evenly">
        <div className="w-full h-[1px] bg-gradient-to-r from-white/5 to-white/40" />
        <p className="relative flex flex-1 whitespace-nowrap font-bold mx-2 font-inter">
          {version}
          {pre && (
            <span className="flex text-xs font-light font-roboto ml-1 italic">
              pre
            </span>
          )}
        </p>
        <div className="w-full h-[1px] bg-gradient-to-l from-white/5 to-white/40" />
      </div>

      <div className="flex flex-col gap-2 text-sm py-2 text-gray-200">
        <div>
          {notes && (
            <p className="inline-block italic mb-2 text-gray-400">*{notes}</p>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
