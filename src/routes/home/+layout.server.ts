import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { type User } from '../../types.js'

/**
 * Redirects the user to the authentication page if they are not authenticated.
 * @param param0
 * @returns
 */
export async function load({ cookies }) {
  const token = cookies.get('jwt')

  // TODO: check why using role is causing issues. For now, just use the token.
  // if (globalState.role === Role.None || !token) throw redirect(307, '/')
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

  return { user }
}
