<script lang="ts">
  import Auth from '$lib/Auth.svelte'
  import Home from '$lib/Home.svelte'
  import { onMount } from 'svelte'
  import { Role } from '../role'
  import { globalState } from '../state.svelte'

  /**
   * Returns a random integer between 0 (inclusive) and the maximum value specified (exclusive).
   * Copied from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  function getRandomIntInclusive(max: number) {
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * maxFloored)
  }

  let imageUrl: String
  onMount(() => {
    const // lightBackgrounds = ['beach', 'desert', 'glaciers', 'precipice', 'sea', 'structures'],
      // Removed some of the images that don't contrast well with the OptiManage title.
      // TODO: make these NOT hard-coded.
      lightBackgrounds = ['beach', 'desert', 'glaciers', 'precipice'],
      darkBackgrounds = ['desert', 'galaxy'],
      darkPreferred =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches,
      imageDir = darkPreferred ? 'dark' : 'light',
      imageIndex = getRandomIntInclusive(
        darkPreferred ? darkBackgrounds.length : lightBackgrounds.length
      )

    imageUrl = `/src/assets/images/${imageDir}/${(darkPreferred ? darkBackgrounds : lightBackgrounds)[imageIndex]}.jpg`
  })

  const { role } = globalState
</script>

<svelte:head>
  <!-- <title>Home</title>
  <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<main
  class={role !== Role.None ? 'authenticated' : ''}
  style="background-image: url({imageUrl});"
>
  {#if role === Role.None}
    <Auth />
  {:else}
    <Home />
  {/if}
</main>

<style>
  main {
    background-size: cover;
    background-position: center;
  }
</style>
