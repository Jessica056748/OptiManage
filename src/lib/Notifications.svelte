<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'
  import { setContext } from 'svelte'

  let canvas
  let notifications = new SvelteSet()

  setContext('canvas', { addItem })

  function addItem(fn: String) {
    $effect(() => {
      notifications.add(fn)
      return () => notifications.delete(fn)
    })
  }
</script>

<!-- {#each }
  <div className='notification' key={i}>
          {notification}
        </div>
{/each} -->
<!-- {@render children()} -->

<style>
</style>
