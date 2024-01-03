const express = require("express");
const dotenv = require("dotenv");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
    console.error('MySQL connection error: ', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL server!');
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

  await connection.query(registerQuery, [person.name, person.surname, person.email, person.position, hash]);
}

// Function to retrieve user password from the database
async function getUserPassword(person) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT empPassword FROM Employees WHERE empName = ? AND empSurname = ?", [person.name, person.surname], (err, result) => {
      if (err) reject(err);
      resolve(result.params ? result[0].empPassword : null);
    });
  });
}

// Function to validate user password
async function validateUserPassword(person) {
  try {
    const hash = await getUserPassword(person);
    const result = await bcrypt.compare(person.password, hash);
    console.log(result);
  } catch (error) {
    console.error('Password validation error:', error);
  }
}

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { ad: name, soyad: surname, email, position, password } = req.body;

  console.log(`[${email}] Registration request received.`);
  console.log(new Date().toLocaleString());

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const checkMailQuery = `SELECT empEmail FROM Employees WHERE empEmail = ?`;

    connection.query(checkMailQuery, [email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (result.length > 0) {
        console.log("Bu mail adresi zaten kayıtlı.");
        res.status(400).json({ error: 'Bu mail adresi zaten kayıtlı.' });
      } else if (!position) {
        res.status(400).json({ error: 'Lütfen pozisyon seçiniz.' });
        console.log("Lütfen pozisyon seçiniz.");
      } else {
        const insertQuery = `
          INSERT INTO Employees (empName, empSurname, empEmail, empPosition, empPassword)
          VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertQuery, [name, surname, email, position, hashedPassword], (err, result) => {
          if (err) {
            console.error(`Error occurred: ${err.sqlMessage}`);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          console.log('Kullanıcı Eklendi.');
          res.status(201).json({ message: 'Kullanıcı başarıyla eklendi.' });
        });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(`------------------------------------\n${email} login request received.`);

  const checkUserQuery = `SELECT empID, empName, empSurname, empPosition, empPassword FROM Employees WHERE empEmail = ?`;

  try {
    const user = await connection.query(checkUserQuery, [email], (err, result) => {
      
      if (err || result[0].empPassword.length === 0 || !bcrypt.compareSync(password, result[0].empPassword)) {
        console.error("Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.");
        res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.' });
      } else {
        const user = {
          id: result[0].empID,
          name: result[0].empName,
          surname: result[0].empSurname,
          position: result[0].empPosition,
          email: email
        };

        const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        res.status(200).json({ message: 'Giriş Başarılı', token, user });
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Employee list endpoint
app.get('/api/employees', (req, res) => {
  const getEmployeesQuery = `SELECT empID, empName, empSurname, empEmail, empPosition FROM Employees`;

  connection.query(getEmployeesQuery, (err, result) => {
    currentDate = new Date();
    console.log(`[${currentDate.toLocaleString()}] Employee list request received by.`);
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).json(result);
  });
});

// Get Employee Info endpoint
app.get('/api/employees/:id', (req, res) => {
  const getEmployeeQuery = `SELECT empName, empSurname, empEmail, empPosition FROM Employees WHERE empID = ?`;

  connection.query(getEmployeeQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(result);
    res.status(200).json(result);
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
