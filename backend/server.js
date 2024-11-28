// Import Express and CORS
const express = require('express');     // Import express library (server creation, route definition, handles HTTP requests)
const cors = require('cors');           // Import cross-origin resource sharing library (allows backend to frontend comms on a diff domain or port)
const pool = require('./db');           // Import the connection pool from db.js
const bcrypt = require('bcrypt');

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

// createManager function (POST method)
app.post('/create-manager', async (req, res) => {
    const {sin, name, phone, address, departmentid, email, password} = req.body;          // Get parameters from request body
    const queryText = `
        SELECT *
        FROM MANAGER
        WHERE sin = $1 OR email = $2
        `;                     // Parameterized query to avoid SQL injections                      
    const values = [sin, email]; // Parameterized username to avoid SQL injections
    const insertQuery = `
        INSERT INTO MANAGER (sin, name, phone, address, departmentid, email, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING sin;
    `;
    try {
        // 1. Sanitize user inputs
        if (!sin || !address || !email || !name || !password) {
            return res.status(400).json({error: 'SIN, name, address, email and password are required'}); 
        }
        // 2. Hash the password using bcrypt
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds); 

        // 3. Check if SIN or email already exists
        const result = await pool.query(queryText, values); 

        if (result.rows.length > 0) { // If username exists (there will be a database object in result)
            return res.status(400).json({error: 'SIN or E-mail already exists'});
        }

        insertValues = [sin, name, phone, address, departmentid, email, hashedPassword]
        // 4. Insert a new manager if the username doesn't exist
        const insertResult = await pool.query(insertQuery, insertValues);

        // 5. Respond with success
        res.status(201).json({
            message: 'Manager account created successfully',
            managerId: insertResult.rows[0].sin
        });
    } catch (error) {
        console.error('Error creating manager', error.message);
        res.status(500).json({error: 'Failed to create Manager'});
    }
});

// Start the server
app.listen(PORT, () => {                    // PORT to listen for requests
    console.log(`Server is running on http://localhost:${PORT}`);
});