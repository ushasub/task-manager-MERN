const asyncHandler = require('express-async-handler')
const Task = require('../models/taskModel')

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (request, response) => {
    const tasks = await Task.find({ user: request.user.id })
    response.status(200).json(tasks)
})

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (request, response) => {
    if(!request.body.text) {
        response.status(400)
        throw new Error('Please add a text field')
    }

    const task = await Task.create({
        text: request.body.text,
        user: request.user.id
    })

    response.status(200).json(task)
})

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (request, response) => {
    const task = await Task.findById(request.params.id)

    if(!task) {
        response.status(404)
        throw new Error('Task not found')
    }

    // Check for user
    if(!request.user) {
        response.status(401)
        throw new Error('User not found')
    }

    // Make sure logged in user matches task user
    if(task.user.toString() !== request.user.id) {
        response.status(401)
        throw new Error('User not authorized')
    }

    const updatedTask = await Task.findByIdAndUpdate(
        request.params.id, 
        request.body, 
        { new: true }
    )

    response.status(200).json(updatedTask)
})

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (request, response) => {
    const task = await Task.findById(request.params.id)

    if(!task) {
        response.status(404)
        throw new Error('Task not found')
    }

    // Check for user
    if(!request.user) {
        response.status(401)
        throw new Error('User not found')
    }

    // Make sure logged in user matches task user
    if(task.user.toString() !== request.user.id) {
        response.status(401)
        throw new Error('User not authorized')
    }

    await task.deleteOne()

    response.status(200).json({ id: request.params.id })
})

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}