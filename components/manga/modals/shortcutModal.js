import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowSmallDownIcon,
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
  ArrowSmallUpIcon,
} from "@heroicons/react/24/solid";
import { Fragment } from "react";

export default function ShortCutModal({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex gap-2 items-center text-xl font-semibold leading-6 text-gray-100"
                  >
                    Keyboard Shortcuts{" "}
                    <div className="flex gap-2 text-white text-xs">
                      <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                        CTRL
                      </div>
                      <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                        /
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="mt-3 w-full bg-gray-500 h-[1px]" />
                  <div className="mt-2 flex flex-col flex-wrap gap-10">
                    <div className="space-y-1">
                      <label className="text-gray-100 font-bold">
                        VERTICAL
                      </label>
                      <p className="text-sm text-gray-400">
                        these shorcuts only work when focused on vertical mode.
                      </p>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <label className="text-gray-400 text-sm font-karla font-extrabold">
                            SCROLL
                          </label>
                          <div className="flex gap-2">
                            <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                              <ArrowSmallUpIcon className="w-5 h-5" />
                            </div>
                            <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                              <ArrowSmallDownIcon className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-gray-400 text-sm font-karla font-extrabold">
                            SCALE IMAGE
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#424245] text-white text-sm font-bold px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <span>SHIFT</span>
                              </div>
                              <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <ArrowSmallUpIcon className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="font-bold text-gray-400 text-sm">
                              |
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-[#424245] text-white text-sm font-bold px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <span>SHIFT</span>
                              </div>
                              <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <ArrowSmallDownIcon className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right to Left */}
                    <div className="space-y-1">
                      <label className="text-gray-100 font-bold">
                        RIGHT TO LEFT
                      </label>
                      {/* <p className="text-sm text-gray-400 w-[18rem]">
                        these shorcuts only work when focused on Right to Left
                        mode.
                      </p> */}
                      <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-karla font-extrabold uppercase">
                          Navigate Through Panels
                        </label>
                        <div className="flex gap-2">
                          <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                            <ArrowSmallLeftIcon className="w-5 h-5" />
                          </div>
                          <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                            <ArrowSmallRightIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* works anywhere */}
                    <div className="space-y-3">
                      <label className="text-gray-100 font-bold">
                        WORKS ANYWHERE
                      </label>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-gray-400 text-sm font-karla font-extrabold uppercase">
                            Navigate Through Chapters
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#424245] text-white text-sm font-bold px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <span>CTRL</span>
                              </div>
                              <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <ArrowSmallLeftIcon className="w-5 h-5" />
                              </div>
                            </div>
                            <div className="font-bold text-gray-400 text-sm">
                              |
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-[#424245] text-white text-sm font-bold px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <span>CTRL</span>
                              </div>
                              <div className="bg-[#424245] text-white px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                                <ArrowSmallRightIcon className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-gray-400 text-sm font-karla font-extrabold uppercase">
                            Show/Hide SideBar
                          </label>
                          <div className="flex">
                            <div className="bg-[#424245] text-white text-sm font-bold px-2 py-1 shadow-md shadow-[#141415] rounded-md">
                              F
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
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
