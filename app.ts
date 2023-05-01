import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

if (process.env.NODE_ENV == 'prod') {
  dotenv.config({ path: __dirname + '/.env' })
} else {
  dotenv.config({ path: __dirname + '/config.env' })
}

import dataRoutes from './routes/data.routes'


export const app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

const options = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API v1' })
})

app.use(dataRoutes)

app.listen(app.get('port'), () => {
  console.log('Server on Port: ' + process.env.PORT)
})
