const { Pool } = require('pg'); // Desconstruct pg to get the Pool module only

// Create a connection pool
const pool = new Pool({
    user: 'postgres',           // Replace with PostgreSQL username
    host: 'localhost',          // Database host (Local development)
    database: 'test_backend',     // Database name
    password: 'Aladino',       // Password field
    port: 5432                  // Default PosgreSQL port 
});

// Exports the pool for use in other files
module.exports = pool;