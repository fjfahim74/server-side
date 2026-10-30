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

// Create New Event
app.post('/api/events', async (req, res) => {
    const data = req.body;

    data.date = new Date(data.date);
    data.createdAt = new Date();

    const result = await eventsCollection.insertOne(data);

    res.send(result);
});

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


app.get('/api/events/home', async (req, res) => {
    const result = await eventsCollection
        .find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(6)
        .toArray();

    res.send(result);
});

// Get Single Event
app.get('/api/events/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid event ID' });
    }

    const result = await eventsCollection.findOne({
        _id: new ObjectId(id),
    });

    if (!result) {
        return res.status(404).send({ message: 'Event not found' });
    }

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