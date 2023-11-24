import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import routes from './routes'
import db from './config/db'
import cors from './config/cors'
const app = express()

app.use(cors())
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/', routes())

db.connect()

const PORT = process.env.SERVER_PORT || 8000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
