import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { XMarkIcon, CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function AddTask({ setAddTaskOpen }) {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees data:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects data:", error));
  }, []);

  const [formData, setFormData] = useState({
    taskName: "",
    startDate: "",
    projectID: "",
    taskAttendedId: "",
    taskAttenderID: "",
    taskStartDate: "",
    taskEndDate: "",
    taskDesc: "",
    taskStatus: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch("http://localhost:5000/api/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId":userId
        },
        body: JSON.stringify({
          taskName: formData.taskName,
          startDate: formData.startDate,
          projectID: formData.projectID,
          taskAttendedId: formData.taskAttendedId,
          taskAttenderID: localStorage.user,
          taskStartDate: formData.taskStartDate,
          taskEndDate: formData.taskEndDate,
          taskDesc: formData.taskDesc,
          taskStatus: formData.taskStatus
        }),
      });

      if (response.ok) {
        console.log("Görev kaydı alındı!");
        handleClose();
        window.location.reload();
      } else {
        const data = await response.json();
        console.error("Error during task registration:", data.error);

        if (data.error === "Bu görev adı zaten kayıtlı.") {
          alert("Bu görev adı zaten kayıtlı. Lütfen farklı bir proje adı kullanın.");
        } else {
          alert("Görev Kaydı sırasında bir hata oluştu.");
        }
      }
    } catch (error) {
      console.error("An error occurred while sending the request:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAddTaskOpen(false);
    console.log(selectedEmployee);
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
                      {/* Header */}
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Yeni Görev
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                              Yeni görevinizi oluşturmak için aşağıdaki bilgileri doldurarak başlayın.
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
                      <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                        <div>
                          <label
                            htmlFor="task-name"
                            className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                          >
                            Görev Adı
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            name="task-name"
                            id="task-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={formData.taskName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                taskName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
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
                            <Listbox
                              value={selected}
                              onChange={(project) => {
                                setSelected(project);
                                setFormData({
                                  ...formData,
                                  projectID: project.projID
                                });
                              }}
                            >
                              {({ open }) => (
                                <>
                                  <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                      <span className="block truncate">{selected.projName || "Seçim yapınız"}</span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {projects.map((project) => (
                                          <Listbox.Option
                                            key={project.id}
                                            className={({ active }) =>
                                              classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                              )
                                            }
                                            value={project}
                                          >
                                            {({ selectedEmployee, active }) => (
                                              <>
                                                <span className={classNames(selectedEmployee ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                  {project.projName}
                                                </span>

                                                {selectedEmployee ? (
                                                  <span
                                                    className={classNames(
                                                      active ? 'text-white' : 'text-indigo-600',
                                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                  >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                        </div>
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="employee-name"
                              className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                            >
                              Görevlendirilen Kişi
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <Listbox
                              value={selectedEmployee}
                              onChange={(employee) => {
                                setSelectedEmployee(employee);
                                setFormData({
                                  ...formData,
                                  taskAttendedId: employee.empID
                                });
                              }}>
                              {({ open }) => (
                                <>
                                  <div className="relative mt-2">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                      <span className="block truncate">{selectedEmployee.empName ? (selectedEmployee.empName + " " + selectedEmployee.empSurname) : "Seçim Yapınız"}</span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {employees.map((person) => (
                                          <Listbox.Option
                                            key={person.id}
                                            className={({ active }) =>
                                              classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                              )
                                            }
                                            value={person}
                                          >
                                            {({ selectedEmployee, active }) => (
                                              <>
                                                <span className={classNames(selectedEmployee ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                  {person.empName + " " + person.empSurname}
                                                </span>

                                                {selectedEmployee ? (
                                                  <span
                                                    className={classNames(
                                                      active ? 'text-white' : 'text-indigo-600',
                                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                  >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                        </div>
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
                              name="project-start-date"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.taskStartDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  taskStartDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Project end date */}
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
                              name="project-end-date"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              value={formData.taskEndDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  taskEndDate: e.target.value,
                                })
                              }
                            />
                           
                          </div>
                        </div>
                       
                        {/* Project description */}
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
                              name="project-description"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              defaultValue={""}
                              value={formData.taskDesc}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  taskDesc: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Privacy */}
                        <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <legend className="sr-only">Privacy</legend>
                          <div
                            className="text-sm font-medium leading-6 text-gray-900"
                            aria-hidden="true"
                          >
                            Görevin Durumu
                          </div>
                          <div className="space-y-5 sm:col-span-2">
                            <div className="space-y-5 sm:mt-0">
                              <div className="relative flex items-start">
                                <div className="absolute flex h-6 items-center">
                                  <input
                                    id="public-access"
                                    name="privacy"
                                    aria-describedby="public-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    defaultChecked={
                                      formData.taskStatus ===
                                      "Tamamlanmış"
                                    }
                                    onChange={() =>
                                      setFormData({
                                        ...formData,
                                        taskStatus: "Tamamlanmış",
                                      })
                                    }
                                  />
                                </div>
                                <div className="pl-7 text-sm leading-6">
                                  <label
                                    htmlFor="public-access"
                                    className="font-medium text-gray-900"
                                  >
                                    Tamamlanmış
                                  </label>
                                 
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="absolute flex h-6 items-center">
                                  <input
                                    id="restricted-access"
                                    name="privacy"
                                    aria-describedby="restricted-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    defaultChecked={
                                      formData.taskStatus ===
                                      "Devam Ediyor"
                                    }
                                    onChange={() =>
                                      setFormData({
                                        ...formData,
                                        taskStatus: "Devam Ediyor",
                                      })
                                    }
                                  />
                                </div>
                                <div className="pl-7 text-sm leading-6">
                                  <label
                                    htmlFor="restricted-access"
                                    className="font-medium text-gray-900"
                                  >
                                    Devam Ediyor
                                  </label>
                                  
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="absolute flex h-6 items-center">
                                  <input
                                    id="private-access"
                                    name="privacy"
                                    aria-describedby="private-access-description"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    defaultChecked={
                                      formData.taskStatus=== "Gecikmiş"
                                    }
                                    onChange={() =>
                                      setFormData({
                                        ...formData,
                                        taskStatus: "Gecikmiş",
                                      })
                                    }
                                  />
                                </div>
                                <div className="pl-7 text-sm leading-6">
                                  <label
                                    htmlFor="private-access"
                                    className="font-medium text-gray-900"
                                  >
                                    Gecikmiş
                                  </label>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    {/* Action buttons */}
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
                          type="submit"
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

export default AddTask