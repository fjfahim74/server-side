import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_DB_URL);
const db = client.db('project');
const eventsCollection = db.collection('events');

const eventJoinsCollection = db.collection('eventJoins');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request and Response
app.get('/', (req, res) => {
    res.send('Hello World from express.js!');
});
// Get All Upcoming Events
app.get('/api/events', async (req, res) => {
    const result = await eventsCollection
        .find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .toArray();

    res.send(result);
});

// MongoDB Connection
async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.log('MongoDB connection failed:', error);
    }
}

connectDB();