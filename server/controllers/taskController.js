const connection = require('../config/dbConfig');

exports.getTasks = (req, res) => {
  const { sortKey, sortOrder, taskStatus } = req.query;

  let getTasksQuery = `
    SELECT a.taskID,a.taskName, a.taskAttendedId, a.projectID, a.taskStatus, a.taskStartDate, a.taskEndDate, a.taskDesc, p.projName, e.empName, e.empSurname
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
    console.log(result);

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

  try {
    const checkNameQuery = `SELECT taskName FROM Tasks WHERE taskName = ?`;

    connection.query(checkNameQuery, [taskName], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        console.log("Bu görev adı zaten kayıtlı.");
        res.status(400).json({ error: "Bu görev adı zaten kayıtlı." });
      } else {
        const insertQuery = `
          INSERT INTO Tasks (taskName ,projectID, taskAttendedId,taskAttenderID, taskStartDate, taskEndDate, taskDesc, taskStatus)
          VALUES (?, ?, ?, ?, ?, ?,?,?)
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
          ],
          (err, result) => {
            if (err) {
              console.error(`Error occurred: ${err.sqlMessage}`);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            console.log("Görev Eklendi.");

            // Token'ı yanıt olarak döndür
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
  console.log(`Task delete request received. ID: ${req.params.taskId}`);
  const deleteProjectQuery = `DELETE FROM Tasks WHERE taskID = ?`;

  connection.query(deleteProjectQuery, [req.params.taskId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(
      `Proje silindi. ${result.affectedRows} satır silindi.ID: ${req.params.taskId}`
    );
    res.status(200).json(result);
  });
}
exports.getTaskByProjectId = (req, res) => {
  console.log("Task list request received.", req.params.projectID);
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