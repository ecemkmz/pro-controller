import React, { useState } from "react";
import {UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

function Navbar({ activeMenu, activeSubMenu }) {
  const navigate = useNavigate()
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);


  const renderMenuTitle = () => {
    if (activeMenu) {
      return `ProController > ${activeMenu}${activeSubMenu ? ` > ${activeSubMenu}` : ''}`;
    }
    return "ProController";
  };



  const handleAccountClick = () => {
    setShowAccountDropdown(!showAccountDropdown);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <div className="flex justify-between items-center p-4 shadow">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center text-xl space-x-4  text-gray-700 font-serif font-medium">
              {renderMenuTitle()}
            </ol>
          </nav>
           <div className="relative">
            <button className="flex items-center gap-x-2 text-gray-800" onClick={handleAccountClick}>
              <div className=" text-gray-700 font-serif font-medium">Hesabım</div>
              <UserOutlined />
            </button>
            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {/* Ayarlar sayfasına yönlendir */}}>Ayarlar</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={logout}>Çıkış Yap</a>
              </div>
            )}
          </div>
        </div>
  )
}

export default Navbar