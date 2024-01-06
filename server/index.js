const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function to handle database connection errors
function handleConnectionError(err) {
  if (err) {
    console.error("MySQL connection error: ", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL server!");
  }
}

connection.connect(handleConnectionError);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

// Function to hash and register a new user
async function registerPerson(person) {
  const hash = await bcrypt.hash(person.password, saltRounds);

  const registerQuery = `INSERT INTO Employees (empName, empSurname, empEmail, empRole, empPassword) 
                         VALUES (?, ?, ?, ?, ?)`;

  await connection.query(registerQuery, [
    person.name,
    person.surname,
    person.email,
    person.position,
    hash,
  ]);
}

// Function to retrieve user password from the database
async function getUserPassword(person) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT empPassword FROM Employees WHERE empName = ? AND empSurname = ?",
      [person.name, person.surname],
      (err, result) => {
        if (err) reject(err);
        resolve(result.params ? result[0].empPassword : null);
      }
    );
  });
}

// Function to validate user password
async function validateUserPassword(person) {
  try {
    const hash = await getUserPassword(person);
    const result = await bcrypt.compare(person.password, hash);
    console.log(result);
  } catch (error) {
    console.error("Password validation error:", error);
  }
}

// User registration endpoint
app.post("/api/register", async (req, res) => {
  const { ad: name, soyad: surname, email, position, password } = req.body;

  console.log(`[${email}] Registration request received.`);
  console.log(new Date().toLocaleString());

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const checkMailQuery = `SELECT empEmail FROM Employees WHERE empEmail = ?`;

    connection.query(checkMailQuery, [email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        console.log("Bu mail adresi zaten kayıtlı.");
        res.status(400).json({ error: "Bu mail adresi zaten kayıtlı." });
      } else if (!position) {
        res.status(400).json({ error: "Lütfen pozisyon seçiniz." });
        console.log("Lütfen pozisyon seçiniz.");
      } else {
        const insertQuery = `
          INSERT INTO Employees (empName, empSurname, empEmail, empPosition, empPassword)
          VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(
          insertQuery,
          [name, surname, email, position, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(`Error occurred: ${err.sqlMessage}`);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            console.log("Kullanıcı Eklendi.");
            const tokenUser = { email: email, id: result.insertId }; // Burada, kullanıcının eşsiz bir kimliğini eklemeyi unutmayın
            const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
              expiresIn: "1h", // Token'ın geçerlilik süresi
            });

            // Token'ı yanıt olarak döndür
            res
              .status(201)
              .json({ message: "Kullanıcı başarıyla eklendi.", token });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(
    `------------------------------------\n${email} login request received.`
  );

  const checkUserQuery = `SELECT empID, empPassword FROM Employees WHERE empEmail = ?`;

  try {
    const result = await connection.query(
      checkUserQuery,
      [email],
      (err, result) => {
        const user = result[0];
        if (
          err ||
          user.empPassword.length === 0 ||
          !bcrypt.compareSync(password, user.empPassword)
        ) {
          console.error(
            "Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz."
          );
          res
            .status(401)
            .json({
              error:
                "Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.",
            });
        } else {
          const tokenUser = {
            id: user.empID,
            email: email,
          };

          const token = jwt.sign(
            { id: tokenUser.id, email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res
            .status(200)
            .json({ message: "Giriş Başarılı", token, user: tokenUser });
        }
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Employee list endpoint
app.get("/api/employees", (req, res) => {
  const getEmployeesQuery = `SELECT empID, empName, empSurname, empEmail, empPosition, empImageUrl FROM Employees`;

  connection.query(getEmployeesQuery, (err, result) => {
    currentDate = new Date();
    console.log(
      `[${currentDate.toLocaleString()}] Employee list request received by.`
    );
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(result);
  });
});

// Get Employee Info endpoint
app.get("/api/employees/:id", (req, res) => {
  console.log("Employee info request received.");
  const getEmployeeQuery = `SELECT empName, empSurname, empEmail, empPosition, empAbout FROM Employees WHERE empID = ?`;

  connection.query(getEmployeeQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(result);
    res.status(200).json(result);
  });
});

// Update Employee Info endpoint
app.put("/api/edit/:id", (req, res) => {
  console.log("Employee info update request received.");
  const { empName, empSurname, empEmail, empPosition, empAbout } = req.body;
  const updateEmployeeQuery = `UPDATE Employees SET empName = ?, empSurname = ?, empEmail = ?, empPosition = ?, empAbout = ? WHERE empID = ?`;

  connection.query(
    updateEmployeeQuery,
    [empName, empSurname, empEmail, empPosition, empAbout, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log(
        `Değişiklikler kaydedildi. ${result.affectedRows} satır güncellendi.ID: ${req.params.id}`
      );
      res.status(200).json(result);
    }
  );
});
// Delete Employee endpoint
app.delete("/api/delete/:id", (req, res) => {
  console.log(`Employee delete request received. ID: ${req.params.id}`);
  const deleteEmployeeQuery = `DELETE FROM Employees WHERE empID = ?`;

  connection.query(deleteEmployeeQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(
      `Çalışan silindi. ${result.affectedRows} satır silindi.ID: ${req.params.id}`
    );
    res.status(200).json(result);
  });
});
//List Projects
app.get("/api/projects", (req, res) => {
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
});
//Create Project
app.post("/api/create-project", async (req, res) => {
  const {
    projName,
    startDate,
    endDate,
    description,
    projectStatus,
    creatorID,
  } = req.body;

  try {
    const checkNameQuery = `SELECT projName FROM Projects WHERE projName = ?`;

    connection.query(checkNameQuery, [projName], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        console.log("Bu proje adı zaten kayıtlı.");
        res.status(400).json({ error: "Bu proje adı zaten kayıtlı." });
      } else {
        const insertQuery = `
          INSERT INTO Projects (projName, projStartDate, projEndDate, projDesc, projStatus, projCreatorID)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          insertQuery,
          [projName, startDate, endDate, description, projectStatus, creatorID],
          (err, result) => {
            if (err) {
              console.error(`Error occurred: ${err.sqlMessage}`);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            console.log("Proje Eklendi.");

            // Token'ı yanıt olarak döndür
            res.status(201).json({ message: "Proje başarıyla eklendi." });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Delete Project
app.delete("/api/delete-project/:id", (req, res) => {
  console.log(`Project delete request received. ID: ${req.params.id}`);
  const deleteProjectQuery = `DELETE FROM Projects WHERE projID = ?`;

  connection.query(deleteProjectQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(
      `Proje silindi. ${result.affectedRows} satır silindi.ID: ${req.params.id}`
    );
    res.status(200).json(result);
  });
});
//Create Task
app.post("/api/create-task", async (req, res) => {
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
});
//List Task
app.get("/api/tasks", (req, res) => {
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
});
//List for id
app.get('/projects/:id', (req, res) => {
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
    console.log(result);
    res.status(200).json(result);
  });
});

//Delete Task
app.delete("/api/delete-task/:id", (req, res) => {
  console.log(`Task delete request received. ID: ${req.params.id}`);
  const deleteProjectQuery = `DELETE FROM Tasks WHERE taskID = ?`;

  connection.query(deleteProjectQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    console.log(
      `Proje silindi. ${result.affectedRows} satır silindi.ID: ${req.params.id}`
    );
    res.status(200).json(result);
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403); // Forbidden
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}
app.get("/employee-info", verifyToken, async (req, res) => {
  const userId = req.user.id; // Kullanıcının ID'si

  // Veritabanı sorgusu
  const query =
    "SELECT empName, empSurname, empEmail, empPosition, empAbout FROM Employees WHERE empId = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Sorgu sırasında hata oluştu:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.json(results[0]);
  });
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  connection.end();
  process.exit();
});
