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
router.get('/project/:projectID',projectController.getProjectById)

//Update Project By Id
router.get('/project/:projectID',projectController.updateProject)

module.exports = router;