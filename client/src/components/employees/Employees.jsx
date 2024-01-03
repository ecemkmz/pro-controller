import React, { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";

function Employees({ onEmployeeClick, onEmployeeClickEdit }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div
      href="/employees"
      className="flex  flex-1 flex-col justify-center px-6 lg:px-8"
    >
      <ul role="list" className="divide-y divide-gray-100">
        {employees.map((person) => (
          <div onClick={() => onEmployeeClick(person.empID)}>
            <li
              key={person.empID}
              className="flex justify-between gap-x-6 py-5 hover:bg-gray-100 cursor-pointer "
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={
                    person.imageUrl ||
                    "https://i.ibb.co/kcyK4dY/360-F-64672736-U5kpd-Gs9ke-Ull8-CRQ3p3-Ya-Ev2-M6qk-VY5.jpg"
                  }
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{`${person.empName} ${person.empSurname}`}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.empEmail}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {person.empPosition}
                </p>
                <div>
                  <button className="text-black-300 hover:text-gray-500 transition ease-out ">
                    <SettingOutlined
                      onClick={() => onEmployeeClickEdit(person.empID)}
                    />
                  </button>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Employees;
