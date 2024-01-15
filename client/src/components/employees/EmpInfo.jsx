import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EmpInfo() {
  const id = useParams().empID;
  const [projectsArray, setProjectsArray] = useState([]);
  const[taskCounts,setTaskCounts]=useState([])

  const [PersonInfo, setPersonInfo] = useState({
    empName: "",
    empSurname: "",
    empPosition: "",
    empEmail: "",
    numOfProjects: "",
    empAbout: "",
  });

  const completedTasksCount =taskCounts.find(task => task.taskStatus === 'Tamamlanmış')?.statusCount || 0;
  const delayedTasksCount = taskCounts.find(task => task.taskStatus === 'Gecikmiş')?.statusCount || 0;
const ongoingTasksCount = taskCounts.find(task => task.taskStatus === 'Devam Ediyor')?.statusCount || 0;



  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEmp = await fetch(
          `http://localhost:5000/api/employees/${id}`
        );
        const dataEmp = await responseEmp.json();
        if (dataEmp && dataEmp.length > 0) {
          setPersonInfo(dataEmp[0]);
        }
        const responseProjects = await fetch(
          `http://localhost:5000/api/projects/taskAttendedUser/${id}`
        );
        const dataProjects = await responseProjects.json();
        if (dataProjects) {
          setProjectsArray(dataProjects);
        }
        const taskCountByStatus = await fetch(
          `http://localhost:5000/api/taskCountByStatus/${id}`
        );
        const taskCounts = await taskCountByStatus.json();
        if (taskCounts) {
          setTaskCounts(taskCounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const renderProjects = () => {
    return (
      <div>
        <div className="sm:flex-auto">
          <h1 className="text-base text-center font-semibold leading-6 text-gray-900">
            Dahil Olduğu Projeler
          </h1>
          <p className="mt-2 text-sm text-gray-700"></p>
        </div>
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {["Proje Adı", "Görev Sayısı", "Durumu", "Başlangıç Tarihi", "Bitiş Tarihi"].map((header, index) => (
                  <th key={index} scope="col" className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${index === 0 ? 'pl-4 pr-3' : ''}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {projectsArray.map((projectArray) => (
                <tr key={projectArray.email}>
                  {["projName", "taskCount", "projStatus", "projStartDate", "projEndDate"].map((field, index) => (
                    <td key={index} className={`whitespace-nowrap px-3 py-5 text-sm text-gray-500 ${index === 0 ? 'pl-4 pr-3 sm:pl-0' : ''}`}>
                      {field === "projStatus" ? (
                        <span
                          className={`inline-flex items-center align-items rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
                          ${
                            projectArray[field] === "Gecikmiş"
                              ? "text-red-700 bg-red-50 ring-red-600/10"
                              : ""
                          }
                          ${
                            projectArray[field] === "Devam Ediyor"
                              ? "text-yellow-600 bg-yellow-50 ring-yellow-500/10"
                              : ""
                          }
                          ${
                            projectArray[field] === "Tamamlandı" || "Tamamlanmış"
                              ? "text-green-700 bg-green-50 ring-green-600/20"
                              : ""
                          }`}
                        >
                          {projectArray[field]}
                        </span>
                      ) : field.includes("Date") ? (
                        projectArray[field] ? (
                          <time dateTime={projectArray[field]}>
                            {formatDate(projectArray[field])}
                          </time>
                        ) : (
                          <span>End date not available</span>
                        )
                      ) : (
                        <div className="text-gray-900">{projectArray[field]}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="px-4 sm:px-0">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Çalışan bilgileri ve projeleri.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Ad - Soyad
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {PersonInfo.empName} {PersonInfo.empSurname}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Rolü
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {PersonInfo.empPosition}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              E-Mail Adresi
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {PersonInfo.empEmail}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Dahil Olduğu Proje Sayısı
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {projectsArray.length}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Atanan Görev Sayısı
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {completedTasksCount+ongoingTasksCount+delayedTasksCount}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Görev Geçmişi
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex justify-start">
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-green-700">
                    Tamamlanan
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-700">
                    {completedTasksCount}
                  </div>
                </div>
                <div className="flex flex-col items-center px-32">
                  <div className="text-sm font-medium text-yellow-600">
                    Devam Eden
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-700">
                    {ongoingTasksCount}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-red-700">
                    Gecikmiş
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-700">
                    {delayedTasksCount}
                  </div>
                </div>

              </div>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Hakkında
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {PersonInfo.empAbout}
            </dd>
          </div>
          <div className="px-4 py-6">{renderProjects()}</div>
        </dl>
      </div>
    </div>
  );
}

export default EmpInfo;
