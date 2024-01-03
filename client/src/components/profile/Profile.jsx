import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@headlessui/react'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <div>Yükleniyor...</div>;
  }
  return (
    <div className="p-16 max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Hesap Bilgilerim</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
        Hesap Bilgilerini buradan görebilir ve düzenleyebilirsin.
        </p>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Ad Soyad</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">{user.name} {user.surname}</div>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Düzenle
              </button>
            </dd>
          </div>
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email Adresi</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">{user.email}</div>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Düzenle
              </button>
            </dd>
          </div>
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Pozisyon</dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">{user.position}</div>
              <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Düzenle
              </button>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Projelerim</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Projelerini buradan görebilir ve düzenleyebilirsin.</p>

        <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">TD Canada Trust</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Düzenle
            </button>
          </li>
          <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">Royal Bank of Canada</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Düzenle
            </button>
          </li>
        </ul>

      </div>
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">Görevlerim</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">Görevlerini buradan görebilir ve düzenleyebilirsin.</p>

        <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">TD Canada Trust</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Düzenle
            </button>
          </li>
          <li className="flex justify-between gap-x-6 py-6">
            <div className="font-medium text-gray-900">Royal Bank of Canada</div>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Düzenle
            </button>
          </li>
        </ul>
      </div>


    </div>
  )
}

export default Profile