<script>
  import Login from "./Auth/Login.svelte";
  import SignUp from "./Auth/SignUp.svelte";

  let loggingIn = true;
</script>

<div>
  {#if loggingIn}
    <Login />
  {:else}
  <SignUp />
  {/if}
</div>

<style>
</style>