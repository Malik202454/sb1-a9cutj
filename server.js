const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = req.body;
    const result = await client.db("reservations").collection("reservations").insertOne(reservation);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await client.db("reservations").collection("reservations").find().toArray();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});