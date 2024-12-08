import { redirect } from '@sveltejs/kit'
import { VITE_BACKEND_PORT } from '$env/static/private'

// Redirects the user to the homepage if they are already authenticated.
export async function load({ locals, cookies }) {
  // TODO: validate session secret.
  const token = cookies.get('jwt'),
    response = await fetch(`http://localhost:${VITE_BACKEND_PORT}/verify`),
    data = await response.json()

  console.log('data:', data)
  // if (locals.secret === 'VALID') redirect(302, '/home')

  return {
    secret: locals.secret,
  }
}
