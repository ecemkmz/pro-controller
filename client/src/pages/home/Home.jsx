import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/bars/Sidebar';
import Navbar from '../../components/bars/Navbar';
import Employees from '../../components/employees/Employees';
import EmpInfo from '../../components/employees/EmpInfo';
import ListTasks from '../../components/tasks/ListTasks';
import ListProjects from '../../components/projects/ListProjects';
import Profile from '../../components/profile/Profile';

export default function Home() {
  const navigate = useNavigate();
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  // Bu durum ve fonksiyonlar Sidebar ve Navbar arasında paylaşılacak
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleMenuClick = (menu, subMenu = null) => {
    setActiveMenu(menu);
    setActiveSubMenu(subMenu);
  };

  const handleEmployeeClick = (empId) => {
    setSelectedEmpId(empId);
    navigate(`Employees/Employee/${empId}`);
  };

  return (
    <div className="flex">
      <Sidebar onMenuClick={handleMenuClick} activeMenu={activeMenu} activeSubMenu={activeSubMenu} navigate={navigate}/>
      <div className="flex-1 flex flex-col">
        <Navbar activeMenu={activeMenu} activeSubMenu={activeSubMenu}/>
        <div className="p-7 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
          <Routes>
          <Route path="/Projects" element={<ListProjects />} />
          <Route path="/Tasks" element={<ListTasks />} />
          <Route path="/Settings" element={<Profile />} />
            <Route path="/Employees" element={<Employees onEmployeeClick={handleEmployeeClick} />} />
            <Route path="/Employees/Employee/:empID" element={<EmpInfo empId={selectedEmpId} />} />
            {/* Diğer rotalarınız */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
