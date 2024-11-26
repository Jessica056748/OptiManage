<script>
  import Login from "./Auth/Login.svelte";
  import SignUp from "./Auth/SignUp.svelte";

  let loggingIn = true;
</script>

<main>
  {loggingIn ? <Login /> : <SignUp />}
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
    column-gap: 10px;
  }
</style>