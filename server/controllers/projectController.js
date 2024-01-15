const connection = require('../config/dbConfig');

//List Project
exports.getProjects = (req, res) => {
  const { sortKey, sortOrder, projectStatus } = req.query;

  let getProjectsQuery = `
  SELECT 
  p.projID, 
  p.projName, 
  p.projStatus, 
  p.projStartDate, 
  p.projEndDate, 
  p.projDesc, 
  p.projCreatorID,
  p.projDelayedDays,
  e.empName AS projCreatorName,
  e.empSurname AS projCreatorSurname
FROM Projects p
LEFT JOIN Employees e ON p.projCreatorID = e.empID
  `;

  // Apply sorting
  if (sortKey && sortOrder) {
    getProjectsQuery += ` ORDER BY ${sortKey} ${sortOrder}`;
  }

  connection.query(getProjectsQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Apply filtering
    if (projectStatus) {
      const filteredProjects = result.filter(
        (project) => project.projStatus === projectStatus
      );
      res.status(200).json(filteredProjects);
    } else {
      res.status(200).json(result);
    }
  });
}

//List PrpjectBycreatorId
exports.getProjectByCreatorId = (req, res) => {

  let getProjectsQuery = `
  SELECT 
  p.projID, 
  p.projName, 
  p.projStatus, 
  p.projStartDate, 
  p.projEndDate, 
  p.projDesc, 
  p.projCreatorID,
  e.empName AS projCreatorName,
  e.empSurname AS projCreatorSurname
FROM Projects p
JOIN Employees e ON p.projCreatorID = e.empID WHERE p.projCreatorID=?
  `;

  connection.query(getProjectsQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(result);
    res.status(200).json(result)
  });
}

//Create Project
exports.createProject = async (req, res) => {
  const {
    projName,
    startDate,
    endDate,
    description,
    projectStatus,
    creatorID,
  } = req.body;
  if (!projName || projName.trim() === '') {
    return res.status(400).json({ error: "Proje ismi boş bırakılamaz." });
  }

  try {
    const checkNameQuery = `SELECT projName FROM Projects WHERE projName = ?`;

    connection.query(checkNameQuery, [projName], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        res.status(400).json({ error: "Bu proje adı zaten kayıtlı." });
      } else {
        const insertQuery = `
          INSERT INTO Projects (projName, projStartDate, projEndDate, projDesc, projStatus, projCreatorID, projDefaultEndDate)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          insertQuery,
          [projName, startDate, endDate, description, projectStatus, creatorID, endDate],
          (err, result) => {
            if (err) {
              console.error(`Error occurred: ${err.sqlMessage}`);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            res.status(201).json({ message: "Proje başarıyla eklendi." });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
//Delete Project 

exports.deleteProject = (req, res) => {
  const projectId = req.params.id;

  const deleteTasksQuery = `DELETE FROM Tasks WHERE projectID = ?`; 

  connection.query(deleteTasksQuery, [projectId], (err, taskDeleteResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting project tasks' });
    }


    const deleteProjectQuery = `DELETE FROM Projects WHERE projID = ?`;

    connection.query(deleteProjectQuery, [projectId], (err, projectDeleteResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error deleting project' });
      }
      console.log(`Project deleted. ID: ${projectId}`);
      return res.status(200).json({taskDeleteResult, projectDeleteResult});
    });
  });
};


exports.getProjectByTaskAttendedId = (req, res) => {
  let getProjectsQueryById = `SELECT 
  p.projID,
  p.projName, 
  p.projStatus,
  p.projStartDate,
  p.projEndDate,
  COUNT(a.taskID) as taskCount, 
  e.empName, 
  e.empSurname
FROM 
  Tasks a 
JOIN 
  Projects p ON a.projectID = p.projID 
JOIN 
  Employees e ON p.projCreatorID = e.empId 
WHERE 
  a.taskAttendedId = ?
GROUP BY 
  p.projID, p.projName, p.projStatus, p.projStartDate, p.projEndDate, e.empName, e.empSurname`;

  connection.query(getProjectsQueryById, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(result);
  });
}

exports.getProjectById = (req, res) =>{
  const getProjectQuery = `SELECT projName, projStatus, projStartDate, projEndDate, empName, empSurname FROM Projects JOIN Employees ON Projects.projCreatorID = Employees.empID WHERE projID = ?`;
  connection.query(getProjectQuery, [req.params.projectID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).json(result[0]);
  });
}

exports.updateProject = (req, res) => {
  const { projName, projStatus} = req.body;
  const updateProjectQuery = `UPDATE Projects SET projName = ?, projStatus = ? WHERE projID = ?`;

  connection.query(updateProjectQuery, [projName, projStatus,  req.params.projectID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(`${result.affectedRows} row updated.ID: ${req.params.projectID}`);
    res.status(200).json(result);
  });
}
//Get list of projects that passed deadline
const getProjectsPassedDeadlineQuery = `SELECT projID, projName, projStatus, projStartDate, projEndDate FROM Projects WHERE projEndDate < CURDATE()`;
//Update projects that passed deadline
const updateProjectPassedDeadlineQuery = `UPDATE Projects SET projEndDate = CURDATE(), projEndDate = DATE_ADD(projEndDate, INTERVAL 1 DAY), projStatus = 'Gecikmiş', projDelayedDays = DATEDIFF(CURDATE(), projDefaultEndDate) WHERE projID = ?`;

exports.updateProjectsPassedDeadline = (req, res) => {
  connection.query(getProjectsPassedDeadlineQuery, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        result.forEach((row) => {
            connection.query(updateProjectPassedDeadlineQuery, [row.projID], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Project updated. ID: ${row.projID}`);
                }
            });
        });
    }
})
}

exports.getProjectForAddTask = (req, res) => {
  const userId = req.headers.userid; // Retrieve the userId from request headers
  const { sortKey, sortOrder, projectStatus } = req.query;

  let getProjectsQuery = `
  SELECT 
  p.projID, 
  p.projName, 
  p.projStatus, 
  p.projStartDate, 
  p.projEndDate, 
  p.projDesc, 
  p.projCreatorID,
  p.projDelayedDays,
  e.empName AS projCreatorName,
  e.empSurname AS projCreatorSurname
FROM Projects p
LEFT JOIN Employees e ON p.projCreatorID = e.empID
WHERE p.projCreatorID = ? `;

  // Apply sorting
  if (sortKey && sortOrder) {
    getProjectsQuery += ` ORDER BY ${sortKey} ${sortOrder}`;
  }

  connection.query(getProjectsQuery, [userId], (err, result) => { // Pass the userId to the query
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Apply filtering based on project status
    let filteredProjects = result;
    if (projectStatus) {
      filteredProjects = result.filter(
        (project) => project.projStatus === projectStatus
      );
    }
    res.status(200).json(filteredProjects);
  });
};
