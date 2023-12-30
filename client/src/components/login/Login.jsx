import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white p-6 rounded-lg shadow-md">
        <img
          className="mx-auto h-20 w-20"
          src="https://i.ibb.co/d7Pk7v9/Procontroller-logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Hesabınıza Giriş Yapın
        </h2>

        <div className="mt-10">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700">
                Email adresi
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-gray-300 py-2 text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-700">
                  Şifre
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Şifrenizi mi unuttunuz?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-gray-300 py-2 text-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
              >
                Giriş Yap
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Üye değil misiniz?{' '}
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
