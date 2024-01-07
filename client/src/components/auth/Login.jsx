import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Giriş işlemi alındı!");

        if (data.message === "Giriş Başarılı") {
          console.log(data, data.user);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", data.user.id);
        }

        navigate('/Home/Projects');
      } else {
        handleLoginError(data.error);
      }
    } catch (error) {
      console.error("İstek gönderilirken bir hata oluştu:", error);
    }
  };

  const handleLoginError = (errorMessage) => {
    switch (errorMessage) {
      case "Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.":
        alert(
          "Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz."
        );
        break;
      case "Şifre boş olamaz.":
        alert("Şifre boş olamaz.");
        break;
      default:
        alert("Giriş sırasında bir hata oluştu.");
    }
  };

  const formFields = [
    {
      id: "email",
      label: "Email adresi",
      type: "email",
      autoComplete: "email",
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      required: true,
    },
    {
      id: "password",
      label: "Şifre",
      type: "password",
      autoComplete: "current-password",
      value: formData.password,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
      required: true,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white p-6 rounded-lg shadow-md">
        <img className="mx-auto h-20 w-20" src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Hesabınıza Giriş Yapın
        </h2>

        <div className="mt-10">
          <form className="space-y-6" action="#" method="POST">
            {formFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium leading-6 text-gray-700">
                  {field.label}
                </label>
                <div className="mt-2">
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={field.value}
                    onChange={field.onChange}
                    required={field.required}
                    className="block w-full rounded-md border-gray-300 py-2 text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}

            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
              >
                Giriş Yap
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Üye değil misiniz?{" "}
            <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Üye ol
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
