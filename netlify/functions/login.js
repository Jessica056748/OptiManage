import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mysql from 'mysql'

const { SESSION_SECRET } = process.env,
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db',
  })

export async function handler(event, context) {
  const { httpMethod } = event,
    { email, password } = JSON.parse(event.body)

  if (httpMethod !== 'POST')
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'not found' }),
    }

  if (!email || !password)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'missing email or password fields' }),
    }

  try {
    connection.connect(error => {
      if (!error)
        return console.log('Connected to MySQL as id ' + connection.threadId)

      console.error('Could not connect to MySQL: ' + error.stack)

      return {
        statusCode: 503,
        body: JSON.stringify({
          serverError: error.toString(),
        }),
      }
    })

    // Query SQL for email and password hash.
    const query = `
      Select E.Email, E.password  
      FROM Employee as E 
      WHERE E.Email = ${email}  
      AND E.Password = ${password}
    `
    connection.query(query, (error, results, fields) => {
      if (error) throw error

      // Compare!
      console.log('The solution is: ', results[0].solution)
    })

    // If successful:
    const token = jwt.sign(
      {
        username,
      },
      SESSION_SECRET,
      {
        expiresIn: '8h',
      }
    )

    connection.end()

    return {
      statusCode: 200,
      headers: {
        'set-cookie': `jwt=${token}; secure; httpOnly; sameSite=Lax`,
      },
      body: JSON.stringify({
        username,
        token,
      }),
    }
  } catch (error) {
    console.error(error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        serverError: error.toString(),
      }),
    }
  }
}
