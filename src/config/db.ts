import mongoose, { Error as mongooseError } from 'mongoose'

export const schemaOptions = { timestamps: true, versionKey: false }

export default {
    connect: () => {
        if (process.env.MONGO_URI) {
            mongoose.Promise = Promise
            mongoose
                .connect(process.env.MONGO_URI)
                .then(() => console.log('DB Connected'))
                .catch((err: mongooseError) => console.log(err))
        }
    },
}
