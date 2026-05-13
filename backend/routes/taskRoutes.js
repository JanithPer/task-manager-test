const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { authorizeRole } = require('../middleware/roleMiddleware');

router.post('/', authorizeRole('Admin', 'User'), createTask);
router.get('/', authorizeRole('Admin', 'User'), getTasks);
router.put('/:id', authorizeRole('Admin'), updateTask);
router.patch('/:id/status', authorizeRole('Admin', 'User'), updateTaskStatus);
router.delete('/:id', authorizeRole('Admin'), deleteTask);

module.exports = router;
