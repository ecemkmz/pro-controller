const express = require('express');
const router = express.Router();
const projectController = require("../controllers/projectController")

// Project list
router.get('/projects', projectController.getProjects );

// Get Project by CreatorId
router.get('/projects/:id',projectController.getProjectByCreatorId);

// Create Project
router.post('/create-project', projectController.createProject);

// Delete Project
router.delete('/delete-project/:id', projectController.deleteProject);
// Get Project by taskAttendedUserId
router.get('/projects/taskAttendedUser/:id', projectController.getProjectByTaskAttendedId)

//Get Project by Id
router.get('/projectDetail/:projectID',projectController.getProjectById)

//Update Project By Id
router.put('/EditProject/:projectID',projectController.updateProject)

//Update Status And Deadlines of Projects That Passed Deadline
router.get('/projects-passed-deadline', projectController.updateProjectsPassedDeadline);

module.exports = router;