import { redirect } from '@sveltejs/kit'
import { VITE_BACKEND_PORT as PORT } from '$env/static/private'

/**
 * Redirects the user to the home page if they are already authenticated.
 * @param param0
 * @returns
 */
export async function load({ cookies }) {
  const token = cookies.get('jwt')

  // NOTE: might be useful/necessary/better to check the context here, too (which would mean moving where we set context).
  // Maybe not. Not sure.
  if (!token) return

  const { status } = await fetch(`http://localhost:${PORT}/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (status === 200) throw redirect(307, '/home')

  return {}
}
