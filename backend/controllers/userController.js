const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

// This code does not auto login the user after registration
// Check out the code in Task-MERN-Auto-Login-After-Registration
// Changes are affected in three .js files
// userController.js (this file), Register.js and Login.js
const registerUser = asyncHandler(async(request, response) => {
    const {name, email, password} = request.body

    // Validation
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

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // The first if will be used if auto login after registration
    // Commented here for reference
    /* if(user) {
        response.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })*/
    if(user) {
        // Just send success message, no token
        response.status(201).json({
            message: 'Registration successful! Please login.',
            email: user.email  // Send back email to pre-fill login form
        })
    } else {
        response.status(400)
        throw new Error('Invalid user data')
    }
})

const loginUser = asyncHandler(async(request, response) => {
    const {email, password} = request.body

    // Check for user email
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
        response.status(401)
        throw new Error('Invalid email or password')
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
}

const getCurrentUser = asyncHandler(async(request, response) => {
    // Debugging
    console.log('User in request:', request.user)
    console.log('Auth header:', request.headers.authorization)

    if (!request.user) {
        response.status(401)
        throw new Error('User not found')
    }

    const user = await User.findById(request.user._id)
    response.status(200).json(user)
})

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
}