import { redirect } from '@sveltejs/kit'
import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { globalState } from '../../state.svelte.js'

// Redirects the user to the homepage if they are already authenticated.
export async function load({ locals, cookies }) {
  const token = cookies.get('jwt'),
    month = new Date().getMonth()
  let status: number, data: { shifts: Array<any> }

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
    const { shifts } = data

    globalState.user.shifts = shifts
    return {}
  } catch (error) {
    // TODO: Notify user of the internal server error.
    console.error(error)
    return {}
  }
}
