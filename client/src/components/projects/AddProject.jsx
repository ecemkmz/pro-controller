import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";

function AddProject({ setAddProjectOpen }) {
  const [open, setOpen] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formData, setFormData] = useState({
    projName: "",
    startDate: "",
    endDate: "",
    description: "",
    projectStatus: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projName: formData.projName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
          projectStatus: formData.projectStatus,
          creatorID: localStorage.user,
        }),
      });

      if (response.ok) {
        console.log("Proje kaydı alındı!");
        handleClose();
        window.location.reload();
      } else {
        handleRegistrationError(await response.json());
      }
    } catch (error) {
      console.error("İstek gönderilirken bir hata oluştu:", error);
    }
  };

  const handleRegistrationError = (data) => {
    console.error("Kayıt sırasında bir hata oluştu:", data.error);

    if (data.error === "Bu proje adı zaten kayıtlı.") {
      alert("Bu proje adı zaten kayıtlı. Lütfen farklı bir proje adı kullanın.");
    } else {
      // Diğer hatalar için genel bir hata mesajı göster
      alert("Proje Kaydı sırasında bir hata oluştu.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAddProjectOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (dateString) => {
    const date = new Date(dateString);
    setEndDate(date);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Yeni Proje
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                              Yeni projenizi oluşturmak için aşağıdaki bilgileri
                              doldurarak başlayın.
                            </p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button
                              type="button"
                              className="relative text-gray-400 hover:text-gray-500"
                              onClick={handleClose}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                        {/* Project Name */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-name"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Proje Adı
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              name="Proje Adı"
                              id="project-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.projName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  projName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-start-date"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Başlama Tarihi
                            </label>
                          </div>
                          <div className="sm:col-span-2 flex items-center">
                            <input
                              type="date"
                              id="project-start-date"
                              name="Başlama Tarihi"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.startDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  startDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-end-date"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Bitiş Tarihi
                            </label>
                          </div>
                          <div className="sm:col-span-2 flex items-center">
                            <input
                              type="date"
                              id="project-end-date"
                              name="Bitiş Tarihi"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.endDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  endDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="project-description"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Açıklama
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              id="project-description"
                              name="Açıklama"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Project Status */}
                        <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <legend className="sr-only">Privacy</legend>
                          <div
                            className="text-sm font-medium leading-6 text-gray-900"
                            aria-hidden="true"
                          >
                            Projenin Durumu
                          </div>
                          <div className="space-y-5 sm:col-span-2">
                            <div className="space-y-5 sm:mt-0">
                              {["Tamamlanmış", "Devam Ediyor", "Gecikmiş"].map((status) => (
                                <div key={status} className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id={`project-status-${status.toLowerCase()}`}
                                      name="Projenin Durumu"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                      defaultChecked={formData.projectStatus === status}
                                      onChange={() =>
                                        setFormData({
                                          ...formData,
                                          projectStatus: status,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor={`project-status-${status.toLowerCase()}`}
                                      className="font-medium text-gray-900"
                                    >
                                      {status}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <hr className="border-gray-200" />
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={handleClose}
                        >
                          Kapat
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={handleSubmit}
                        >
                          Oluştur
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
export default AddProject;