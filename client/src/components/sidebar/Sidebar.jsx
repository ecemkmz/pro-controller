import React, { useState } from "react";
import { AppstoreOutlined, TeamOutlined, SettingOutlined, PlusOutlined, DownOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import Login from '../login/Login';
import Employees from '../employees/Employees';

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const Menus = [
    { title: "Projeler", icon: <AppstoreOutlined />, subMenu: ["Proje Oluştur"] },
    { title: "Çalışanlar", icon: <TeamOutlined /> },
    { title: "Ayarlar", icon: <SettingOutlined />, bottom: true },
  ];

  const handleMenuClick = (title, sub = null) => {
    if (sub) {
      setActiveSubMenu(sub === activeSubMenu ? null : sub);
    } else {
      setActiveMenu(title === activeMenu ? null : title);
      if (!Menus.find(menu => menu.title === title).subMenu) {
        setActiveSubMenu(null);
      }
    }
  };

  const renderMenuTitle = () => {
    if (activeMenu) {
      return `ProController / ${activeMenu}${activeSubMenu ? ` / ${activeSubMenu}` : ''}`;
    }
    return "ProController";
  };

  return (
    <div className="flex">
      <div
        className={`${open ? "w-72" : "w-20"} h-screen p-5 pt-8 relative duration-300 shadow-lg`}
      >
        <img
          src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png"
          className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
          onClick={() => setOpen(!open)}
        />
        <h1
          className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}
        >
          ProController
        </h1>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <React.Fragment key={index}>
              <li
                className={`flex rounded-md p-3 cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${Menu.bottom ? "mt-auto" : "mt-3"} border-b border-gray-200 ${
                  activeMenu === Menu.title || hoveredMenu === Menu.title ? "text-blue-500" : ""
                }`}
                onClick={() => handleMenuClick(Menu.title)}
                onMouseEnter={() => setHoveredMenu(Menu.title)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                {React.cloneElement(Menu.icon, {
                  className: `${activeMenu === Menu.title || hoveredMenu === Menu.title ? "text-blue-500" : "text-gray-700"}`
                })}
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {Menu.title}
                </span>
                {open && Menu.subMenu && (
                  <span className="ml-auto">
                    {activeMenu === Menu.title ? <UpOutlined /> : <DownOutlined />}
                  </span>
                )}
              </li>
              {open && Menu.subMenu && activeMenu === Menu.title && Menu.subMenu.map((subItem, subIndex) => (
                <li
                  key={subIndex}
                  className={`flex rounded-md p-3 pl-12 cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${
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
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 shadow-md">
          <h1 className="text-xl font-semibold text-gray-800">{renderMenuTitle()}</h1>
          <button className="flex items-center gap-x-2 text-gray-800">
            <UserOutlined />
            <span>Hesabım</span>
          </button>
        </div>
        {/* Ana içerik */}
        <div className="flex-1 p-7 overflow-y-auto">
          {/* İçerik burada */}
          <Employees/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
