import { Fragment, useEffect, useState } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";

const publishingOptions = [
  { title: "Tamamlanmış", current: true },
  { title: "Devam Ediyor", current: false },
  { title: "Gecikmiş", current: false },
];
const activity = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:24",
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 5,
    type: "viewed",
    person: { name: "Alex Curren" },
    date: "2d ago",
    dateTime: "2023-01-24T09:12",
  },
  {
    id: 6,
    type: "paid",
    person: { name: "Alex Curren" },
    date: "1d ago",
    dateTime: "2023-01-24T09:20",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function DetailProject({ OnProjectClick }) {
  const { projectID } = useParams();
  const [TaskList, setTaskList] = useState([
    {
      taskName: "",
      taskStatus: "",
      taskEndDate: "",
      empName: "",
      empSurname: "",
    },
  ]);
  const [ProjectInfo, setProjectInfo] = useState([
    {
      projName: "",
      projStartDate: "",
      projEndDate: "",
      empName: "",
      empSurname: "",
    },
  ]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${projectID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTaskList(data);
        console.log(TaskList); // State güncellendikten sonra logla
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Hata durumunda kullanıcıya bildirim gösterme veya başka bir işlem yapma
      });
    fetch(`http://localhost:5000/api/project/${projectID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data1) => {
        setProjectInfo(data1);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Hata durumunda kullanıcıya bildirim gösterme veya başka bir işlem yapma
      });
  }, []);
  const projStartDate = new Date(ProjectInfo[0].projStartDate);
  const projEndDate = new Date(ProjectInfo[0].projEndDate);

  const renderTaskStatus = (status) => {
    let color = "";
    if (status === "Tamamlanmış")
      color = "  text-green-700  bg-green-50 ring-green-600/10";
    else if (status === "Devam Ediyor")
      color = "text-yellow-600 bg-yellow-50 ring-yellow-500/10";
    else if (status === "Gecikmiş")
      color = "text-red-700 bg-red-50 ring-red-600/10";
    return (
      <span
        className={`flex items-center justify-center px-2 py-1 font-medium text-xs ring-1 ring-inset rounded-md ${color}`}
      >
        {status}
      </span>
    );
  };

  const [selected, setSelected] = useState(publishingOptions[0]);

  const [editingMode, setEditingMode] = useState(false);

  const [formData, setFormData] = useState({
    projName: ProjectInfo[0].projName,
    projStartDate: ProjectInfo[0].projStartDate,
    projEndDate: ProjectInfo[0].projEndDate,
    projStatus: ProjectInfo[0].projStatus,
  });

  const handleEditClick = async (e) => {
    if (editingMode) {
      // Kaydet butonuna tıklandığında yapılacak işlemler
      try {
        const response = await fetch(
          `http://localhost:5000/api/project/${projectID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              projStartDate: new Date(
                formData.projStartDate + "T00:00:00Z"
              ).toISOString(),
              projEndDate: new Date(
                formData.projEndDate + "T00:00:00Z"
              ).toISOString(),
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setEditingMode(false);
      window.location.reload();
    } else {
      setFormData({
        ...ProjectInfo[0],
      });
      // Düzenle butonuna tıklandığında yapılacak işlemler
      setEditingMode(true);
    }
  };

  return (
    <div>
      <header className="relative isolate pt-16">
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
            <div
              className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
              style={{
                clipPath:
                  "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
              }}
            />
          </div>
          {console.log("Gelen:" + ProjectInfo)}

          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
            <div className="flex items-center gap-x-6">
              <img
                src="https://tailwindui.com/img/logos/48x48/tuple.svg"
                alt=""
                className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
              />
              <h1>
                <div className="text-sm leading-6 text-gray-500">Proje Adı</div>
                {editingMode ? (
                  <input
                    type="text"
                    value={formData.projName}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        projName: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    {ProjectInfo[0].projName}
                  </div>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              <span
                className="text-sm font-semibold leading-6 text-gray-900 sm:block cursor-pointer"
                onClick={handleEditClick}
              >
                {editingMode ? "Kaydet" : "Düzenle"}
              </span>

              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">
                      Proje durumunu değiştir
                    </Listbox.Label>
                    <div className="relative">
                      <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
                        <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm">
                          <CheckIcon
                            className="-ml-0.5 h-5 w-5"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-semibold">
                            {selected.title}
                          </p>
                        </div>
                        <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                          <span className="sr-only">
                            Proje durumunu değiştir
                          </span>
                          <ChevronDownIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </Listbox.Button>
                      </div>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {publishingOptions.map((option) => (
                            <Listbox.Option
                              key={option.title}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900",
                                  "cursor-default select-none p-4 text-sm"
                                )
                              }
                              value={option}
                            >
                              {({ selected, active }) => (
                                <div className="flex flex-col">
                                  <div className="flex justify-between">
                                    <p
                                      className={
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }
                                    >
                                      {option.title}
                                    </p>
                                    {selected ? (
                                      <span
                                        className={
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        }
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                  <p
                                    className={classNames(
                                      active
                                        ? "text-indigo-200"
                                        : "text-gray-500",
                                      "mt-2"
                                    )}
                                  >
                                    {option.description}
                                  </p>
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>

              <Menu as="div" className="relative sm:hidden">
                <Menu.Button className="-m-3 block p-3">
                  <span className="sr-only">More</span>
                  <EllipsisVerticalIcon
                    className="h-5 w-5 text-gray-500"
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
                        <button
                          type="button"
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block w-full px-3 py-1 text-left text-sm leading-6 text-gray-900"
                          )}
                        >
                          Copy URL
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-w-3xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {/* Invoice */}
          <div className="w-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-3 lg:row-span-2 lg:row-end-3 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Bilgiler
            </h2>
            {editingMode ? (
              <div className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <label htmlFor="startDate" className="inline text-gray-500">
                    Başlama Tarihi:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.projStartDate}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        projStartDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <label htmlFor="endDate" className="inline text-gray-500">
                    Bitiş Tarihi:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.projEndDate}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        projEndDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="inline text-gray-500">
                    Oluşturan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${ProjectInfo[0].empName}  ${ProjectInfo[0].empSurname}`}{" "}
                    </span>
                  </dt>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4">
                  <label htmlFor="status" className="inline text-gray-500">
                    Proje Durumu:
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.projStatus}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        projStatus: e.target.value,
                      }))
                    }
                  >
                    <option value="Tamamlanmış">Tamamlanmış</option>
                    <option value="Devam Ediyor">Devam Ediyor</option>
                    <option value="Gecikmiş">Gecikmiş</option>
                  </select>
                </div>
              </div>
            ) : (
              // Düzenleme modu kapalıysa
              <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">Başlama Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {ProjectInfo[0].projStartDate ? (
                      <time dateTime={ProjectInfo[0].projStartDate}>
                        {formatDate(ProjectInfo[0].projStartDate)}
                      </time>
                    ) : (
                      <span>Başlama tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Bitiş Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {ProjectInfo[0].projEndDate ? (
                      <time dateTime={ProjectInfo[0].projEndDate}>
                        {formatDate(ProjectInfo[0].projEndDate)}
                      </time>
                    ) : (
                      <span>Başlama tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="inline text-gray-500">
                    Oluşturan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${ProjectInfo[0].empName}  ${ProjectInfo[0].empSurname}`}{" "}
                    </span>
                  </dt>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="inline text-gray-500">
                    <span className="inline-flex">
                      Proje Durumu: &nbsp;
                      {renderTaskStatus(ProjectInfo[0].projStatus)}
                    </span>
                  </dt>
                </div>
              </dl>
            )}
            <div className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
              <div className="sm:flex sm:items-center sm:justify-between sm:flex-wrap">
                <div className="flex-grow">
                  <div className="text-base font-semibold leading-6 text-gray-900">
                    Görevler
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    Görev adı, görevlendirilen çalışan, görev durumu burada
                    bulunmaktadır.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Görev Ekle
                  </button>
                </div>
              </div>

              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Görev Adı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Görevlendirilen Kişi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Görev Durumu
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bitiş Tarihi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {TaskList.map((task) => (
                          <tr key={task.taskID}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {task.taskName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.empName} {task.empSurname}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {renderTaskStatus(task.taskStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.taskEndDate ? (
                                <time dateTime={task.taskEndDate}>
                                  {formatDate(task.taskEndDate)}
                                </time>
                              ) : (
                                <span>Başlama tarihi mevcut değil.</span>
                              )}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <a className="text-indigo-600 hover:text-indigo-900">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                                <span className="sr-only"></span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-start-4">
            {/* Activity feed */}
            <h2 className="text-sm font-semibold leading-6 text-gray-900">
              Activity
            </h2>
            <ul role="list" className="mt-6 space-y-6">
              {activity.map((activityItem, activityItemIdx) => (
                <li key={activityItem.id} className="relative flex gap-x-4">
                  <div
                    className={classNames(
                      activityItemIdx === activity.length - 1
                        ? "h-6"
                        : "-bottom-6",
                      "absolute left-0 top-0 flex w-6 justify-center"
                    )}
                  >
                    <div className="w-px bg-gray-200" />
                  </div>
                  {activityItem.type === "commented" ? (
                    <>
                      <img
                        src={activityItem.person.imageUrl}
                        alt=""
                        className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                      />
                      <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                        <div className="flex justify-between gap-x-4">
                          <div className="py-0.5 text-xs leading-5 text-gray-500">
                            <span className="font-medium text-gray-900">
                              {activityItem.person.name}
                            </span>{" "}
                            commented
                          </div>
                          <time
                            dateTime={activityItem.dateTime}
                            className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                          >
                            {activityItem.date}
                          </time>
                        </div>
                        <p className="text-sm leading-6 text-gray-500">
                          {activityItem.comment}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                        {activityItem.type === "paid" ? (
                          <CheckCircleIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        )}
                      </div>
                      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">
                          {activityItem.person.name}
                        </span>{" "}
                        {activityItem.type} the invoice.
                      </p>
                      <time
                        dateTime={activityItem.dateTime}
                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                      >
                        {activityItem.date}
                      </time>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProject;
