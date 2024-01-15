import React, { useState } from "react";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

function Sidebar({ onMenuClick, activeMenu, activeSubMenu, navigate }) {
  const [open, setOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const Menus = [
    {
      title: "Projeler",
      icon: <AppstoreOutlined />,
      route: "/Home/Projects",
    },
    {
      title: "Görevler",
      icon: <FileTextOutlined />,
      route: "/Home/Tasks",
    },
    { title: "Çalışanlar", icon: <TeamOutlined />, route: "/Home/Employees" },
    {
      title: "Hesabım",
      icon: <UserOutlined />,
      route: "/Home/Profile",
      bottom: true,
    },
    // Diğer ana menüler
  ];

  const handleMenuClick = (menu, subItem = null) => {
    onMenuClick(menu.title, subItem ? subItem.title : null); // Üst bileşene bilgiyi iletiyoruz
    navigate(subItem ? subItem.route : menu.route);
  };

  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } h-screen p-5 pt-8 relative duration-300 shadow-md`}
    >
      <img
        src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png"
        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
        alt="logo"
        onClick={() => setOpen(!open)}
      />
      <h1
        className={`text-black origin-left font-medium text-xl duration-200 ${
          !open && "scale-0"
        }`}
      >
        ProController
      </h1>
      {/* Menu List */}
      <ul className="pt-6 divide-y">
        {Menus.map((Menu, index) => (
          <React.Fragment key={index}>
            <li
              className={`flex p-3 transition ease-out cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${
                Menu.bottom ? "mt-auto" : "mt-3"
              } ${
                (activeMenu === Menu.title || hoveredMenu === Menu.title) &&
                "text-blue-500"
              }`}
              onClick={() => handleMenuClick(Menu)}
            >
              {React.cloneElement(Menu.icon, {
                className: `${
                  (activeMenu === Menu.title || hoveredMenu === Menu.title) &&
                  "text-blue-500"
                }`,
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
            {open &&
              Menu.subMenu &&
              activeMenu === Menu.title &&
              Menu.subMenu.map((subItem, subIndex) => (
                <li
                  key={subIndex}
                  className={`flex p-3 pl-12 cursor-pointer hover:bg-light-white text-gray-700 text-sm items-center gap-x-4 ${
                    activeSubMenu === subItem.title && "text-blue-500"
                  }`}
                  onClick={() => handleMenuClick(Menu, subItem)}
                >
                  <PlusOutlined
                    className={`${
                      activeSubMenu === subItem.title && "text-blue-500"
                    }`}
                  />
                  <span>{subItem.title}</span>
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
