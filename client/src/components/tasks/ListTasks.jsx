import { Fragment, useState, useEffect } from "react";
import { Menu, Transition, Popover } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AddTask from "./AddTask";
import axios from "axios";

const sortOptions = [
  { name: "A-Z Sıralama", key: "taskName", order: "asc" },
  { name: "Z-A Sıralama", key: "taskName", order: "desc" },
  { name: "En Yeniler", key: "taskStartDate", order: "desc" },
];

const filters = [
  {
    id: "Görev Durumu",
    name: "Görev Durumu",
    options: [
      { value: "Gecikmiş", label: "Gecikmiş", checked: false },
      { value: "Tamamlanmış", label: "Tamamlanmış", checked: false },
      { value: "Devam Ediyor", label: "Devam Ediyor", checked: false },
    ],
  },
];

const statuses = {
  Tamamlanmış: "text-green-700 bg-green-50 ring-green-600/20",
  "Devam Ediyor": "text-yellow-600 bg-yellow-50 ring-yellow-500/10",
  Gecikmiş: "text-red-700 bg-red-50 ring-red-600/10",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
function calculateDurationInDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return Math.round(daysDifference);
}
export default function ListTasks({ onTaskClick }) {
  const [tasks, setTasks] = useState([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState(null);

  // Fonksiyonlar üstte tanımlandı, altta kullanıldı.
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        params: {
          sortKey: selectedSortOption?.key,
          sortOrder: selectedSortOption?.order,
          taskStatus: selectedTaskStatus?.value,
        },
      });

      const filteredTasks = response.data.filter(
        (task) =>
          !selectedTaskStatus ||
          !selectedTaskStatus.value ||
          task.taskStatus === selectedTaskStatus.value
      );

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
    updateTasksDeadline();
  };
  const updateTasksDeadline = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks-passed-deadline"
      );
      alert("Görev süreleri güncellendi");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
    updateTasksDeadline();
  }, [selectedSortOption, selectedTaskStatus]);

  const handleDeleteTask = (taskID, projectId) => {
    const userId = localStorage.getItem("user");
    if (window.confirm("Bu Görevleri Silmek İstediğinize Emin Misiniz?")) {
      axios
        .delete(`http://localhost:5000/api/delete-task/${taskID}`, {
          headers: {
            userid: userId,
            projectid: projectId
          },
        })
        .then((response) => {
          console.log("Success:", response.data);
          fetchData();
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    }
  };

  const handleSortOptionChange = (option) => {
    setSelectedSortOption(option);
  };

  const handleTaskStatusChange = (status) => {
    setSelectedTaskStatus(status);
  };

  return (
    <div>
      <section className="mb-8" aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-gray-200 bg-white pb-4">
          <div className=" flex  items-center justify-between px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sıralama
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            onClick={() => handleSortOptionChange(option)}
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setAddTaskOpen(true)}
            >
              Filtreler
            </button>

            <div className="hidden sm:block">
              <div className="flow-root">
                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                  {filters.map((section) => (
                    <Popover
                      key={section.name}
                      className="relative inline-block px-4 text-left"
                    >
                      <Popover.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.name}</span>
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  onChange={() =>
                                    handleTaskStatusChange(
                                      selectedTaskStatus?.value === option.value
                                        ? null
                                        : option
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Active filters */}
        <div className="bg-gray-100">
          <div className="  px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-gray-500">
              Filtreler
              <span className="sr-only">, active</span>
            </h3>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:ml-4 sm:mt-0">
              <div className="-m-1 flex flex-wrap items-center">
                {selectedSortOption && (
                  <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                    <span>{selectedSortOption.name}</span>
                    <button
                      type="button"
                      className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                      onClick={() => handleSortOptionChange(null)}
                    >
                      <span className="sr-only">{`Remove sort filter for ${selectedSortOption.name}`}</span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedTaskStatus && (
                  <span className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                    <span>{selectedTaskStatus.label}</span>
                    <button
                      type="button"
                      className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                      onClick={() => handleTaskStatusChange(null)}
                    >
                      <span className="sr-only">
                        {`Remove filter for ${selectedTaskStatus.label}`}
                      </span>
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {tasks.map((task) => (
            <li
              key={task.taskID}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                <div className="text-sm font-medium leading-6 text-gray-900">
                  <span className="font-thin text-gray-500 font-serif">
                    Proje | {task.projName}
                  </span>
                  <br />
                    Görev | {task.taskName}
                </div>
                <Menu as="div" className="relative ml-auto">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisHorizontalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() => onTaskClick(task.taskID)}
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            Görüntüle
                            <span className="sr-only">, {task.taskName}</span>
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={() =>
                              handleDeleteTask(task.taskID, task.projectID)
                            }
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            Sil
                            <span className="sr-only">{`, ${task.taskName}`}</span>
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Başlama Tarihi</dt>
                  <dd className="text-gray-700">
                    {task.taskStartDate ? (
                      <time dateTime={task.taskStartDate}>
                        {formatDate(task.taskStartDate)}
                      </time>
                    ) : (
                      <span>End date not available</span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Bitiş Tarihi</dt>
                  <dd className="text-gray-700">
                    {task.taskEndDate ? (
                      <time dateTime={task.taskEndDate}>
                        {formatDate(task.taskEndDate)}
                      </time>
                    ) : (
                      <span>End date not available</span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Görevlendirilen Kişi</dt>

                  <dd className="text-gray-700">
                    {task.empName + " " + task.empSurname}
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Adam Gün Değeri</dt>

                  <dd className="text-gray-700">
                    <span className="text-gray-500 text-sm">
                      {calculateDurationInDays(
                        task.taskStartDate,
                        task.taskEndDate
                      )}{" "}
                      gün
                    </span>
                  </dd>
                </div>
                {task.taskDelayedDays > 0 ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Gecikmiş Gün Sayısı</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="text-gray-700">
                        {task.taskDelayedDays}
                      </div>
                    </dd>
                  </div>
                ) : (
                  ""
                )}
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Durumu</dt>
                  <dd className="flex items-start gap-x-2">
                    <div
                      className={classNames(
                        statuses[task.taskStatus],
                        "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                      )}
                    >
                      {task.taskStatus}
                    </div>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 sm:absolute sm:bottom-0 sm:right-0 sm:mr-4 sm:mb-4">
        <button
          type="button"
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setAddTaskOpen(true)}
        >
          Görev ekle
        </button>
      </div>

      {addTaskOpen && <AddTask setAddTaskOpen={setAddTaskOpen} />}
    </div>
  );
}
