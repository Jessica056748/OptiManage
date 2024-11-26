<script>
  /**
   * Checks that a profile with the given information exists.
   * 
   * @param {Event} event
   */
  async function login(event) {
    event.preventDefault()

    // @ts-ignore
    console.log(Object.fromEntries(new FormData(event.target)))
    let status

    try {
      const response = await fetch('/.netlify/functions/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      status = response.status
    } catch (error) {
      console.error(error)
      return 
      // notify('❌ Something went wrong, please try again later', 'error')
    }

    if (status === 401) {
      // Handle invalid credentials.
      return 
    }

    // Handle valid credentials.
  }
</script>

<main>
  <form on:submit={login}>
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
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
    column-gap: 10px;
  }
</style>