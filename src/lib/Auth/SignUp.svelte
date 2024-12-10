<script lang="ts">
  import { Role } from '../../types'
  import { getUserContext } from '../../context'
  const { VITE_BACKEND_PORT: PORT } = import.meta.env
  let { signingUp = $bindable() }: { signingUp: boolean } = $props(),
    user = getUserContext(),
    password1: string = $state(''),
    password2: string = $state(''),
    warn: string = $state('')

  /**
   * Sends a signup request to the server, updating the database as well as the App state if successful.
   */
  async function signUp(event: SubmitEvent) {
    event.preventDefault()
    // @ts-ignore
    const body = Object.fromEntries(new FormData(event.target))

    console.log('body:', body)

    if (password1 !== password2) {
      warn = 'warn'
      setTimeout(() => (warn = ''), 1_000)
      return
    }

    delete body['password-check']
    let status

    return

    try {
      const response = await fetch(`http://localhost:${PORT}/create-manager`, {
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
      // Operation was unsuccessful due to a client error.
      return
    }

    if (status === 200) {
      // Operation was successful.
      user.role = Role.Manager
    }

    // Otherwise, something else went wrong. Give a vague "try again" message here.
  }

  function switchToLogin() {
    signingUp = false
  }
</script>

<form onsubmit={signUp}>
  <!-- TODO: remove "required" from nullable fields, especially department id. -->
  <h2>Create a Manager Account</h2>

  <label>
    Name
    <input type="text" name="name" placeholder="Peter Parker" required />
  </label>

  <label>
    Phone
    <input
      type="tel"
      minlength="10"
      maxlength="10"
      name="phone"
      placeholder="4032345677"
      required
    />
  </label>

  <label>
    Email
    <input
      type="email"
      name="email"
      placeholder="PParker@optimanage.ca"
      required
    />
  </label>

  <label>
    Address
    <input
      type="address"
      name="address"
      placeholder="2717 Hocus Pocus Drive, Calgary, Alberta, T2A45K"
      required
    />
  </label>

  <label>
    SIN
    <input
      type="password"
      name="sin"
      minlength="9"
      maxlength="9"
      placeholder="111111111"
      required
    />
  </label>

  <!-- TOOO: Fix the issue where, if a department number that doesn't exist is entered, we cannot create an account. -->
  <label>
    Department Id
    <input type="number" name="departmentid" placeholder="3" required />
  </label>

  <!-- TODO: add a second password field to prevent typos. -->
  <label>
    Password
    <input
      type="password"
      name="password"
      bind:value={password1}
      placeholder="PeterParker"
      class={password1 === password2 ? 'valid' : 'invalid'}
      required
    />
  </label>

  <label>
    Re-enter Password
    <input
      type="password"
      name="password-check"
      bind:value={password2}
      placeholder="PeterParker"
      class={password1 === password2 ? 'valid' : 'invalid' + ' checker'}
      required
    />
  </label>

  {#if password1 !== password2}
    <p class={warn}>Passwords should match.</p>
  {/if}
  <input type="submit" value="Create Account!" />

  <div>
    Already have an account?<br />
    <button type="button" onclick={switchToLogin}>Log in!</button>
  </div>
</form>

<style>
  form {
    width: 80%;
    border: 1px solid transparent;

    background-color: hsl(0, 0%, 20%);
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
  .checker {
    border: 3px solid transparent;
    transition: border-color 0.25s;
  }
  .valid {
    border: 3px solid green;
  }
  .invalid {
    border: 3px solid red;
  }

  h2,
  div {
    align-self: center;
  }
  label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  label input {
    width: 50%;
  }
  input:not([type='submit']) {
    width: 100%;
  }

  input[type='submit'] {
    align-self: center;
  }

  .warn {
    animation: warn 1s ease;
  }

  @media (prefers-color-scheme: light) {
    form {
      background-color: hsla(0, 0%, 90%, 0.8);
    }
  }

  @media (prefers-color-scheme: dark) {
    form {
      background-color: hsla(0, 0%, 20%, 0.8);
    }
    input::placeholder {
      color: hsl(0, 0, 95%);
    }
  }

  @media only screen and (min-width: 700px) {
    form {
      width: 80%;
    }
    input:not([type='submit']) {
      width: 50%;
    }
  }

  @media only screen and (min-width: 1000px) {
    form {
      width: 50%;
    }
    input:not([type='submit']) {
      width: 50%;
    }
  }

  @keyframes warn {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-15px);
    }
    50% {
      color: red;
    }
    75% {
      transform: translateX(15px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>
