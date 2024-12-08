import { redirect } from '@sveltejs/kit'
import { VITE_BACKEND_PORT as PORT } from '$env/static/private'
import { globalState } from '../state.svelte.js'
import { Role } from '../role.js'
import { goto } from '$app/navigation'

export async function load(request) {
  const { locals, cookies } = request,
    { role } = globalState

  // TODO: validate session secret.
  const token = cookies.get('jwt'),
    response = await fetch(`http://localhost:${PORT}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    }),
    data = await response.json()
  console.log('data:', data)
  // if (locals.secret === 'VALID') redirect(302, '/home')
  return {
    secret: locals.secret,
  }
}
