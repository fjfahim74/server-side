import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

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

// Join an Event
app.post('/api/event-joins', async (req, res) => {
    const data = req.body;

    const existingJoin = await eventJoinsCollection.findOne({
        eventId: data.eventId,
        userEmail: data.userEmail,
    });

    if (existingJoin) {
        return res.status(409).send({
            message: 'You have already joined this event!',
        });
    }

    const event = await eventsCollection.findOne({
        _id: new ObjectId(data.eventId),
    });

    if (!event) {
        return res.status(404).send({
            message: 'Event not found',
        });
    }

    data.eventDate = event.date;
    data.eventCategory = event.category;
    data.eventLocation = event.location;

    data.joinedAt = new Date();

    const result = await eventJoinsCollection.insertOne(data);

    res.send(result);
});

// Get Joined Events by User Email
app.get('/api/event-joins/:email', async (req, res) => {
    const email = req.params.email;

    const result = await eventJoinsCollection
        .find({ userEmail: email })
        .sort({ eventDate: 1 })
        .toArray();

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