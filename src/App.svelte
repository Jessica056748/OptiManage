<script lang="ts">
  import Auth from './lib/Auth.svelte'
  import Home from './lib/Home/Home.svelte'
  import Nav from './lib/Nav.svelte'
  import Footer from './lib/Footer.svelte'
  import { globalState } from './state.svelte'
  import { Role } from './role'

  const { role } = globalState,
    log = console.log.bind(console)
</script>

<main>
  {#if role === Role.None}
    <Auth  />
  {:else}
    <Nav />
    <Home />
    <Footer />
  {/if}
</main>

<style>
</style>
