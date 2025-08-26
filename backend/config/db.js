import mongoose from 'mongoose'

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://luciferjalwaniya702:TYZNdRJXcAq8mJAv@cluster0.oad4yut.mongodb.net/Tasky')
    // await mongoose.connect('mongodb://localhost:27017/Tasky')
    .then(() => console.log('DB connected'));
}