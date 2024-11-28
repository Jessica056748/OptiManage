<script lang="ts">
  import Login from "./Auth/Login.svelte";
  import SignUp from "./Auth/SignUp.svelte";
  let signingUp = true
</script>

<div class="Auth">
  {#if signingUp}
    <SignUp />
  {:else}
    <Login />
  {/if}
</div>

<style>
</style>