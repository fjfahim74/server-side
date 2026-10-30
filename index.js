import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_DB_URL);
const db = client.db('project');

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

//request and response
app.get('/', (req, res) => {
    res.send('Hello World from express.js!')
})

app.get('/dashboard', (req, res) => {
    res.send('THis is Dashboard from express')
})
async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.log('MongoDB connection failed:', error);
    }
}

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
