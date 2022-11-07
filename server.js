const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')

// Load env vars
dotenv.config({ path: './config/config.env' })
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV

// Connect to database
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

const app = express()

// Body Parser
app.use(express.json())

// Dev Logging midlleware
if (NODE_ENV === 'development')
  app.use(morgan('dev'))

// File uploading
app.use(fileUpload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const server = app.listen(
  PORT,
  console.log(`server is running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejection
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red)

  // Close server & exit process
  server.close(() => process.exit(1))
})