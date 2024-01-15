import React, { useState, useEffect } from "react";
import NoProject from "../projects/NoProject";
import NoTask from "../tasks/NoTask";

function Profile({ onProjectClick, onTaskClick}) {
  const [employee, setEmployee] = useState(null);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState([]);

  const userId = localStorage.user;

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/api/employee-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmployee(data);

          const responseProj = await fetch(
            `http://localhost:5000/api/projects/${userId}`
          );
          const employeeProj = await responseProj.json();
          if (employeeProj) {
            setEmployeeProjects(employeeProj);
          }
          const responseTask = await fetch(
            `http://localhost:5000/api/tasks/${userId}`
          );
          const employeeTask = await responseTask.json();
          if (employeeTask) {
            setEmployeeTasks(employeeTask);
          }
        } else {
          console.error("Bilgiler alınamadı.");
        }
      } catch (error) {
        console.error("Sunucu hatası", error);
      }
    };

    fetchEmployeeInfo();
  }, [userId]);

  if (!employee) {
    return <div>Yükleniyor...</div>;
  }
  return (
    <div className="p-16 max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Hesap Bilgilerim
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Hesap Bilgilerini buradan görebilir ve düzenleyebilirsin.
        </p>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              Ad Soyad
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">
                {employee.empName} {employee.empSurname}
              </div>
          
            </dd>
          </div>
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              Email Adresi
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">{employee.empEmail}</div>
              
            </dd>
          </div>
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              Pozisyon
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">{employee.empPosition}</div>
             
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Projelerim
        </h2>
        <p className="mt-1 mb-5 text-sm leading-6 text-gray-500">
          Projelerini buradan görebilir ve düzenleyebilirsin.
        </p>

        {employeeProjects.length === 0 ? (
          <NoProject />
        ) : (
          <ul
            role="list"
            className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            {employeeProjects.map((employeeProject) => (
              <li
                className="flex justify-between gap-x-6 py-6"
                key={employeeProject.projID}
              >
                <div className="font-medium text-gray-900">
                  {employeeProject.projName}
                </div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => onProjectClick(employeeProject.projID)}
                >
                  Görüntüle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Görevlerim
        </h2>
        <p className="mt-1 mb-5 text-sm leading-6 text-gray-500">
          Görevlerini buradan görebilir ve düzenleyebilirsin.
        </p>

        {employeeTasks.length === 0 ? (
          <NoTask />
        ) : (
          <ul
            role="list"
            className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
          >
            {employeeTasks.map((employeeTask) => (
              <li
                className="flex justify-between gap-x-6 py-6"
                key={employeeTask.taskID}
              >
                <div className="font-medium text-gray-900">
                  {employeeTask.taskName}
                </div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => onTaskClick(employeeTask.taskID)}
                >
                  Düzenle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
