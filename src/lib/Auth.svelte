<script>
  import Login from "./Auth/Login.svelte";
  import SignUp from "./Auth/SignUp.svelte";


  let loggingIn = true,
    { currentAuthentication } = $props();
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