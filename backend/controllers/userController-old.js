const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// Register new user
// POST /api/users
const registerUser = asyncHandler(async(request, response) => {
    console.log('Register route hit')
    console.log('Request body:', request.body)
    const {name, email, password} = request.body

    // Check if all fields exist
    if(!name || !email || !password) {
        response.status(400)
        throw new Error('All fields are necessary!')
    }

    // Check if user exists
    const userExists = await User.findOne({email})
    if(userExists) {
        response.status(400)
        throw new Error('User already exists')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        response.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        response.status(400)
        throw new Error('Invalid user data')
    }
})

// Login user
// POST /api/users/login
const loginUser = asyncHandler(async(request, response) => {
    const {email, password} = request.body

    // Find user by email
    const user = await User.findOne({email})

    // Check user and password match
    if(user && (await bcrypt.compare(password, user.password))) {
        response.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        response.status(400)
        throw new Error('Invalid credentials')
    }
})

// Get current user
// GET /api/users/current
const getCurrentUser = asyncHandler(async(request, response) => {
    const { _id, name, email } = await User.findById(request.user.id)
    
    response.status(200).json({
        id: _id,
        name,
        email
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
}