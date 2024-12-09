<script lang="ts">
  import { getUserContext } from '../../context'
  import PopUp from './PopUp.svelte'

  const { _classes, day }: { _classes: Array<String>; day: number } = $props()
  let user = getUserContext(),
    popup = $state(false)
</script>

{#if popup}
  <PopUp />
{/if}
<!-- <a aria-label="date" onclick={() => (popup = false)} href={void 0}> -->
<!-- <div class={_classes.join(' ')}>{day}</div> -->
<!-- </a> -->
<div class={_classes.join(' ')}><a href={void 0}>{day}</a></div>

<style>
  a {
    color: white;
    font-weight: normal;
  }
  div {
    padding: 3px;
    border: 0 solid white;
    border-width: 1px 0;
    aspect-ratio: 1 / 1;
  }
  .today {
    font-weight: bold;
    border-width: 1px;
    color: hsl(237, 100%, 70%);
    border-color: hsl(237, 100%, 70%);
    background-color: hsla(0, 0%, 0%, 0.2);
  }
  .grayed {
    color: hsl(0, 0%, 70%);
    background-color: hsla(0, 71%, 16%, 0.3);
  }
  div:hover {
    cursor: pointer;
    color: hsl(237, 100%, 70%);
    background-color: hsla(0, 0%, 0%, 0.4);
  }
</style>
