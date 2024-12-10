import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { type User } from '../../types.js'
import { Role } from '../../types.js'

/**
 * Redirects the user to the authentication page if they are not authenticated.
 * @param param0
 * @returns
 */
export async function load({ cookies }) {
  const token = cookies.get('jwt')

  if (!token) throw redirect(307, '/')

  const response = await fetch(`http://localhost:${PORT}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }),
    { user }: { user: User } = await response.json()

  if (response.status !== 200) throw redirect(307, '/')

  // @ts-ignore
  user.role = user.role === 'manager' ? Role.Manager : Role.Employee

  return { user, token }
}
