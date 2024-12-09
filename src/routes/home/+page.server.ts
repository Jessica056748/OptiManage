import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { type Shift } from '../../types'

/**
 * Loads shifts of the current user.
 * @param param0
 * @returns
 */
export async function load({ cookies }) {
  const token = cookies.get('jwt'),
    month = new Date().getMonth()

  try {
    const response = await fetch(
        `http://localhost:${PORT}/shifts/department?month=${month}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      data: { shifts: Array<Shift> } = await response.json(),
      { shifts } = data

    return { shifts }
  } catch (error) {
    // TODO: Notify user of the internal server error.
    console.error(error)
    return { shifts: [] }
  }
}
