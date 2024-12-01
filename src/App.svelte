<script lang="ts">
  import Auth from './lib/Auth.svelte'
  import Home from './lib/Home.svelte'
  import { globalState } from './state.svelte'
  import { Role } from './role'

  const { role } = globalState,
    log = console.log.bind(console)
</script>

<main class={role === Role.None ? "auth" : ""}>
  {#if role === Role.None}
    <Auth  />
  {:else}
    <Home />
  {/if}
</main>

<style>
</style>
