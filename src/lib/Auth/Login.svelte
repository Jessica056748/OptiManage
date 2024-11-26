<script>
  /**
   * Checks that a profile with the given information exists.
   * 
   * @param {Event} event
   */
  function login(event) {
    event.preventDefault()

    // @ts-ignore
    console.log(Object.fromEntries(new FormData(event.target)))
  }
</script>

<main>
  <form on:submit={login}>
    Login

    <label>
      Username or email
      <input type="text" name="username" id="username" required>
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