<script lang="ts">
  const { VITE_BACKEND_PORT: PORT } = import.meta.env

  let adding: boolean = $state(false),
    password1: string = $state(''),
    password2: string = $state(''),
    warn: string = $state('')
  const { data } = $props(),
    {
      token,
      user: { sin },
    } = data

  /**
   * Attempts to create a new employee under the current manager and department.
   */
  async function addEmployee(event: SubmitEvent) {
    event.preventDefault()
    // @ts-ignore
    const body = Object.fromEntries(new FormData(event.target))

    if (body.password != body['password-check']) {
      warn = 'warn'
      setTimeout(() => (warn = ''), 1_000)
      return
    }

    delete body['password-check']

    body.msin = sin
    let status
    try {
      const response = await fetch(`http://localhost:${PORT}/add-employee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
      // TODO: notify manager.
      return
    }

    if (status === 200) {
      // Operation was successful.
      // Maybe notifying the manager is not necessary, as this component will show an enumeration of the employees.
      adding = false
    }

    // Otherwise, something else went wrong. Give a vague "try again" message here.
  }
</script>

<div>
  {#if !adding}
    <button onclick={() => (adding = true)}>Add Employee</button>
  {:else}
    <form onsubmit={addEmployee}>
      <!-- TODO: remove "required" from nullable fields, especially department id. -->
      <h2>Add new employee</h2>

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

      <label>
        Hourly Rate
        <input type="number" name="rate" placeholder="15" required />
      </label>

      <label>
        Password

        <input
          type="password"
          name="password"
          bind:value={password1}
          placeholder="PeterParker"
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
      <input type="submit" value="Add Employee!" />

      <button type="button" onclick={() => (adding = false)}>Cancel</button>
    </form>
  {/if}
</div>

<style>
  form {
    width: 80%;
    color: white;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    transition: border-color 0.25s;
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

  .warn {
    animation: warn 1s ease;
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
