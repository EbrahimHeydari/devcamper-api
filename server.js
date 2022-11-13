const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const ExpressMongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')

// Load env vars
dotenv.config({ path: './config/config.env' })
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV

// Connect to database
connectDB()

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const hpp = require('hpp')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const app = express()

// Body Parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev Logging midlleware
if (NODE_ENV === 'development')
  app.use(morgan('dev'))

// File uploading
app.use(fileUpload())

// Sanitize data
app.use(ExpressMongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS Atacks
app.use(xss())

// Enable CORS
app.use(cors())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
})

app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

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