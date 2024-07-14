import { Fragment, useState } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";

const severityOptions = [
  { id: 1, name: "Low" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
  { id: 4, name: "Critical" },
];

interface BugReportFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const BugReportForm: React.FC<BugReportFormProps> = ({ isOpen, setIsOpen }) => {
  const [bugDescription, setBugDescription] = useState("");
  const [severity, setSeverity] = useState(severityOptions[0]);

  function closeModal() {
    setIsOpen(false);
    setBugDescription("");
    setSeverity(severityOptions[0]);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const bugReport = {
      desc: bugDescription,
      severity: severity.name,
      url: window.location.href,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/v2/admin/bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: bugReport,
        }),
      });

      const json = await res.json();
      toast.success(json.message);
      closeModal();
    } catch (err: any) {
      console.log(err);
      toast.error("Something went wrong: " + err.message);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[200]" onClose={closeModal}>
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
                      Report a Bug
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="bugDescription"
                            className={`block text-txt text-sm font-medium mb-2`}
                          >
                            Bug Description
                          </label>
                          <textarea
                            id="bugDescription"
                            name="bugDescription"
                            rows={4}
                            className={`w-full bg-image text-txt rounded-md border border-txt focus:ring-action focus:border-action transition duration-300 focus:outline-none py-2 px-3`}
                            placeholder="Describe the bug you encountered..."
                            value={bugDescription}
                            onChange={(e) => setBugDescription(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <Listbox value={severity} onChange={setSeverity}>
                          <div className="relative mt-1">
                            <label
                              htmlFor="severity"
                              className={`block text-txt text-sm font-medium mb-2`}
                            >
                              Severity
                            </label>
                            <Listbox.Button
                              type="button"
                              className="relative w-full cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all rounded-lg bg-image py-2 pl-3 pr-10 text-left shadow-md sm:text-base duration-300"
                            >
                              <span className="block truncate text-white font-semibold">
                                {severity.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-image py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {severityOptions.map((person, personIdx) => (
                                  <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-secondary/50 text-white"
                                          : "text-gray-400"
                                      }`
                                    }
                                    value={person}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium text-white"
                                              : "font-normal"
                                          }`}
                                        >
                                          {person.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-action">
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      <div className="mt-4">
                        <button
                          type="submit"
                          className={`w-full bg-action text-white py-2 px-4 rounded-md font-semibold hover:bg-action/80 focus:ring focus:ring-action focus:outline-none transition duration-300`}
                        >
                          Submit Bug Report
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
    </>
  );
};

export default BugReportForm;
