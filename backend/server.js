// Import Express and CORS
const express = require('express');     // Import express library (server creation, route definition, handles HTTP requests)
const cors = require('cors');           // Import cross-origin resource sharing library (allows backend to frontend comms on a diff domain or port)
const pool = require('./db');           // Import the connection pool from db.js

// Create an instance of express
const app = express();                    // Main object of the server (express instance)
const PORT = process.env.PORT || 5000;    // process.env.PORT allows for dynamic assignment in a production environment 

// Middleware
app.use(cors());            // Allows frontend to make API requests to your backend (http://localhost:5000)
app.use(express.json());    // Middleware to parse JSON data, "understanding JSON payloads"

// Routes (Define a basic route)
app.get('/', (req, res) => {                // Response to a client's GET request
    res.send('Hello from the backend!');
});

// Test route for DB query
app.get('/test-db', async (req, res) => {
    try{
        const result = await pool.query('SELECT NOW()'); // Test query to get the current time
        res.json({message: 'Database connection successful!', time: result.rows[0].now});
    } catch (error) {
        console.error('Database connection error: ', error.message);
        res.status(500).json({error: 'Database connection failed.'});
    }
});

// Start the server
app.listen(PORT, () => {                    // PORT to listen for requests
    console.log(`Server is running on http://localhost:${PORT}`);
});