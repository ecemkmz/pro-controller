import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";


function Employees({ onEmployeeClick, onEmployeeClickEdit }) {
  const [employees, setEmployees] = useState([]);

  // Delete employee
  const handleDelete = (empId) => {
    if (window.confirm("Bu Kullanıcıyı Silmek İstediğinize Emin Misiniz?")) {
      fetch(`http://localhost:5000/api/delete/${empId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Fetch employees
  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-100">
        {employees.map((person) => (
          <li key={person.empID} className="flex justify-between gap-x-6 py-5 hover:bg-gray-100 cursor-pointer">
            <div className="flex min-w-0 gap-x-4 pl-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={person.empImageUrl || "https://i.ibb.co/kcyK4dY/360-F-64672736-U5kpd-Gs9ke-Ull8-CRQ3p3-Ya-Ev2-M6qk-VY5.jpg"}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {`${person.empName} ${person.empSurname}`}{" "}
                  <span className="text-sm leading-6 text-gray-500">
                    ({person.empPosition})
                  </span>{" "}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {person.empEmail}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className=" leading-6 text-gray-900"></p>
              <div className="flex items-center gap-x-3 text-lg pr-4">
                <div>
                  <span
                    className="text-end cursor-pointer  hover:text-blue-700 hover:transition-all"
                    alt="View"
                    onClick={() => onEmployeeClick(person.empID)}
                  >
                    <EyeOutlined />
                  </span>
                </div>
                <div>
                  <span
                    className="text-end cursor-pointer hover:text-yellow-600 hover:transition-all"
                    onClick={() => onEmployeeClickEdit(person.empID)}
                  >
                    <EditOutlined />
                  </span>
                </div>
                <div>
                  <span
                    className="cursour-pointer hover:text-red-600 hover:transition-all"
                    onClick={() => handleDelete(person.empID)}
                  >
                    <DeleteOutlined />
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employees;
