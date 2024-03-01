const express = require('express');
const router = express.Router();
const projectController = require("../controllers/projectController")
const verifyAdmin = require("../middleware/verifyAdmin")

router.get('/projects', projectController.getProjects );

router.get('/projects/:id',projectController.getProjectByCreatorId);

router.post('/create-project', projectController.createProject);

router.delete('/delete-project/:id', verifyAdmin, projectController.deleteProject);

router.get('/projects/taskAttendedUser/:id', projectController.getProjectByTaskAttendedId)

router.get('/projectDetail/:projectID',projectController.getProjectById)

router.put('/EditProject/:projectID',verifyAdmin, projectController.updateProject)

// router.get('/projects-passed-deadline', projectController.updateProjectsPassedDeadline);

router.get('/AddTask/Projects',projectController.getProjectForAddTask)

module.exports = router;