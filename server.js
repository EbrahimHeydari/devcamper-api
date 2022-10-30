const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config({ path: './config/config.env' })

// Route files
const bootcamps = require('./routes/bootcamps')

// Load env vars
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV

const app = express()

// Dev Logging midlleware
if (NODE_ENV === 'development')
  app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

app.listen(
  PORT,
  console.log(`server is running in ${NODE_ENV} mode on port ${PORT}`)
)