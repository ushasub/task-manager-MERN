const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (request, response, next) => {
    let token

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = request.headers.authorization.split(' ')[1]
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // Get user from token
            const user = await User.findById(decoded.id).select('-password')
            
            if (!user) {
                response.status(401)
                throw new Error('User not found')
            }

            request.user = user
            next()
        } catch (error) {
            console.log('Auth Error:', error)
            response.status(401)
            throw new Error('Not authorized')
        }
    } else {
        response.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }