import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import  userRouter  from './routes/user.route.js'
import taskRouter from './routes/task.route.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended :true }));

// connect db
connectDB();

// routes 
app.use('/api/user',userRouter);
app.use('/api/tasks',taskRouter);


app.get('/', (req, res) =>{
    res.send("API WORKING");
})

app.listen(port, ()=>{
    console.log(`Server runing on http://localhost:${port}`);
})