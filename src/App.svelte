<script lang="ts">
  import Auth from './lib/Auth.svelte';
  import Home from './lib/Home/Home.svelte';
  import Nav from './lib/Nav.svelte';
  import Footer from './lib/Footer.svelte';
  import Authentication from './authState';

  let currentAuthentication: Authentication = $state(Authentication.None);
</script>

<main>
  {#if currentAuthentication === Authentication.None}

  <Auth {currentAuthentication} />

  {:else}

  <Nav {currentAuthentication} />
  <Home {currentAuthentication} />
  <Footer />
  
  {/if}
</main>

<style>
</style>
