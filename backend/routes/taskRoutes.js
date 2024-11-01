const express = require('express')
const router = express.Router()
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController')

const { protect } = require('../middleware/authMiddleware')

// Protect all task routes
router.use(protect)

// Routes for tasks
router.route('/').get(getTasks).post(createTask)
router.route('/:id').put(updateTask).delete(deleteTask)

module.exports = router