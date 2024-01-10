const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../config/dbConfig');

const saltRounds = 10;

// Kullanıcı kaydı için fonksiyon
exports.registerPerson = async (person) => {
  const hash = await bcrypt.hash(person.password, saltRounds);
  const registerQuery = `INSERT INTO Employees (empName, empSurname, empEmail, empRole, empPassword) VALUES (?, ?, ?, ?, ?)`;

  await connection.query(registerQuery, [person.name, person.surname, person.email, person.role, hash]);
};

// Veritabanından kullanıcı şifresini alma
async function getUserPassword(person) {
  return new Promise((resolve, reject) => {
      connection.query("SELECT empPassword FROM Employees WHERE empName = ? AND empSurname = ?", [person.name, person.surname], (err, result) => {
          if (err) reject(err);
          resolve(result[0] ? result[0].empPassword : null);
      });
  });
}

// Kullanıcı şifresini doğrulama
exports.validateUserPassword = async (person) => {
  try {
      const hash = await getUserPassword(person);
      const result = await bcrypt.compare(person.password, hash);
      return result; // Doğrulama sonucunu döndür
  } catch (error) {
      console.error("Password validation error:", error);
      throw error; // Hata durumunda hatayı yukarıya ilet
  }
};

exports.register = async (req, res) => {
  const { name, surname, email, position, password } = req.body;

  if (!name || !surname || !email || !position || !password) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const insertQuery = `
          INSERT INTO Employees (empName, empSurname, empEmail, empPosition, empPassword)
          VALUES (?, ?, ?, ?, ?)
      `;

      connection.query(insertQuery, [name, surname, email, position, hashedPassword], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal Server Error" });
          }

          // Yeni oluşturulan kullanıcının ID'sini alın
          const userId = result.insertId;
          
          // Kullanıcı için bir JWT oluşturun
          const tokenUser = { id: userId, email };
          const token = jwt.sign({ id: tokenUser.id, email }, process.env.JWT_SECRET);

          res.status(201).json({ message: "Kullanıcı başarıyla eklendi.", token, user: tokenUser});
      });
  } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUserQuery = `SELECT empID, empPassword FROM Employees WHERE empEmail = ?`;

        connection.query(checkUserQuery, [email], (err, result) => {
            if (err || result.length === 0) {
                return res.status(401).json({ error: "Kullanıcı bulunamadı veya şifre yanlış." });
            }

            const user = result[0];
            if (!bcrypt.compareSync(password, user.empPassword)) {
                return res.status(401).json({ error: "Kullanıcı bulunamadı veya şifre yanlış." });
            }

            const tokenUser = { id: user.empID, email };
            const token = jwt.sign({ id: tokenUser.id, email }, process.env.JWT_SECRET);

            res.status(200).json({ message: "Giriş Başarılı", token, user: tokenUser });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
