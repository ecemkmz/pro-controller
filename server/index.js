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
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const authRoutes = require('./routes/authRoutes');

app.use('/api', authRoutes);
app.use('/api', employeeRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  connection.end();
  process.exit();
});
