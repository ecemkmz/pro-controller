const express = require('express');
const router = express.Router();
const  taskController = require("../controllers/taskController");
const verifyAdmin = require("../middleware/verifyAdmin")

router.get('/tasks', taskController.getTasks)

router.post('/create-task',verifyAdmin, taskController.createTask)

router.get('/tasks/:id',taskController.getTaskByTaskAttendedId)

router.delete('/delete-task/:taskId',verifyAdmin, taskController.deleteTask)

router.get('/task-list-by-projID/:projectID', taskController.getTaskByProjectId)

module.exports = router