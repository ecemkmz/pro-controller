import React from 'react';
import { Link } from 'react-router-dom';
import ParticlesBg from '../../components/particles-bg/ParticlesBg';

function Home() {
  return (
    <div className="relative h-screen">
      <ParticlesBg />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <div className=" bg-gray-600 p-8 rounded-md">
          <h1 className="text-5xl font-extrabold mb-6">ProController'a Hoş Geldiniz!</h1>
          <p className="text-2xl mb-8">En iyi proje yönetimi için bizimle birlikte olun.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <button className="text-white px-6 py-3 rounded-md text-lg font-semibold" style={{ backgroundColor: '#012030' }}>
                Üye Ol
              </button>
            </Link>
            <Link to="/login">
              <button className="text-white px-6 py-3 rounded-md text-lg font-semibold" style={{ backgroundColor: '#012030' }}>
                Giriş Yap
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
