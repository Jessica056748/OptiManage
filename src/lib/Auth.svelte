<script lang="ts">
  import Login from "./Auth/Login.svelte";
  import SignUp from "./Auth/SignUp.svelte";
  import { Role } from "../role";
  
  // 
  let { role, signingUp }: { role: Role, signingUp: boolean } = $props();
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