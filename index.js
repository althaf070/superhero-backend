import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectToDb } from './db/connect.js';
import userRoutes from './routes/userRoutes.js'
import grievenceRoutes from './routes/grievenceRoute.js'
dotenv.config()


const app = express();
const PORT = process.env.PORT || 3000

app.use(cors({origin:'http://localhost:5173',credentials: true}))
app.use(express.json());    
app.use(cookieParser())

app.use('/api',userRoutes)
app.use('/api',grievenceRoutes)


app.listen(PORT,()=> {
    connectToDb()
    console.log("Server running on port 3000");
})
