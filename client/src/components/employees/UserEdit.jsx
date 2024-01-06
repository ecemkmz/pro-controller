import {
  CalendarDaysIcon,
  UserCircleIcon,
  PencilIcon,
  FolderIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


function EmpInfo() {
  const id = useParams().empID;
  const [projectsArray, setProjectsArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);

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
        // Çalışan bilgilerini çekme
        const responseEmp = await fetch(`http://localhost:5000/api/employees/${id}`);
        const dataEmp = await responseEmp.json();
        if (dataEmp && dataEmp.length > 0) {
          setPersonInfo(dataEmp[0]);
        }
  
        // Çalışanın projelerini çekme
        const responseProjects = await fetch(`http://localhost:5000/projects/${id}`);
        const dataProjects = await responseProjects.json();
        console.log(dataProjects)
        if (dataProjects) {
          setProjectsArray(dataProjects);
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
  


  const handleEditClick = (fieldName) => {
    setIsEditing(true);
    setEditingField(fieldName);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setEditingField(null);
    try {
      const response = fetch(`http://localhost:5000/api/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(PersonInfo),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderProjects = () => {
    return  (

  <div>
  <div className="sm:flex-auto">
  <h1 className="text-base  text-center font-semibold leading-6 text-gray-900">Oluşturduğu Projeler</h1>
  <p className="mt-2 text-sm text-gray-700">
    
  </p>
</div>
  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
  <table className="min-w-full divide-y divide-gray-300">
    <thead>
      <tr>
        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
          Proje Adı
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Görev Sayısı
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Durumu
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Başlangıç Tarihi
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
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
                <div className="font-medium text-gray-900">{projectArray.projName}</div>
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-gray-900">{projectArray.taskCount}</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500" >
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
                                            projectArray.projStatus === "Tamamlandı"
                                              ? "text-green-700 bg-green-50 ring-green-600/20"
                                              : ""
                                          }`}
            >
            {projectArray.projStatus}
            </span>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{projectArray.projStartDate ? (
                      <time dateTime={projectArray.projStartDate}>
                        {formatDate(projectArray.projStartDate)}
                      </time>
                    ) : (
                      <span>End date not available</span>
                    )}</td>
                     <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{projectArray.projEndDate ? (
                      <time dateTime={projectArray.projEndDate}>
                        {formatDate(projectArray.projEndDate)}
                      </time>
                    ) : (
                      <span>End date not available</span>
                    )}</td>
          
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
    );
  };
  const renderEditableField = (label, value, fieldName, isEditingField) => (
    <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
      <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {isEditingField ? (
          <div className="flex items-center justify-between">
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
            `${PersonInfo.empName}`,
            "empName",
            editingField === "empName"
          )}
          {renderEditableField(
            "Soyad",
            PersonInfo.empSurname,
            "empSurname",
            editingField === "empSurname"
          )}
          {renderEditableField(
            "Rolü",
            PersonInfo.empPosition,
            "empPosition",
            editingField === "empPosition"
          )}
          {renderEditableField(
            "E-Mail Adresi",
            PersonInfo.empEmail,
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
            PersonInfo.empAbout,
            "empAbout",
            editingField === "empAbout"
          )}
          {/* <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
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
          </div> */}
          <div className=" px-4 py-6">

              {renderProjects()}
          </div>
        </dl>
      </div>
    </div>
  );
}

export default EmpInfo;
