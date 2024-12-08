<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  // @ts-ignore
  import Login from '../lib/auth/Login.svelte'
  // @ts-ignore
  import SignUp from '../lib/auth/SignUp.svelte'
  import { Role } from '../role'
  import { globalState } from '../state.svelte'

  const { role } = globalState

  // Redirects user to the
  $effect.pre(() => {
    if (role !== Role.None) goto('/home')
  })

  let signingUp: boolean = $state(false)
</script>

<div class="auth-wrapper">
  <h1>ʘptiManage</h1>
  {#if signingUp}
    <SignUp bind:signingUp />
  {:else}
    <Login bind:signingUp />
  {/if}
</div>

<style>
  h1 {
    top: 1em;
    font-size: 2em;
  }

  .auth-wrapper {
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
  }

  /* TODO: Fix h1 contrast issue with some of the background images. */
  /* @media (prefers-color-scheme: light) {
    h1 {
      color: hsl(0, 0%, 90%);
    }
  } */

  @media only screen and (min-width: 600px) {
    h1 {
      font-size: 3.2em;
    }
  }
</style>
