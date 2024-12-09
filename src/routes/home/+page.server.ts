import { redirect } from '@sveltejs/kit'
import { VITE_BACKEND_PORT as PORT } from '$env/static/private'

// Redirects the user to the homepage if they are already authenticated.
export async function load({ locals, cookies }) {
  const token = cookies.get('jwt'),
    month = new Date().getMonth()
  let status: number, data: Object

  try {
    const response = await fetch(
      // TODO: verify this works after Daniel's fix.
      `http://localhost:${PORT}/shifts/department?month=${month}`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    data = await response.json()

    console.log('data from /home page.server:', data)
    return data
  } catch (error) {
    // TODO: Notify user of the internal server error.
    console.error(error)
    return {}
  }
}
