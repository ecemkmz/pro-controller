import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SignUp = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    Ad: "",
    Soyad: "",
    "Email adresi": "",
    password: "",
  });
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad: formData.Ad,
          soyad: formData.Soyad,
          email: formData["Email adresi"],
          password: formData.password,
          position: selectedOption,
        }),
      });

      if (response.ok) {
        console.log("Kayıt işlemi alındı!");
        const data = await response.json();
        data.message && alert(data.message);
        localStorage.setItem("token", data.token);
        navigate('/Home');
        // İsteğe bağlı olarak başka bir işlem yapabilirsiniz, örneğin kullanıcıyı başka bir sayfaya yönlendirebilirsiniz.
      } else {
        const data = await response.json();
        console.error("Kayıt sırasında bir hata oluştu:", data.error);

        // Backend'den gelen hatayı kontrol et
        if (data.error === "Bu mail adresi zaten kayıtlı.") {
          // Kullanıcıya hatayı göster
          alert(
            "Bu mail adresi zaten kayıtlı. Lütfen farklı bir mail adresi kullanın."
          );
        }
        else if(data.error === "Lütfen pozisyon seçiniz.") {
          alert("Lütfen pozisyon seçiniz.");
        }
        else {
          // Diğer hatalar için genel bir hata mesajı göster
          alert("Kayıt sırasında bir hata oluştu.");
        }
      }
    } catch (error) {
      console.error("İstek gönderilirken bir hata oluştu:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <img
          className="mx-auto h-16 w-16"
          src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png"
          alt="Your Company"
        />
        <h2 className="mt-4 text-center text-lg font-bold leading-6 text-gray-900">
          Üye Olun
        </h2>

        <form className="mt-4 space-y-4">
          {["Ad", "Soyad", "Email adresi"].map((label) => (
            <div key={label}>
              <label
                htmlFor={label.toLowerCase()}
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                {label}
              </label>
              <div className="mt-1">
                <input
                  id={label.toLowerCase()}
                  name={label.toLowerCase()}
                  type="text"
                  autoComplete="email"
                  required
                  value={formData[label]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [label]: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 py-2 text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}

          {["password", "passwordConfirm"].map((passwordType) => (
            <div key={passwordType} className="mt-2">
              <label
                htmlFor={passwordType}
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                {passwordType === "password" ? "Şifre" : "Şifreyi Onayla"}
              </label>
              <div className="mt-1">
                <input
                  id={passwordType}
                  name={passwordType}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData[passwordType]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [passwordType]: e.target.value,
                    })
                  }
                  className="block w-full rounded-md border-gray-300 py-2 text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}

          <div className="mt-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Pozisyon
              </label>
              <div className="text-sm">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center gap-x-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {selectedOption}
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none left-0">
                      <div className="py-1">
                        {["CEO", "Backend Dev.", "Frontend Dev."].map(
                          (menuItem, index) => (
                            <Menu.Item key={menuItem}>
                              {({ active }) => (
                                <a
                                  onClick={() => {
                                    setSelectedOption(menuItem);
                                    setSelectedPosition(index); // Seçilen pozisyonu güncelle
                                  }}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm",
                                    selectedPosition === index
                                      ? "bg-gray-200"
                                      : "" // Bu satırı ekle
                                  )}
                                >
                                  {menuItem}
                                </a>
                              )}
                            </Menu.Item>
                          )
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
              onClick={handleSubmit}
            >
              Üye Ol
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Üye misiniz?{" "}
          <a
            href="/login"
            className="font-semibold leading-5 text-indigo-600 hover:text-indigo-500"
          >
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
