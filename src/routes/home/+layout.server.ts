import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { Role } from '../../role.js'
import { globalState } from '../../state.svelte.js'

/**
 * Redirects the user to the authentication page if they are not authenticated.
 * @param param0
 * @returns
 */
export async function load({ cookies }) {
  const token = cookies.get('jwt')

  console.log(globalState.role)
  console.log('Role.None:', Role.None)
  console.log(globalState.role === Role.None)
  console.log('token:', token)
  if (globalState.role === Role.None || !token) throw redirect(307, '/')

  const { status } = await fetch(`http://localhost:${PORT}/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('status:', status)

  if (status !== 200) throw redirect(307, '/')

  return {}
}
