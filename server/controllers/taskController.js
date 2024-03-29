const connection = require('../config/dbConfig');

exports.getTasks = (req, res) => {
  const { sortKey, sortOrder, taskStatus } = req.query;

  let getTasksQuery = `
    SELECT a.taskID,a.taskName, a.taskAttendedId, a.projectID, a.taskStatus, a.taskStartDate, a.taskEndDate, a.taskDesc, p.projName, e.empName, e.empSurname,a.taskDelayedDays
    FROM Tasks a JOIN Projects p ON a.projectID = p.projID JOIN Employees e ON a.taskAttendedId = e.empId
  `;

  // Apply sorting
  if (sortKey && sortOrder) {
    getTasksQuery += ` ORDER BY ${sortKey} ${sortOrder}`;
  }

  connection.query(getTasksQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Apply filtering
    if (taskStatus) {
      const filteredTasks = result.filter(
        (task) => task.taskStatus === taskStatus
      );
      res.status(200).json(filteredTasks);
    } else {
      res.status(200).json(result);
    }
  });
}

exports.getTaskByTaskAttendedId = (req, res) => {

  let getTasksQuery = `
    SELECT a.taskID,a.taskName, a.taskAttendedId, a.projectID, a.taskStatus, a.taskStartDate, a.taskEndDate, a.taskDesc, p.projName, e.empName, e.empSurname
    FROM Tasks a JOIN Projects p ON a.projectID = p.projID JOIN Employees e ON a.taskAttendedId = e.empId WHERE a.taskAttendedId=?
  `;

 
  connection.query(getTasksQuery,[req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json(result)
  });
}

exports.createTask = async (req, res) => {
  const {
    taskName,
    projectID,
    taskAttendedId,
    taskAttenderID,
    taskStartDate,
    taskEndDate,
    taskDesc,
    taskStatus,
  } = req.body;
  if (!taskName || taskName.trim() === '') {
    return res.status(400).json({ error: "Görev ismi boş bırakılamaz." });
  }

  try {
    const checkNameQuery = `SELECT taskName FROM Tasks WHERE taskName = ?`;

    connection.query(checkNameQuery, [taskName], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        res.status(400).json({ error: "Bu görev adı zaten kayıtlı." });
      } else {
        const insertQuery = `
          INSERT INTO Tasks (taskName ,projectID, taskAttendedId,taskAttenderID, taskStartDate, taskEndDate, taskDesc, taskStatus,taskDefaultEndDate)
          VALUES (?, ?, ?, ?, ?, ?,?,?,?)
        `;

        connection.query(
          insertQuery,
          [
            taskName,
            projectID,
            taskAttendedId,
            taskAttenderID,
            taskStartDate,
            taskEndDate,
            taskDesc,
            taskStatus,
            taskEndDate
          ],
          (err, result) => {
            if (err) {
              console.error(`Error occurred: ${err.sqlMessage}`);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }
            res.status(201).json({ message: "Görev başarıyla eklendi." });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
exports.deleteTask = (req, res) => {
  const deleteProjectQuery = `DELETE FROM Tasks WHERE taskID = ?`;

  connection.query(deleteProjectQuery, [req.params.taskId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(
      ` ${result.affectedRows} row deleted.ID: ${req.params.taskId}`
    );
    res.status(200).json(result);
  });
}
exports.getTaskByProjectId = (req, res) => {
  const getTaskQuery = `SELECT empName, empSurname, taskID, taskName, taskStatus, taskEndDate  FROM Tasks JOIN Projects ON Tasks.projectID = Projects.projID JOIN Employees ON Tasks.taskAttendedId = Employees.empID WHERE projectID = ?`;

  connection.query(getTaskQuery, [req.params.projectID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(`Tasks: ${result}`)
    res.status(200).json(result);
  });
}

exports.updateTask = (req, res) => {
  const { taskName, taskStatus } = req.body;
  const projectId = req.headers.projectid;
  const updateTaskQuery = `UPDATE Tasks SET taskName = ?, taskStatus = ? WHERE taskID = ?`;

  connection.query(updateTaskQuery, [taskName, taskStatus, req.params.taskID], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      console.log(` ${result.affectedRows} row updated.ID: ${req.params.taskID}`);

      if (taskStatus === 'Tamamlanmış') {
          checkAndUpdateProjectStatus(projectId, res, () => {
              res.status(200).json(result);
          });
      } else {
          res.status(200).json(result);
      }
  });
};

function checkAndUpdateProjectStatus(projectId, res, callback) {
  const checkTasksQuery = `SELECT COUNT(*) AS remainingTasks FROM Tasks WHERE projectID = ? AND taskStatus != 'Tamamlanmış'`;

  connection.query(checkTasksQuery, [projectId], (err, tasksResult) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      if (tasksResult[0].remainingTasks === 0) {
          const updateProjectQuery = `UPDATE Projects SET projStatus = 'Tamamlanmış' WHERE projID = ?`;
          connection.query(updateProjectQuery, [projectId], (err, updateResult) => {
              if (err) {
                  console.error(err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  return;
              }
              callback();
          });
      } else {
          callback();
      }
  });
}
exports.getTaskById = (req, res) =>{
  const getTaskQuery = `
  SELECT 
    Tasks.taskID, 
    Tasks.taskName, 
    Tasks.projectID, 
    Tasks.taskStartDate, 
    Tasks.taskEndDate,
    Tasks.taskAttenderID,
    Attender.empName AS attenderEmpName, 
    Attender.empSurname AS attenderEmpSurname,
    Tasks.taskAttendedId,
    Attended.empName AS attendedEmpName, 
    Attended.empSurname AS attendedEmpSurname,
    Tasks.taskDesc,
    Tasks.taskStatus
  FROM 
    Tasks 
  JOIN Employees AS Attender ON Tasks.taskAttenderID = Attender.empID
  JOIN Employees AS Attended ON Tasks.taskAttendedId = Attended.empID
  WHERE 
    taskID = ?`;
  connection.query(getTaskQuery, [req.params.taskID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).json(result[0]);
  });

}

exports.getTaskStatusCount= (req, res) => {

  let getTasksQuery = `
  SELECT a.taskStatus, COUNT(*) AS statusCount
  FROM Tasks a 
  WHERE a.taskAttendedId = ?
  GROUP BY a.taskStatus
`;

  connection.query(getTasksQuery,[req.params.empID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(200).json(result)
  });
}

const getTasksPassedDeadlineQuery = `SELECT taskID, taskName, taskStatus, taskStartDate, taskEndDate FROM Tasks WHERE taskEndDate < CURDATE()`;

const updateTaskPassedDeadlineQuery = `UPDATE Tasks SET taskEndDate = CURDATE(), taskEndDate = DATE_ADD(taskEndDate, INTERVAL 1 DAY), taskStatus = 'Gecikmiş', taskDelayedDays = DATEDIFF(CURDATE(), taskDefaultEndDate) WHERE taskID = ?`;

exports.updateTasksPassedDeadline = (req, res) => {
  connection.query(getTasksPassedDeadlineQuery, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        result.forEach((row) => {
            connection.query(updateTaskPassedDeadlineQuery, [row.taskID], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Task updated. ID: ${row.taskID}`);
                }
            });
        });
    }
})
}