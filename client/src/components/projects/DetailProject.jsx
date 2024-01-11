import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function DetailProject({ OnProjectClick }) {
  const { projectID } = useParams();
  const [TaskList, setTaskList] = useState([
    {
      taskID: "",
      taskName: "",
      taskStatus: "",
      taskEndDate: "",
      empName: "",
      empSurname: "",
    },
  ]);
  const [ProjectInfo, setProjectInfo] = useState({
    projName: "",
    projStartDate: "",
    projEndDate: "",
    empName: "",
    empSurname: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/projectDetail/${projectID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProjectInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Hata durumunda kullanıcıya bildirim gösterme veya başka bir işlem yapma
      });

    fetch(`http://localhost:5000/api/task-list-by-projID/${projectID}}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTaskList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Hata durumunda kullanıcıya bildirim gösterme veya başka bir işlem yapma
      });
  }, [DetailProject]);

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

  const [editingMode, setEditingMode] = useState(false);

  const [formData, setFormData] = useState({
    projName: "",
    projStatus: "",
  });
  const [taskEditingID, setTaskEditingID] = useState(null);

  const [taskFormData, setTaskFormData] = useState({
    taskName: "",
    taskStatus: "",
  });

  const handleEditClick = async (e) => {
    if (editingMode) {
      try {
        const userid = localStorage.getItem("user");
        console.log(userid);
        const response = await fetch(
          `http://localhost:5000/api/EditProject/${projectID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", userid: userid },
            body: JSON.stringify({ ...formData }),
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
        projName: ProjectInfo.projName,
        projStatus: ProjectInfo.projStatus,
      });
      // Düzenle butonuna tıklandığında yapılacak işlemler
      setEditingMode(true);
    }
  };
  const handleTaskEditClick = async (taskID) => {
    if (taskEditingID === taskID) {
      try {
        const userid = localStorage.getItem("user");
        console.log(taskID);
        const response = await fetch(
          `http://localhost:5000/api/EditTask/${taskID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              userid: userid,
              projectid: projectID,
            },
            body: JSON.stringify({ ...taskFormData }),
          }
        );
        if (response.status === 403) {
          // If the response status is 403, display an alert
          const data = await response.json();
          alert(data.error || "Yetkisiz erişim.");
          setTaskEditingID(null);
          window.location.reload();
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setTaskEditingID(null);
      window.location.reload();
    } else {
      const selectedTask = TaskList.find((task) => task.taskID === taskID);
      setTaskFormData({
        taskName: selectedTask.taskName,
        taskStatus: selectedTask.taskStatus,
      });
      setTaskEditingID(taskID);
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
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
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
                  </div>
                ) : (
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    {ProjectInfo.projName}
                  </div>
                )}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 sm:gap-x-6">

                <button
                  type="button"
                  onClick={handleEditClick}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {editingMode ? "Kaydet" : "Düzenle"}
                </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto">
          {/* Invoice */}
          <div className="w-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-3 lg:row-span-2 lg:row-end-3 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Bilgiler
            </h2>
            {editingMode ? (
              <div className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">Başlama Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {ProjectInfo.projStartDate ? (
                      <time dateTime={ProjectInfo.projStartDate}>
                        {formatDate(ProjectInfo.projStartDate)}
                      </time>
                    ) : (
                      <span>Başlama tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Bitiş Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {ProjectInfo.projEndDate ? (
                      <time dateTime={ProjectInfo.projEndDate}>
                        {formatDate(ProjectInfo.projEndDate)}
                      </time>
                    ) : (
                      <span>Bitiş tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="inline text-gray-500">
                    Oluşturan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${ProjectInfo.empName}  ${ProjectInfo.empSurname}`}{" "}
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
                    {ProjectInfo.projStartDate ? (
                      <time dateTime={ProjectInfo.projStartDate}>
                        {formatDate(ProjectInfo.projStartDate)}
                      </time>
                    ) : (
                      <span>Başlama tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Bitiş Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {ProjectInfo.projEndDate ? (
                      <time dateTime={ProjectInfo.projEndDate}>
                        {formatDate(ProjectInfo.projEndDate)}
                      </time>
                    ) : (
                      <span>Bitiş tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="inline text-gray-500">
                    Oluşturan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${ProjectInfo.empName}  ${ProjectInfo.empSurname}`}{" "}
                    </span>
                  </dt>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="inline text-gray-500">
                    <span className="inline-flex">
                      Proje Durumu: &nbsp;
                      {renderTaskStatus(ProjectInfo.projStatus)}
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
                <div className="mt-4 sm:mt-0 sm:mt-4"></div>
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
                              {taskEditingID === task.taskID ? (
                                <input
                                  type="text"
                                  value={taskFormData.taskName}
                                  onChange={(e) =>
                                    setTaskFormData((prevData) => ({
                                      ...prevData,
                                      taskName: e.target.value,
                                    }))
                                  }
                                />
                              ) : (
                                task.taskName
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.empName} {task.empSurname}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {taskEditingID === task.taskID ? (
                                <select
                                  id="status"
                                  name="status"
                                  value={taskFormData.taskStatus}
                                  onChange={(e) =>
                                    setTaskFormData((prevData) => ({
                                      ...prevData,
                                      taskStatus: e.target.value,
                                    }))
                                  }
                                >
                                  {/* Burada durum seçeneklerini ekleyin */}
                                  <option value="Tamamlanmış">
                                    Tamamlanmış
                                  </option>
                                  <option value="Devam Ediyor">
                                    Devam Ediyor
                                  </option>
                                  <option value="Gecikmiş">Gecikmiş</option>
                                </select>
                              ) : (
                                renderTaskStatus(task.taskStatus)
                              )}
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
                              <a
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => handleTaskEditClick(task.taskID)}
                              >
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
        </div>
      </div>
    </div>
  );
}

export default DetailProject;
