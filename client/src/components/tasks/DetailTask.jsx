import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";


function DetailTask({ OnTaskClick }) {
  const { taskID } = useParams();
  const [TaskList, setTaskList] = useState([
    {
      taskID:"",
      projectID:"",
      taskName: "",
      taskStatus: "",
      taskStartDate:"",
      taskEndDate: "",
      taskDesc:"",
      attendedEmpName: "",
      attendedEmpSurname: "",
      attendeEmpName:"",
      attenderEmpSurname: ""
    },
  ]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/taskDetail/${taskID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTaskList(data);
        console.log(TaskList);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Hata durumunda kullanıcıya bildirim gösterme veya başka bir işlem yapma
      });
  }, [DetailTask]);

  const renderTaskStatus = (status) => {
    let color = "";
    if (status === "Tamamlanmış")
      color = "  text-green-700  bg-green-50 ring-green-600/10";
    else if (status === "Devam Ediyor")
      color = "text-yellow-600 bg-yellow-50 ring-yellow-500/10";
    else if (status === "Gecikmiş")
      color = "text-red-700 bg-red-50 ring-red-600/10";
    return (
      <span
        className={`flex items-center justify-center px-2 py-1 font-medium text-xs ring-1 ring-inset rounded-md ${color}`}
      >
        {status}
      </span>
    );
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  function calculateDurationInDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.round(daysDifference);
  }


  return (
    <div>
      <header className="relative isolate pt-16">
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
            <div
              className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
              style={{
                clipPath:
                  "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
              }}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
            <div className="flex items-center gap-x-6">
              <img
                src="https://tailwindui.com/img/logos/48x48/tuple.svg"
                alt=""
                className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
              />
              <h1>
                <div className="text-sm leading-6 text-gray-500">Görev Adı</div>
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                    {TaskList.taskName}
                  </div>
              </h1>
            </div>
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              <span
                className="text-sm font-semibold leading-6 text-gray-900 sm:block cursor-pointer"
              >
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto">
          {/* Invoice */}
          <div className="w-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-3 lg:row-span-2 lg:row-end-3 xl:px-16 xl:pb-20 xl:pt-16">
            <h2 className="text-base font-semibold leading-6 text-gray-900">
              Bilgiler
            </h2>
              <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">Başlama Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {TaskList.taskStartDate ? (
                      <time dateTime={TaskList.taskStartDate}>
                        {formatDate(TaskList.taskStartDate)}
                      </time>
                    ) : (
                      <span>Başlama tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">Bitiş Tarihi:</dt>{" "}
                  <dd className="inline text-gray-700">
                    {TaskList.taskEndDate ? (
                      <time dateTime={TaskList.taskEndDate}>
                        {formatDate(TaskList.taskEndDate)}
                      </time>
                    ) : (
                      <span>Bitiş tarihi mevcut değil.</span>
                    )}
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="inline text-gray-500">
                    Atanan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${TaskList.attendedEmpName}  ${TaskList.attendedEmpSurname}`}{" "}
                    </span>
                  </dt>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="inline text-gray-500">
                    Atayan Kişi:{" "}
                    <span className="text-gray-700">
                      {`${TaskList.attenderEmpName}  ${TaskList.attenderEmpSurname}`}{" "}
                    </span>
                  </dt>
                </div>
                <div className="mt-6 sm:border-t sm:border-gray-900/5  sm:pt-6">
                  <dt className="inline text-gray-500">
                    <span className="inline-flex">
                      Görev Durumu: &nbsp;
                      {renderTaskStatus(TaskList.taskStatus)}
                    </span>
                  </dt>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                  <dt className="inline text-gray-500">
                    Adam Gün Değeri:{" "}
                    <span className="text-gray-700">
                    {calculateDurationInDays(
                        TaskList.taskStartDate,
                        TaskList.taskEndDate
                      )}{" "}
                      gün
                    </span>
                  </dt>
                </div>
                <div className="mt-6 sm:border-t sm:border-gray-900/5  sm:pt-6">
                <dt className="inline text-gray-500">
                    Görev Açıklaması:{" "}
                    <span className="text-gray-700">
                      {`${TaskList.taskDesc}`}{" "}
                    </span>
                  </dt>
                </div>
              </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailTask;
