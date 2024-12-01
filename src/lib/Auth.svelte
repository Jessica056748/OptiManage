<script lang="ts">
  import Login from "./Auth/Login.svelte"
  import SignUp from "./Auth/SignUp.svelte"
  import { Role } from "../role"
  import { globalState } from "../state.svelte"

let signingUp: boolean = $state(false)
</script>

<h1>ʘptiManage</h1>
<div class="auth-wrapper">
  {#if signingUp}
    <SignUp  />

  {:else}
    <Login />
  {/if}
</div>

<style>
h1 {
  margin-top: 1em;
  font-size: 2em;
}
  
.auth-wrapper {
  width: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 600px) {
  h1 {
    font-size: 3.2em;
  }
}
</style>