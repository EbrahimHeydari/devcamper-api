const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')

// Load env vars
dotenv.config({ path: './config/config.env' })
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV

// Connect to database
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')

const app = express()

// Body Parser
app.use(express.json())

// Dev Logging midlleware
if (NODE_ENV === 'development')
  app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

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