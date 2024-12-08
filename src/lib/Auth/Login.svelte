<script lang="ts">
  import { Role } from '../../role'
  import { globalState } from '../../state.svelte'
  let { signingUp = $bindable() }: { signingUp: boolean } = $props()
  const { VITE_BACKEND_PORT: PORT } = import.meta.env

  /**
   * Sends a login request to the server, and updates App state if successful. Does not mutate the database.
   */
  async function login(event: SubmitEvent) {
    event.preventDefault()

    // @ts-ignore
    const body = Object.fromEntries(new FormData(event.target))
    let status

    try {
      const response = await fetch(`http://localhost:${PORT}/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }),
        data = await response.json()

      ;({ status } = response)
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
      globalState.role = Role.Manager
    }

    // Otherwise, something else went wrong. Give a vague "try again" message here.
  }

  function switchToSignUp() {
    signingUp = true
  }
</script>

<form onsubmit={login}>
  <h2>Login</h2>

  <label>
    Email
    <input
      type="text"
      name="email"
      id="email"
      placeholder="trump@us.ca"
      required
    />
  </label>

  <label>
    Password

    <input
      type="password"
      name="password"
      id="password"
      placeholder="trump"
      required
    />
  </label>

  <input type="submit" value="Login" />

  <div>
    No account?<br />
    <button type="button" onclick={switchToSignUp}>Sign up!</button>
  </div>
</form>

<style>
  form {
    width: 80%;
    border: 1px solid transparent;

    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    transition: border-color 0.25s;
  }
  form:hover {
    border-color: hsl(237, 100%, 70%);
  }

  h2,
  div {
    align-self: center;
  }
  label {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  input:not([type='submit']) {
    width: 100%;
  }

  input[type='submit'] {
    align-self: center;
  }

  @media (prefers-color-scheme: light) {
    form {
      background-color: hsla(0, 0%, 90%, .8);
    }
  }
  
  @media (prefers-color-scheme: dark) {
    form {
      background-color: hsla(0, 0%, 20%, .8);
    }
    input::placeholder {
      color: hsl(0, 0, 95%);
    }
  }

  @media only screen and (min-width: 700px) {
    form {
      width: 45%;
    }
    input:not([type='submit']) {
      width: 90%;
    }
  }

  @media only screen and (min-width: 1000px) {
    form {
      width: 30%;
    }
    input:not([type='submit']) {
      width: 80%;
    }
  }
</style>
