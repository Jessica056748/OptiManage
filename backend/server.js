// Import Express and CORS
const express = require('express') // Import express library (server creation, route definition, handles HTTP requests)
const cors = require('cors') // Import cross-origin resource sharing library (allows backend to frontend comms on a diff domain or port)
const pool = require('./db') // Import the connection pool from db.js
const bcrypt = require('bcrypt') // Import bcrypt for password hashing
const jwt = require('jsonwebtoken') // Import jwt for authentication handling

// Create an instance of express
const app = express() // Main object of the server (express instance)
const PORT = process.env.PORT || 5000 // process.env.PORT allows for dynamic assignment in a production environment
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // Enable credentials (cookies, etc.)
}
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  // TODO: Uncomment for production with HTTPS
  // secure: true
}
// Middleware
app.use(cors(corsOptions)) // Allows frontend to make API requests to your backend (http://localhost:5000)
app.use(express.json()) // Middleware to parse JSON data, "understanding JSON payloads"

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] // Get authorization header
  const token = authHeader && authHeader.split(' ')[1] // Extract token

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' })
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Attach decoded payload to the request object
    next() // Continue, skipping rest of the code
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' })
  }
}

// Routes (Define a basic route)
app.get('/', (req, res) => {
  // Response to a client's GET request
  res.send('Hello from the backend!')
})

// Test route for DB query
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()') // Test query to get the current time
    res.json({
      message: 'Database connection successful!',
      time: result.rows[0].now,
    })
  } catch (error) {
    console.error('Database connection error: ', error.message)
    res.status(500).json({ error: 'Database connection failed.' })
  }
})

app.post('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'], // Get authorization header
    token = authHeader && authHeader.split(' ')[1] // Extract token

  if (!token)
    return res.status(401).json({ error: 'Access denied. Token missing.' })

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' })
  }
})

/**
 * Clears the jwt token.
 */
app.post('/logout', async (req, res) => {
  res.cookie('jwt', '', { ...cookieOptions, expires: new Date(0) })
  res.status(200).send()
})

// createManager function (POST method)
app.post('/create-manager', async (req, res) => {
  const { sin, name, phone, address, departmentid, email, password } = req.body // Get parameters from request body
  console.log('body:')
  console.log(req.body)
  const queryText = `
        SELECT *
        FROM MANAGER
        WHERE sin = $1 OR email = $2
        ` // Parameterized query to avoid SQL injections
  const values = [sin, email] // Parameterized username to avoid SQL injections
  const insertQuery = `
        INSERT INTO MANAGER (sin, name, phone, address, departmentid, email, password)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING sin;
    `
  const updateDepartmentQuery = `
        UPDATE department
        SET msin = $1
        WHERE departmentid = $2
    `
  try {
    // 1. Sanitize user inputs
    if (!sin || !address || !email || !name || !password) {
      return res
        .status(400)
        .json({ error: 'SIN, name, address, email and password are required' })
    }
    // 2. Hash the password using bcrypt
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 3. Check if SIN or email already exists
    const result = await pool.query(queryText, values)

    if (result.rows.length > 0) {
      // If username exists (there will be a database object in result)
      return res.status(400).json({ error: 'SIN or E-mail already exists' })
    }

    insertValues = [
      sin,
      name,
      phone,
      address,
      departmentid,
      email,
      hashedPassword,
    ]
    // 4. Insert a new manager if the username doesn't exist
    const insertResult = await pool.query(insertQuery, insertValues)

    // 5. Update the department with the manager's sin
    const updateValues = [sin, departmentid]
    await pool.query(updateDepartmentQuery, updateValues)

    // 5. Respond with success
    res.status(201).json({
      message:
        'Manager account created successfully and assigned to department',
      managerId: insertResult.rows[0].sin,
    })
  } catch (error) {
    console.error('Error creating manager', error.message)
    res.status(500).json({ error: 'Failed to create Manager' })
  }
})

// authenticate(email, password) function (POST method)
app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body // Get email and password values from request body

  console.log('email:', email)
  console.log('password:', password)

  // parameterized query to retrieve user by email
  const managerQuery = `
        SELECT 'manager' AS role, *
        FROM manager
        WHERE email = $1
        `
  const employeeQuery = `
        SELECT 'employee' AS role, *
        FROM employee
        WHERE email = $1
        `
  const values = [email]
  try {
    // 1. Sanitize user inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    // 2. Query database to find manager by email, storing full tuple in result
    const managerResult = await pool.query(managerQuery, values)

    // 3. Query the employee table if not found in the manager table
    let user = null
    if (managerResult.rows.length > 0) {
      // If found in manager table
      user = managerResult.rows[0] // Manager tuple
    } else {
      const employeeResult = await pool.query(employeeQuery, values)
      if (employeeResult.rows.length > 0) {
        // If found in employee table
        user = employeeResult.rows[0] // employee tuple
      }
    }

    // 4. Check if user exists
    if (!user) {
      // If user is null
      return res
        .status(400)
        .json({ error: 'Email not found in Manager or Employee records' })
    }

    // 4. Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password) // Returns a boolean stating whether it's a match (T) or not (F)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // 5. Generate a JWT token
    const tokenPayLoad = {
      sin: user.sin,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    const token = jwt.sign(tokenPayLoad, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // 6. Return success message and token (with name in case we want it to say "Welcome, <name>!")
    const { name, role } = user
    res.cookie('jwt', token, cookieOptions)
    res.status(200).json({
      message: 'Authentication successful',
      user: { name, role },
    }) // Object shorthand in case we want to return more values later
  } catch (error) {
    console.error('Error authenticating manager: ', error.message)
    res.status(500).json({ error: 'Failed to authenticate' })
  }
})

// Add employee function
app.post('/add-employee', authenticateToken, async (req, res) => {
  const { role } = req.user // Get role from JWT
  const {
    sin,
    name,
    phone,
    address,
    departmentid,
    email,
    password,
    msin,
    rate,
  } = req.body // Get parameters from request body
  const queryText = `
        SELECT *
        FROM employee
        WHERE sin = $1 OR email = $2
        ` // Parameterized query to avoid SQL injections
  const values = [sin, email] // Parameterized username to avoid SQL injections
  const insertQuery = `
        INSERT INTO employee (sin, name, phone, address, departmentid, email, password, msin, rate)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING sin;
    `
  const managerCheckQuery = `
        SELECT *
        FROM manager
        WHERE sin = $1
        `
  const managerSin = [msin]

  const departmentidQuery = `
        SELECT *
        FROM department
        WHERE departmentid = $1
        `
  const departmentidValue = [departmentid]
  try {
    if (role !== 'manager') {
      return res.status(400).json({ error: 'Only managers can add employees' })
    }

    // Sanitize user inputs
    if (
      !sin ||
      !address ||
      !email ||
      !name ||
      !password ||
      !msin ||
      !rate ||
      !departmentid
    ) {
      return res.status(400).json({
        error:
          'SIN, name, address, email, manager SIN, rate and password are required',
      })
    }
    // Check if manager exists in Schema
    const managerResult = await pool.query(managerCheckQuery, managerSin)
    if (managerResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid Manager SIN' })
    }
    // Check if departmentid exists in Schema
    const departmentidResult = await pool.query(
      departmentidQuery,
      departmentidValue
    )
    if (departmentidResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid department ID' })
    }
    // Hash the password using bcrypt
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Check if SIN or email already exists
    const result = await pool.query(queryText, values)

    if (result.rows.length > 0) {
      // If username exists (there will be a database object in result)
      return res.status(400).json({ error: 'SIN or E-mail already exists' })
    }

    insertValues = [
      sin,
      name,
      phone,
      address,
      departmentid,
      email,
      hashedPassword,
      msin,
      rate,
    ]
    // Insert a new manager if the username doesn't exist
    const insertResult = await pool.query(insertQuery, insertValues)

    // Respond with success
    res.status(201).json({
      message: 'Employee account created successfully',
      employee: {
        sin: insertResult.rows[0].sin,
        name,
        email,
      },
    })
  } catch (error) {
    console.error('Error creating employee', error.message)
    res.status(500).json({ error: 'Failed to create Employee' })
  }
})

// Endpoint for changing user password
app.patch('/change-password', authenticateToken, async (req, res) => {
  const { sin, role } = req.user // Get sin and role from JWT
  const { currentPassword, newPassword, confirmPassword } = req.body // Get passwords from request body

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'New password must match confirmation password' })
    }
    // Select table based on user role
    const table = role === 'manager' ? 'manager' : 'employee' // if role is manager, choose manager, else choose employee

    // Fetch current hashed password from the database
    const query = `SELECT password FROM ${table} WHERE sin = $1`
    const result = await pool.query(query, [sin])

    if (result.rows.length === 0) {
      return res.status(400), json({ error: 'User not found' })
    }

    const hashedPassword = result.rows[0].password

    // Compare current password with hashed password
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword)
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash the new password
    const saltRounds = 12
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update new password in database
    const updateQuery = `UPDATE ${table} SET password = $1 WHERE sin = $2`
    await pool.query(updateQuery, [newHashedPassword, sin])

    res.status(200).json({ message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Error changing password: ', error.message)
    res.status(500).json({ error: 'Failed to update password.' })
  }
})

// addRequest() function
app.post('/add-request', authenticateToken, async (req, res) => {
  const { sin } = req.user // Extract sin from req.user (after token validity)
  const { requestId, week, day, type } = req.body // Extract parameters from request body

  // Validation queries
  const toSinQuery = `
        SELECT msin
        FROM employee
        WHERE sin = $1
        `
  try {
    if (!week || !day || !type) {
      return res
        .status(400)
        .json({ error: 'Week, day, and type are required.' })
    }
    // Query database for the manager SIN (msin)
    const result = await pool.query(toSinQuery, [sin])
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Employee SIN not found' })
    }
    // Else we have the row that inlcudes msin
    const toSin = result.rows[0].msin // Manager's sin

    const insertQuery = `
            INSERT INTO request (week, day, fromSin, toSin, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `

    const insertResult = await pool.query(insertQuery, [
      week,
      day,
      sin,
      toSin,
      type,
    ])

    // Create a notification for the manager
    const notificationQuery = `
            INSERT INTO notifications (to_msin, request_id, message)
            VALUES ($1, $2, $3)
            `
    const notificationMessage = `New request from employee ${sin} for ${type}`
    const notificationValues = [toSin, requestId, notificationMessage]
    await pool.query(notificationQuery, notificationValues)

    res
      .status(201)
      .json({ message: 'Request created successfully and manager notified ' })
  } catch (error) {
    console.error('Error adding request: ', error.message)
    res.status(500).json({ error: 'Failed to add request' })
  }
})

// authorizeRequest notifies the sender of the request about the approval/rejection of the request.
app.patch('/authorize-request/:id', authenticateToken, async (req, res) => {
  const requestId = parseInt(req.params.id, 10) // Parse String into int for processing
  const { authorized } = req.body // Authorized is either true or false
  const toSin = req.user.sin // Manager SIN from JWT

  try {
    // Validate request Id
    if (isNaN(requestId)) {
      return res.status(400).json({ error: 'Invalid request ID' })
    }

    // Validate authorized status
    if (typeof authorized !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'Authorized value must be true or false' })
    }

    // Update the authorized status of the request
    const updateRequestQuery = `
            UPDATE request
            SET authorized = $1
            WHERE id = $2 AND tosin = $3
            RETURNING fromsin, type
        `
    const updateResult = await pool.query(updateRequestQuery, [
      authorized,
      requestId,
      toSin,
    ])

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Request not found or you are not authorized to update it',
      })
    }

    const { fromsin, type } = updateResult.rows[0] // Get employee SIN and request type

    // Create a notification for the employee
    const notificationQuery = `
            INSERT INTO notifications (to_sin, request_id, message)
            VALUES ($1, $2, $3)
        ` // If true is authorized, if false or null it's rejected.
    const notificationMessage = `Your request for ${type} has been ${
      authorized ? 'approved' : 'rejected'
    }`
    const notificationValues = [fromsin, requestId, notificationMessage]
    await pool.query(notificationQuery, notificationValues)

    res.status(200).json({
      message: `Request ${
        authorized ? 'approved' : 'rejected'
      } successfully and employee notified.`,
    })
  } catch (error) {
    console.error('Error authorizing request: ', error.message)
    res.status(500).json({ error: 'Failed to authorize request' })
  }
})

// Endpoint for managers to fetch notifications (descending order)
app.get('/notifications/manager', authenticateToken, async (req, res) => {
  const { sin } = req.user // Manager SIN from JWT
  try {
    const query = `
            SELECT id, message, created_at, read
            FROM notifications
            WHERE to_msin = $1
            ORDER BY created_at DESC
        `
    const result = await pool.query(query, [sin])
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching manager notifications: ', error.message)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Endpoint for employees to fetch notifications (descending order)
app.get('/notifications/employee', authenticateToken, async (req, res) => {
  const { sin } = req.user // Employee SIN from JWT
  try {
    const query = `
            SELECT id, message, created_at, read
            FROM notifications
            WHERE to_sin = $1
            ORDER BY created_at DESC
        `
    const result = await pool.query(query, [sin])
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching employee notifications: ', error.message)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Endpoint to mark notifications as READ
app.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id, 10) // Parse String into int for processing

  try {
    // Validate id
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid notification ID' })
    }
    const query = `
            UPDATE notifications
            SET read = TRUE
            WHERE id = $1
        `
    const result = await pool.query(query, [id])

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: 'Notification not found or already marked as read' })
    }
    res.status(200).json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error marking notifications as read: ', error.message)
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

// Endpoint for employees to update their availability
app.post('/availability', authenticateToken, async (req, res) => {
  const { sin } = req.user // Extract SIN from JWT
  const { weekday, emp_start, emp_end } = req.body // Get from request's body

  try {
    // Validate inputs
    if (!weekday || !emp_start || !emp_end) {
      return res
        .status(400)
        .json({ error: 'Weekday, from, and to values are required' })
    }
    // Ensure from is before to
    if (
      new Date(`2024-01-01T${emp_start}Z`) >= new Date(`2024-01-01T${emp_end}Z`)
    ) {
      return res
        .status(400)
        .json({ error: 'Start time must be earlier than end time' })
    }

    // Query to insert or update availability
    const query = `
            INSERT INTO availability (sin, weekday, emp_start, emp_end)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (sin, weekday)
            DO UPDATE SET emp_start = $3, emp_end = $4;
        `

    // Execute query with parameters
    await pool.query(query, [sin, weekday, emp_start, emp_end])

    // Send success response
    res.status(200).json({ message: 'Availability updated successfully' })
  } catch (error) {
    console.error('Error updating availability: ', error.message)
    res.status(500).json({ error: 'Failed to update availability' })
  }
})

// Endpoint for managers to fetch employee availability
app.get('/availability', authenticateToken, async (req, res) => {
  const { weekday, sin: employeeSin } = req.query // Extract filters from query parameters
  const { sin, role } = req.user // Extract manager SIN and role from JWT

  try {
    // Make sure only managers can access this endpoint
    if (role !== 'manager') {
      return res
        .status(403)
        .json({ error: 'Access denied. Only managers can view availability' })
    }

    // Build dynamic query based on filters
    let query = `
            SELECT sin, weekday, emp_start, emp_end
            FROM availability
        `
    const params = []

    if (weekday || employeeSin) {
      query += ' WHERE '
      if (weekday) {
        params.push(weekday)
        query += `weekday = $${params.length}`
      }
      if (employeeSin) {
        params.push(employeeSin)
        if (weekday) query += ' AND '
        query += `sin = $${params.length}`
      }
    }
    query += ' ORDER BY weekday, emp_start'

    // Execute query
    const result = await pool.query(query, params)

    // Send response
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching availability: ', error.message)
    res.status(500).json({ error: 'Failed to fetch availability' })
  }
})

// Endpoint for managers to create a schedule
app.post('/schedule', authenticateToken, async (req, res) => {
  const managerSin = req.user.sin // Extract SIN
  const role = res.user.role // Extract role from JWT
  const { employeeSin, week } = req.body // Extract inputs from request body

  try {
    // Make sure only managers can create schedules
    if (role != 'manager') {
      return res
        .status(403)
        .json({ error: 'Access denied. Only managers can create schedules' })
    }
    // Validate inputs
    if (!week || !employeeSin) {
      return res
        .status(400)
        .json({ error: 'Week and employee SIN are required' })
    }
    // Check if employee exists
    const employeeQuery = `SELECT * FROM employee WHERE sin = $1`
    const employeeResult = await pool.query(employeeQuery, [employeeSin])
    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    // Check employee availability for the week
    const availabilityCheckQuery = `
            SELECT COUNT(*) AS count
            FROM availability
            WHERE sin = $1
        `
    const availabilityResult = await pool.query(availabilityCheckQuery, [
      employeeSin,
    ])
    const hasAvailability = parseInt(availabilityResult.rows[0].count, 10) > 0

    // If employee has availability, ensure they have at least one available time slot for the week.
    if (hasAvailability) {
      const availabilityValidationQuery = `
                SELECT *
                FROM availability
                WHERE sin = $1
            `
      const availabilityValidationResult = await pool.query(
        availabilityValidationQuery,
        [employeeSin]
      )

      if (availabilityValidationResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Employee has no available time slots for the given week',
        })
      }
    }
    // Insert or update the schedule
    const scheduleQuery = `
            INSERT INTO schedule (week, sin, update_sin)
            VALUES ($1, $2, $3)
            ON CONFLICT (week, sin)
            DO UPDATE SET update_sin = $3
        `
    await pool.query(scheduleQuery, [week, employeeSin, managerSin])
    res
      .status(200)
      .json({ message: 'Schedule created or updated successfully' })
  } catch (error) {
    console.error('Error creating/updating schedule: ', error.message)
    res.status(500).json({ error: 'Failed to create/update schedule' })
  }
})

// Mapping weekdays to integers
const weekdayMap = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
}

// Endpoint for managers to create shifts
app.post('/shift', authenticateToken, async (req, res) => {
  const { sin: msin } = req.user // Manager SIN from JWT
  const { day, week, month, esin, length } = req.body // Get data from params

  try {
    // Validate inputs
    if (!day || !week || !month || !esin || !length) {
      return res.status(400).json({
        error: 'All fields (day, week, month, esin, length) are required',
      })
    }
    // Check that day and week are valid integers
    const dayInt = parseInt(day, 10)
    const weekInt = parseInt(week, 10)
    const monthInt = parseInt(month, 10)

    if (isNaN(dayInt) || dayInt < 1 || dayInt > 7) {
      return res.status(400).json({
        error: 'Invalid day value. It must be an integer between 1 and 7',
      })
    }
    if (isNaN(weekInt) || weekInt < 1 || weekInt > 52) {
      return res.status(400).json({
        error: 'Invalid week value. It must be an integer between 1 and 52',
      })
    }
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({
        error: 'Invalid month value. It must be an integer between 1 and 12',
      })
    }
    if (length <= 0) {
      return res
        .status(400)
        .json({ error: 'Shift length must be greater than 0' })
    }

    // Check if employee is scheduled for the given week
    const scheduleCheckQuery = `SELECT * FROM schedule WHERE sin = $1 AND week = $2`
    const scheduleResult = await pool.query(scheduleCheckQuery, [esin, week])

    if (scheduleResult.rows.legth === 0) {
      return res
        .status(400)
        .json({ error: 'Employee is not scheduled for this week' })
    }
    // Map day integer to weekday string
    const weekday = weekdayMap[dayInt]

    // Validate against employee availability
    const availabilityCheckQuery = `
            SELECT emp_start, emp_end
            FROM availability
            WHERE sin = $1 AND weekday = $2
        `
    const availabilityResult = await pool.query(availabilityCheckQuery, [
      esin,
      weekday,
    ])

    if (availabilityResult.rows.length > 0) {
      const { emp_start, emp_end } = availabilityResult.rows[0] // Assign the values from the query

      // Check if the shift length fits within the available time
      const shiftEnd = parseFloat(emp_start) + parseFloat(length)
      if (shiftEnd > emp_end) {
        return res
          .status(400)
          .json({ error: 'Shift exceeds employee availability' })
      }
    }

    // Insert shift into table
    const insertShiftQuery = `
        INSERT INTO shift (day, week, month, msin, esin, length)
        VALUES ($1, $2, $3, $4, $5, $6)
        `
    await pool.query(insertShiftQuery, [day, week, month, msin, esin, length])
    res.status(201).json({ message: 'Shift created scuccessfully' })
  } catch (error) {
    console.error('Error creating shift: ', error.message)
    res.status(500).json({ error: 'Failed to create shift' })
  }
})

// Endpoint for employees to view their shifts
app.get('/shifts', authenticateToken, async (req, res) => {
  const { sin: esin } = req.user // Get employee sin from JWT
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // Get month as an integer (starts from 0)

  try {
    // Query to fetch monthly shifts for employee
    const query = `
            SELECT day, week, month, length
            FROM shift
            WHERE esin = $1 AND month = $2
        `
    const result = await pool.query(query, [esin, currentMonth])

    // Format data for calendar view in response
    const shifts = result.rows.map(shift => ({
      day: shift.day,
      week: shift.week,
      month: shift.month,
      length: shift.length,
    }))

    // Send response using formatted data
    res.status(200).json(shifts)
  } catch (error) {
    console.error('Error fetching shifts: ', error.message)
    res.status(500).json({ error: 'Failed to fetch shifts' })
  }
})

// Endpoint for managers to view shifts in their departments
app.get('/shifts/department', authenticateToken, async (req, res) => {
  const { sin: msin } = req.user // Manager sin from JWT
  const { week, month } = req.query // Optional filters for week and month

  try {
    // Base query to fetch shifts for employees in the manager's department
    let query = `
            SELECT s.day, s.week, s.month, s.length, s.esin, e.name AS employee_name
            FROM shift AS s
            INNER JOIN employee AS e ON s.esin = e.sin
            INNER JOIN department AS d ON e.departmentid = d.departmentid
            WHERE d.msin = $1`
    const params = [msin]

    // Add filters for week and/or month if provided
    if (week) {
      query += `\nAND s.week = $${params.length + 1}`
      params.push(week)
    }
    if (month) {
      query += `\nAND s.month = $${params.length + 1}`
      params.push(month)
    }
    // Order shifts by week and day
    query += '\nORDER BY s.week, s.day'

    const result = await pool.query(query, params)

    // Format response
    const shifts = result.rows.map(shift => ({
      day: shift.day,
      week: shift.week,
      month: shift.month,
      length: shift.length,
      employee: {
        sin: shift.esin,
        name: shift.employee_name,
      },
    }))
    // Send response with formatted shifts
    res.status(200).json({ shifts })
  } catch (error) {
    console.error('Error fetching department shifts: ', error.message)
    res.status(500).json({ error: 'Failed to get department shifts' })
  }
})

// Endpoint for managers to modify shifts
app.put('/shift', authenticateToken, async (req, res) => {
  const { sin: msin } = req.user // Get data from JWT
  const { day, week, month, esin, length } = req.body // Get data from request body

  try {
    // Validate inputs
    if (!day || !week || !month || !esin || !length) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Verify the shift exists
    const shiftQuery = `
            SELECT s.*, e.departmentid
            FROM shift AS s
            JOIN employee AS e ON s.esin = e.sin
            WHERE s.day = $1 AND s.week = $2 AND s.month = $3 AND s.esin = $4
        `
    const shiftResult = await pool.query(shiftQuery, [day, week, month, esin])

    if (shiftResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shift not found' })
    }

    const shift = shiftResult.rows[0]

    // Verify that the manager belongs to the same department as the employee
    const employeeDeptId = shift.departmentid
    const managerDeptQuery = `
            SELECT departmentid
            FROM manager
            WHERE sin = $1
        `
    const managerResult = await pool.query(managerDeptQuery, [msin])
    if (
      managerResult.rows.length === 0 ||
      managerResult.rows[0].departmentid !== employeeDeptId
    ) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to modify this shift' })
    }

    // Update the shift (If a shift exists, the only thing to modify is the length of the shift)
    const updateShiftQuery = `
            UPDATE shift
            SET length = $5
            WHERE day = $1 AND week = $2 AND month = $3 AND esin = $4
        `
    await pool.query(updateShiftQuery, [day, week, month, esin, length])

    res.status(200).json({ message: 'Shift updated successfully' })
  } catch (error) {
    console.error('Error modifying shift: ', error.message)
    res.status(500).json({ error: 'Failed to modify shift' })
  }
})

// Endpoint for managers to delete a shift
app.delete('/shift', authenticateToken, async (req, res) => {
  const { sin: msin } = req.user // Manager sin from JWT
  const { day, week, month, esin } = req.body // Get data from request body

  try {
    // Validate inputs
    if (!day || !week || !month || !esin) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    // Check if the shift exists
    const shiftQuery = `
            SELECT s.*, e.departmentid
            FROM shift s
            JOIN employee e ON s.esin = e.sin
            WHERE s.day = $1 AND s.week = $2 AND s.month = $3 AND s.esin = $4
        `
    const shiftResult = await pool.query(shiftQuery, [day, week, month, esin])

    if (shiftResult.rows.length === 0) {
      return res.status(404).json({ error: 'Shift not found' })
    }
    const shift = shiftResult.rows[0]

    // Verify that the manager and employee share the same dept.
    const employeeDeptId = shift.departmentid
    const managerDeptQuery = `
            SELECT departmentid
            FROM manager
            WHERE sin = $1
        `
    const managerResult = await pool.query(managerDeptQuery, [msin])
    if (managerResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to delete this shift' })
    }
    // Delete the shift
    const deleteShiftQuery = `
            DELETE FROM shift
            WHERE day = $1 AND week = $2 AND month = $3 AND esin = $4
        `
    await pool.query(deleteShiftQuery, [day, week, month, esin])

    res.status(200).json({ message: 'Shift deleted successfully' })
  } catch (error) {
    console.error('Error deleting shift: ', error.message)
    res.status(500).json({ error: 'Failed to delete shift' })
  }
})

// Endpoint for calculating payroll
app.post('/payroll/calculate', authenticateToken, async (req, res) => {
  const { sin: managerSin } = req.user // get mSin from JWT
  const { employee_sin } = req.body // Parameter (optional) to calculate for a specific employee
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // Get month of the year
  const currentWeek = getWeekOfYear(currentDate) // Get the week of the year

  try {
    // Get departmentid from manager table
    const departmentidQuery = `SELECT departmentid FROM manager WHERE sin = $1`
    const departmentidResult = await pool.query(departmentidQuery, [managerSin])

    if (departmentidResult.rows.length === 0) {
      return res.status(404).json({ error: "Manager's department not found" })
    }
    const departmentid = departmentidResult.rows[0].departmentid

    let payrollQuery, params

    if (employee_sin) {
      // Calculate payroll for a specific employee
      payrollQuery = `
                SELECT e.sin, e.rate, SUM(s.length) AS total_hours
                FROM employee AS e
                JOIN shift AS s ON e.sin = s.esin
                WHERE e.sin = $1 
                AND s.month = $2 
                AND s.week <= $3 
                GROUP BY e.sin, e.rate, s.week;
            `
      params = [employee_sin, currentMonth, currentWeek]
    } else {
      // Calculate payroll for all the employees in manager's department
      payrollQuery = `
                SELECT e.sin, e.rate, SUM(s.length) AS total_hours
                FROM employee AS e
                JOIN shift AS s ON e.sin = s.esin
                WHERE e.departmentid = $1
                AND s.month = $2
                AND s.week <= $3
                GROUP BY e.sin, e.rate, s.week;
            `
      params = [departmentid, currentMonth, currentWeek]
    }
    const payrollResult = await pool.query(payrollQuery, params)

    // If no shifts found
    if (payrollResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No shifts found for payroll calculation' })
    }
    // Calculate payroll for each employee
    const payrolls = payrollResult.rows.map(row => ({
      sin: row.sin,
      totalHours: row.total_hours,
      rate: row.rate,
      totalPay: parseFloat(row.total_hours) * parseFloat(row.rate),
    }))

    // Insert payrolls into the database
    for (const payroll of payrolls) {
      const insertQuery = `
                INSERT INTO payroll (sin, week, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (sin, week)
                DO UPDATE SET quantity = EXCLUDED.quantity;
            `
      await pool.query(insertQuery, [
        payroll.sin,
        currentWeek,
        payroll.totalPay,
      ])
    }
    res.status(200).json({
      message: 'Payroll calculated successfully',
      payrolls,
    })
  } catch (error) {
    console.error('Error calculating payroll: ', error.message)
    res.status(500).json({ error: 'Failed to calculate payroll' })
  }
})

// Endpoint for employees to view their payrolls once authorized
app.get('/payroll/employee', authenticateToken, async (req, res) => {
  const { sin: employeeSin } = req.user // Get sin from JWT

  try {
    // Query to fetch authorized payrolls for the employee
    const query = `
            SELECT week, quantity, authorized
            FROM payroll
            WHERE sin = $1 AND authorized = TRUE;
        `
    const result = await pool.query(query, [employeeSin])

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'No authorized payrolls found.' })
    }
    // Get payroll data
    res.status(200).json({
      message: 'Authorized payrolls retrieved successfully',
      payrolls: result.rows,
    })
  } catch (error) {
    console.error('Error fetching employee payroll: ', error.message)
    res.status(500).json({ error: 'Failed to fetch payrolls.' })
  }
})

// Endpoint for managers to view payrolls for their departments or specific employees
app.get('/payroll/manager', authenticateToken, async (req, res) => {
  const { sin: managerSin, role } = req.user // Get manager's sin and role from JWT
  const { employee_sin } = req.query // Filter by employee

  if (role != 'manager') {
    return res.status(403).json({
      message:
        'Unauthorized access. Only managers can view department payrolls',
    })
  }
  try {
    // Get departmentid from manager table
    const departmentidQuery = `SELECT departmentid FROM manager WHERE sin = $1`
    const departmentidResult = await pool.query(departmentidQuery, [managerSin])

    if (departmentidResult.rows.length === 0) {
      return res.status(404).json({ error: "Manager's department not found" })
    }
    const departmentid = departmentidResult.rows[0].departmentid

    let query, params
    // Query for a specific employe in the manager's department
    if (employee_sin) {
      query = `
                SELECT e.sin AS employee_sin, e.name AS employee_name, p.week, p.quantity, p.authorized
                FROM payroll AS P JOIN employee AS e ON p.sin = e.sin
                WHERE e.sin = $1 AND e.departmentid = $2
                ORDER BY p.week;
            `
      params = [employee_sin, departmentid]
    } else {
      // Query for all employees in the manager's department
      query = `
                SELECT e.sin AS employee_sin, e.name AS employee_name, p.week, p.quantity, p.authorized
                FROM payroll AS p JOIN employee AS e ON p.sin = e.sin
                WHERE e.departmentid = $1
                ORDER BY e.sin, p.week;
            `
      params = [departmentid]
    }
    const result = await pool.query(query, params)

    // If no payrolls are found
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: employee_sin
          ? `No payrolls found for employee with SIN ${employee_sin}.`
          : `No payrolls found for department ${departmentid}.`,
      })
    }
    // Group payrolls by employee
    const payrolls = result.rows.reduce((acc, row) => {
      const employeeKey = row.employee_sin
      if (!acc[employeeKey]) {
        acc[employeeKey] = {
          name: row.employee_name,
          payrolls: [],
        }
      }
      acc[employeeKey].payrolls.push({
        week: row.week,
        quantity: row.quantity,
        authorized: row.authorized,
      })
      return acc
    }, {})

    // Return payroll data grouped by employee
    res.status(200).json({
      message: employee_sin
        ? `payroll retrieved successfully for employee ${employee_sin}.`
        : `payrolls retrieved successfully for department ${departmentid}.`,
      payrolls,
    })
  } catch (error) {
    console.error('Error fetching department payroll: ', error.message)
    res.status(500).json({ error: 'Failed to fetch payrolls.' })
  }
})

// Endpoint for authorizing payrolls
app.post('/payroll/authorize', authenticateToken, async (req, res) => {
  const { sin: managerSin, role } = req.user // Extract manager's sin and role from JWT
  const { employee_sins, weeks } = req.body // Employees or weeks to authorize

  if (role != 'manager') {
    return res.status(403).json({
      message: 'Unauthorized access. Only managers can authorize payrolls.',
    })
  }

  try {
    // Get department ID for the manager
    const departmentQuery = `SELECT departmentid FROM manager WHERE sin = $1`
    const departmentResult = await pool.query(departmentQuery, [managerSin])

    if (departmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Manager's department not found." })
    }
    const departmentId = departmentResult.rows[0].departmentid

    let updateQuery, params

    if (employee_sins && employee_sins.length > 0) {
      // authorize specific employees' payrolls
      updateQuery = `
                UPDATE payroll
                SET authorized = true
                WHERE sin = ANY($1) AND week = ANY($2)
                AND sin IN (
                            SELECT sin 
                            FROM employee
                            WHERE departmentid = $3)
                RETURNING sin, week;
        `
      params = [employee_sins, weeks, departmentId]
    } else {
      // Authorize all payrolls for the dept
      updateQuery = `
                UPDATE payroll
                SET authorized = true
                WHERE week = ANY($1)
                AND sin IN (
                            SELECT sin
                            FROM employee
                            WHERE departmentid = $2)
                RETURNING sin, week;
        `
      params = [weeks, departmentId]
    }
    const result = await pool.query(updateQuery, params)

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No payrolls found to authorize.' })
    }

    // Send notifications to employees whose payrolls were authorized
    const notifications = result.rows.map(row => ({
      to_sin: row.sin,
      message: 'Your payroll has been authorized and is ready for viewing.',
    }))

    const notificationQuery = `
            INSERT INTO notifications (to_sin, message)
            VALUES ($1, $2)
        `
    for (const notification of notifications) {
      await pool.query(notificationQuery, [
        notification.to_sin,
        notification.message,
      ])
    }

    res.status(200).json({
      message: 'Payrolls authorized successfully and notifications sent.',
      authorizedPayrolls: result.rows,
    })
  } catch (error) {
    console.error('Error authorizing payrolls: ', error.message)
    res.status(500).json({ error: 'Failed to authorize payrolls.' })
  }
})

// Function to calculate current week of the year
function getWeekOfYear(date) {
  // Clone the date
  // Get first day of the year
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)

  // Calculate days that passed from start of year (division by milliseconds)
  const pastDaysOfYear = Math.ceil((date - firstDayOfYear) / 86400000)

  // Calculate the ISO week number (according to the Gregorian calendar)
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7)
}

// Start the server
app.listen(PORT, () => {
  // PORT to listen for requests
  console.log(`Server is running on http://localhost:${PORT}`)
})
