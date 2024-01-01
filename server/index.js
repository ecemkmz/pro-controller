const express = require("express");
const dotenv = require("dotenv");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

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

connection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantısı hatası:', err);
    process.exit(1);
  } else {
    console.log('MySQL sunucusuna bağlandı!');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı!`);
});

async function registerPerson(person) {
  const hash = await bcrypt.hash(person.password, saltRounds);

  const registerQuery = `INSERT INTO Employees (empName, empSurname, empEmail, empRole, empPassword) 
                         VALUES (?, ?, ?, ?, ?)`;

  await connection.query(registerQuery, [person.name, person.surname, person.email, person.position, hash]);

}

async function getUserPassword() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT empPassword FROM Employees WHERE empName = ? empSurname = ?", [Person.name, Person.surname], (err, result) => {
      if (err) reject(err);
      resolve(result[0].empPassword);
    });
  });
}

async function validateUserPassword() {
  try {
    const hash = await getUserPassword();
    const result = await bcrypt.compare(Person.password, hash);
    console.log(result);
  } catch (error) {
    console.error('Password validation error:', error);
  }
}

// Complete user registration
app.post('/api/register', async (req, res) => {
  console.log(` [${req.body.email}] için Kayıt isteği alındı.`);

  const name = req.body.ad;
  const surname = req.body.soyad;
  const email = req.body.email;
  const position = req.body.position;
  const password = req.body.password;

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
      } else {
        const insertQuery = `
          INSERT INTO Employees (empName, empSurname, empEmail, empRole, empPassword)
          VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertQuery, [name, surname, email, position, hashedPassword], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          console.log('Kullanıcı başarıyla kaydedildi.');
          res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
        });
      }
    });
  } catch (error) {
    console.error('Kayıt sırasında bir hata oluştu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Complete user login
app.post('/api/login', async (req, res) => {
  const checkUserQuery = `
    SELECT empPassword FROM Employees WHERE empEmail = ?
  `;

  console.log(`${req.body.email} kullanıcısı için giriş isteği alındı.`);

  const email = req.body.email.replace(/\n$/, "");
  const password = req.body.password;

  try {
    // Mail adresini kontrol et
    const user = await connection.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        console.error("Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.");
        res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.' });
      } else {
        if (result.length === 0) {
          console.error("Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.");
          res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.' });
        } else {
          // Parolayı kontrol et
          if (bcrypt.compareSync(password, result[0].empPassword)) {
            // Giriş başarılı, isteğe bağlı olarak ek işlemler yapabilirsiniz.
            res.status(200).json({ message: 'Kullanıcı girişi başarılı.' });
          } else {
            console.error("Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.");
            res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre yanlış. Lütfen bilgilerinizi kontrol ediniz.' });
          }
        }
      }
    });
  } catch (error) {
    console.error('Giriş sırasında hata oluştu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





process.on('SIGINT', () => {
  connection.end();
  process.exit();
});

