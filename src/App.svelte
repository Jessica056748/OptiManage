<script lang="ts">
  import Auth from './lib/Auth.svelte';
  import Home from './lib/Home/Home.svelte';
  import Nav from './lib/Nav.svelte';
  import Footer from './lib/Footer.svelte';
  import { Role } from './role.ts';
  const log = console.log.bind(console);

  let role: Role = $state(Role.None),
    signingUp: boolean = $state(false)
</script>

<main>
  {#if role === Role.None}
  <!-- If I mutate role in Auth, does it update roles's actual state? -->
  <Auth {role} {signingUp} />

  {:else}

  <Nav {role} />
  <Home {role} />
  <Footer />
  
  {/if}
</main>

<style>
</style>
