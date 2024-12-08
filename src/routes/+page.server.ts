import { redirect } from '@sveltejs/kit'

// Redirects the user to the homepage if they are already authenticated.
export async function load({ locals }) {
  // TODO: validate session secret.
  if (locals.secret === 'VALID') redirect(302, '/home')

  return {
    secret: locals.secret,
  }
}
