/*const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {
    errorHandler
}*/

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    // Format error messages
    let message = err.message
    if (statusCode === 500) {
        message = 'Server error. Please try again later'
    }

    res.json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}