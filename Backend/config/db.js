import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://pratikshap:s8m5XABWUUxiFG9C@taskpro.f8ncpkw.mongodb.net/?appName=TaskPro')
    .then(() => console.log('Database Connected'));
}    