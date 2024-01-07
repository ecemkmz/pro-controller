import React from "react";
import { Link } from "react-router-dom";
import ParticlesBg from "../../components/auth/ParticlesBg";

function Auth() {
  return (
    <div className="relative h-screen">
      <ParticlesBg />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <div>
          <h1 className="text-5xl font-extrabold mb-6">
            ProController'a Hoş Geldiniz!
          </h1>
          <p className="text-2xl mb-8">
            En iyi proje yönetimi için bizimle birlikte olun.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <button className="hover:bg-white hover:text-black text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300">
                Üye Ol
              </button>
            </Link>
            <div className="text-white px-6 py-3 rounded-md text-lg font-semibold">
              |
            </div>
            <Link to="/login">
              <button className="hover:bg-white hover:text-black text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300">
                Giriş Yap
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
