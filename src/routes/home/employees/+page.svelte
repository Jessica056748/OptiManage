<script lang="ts">
  let adding: boolean = $state(false),
    password1: string = $state(''),
    password2: string = $state('')

  /**
   * Attempts to create a new employee under the current manager and department.
   */
  async function addEmployee(event: SubmitEvent) {
    event.preventDefault()
    // @ts-ignore
    const body = Object.fromEntries(new FormData(event.target))
    let status

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

      <!-- TODO: add a second password field to prevent typos. -->
      <label>
        Password

        <input
          type="password"
          name="password"
          value={password1}
          placeholder="PeterParker"
          required
        />
      </label>

      <label>
        Re-enter Password
        <input
          type="password2"
          name="password"
          value={password2}
          placeholder="PeterParker"
          required
        />
      </label>

      {#if password1 !== password2}
        Passwords should match.
      {/if}
      <input type="submit" value="Add Employee!" />

      <div>
        Already have an account?<br />
        <button type="button" onclick={() => (adding = false)}>Cancel</button>
      </div>
    </form>
  {/if}
</div>

<style>
  form {
    width: 80%;
    border: 1px solid transparent;

    color: white;
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
</style>
