const express = require("express");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "ProController",
  user: "root",
  password: "mandalinaxyZ12",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
});
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const insertEmp =
  "INSERT INTO employees (empID, empName, empSurname, empEmail, empPosition, empPassword";

app.post("/addEmp", (req, res) => {
  const id = req.body.id;
  const name = req.body.ad;
  const surname = req.body.soyad;
  const email = req.body.email;
  const position = req.body.position;
  const password = req.body.password;

  const qr = `INSERT INTO employees (empID, empName, empSurname, empEmail, empPosition, empPassword) 
  VALUES ('${id}', '${name}', '${surname}', '${email}', '${position}', '${password}')`;

  connection.query(qr, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("Kayıt başarıyla oluşturuldu!");
    }
  });
});

const id = 3;
const name = "Alper";
const surname = "Karaca";
const email = "karacaalper41@procontroller.com";
const position = "Backend Dev.";
const password = "onikiparmakbagirsagi12";


