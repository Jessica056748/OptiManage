<script lang="ts">
  import { onMount } from 'svelte'
  import { globalState } from '../state.svelte'
  import { Role } from '../role'
  import '../css/app.css'
  import { goto } from '$app/navigation'

  /**
   * Returns a random integer between 0 (inclusive) and the maximum value specified (exclusive).
   * Copied from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  function getRandomIntInclusive(max: number): number {
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * maxFloored)
  }

  let imageUrl: String = $state('')
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

    $inspect('globalState:', globalState)
    $inspect('Role.None:', Role.None)
  })

  const { role } = globalState,
    { children } = $props()
</script>

<main style="background-image: url({imageUrl});">
  {@render children()}
</main>

<style>
  main {
    background-position: center;
    background-size: cover;

    display: flex;
    flex-direction: row;
  }
</style>
