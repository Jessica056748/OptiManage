<script lang="ts">
  import { Role } from "../../role";
  import { globalState } from "../../state.svelte";
  const log = console.log.bind(console),
    { VITE_BACKEND_PORT: PORT } = import.meta.env

  /**
   * Sends a login request to the server, and updates App state if successful. Does not mutate the database.
   */
  async function login(event: SubmitEvent) {
    event.preventDefault()

    // @ts-ignore
    const { email, password } = Object.fromEntries(new FormData(event.target)) 
    let status

    try {
      const response = await fetch(`http://localhost:${PORT}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      }),
      data = await response.json();

      ({status} = response)
    } catch (error) {
      console.error(error)
      return 
      // TODO: notify user
      // notify('❌ Something went wrong, please try again later', 'error')
    }

    if (status === 401) {
      // Credentials were invalid.
      return 
    }

    if (status === 200) {
      // Credentials were valid.
      globalState.role = Role.Manager;
    }

    // Otherwise, something else went wrong. Give a vague "try again" message here.
  }
</script>

  <form onsubmit={login}>
    Login

    <label>
      Username or email
      <input type="text" name="email" id="email" required>
    </label>

    <label>
      Password

      <input type="password" name="password" id="password" required>
    </label>

    <input type="submit" value="Submit">
  </form>

<style>
  form {
    display: flex;
    flex-direction: column;
    column-gap: 10px;
  }
</style>