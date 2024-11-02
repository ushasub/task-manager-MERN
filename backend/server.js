const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./connect/database');
const port = process.env.PORT || 8000

connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Add error logging
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tasks', require('./routes/taskRoutes'))

/*app.get('/', (req, res) => {
    res.send('API is running')
})*/

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})