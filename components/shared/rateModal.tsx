import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import * as React from "react";

export type RateModalProps = {
  onClose?: () => any;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  show: boolean;
};

export const RateModal = ({
  show,
  onSubmit,
  onClose = () => {},
}: RateModalProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transition-all">
                <div className="bg-secondary p-6 rounded-lg shadow-xl">
                  <h2 className={`text-action text-2xl font-semibold mb-4`}>
                    What did you think of this anime?
                  </h2>
                  <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="review"
                          className={`block text-txt text-sm font-medium mb-2`}
                        >
                          Thoughts
                        </label>
                        <textarea
                          id="review"
                          name="review"
                          rows={4}
                          className={`w-full bg-image text-txt rounded-md border border-txt focus:ring-action focus:border-action transition duration-300 focus:outline-none py-2 px-3`}
                          placeholder="Describe your thoughts on the anime"
                          //   required
                        ></textarea>
                      </div>

                      <div className="relative mt-1">
                        <label
                          htmlFor="rating"
                          className={`block text-txt text-sm font-medium mb-2`}
                        >
                          Rating
                        </label>
                        <input
                          id="rating"
                          name="rating"
                          type="number"
                          step="0.1"
                          inputMode="decimal"
                          max="10"
                          className="relative w-full cursor-pointer outline focus:outline-action outline-[0.5px] hover:shadow-xl transition-all rounded-lg bg-image py-2 pl-3 pr-10 text-left shadow-md sm:text-base duration-300"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className={`w-full bg-action text-white py-2 px-4 rounded-md font-semibold hover:bg-action/80 focus:ring focus:ring-action focus:outline-none transition duration-300`}
                      >
                        Submit your review
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
