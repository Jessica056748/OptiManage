import { VITE_BACKEND_PORT } from '$env/static/private'
import type { HandleFetch } from '@sveltejs/kit'

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const cookie = event.request.headers.get('cookie')

  // TODO: adjust to the url where the api will rest once the application is deployed.
  if (
    cookie !== null &&
    request.url.startsWith(`http://localhost:${VITE_BACKEND_PORT}/`)
  )
    request.headers.set('cookie', cookie)

  return fetch(request)
}
