const express = require("express");
const dotenv = require("dotenv");
const mysql = require('mysql');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log(connection.state);
connection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantısı hatası:', err);
  } else {
    console.log('MySQL sunucusuna bağlandı!');

  }
});
console.log(connection.state);




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


