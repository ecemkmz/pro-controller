const express = require('express');
const router = express.Router();
const  taskController = require("../controllers/taskController");

router.get('/tasks', taskController.getTasks)

router.post('/create-task', taskController.createTask)

router.get('/tasks/:id',taskController.getTaskByTaskAttendedId)

router.delete('/delete-task/:id', taskController.deleteTask)

router.get('/task-list-by-projID/:projectID', taskController.getTaskByProjectId)

module.exports = router