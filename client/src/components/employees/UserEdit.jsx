import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EmpInfo() {
  const id = useParams().empID;
  const [projectsArray, setProjectsArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [personInfo, setPersonInfo] = useState({
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = (fieldName) => {
    setIsEditing(true);
    setEditingField(fieldName);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    setEditingField(null);
    try {
      const response = await fetch(`http://localhost:5000/api/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personInfo),
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const renderEditableField = (label, value, fieldName, isEditingField) => (
    <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
      <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {isEditingField ? (
          <div className="flex items-center justify-between">
            {fieldName === "empPosition" ? (
              
              <select

                value={value}
                onChange={(e) =>
                  setPersonInfo((prevInfo) => ({
                    ...prevInfo,
                    [fieldName]: e.target.value,
                  }))
                }
                className="border h-10 border-gray-500 focus:outline-none focus:border-blue-500 w-3/4"
              >
                <option value="CEO">CEO</option>
                <option value="Frontend Dev.">Frontend Dev.</option>
                <option value="Backend Dev.">Backend Dev.</option>
              </select>
            ) : (
              <input
              type="text"
              value={value}
              onChange={(e) =>
                setPersonInfo((prevInfo) => ({
                  ...prevInfo,
                  [fieldName]: e.target.value,
                }))
              }
              className="border h-8 border-gray-500 focus:outline-none focus:border-blue-500 w-3/4"
            />
            )}

            <div>
              <span
                className="text-end cursor-pointer hover:text-gray-700 hover:font-semibold"
                onClick={handleSaveClick}
              >
                Kaydet
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>{value}</span>
            <span
              className="text-end cursor-pointer hover:text-gray-700 hover:font-semibold"
              onClick={() => handleEditClick(fieldName)}
            >
              Düzenle
            </span>
          </div>
        )}
      </dd>
    </div>
  );

  const renderProjects = () => (
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
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Proje Adı
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Görev Sayısı
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Durumu
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Başlangıç Tarihi
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Bitiş Tarihi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {projectsArray.map((projectArray) => (
              <tr key={projectArray.email}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {projectArray.projName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div className="text-gray-900">{projectArray.taskCount}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center align-items rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
                    ${
                      projectArray.projStatus === "Gecikmiş"
                        ? "text-red-700 bg-red-50 ring-red-600/10"
                        : ""
                    }
                    ${
                      projectArray.projStatus === "Devam Ediyor"
                        ? "text-yellow-600 bg-yellow-50 ring-yellow-500/10"
                        : ""
                    }
                    ${
                      projectArray.projStatus === "Tamamlanmış"
                        ? "text-green-700 bg-green-50 ring-green-600/20"
                        : ""
                    }`}
                  >
                    {projectArray.projStatus}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {projectArray.projStartDate ? (
                    <time dateTime={projectArray.projStartDate}>
                      {formatDate(projectArray.projStartDate)}
                    </time>
                  ) : (
                    <span>End date not available</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {projectArray.projEndDate ? (
                    <time dateTime={projectArray.projEndDate}>
                      {formatDate(projectArray.projEndDate)}
                    </time>
                  ) : (
                    <span>End date not available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <div className="px-4 sm:px-0">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Çalışan bilgileri ve projeleri.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {renderEditableField(
            "Ad",
            `${personInfo.empName}`,
            "empName",
            editingField === "empName"
          )}
          {renderEditableField(
            "Soyad",
            personInfo.empSurname,
            "empSurname",
            editingField === "empSurname"
          )}
          {renderEditableField(
            "Rolü",
            personInfo.empPosition,
            "empPosition",
            editingField === "empPosition"
          )}
          {renderEditableField(
            "E-Mail Adresi",
            personInfo.empEmail,
            "empEmail",
            editingField === "empEmail"
          )}
          {renderEditableField(
            "Dahil Olduğu Proje Sayısı",
            projectsArray.length,
            "numOfProjects",
            editingField === "numOfProjects"
          )}
          {renderEditableField(
            "Hakkında",
            personInfo.empAbout,
            "empAbout",
            editingField === "empAbout"
          )}
          <div className="px-4 py-6">{renderProjects()}</div>
        </dl>
      </div>
    </div>
  );
}

export default EmpInfo;
