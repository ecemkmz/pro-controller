const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employeeController")
const verifyToken = require('../middleware/verifyToken');

router.get('/employees', employeeController.getEmployees );

router.get('/employees/:id',employeeController.getEmployeeInfo);

router.put('/edit/:id', employeeController.updateEmployeeInfo);

router.delete('/delete/:id', employeeController.deleteEmployee);

router.get('/employee-info', verifyToken, employeeController.getLoginEmployeeInfo);


module.exports = router;