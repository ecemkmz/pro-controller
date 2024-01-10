const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employeeController")
const verifyToken = require('../middleware/verifyToken');

// Employee list endpoint
router.get('/employees', employeeController.getEmployees );

// Get Employee Info endpoint
router.get('/employees/:id',employeeController.getEmployeeInfo);

// Update Employee Info endpoint
router.put('/edit/:id', employeeController.updateEmployeeInfo);

// Delete Employee endpoint
router.delete('/delete/:id', employeeController.deleteEmployee);

router.get('/employee-info', verifyToken, employeeController.getLoginEmployeeInfo);


module.exports = router;