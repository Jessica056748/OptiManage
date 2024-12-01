<script lang="ts">
  import Login from "./Auth/Login.svelte"
  import SignUp from "./Auth/SignUp.svelte"
  import { Role } from "../role"
  import { globalState } from "../state.svelte"

let signingUp: boolean = $state(false)
</script>

<div class="Auth">
  {#if signingUp}
    <SignUp  />


  {:else}
    <Login />
  {/if}
</div>

<style>
</style>