const connection = require('../config/dbConfig');
// Employee list endpoint
exports.getEmployees = (req, res) => {
  const getEmployeesQuery = `SELECT empID, empName, empSurname, empEmail, empPosition, empImageUrl FROM Employees`;

  connection.query(getEmployeesQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(result);
  });
};

// Get Employee Info endpoint
exports.getEmployeeInfo = (req, res) => {
  const getEmployeeQuery = `SELECT empName, empSurname, empEmail, empPosition, empAbout FROM Employees WHERE empID = ?`;

  connection.query(getEmployeeQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(result);
  });
};

// Update Employee Info endpoint
exports.updateEmployeeInfo = (req, res) => {
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
      res.status(200).json(result);
    }
  );
};

// Delete Employee endpoint
exports.deleteEmployee = (req, res) => {
  const deleteEmployeeQuery = `DELETE FROM Employees WHERE empID = ?`;

  connection.query(deleteEmployeeQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(result);
  });
};

//
exports.getLoginEmployeeInfo = async (req, res) => {
  const userId = req.user.id;

  const query = "SELECT empName, empSurname, empEmail, empPosition, empAbout FROM Employees WHERE empId = ?";
  
  connection.query(query, [userId], (err, results) => {
      if (err) {
          console.error("Sorgu sırasında hata oluştu:", err);
          res.status(500).send("Server Error");
          return;
      }
      res.json(results[0]);
  });
};
