import express from 'express';
import cors from 'cors';
import 'dotenv/config'

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
