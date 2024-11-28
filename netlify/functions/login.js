import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pg from 'pg'

const {
    SESSION_SECRET,
    POSTGRES_PASSWORD,
    POSTGRES_USERNAME,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DATABASE,
  } = process.env,
  { Client } = pg,
  client = new Client({
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DATABASE,
    options: '--search-path="Optimize'
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
    await client.connect()

    const query = `
        select *
        from manager
        where email = ${email}
      `,
      res = await client.query(query)

    console.log(res.rows[0].message)

    const token = jwt.sign(
      {
        username,
      },
      SESSION_SECRET,
      {
        expiresIn: '8h',
      }
    )

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
  } finally {
    await client.end()
  }
}
