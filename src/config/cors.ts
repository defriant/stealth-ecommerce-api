import corsInstance from 'cors'

const allowedOrigins = ['*']

const cors = () =>
    corsInstance({
        origin: (origin, callback) => {
            if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') return callback(null, '*')
            if (!origin || allowedOrigins.indexOf(origin) !== -1) return callback(null, true)
            return callback(new Error('Not allowed by CORS'))
        },
    })

export default cors
