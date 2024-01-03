import { CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const projectsArray = [
  {
    projName: "Proj1",
    projStatus: "Devam Ediyor",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj2",
    projStatus: "Tamamlandı",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj3",
    projStatus: "Gecikmiş",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj4",
    projStatus: "Tamamlandı",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj5",
    projStatus: "Tamamlandı",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj6",
    projStatus: "Tamamlandı",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj7",
    projStatus: "Devam Ediyor",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
  {
    projName: "Proj8",
    projStatus: "Gecikmiş",
    projLeader: "Alex Curren",
    projStartDate: "01/01/2021",
    projEndDate: "01/01/2022",
  },
];

function EmpInfo() {
  const id = useParams().empID;

  const [PersonInfo, setPersonInfo] = useState({
    empName: "",
    empSurname: "",
    empPosition: "",
    empEmail: "",
    numOfProjects: "",
    empAbout: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employees/${id}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setPersonInfo(data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const renderProjects = () => {
    const groupedProjects = [];
    for (let i = 0; i < projectsArray.length; i += 3) {
      groupedProjects.push(projectsArray.slice(i, i + 3));
    }

    return groupedProjects.map((group, groupIndex) => (
      <div
        key={groupIndex}
        className="lg:flex lg:gap-5 lg:mb-5 sm:flex-wrap sm:mb-10"
      >
        {group.map((project, index) => (
          <div key={index} className={` sm:w-1/2 md:w-80 `}>
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-5">
              <dl className="flex flex-wrap">
                <div className="flex-auto pl-6 pt-6">
                  <dt className="text-sm font-semibold leading-6 text-gray-900">
                    {project.projName}
                  </dt>
                  <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
                </div>
                <div className="flex-none self-end px-6 pt-4">
                  <dt className="sr-only">Status</dt>
                  <dd
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
  ${
    project.projStatus === "Gecikmiş"
      ? "text-red-700 bg-red-50 ring-red-600/10"
      : ""
  }
  ${
    project.projStatus === "Devam Ediyor"
      ? "text-yellow-600 bg-yellow-50 ring-yellow-500/10"
      : ""
  }
  ${
    project.projStatus === "Tamamlandı"
      ? "text-green-700 bg-green-50 ring-green-600/20"
      : ""
  }`}
                  >
                    {project.projStatus}
                  </dd>
                </div>
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <dt className="flex-none">
                    <span className="sr-only">Leader</span>
                    <UserCircleIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-gray-900">
                    {project.projLeader}
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Due date</span>
                    <CalendarDaysIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    <time dateTime="2023-01-31">{project.projStartDate}</time>
                  </dd>
                </div>
                <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                  <dt className="flex-none">
                    <span className="sr-only">Status</span>
                    <CalendarDaysIcon
                      className="h-6 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd className="text-sm leading-6 text-gray-500">
                    {project.projEndDate}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    ));
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
              Hakkında
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {PersonInfo.empAbout}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Projeler
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {renderProjects()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default EmpInfo;
