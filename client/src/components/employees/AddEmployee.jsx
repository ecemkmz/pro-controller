import React, { useState } from "react";

const EmployeeForm = ({ onClose, onEmployeeAdded }) => {
  const [employeeData, setEmployeeData] = useState({
    empName: "",
    empSurname: "",
    empEmail: "",
    empPassword: "",
    empPosition: "",
  });

  const positions = ["CEO", "Frontend Dev", "Backend Dev."]; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: employeeData.empName,
          surname: employeeData.empSurname,
          email: employeeData.empEmail,
          position: employeeData.empPosition,
          password: employeeData.empPassword,
        }),
      });
  
      if (response.ok) {
        onEmployeeAdded();
        onClose(); // Çalışan ekledikten sonra formu kapat
      } else {
        console.error("Çalışan eklerken hata:", await response.json());
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Çalışan Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="empName" className="block text-sm font-medium text-gray-700">
              Adı
            </label>
            <input
              type="text"
              id="empName"
              name="empName"
              value={employeeData.empName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="empSurname" className="block text-sm font-medium text-gray-700">
              Soyadı
            </label>
            <input
              type="text"
              id="empSurname"
              name="empSurname"
              value={employeeData.empSurname}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="empEmail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="empEmail"
              name="empEmail"
              value={employeeData.empEmail}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="empPassword" className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              id="empPassword"
              name="empPassword"
              value={employeeData.empPassword}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="empPosition" className="block text-sm font-medium text-gray-700">
              Pozisyon
            </label>
            <select
              id="empPosition"
              name="empPosition"
              value={employeeData.empPosition}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Pozisyon Seçin
              </option>
              {positions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 px-4 py-2 rounded-md border border-gray-300 mr-2"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Çalışan Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
