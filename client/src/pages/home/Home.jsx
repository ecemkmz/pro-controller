import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../../components/bars/Sidebar";
import Navbar from "../../components/bars/Navbar";
import Employees from "../../components/employees/Employees";
import EmpInfo from "../../components/employees/EmpInfo";
import ListTasks from "../../components/tasks/ListTasks";
import ListProjects from "../../components/projects/ListProjects";
import Profile from "../../components/profile/Profile";
import UserEdit from "../../components/employees/UserEdit";
import DetailProject from "../../components/projects/DetailProject";
import DetailTask from "../../components/tasks/DetailTask";

export default function Home() {
  const navigate = useNavigate();
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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

  const handleEmployeeClickEdit = (empId) => {
    setSelectedEmpId(empId);
    navigate(`Employees/UserEdit/${empId}`);
  };

  const handleProjectClick = (projectID) => {
    setSelectedProjectId(projectID);
    navigate(`Project/${projectID}`);
  };
  const handleTaskClick = (taskID) => {
    setSelectedTaskId(taskID);
    navigate(`Task/${taskID}`);
  };

  return (
    <div className="flex max-h-screen">
      <Sidebar
        onMenuClick={handleMenuClick}
        activeMenu={activeMenu}
        activeSubMenu={activeSubMenu}
        navigate={navigate}
      />
      <div className="flex-1 flex flex-col">
        <Navbar activeMenu={activeMenu} activeSubMenu={activeSubMenu} />
        <div
          className="p-7 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 68px)" }}
        >
          <Routes>
            <Route
              path="/Projects"
              element={<ListProjects onProjectClick={handleProjectClick} />}
            />
            <Route path="/Tasks" element={<ListTasks onTaskClick={handleTaskClick} />} />
            <Route path="/Settings" element={<Profile onProjectClick={handleProjectClick} />} />
            <Route
              path="/Employees"
              element={
                <Employees
                  onEmployeeClick={handleEmployeeClick}
                  onEmployeeClickEdit={handleEmployeeClickEdit}
                />
              }
            />
            <Route
              path="/Employees/Employee/:empID"
              element={<EmpInfo empId={selectedEmpId} />}
            />
            <Route
              path="/Employees/UserEdit/:empID"
              element={<UserEdit empId={selectedEmpId} />}
            />
            <Route path="Task/:taskID" element={<DetailTask />} />
            <Route path="Project/:projectID" element={<DetailProject />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
