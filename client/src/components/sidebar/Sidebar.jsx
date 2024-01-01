import React, { useState } from "react";
import { AppstoreOutlined, TeamOutlined, SettingOutlined, PlusOutlined, DownOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import Employees from '../employees/Employees';
import Projects from "../projects/ListProjects"

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const Menus = [
    { title: "Projeler", icon: <AppstoreOutlined />, subMenu: ["Proje Oluştur"] },
    { title: "Çalışanlar", icon: <TeamOutlined /> },
    { title: "Ayarlar", icon: <SettingOutlined />, bottom: true },
  ];

  const handleMenuClick = (title, sub = null) => {
    setActiveMenu(title === activeMenu ? null : title);
    setActiveSubMenu(sub === activeSubMenu ? null : sub);
  };

  const renderMenuTitle = () => {
    if (activeMenu) {
      return `ProController / ${activeMenu}${activeSubMenu ? ` / ${activeSubMenu}` : ''}`;
    }
    return "ProController";
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Projeler":
        return <Projects />;
      case "Çalışanlar":
        return <Employees />;
      default:
        return null;
    }
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`${open ? "w-72" : "w-20"} h-screen p-5 pt-8 relative duration-300 shadow-md`}>
        {/* Logo */}
        <img
          src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png"
          className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
          alt="logo"
          onClick={() => setOpen(!open)}
        />
        <h1 className={`text-black origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
          ProController
        </h1>
        {/* Menu List */}
        <ul className="pt-6 divide-y">
          {Menus.map((Menu, index) => (
            <React.Fragment key={index}>
              {/* Main Menu Item */}
              <li
                className={`flex  p-3 transition ease-out cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${Menu.bottom ? "mt-auto" : "mt-3"} ${
                  activeMenu === Menu.title || hoveredMenu === Menu.title ? "text-blue-500" : ""
                }`}
                onClick={() => handleMenuClick(Menu.title)}
                onMouseEnter={() => setHoveredMenu(Menu.title)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                {React.cloneElement(Menu.icon, {
                  className: `${activeMenu === Menu.title || hoveredMenu === Menu.title ? "text-blue-500" : "text-gray-700"}`
                })}
                <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
                {open && Menu.subMenu && (
                  <span className="ml-auto">
                    {activeMenu === Menu.title ? <UpOutlined /> : <DownOutlined />}
                  </span>
                )}
              </li>
              {/* Sub Menu Items */}
              {open && Menu.subMenu && activeMenu === Menu.title && Menu.subMenu.map((subItem, subIndex) => (
                <li
                  key={subIndex}
                  className={`flex  p-3 pl-12 cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${
                    activeSubMenu === subItem ? "text-blue-500" : ""
                  }`}
                  onClick={() => handleMenuClick(Menu.title, subItem)}
                >
                  <PlusOutlined className={`${activeSubMenu === subItem ? "text-blue-500" : "text-gray-700"}`} />
                  <span>{subItem}</span>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 shadow">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center text-xl space-x-4  text--gray-500 font-medium">
              {renderMenuTitle()}
            </ol>
          </nav>
          <button className="flex items-center gap-x-2 text-gray-800">
            <UserOutlined />
            <span>Hesabım</span>
          </button>
        </div>
        {/* Main Content Area */}
        <div className="p-7  overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
        {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
