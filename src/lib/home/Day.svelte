<script lang="ts">
  import { getUserContext } from '../../context'
  import type { PopUpData } from '../../types'

  let {
    _classes,
    day,
    month,
    datePopUp = $bindable(),
  }: {
    _classes: Array<String>
    day: number
    month: number
    datePopUp: PopUpData | undefined
  } = $props()

  let user = getUserContext()
</script>

<div class={_classes.join(' ')}>
  <a
    href={void 0}
    onclick={() => {
      // TODO: notify the user somehow that no data is currently available for days past the given month.
      if (_classes.includes('grayed')) return
      const popUpData = { month, day }

      datePopUp = popUpData
    }}>{day}</a
  >
</div>

<style>
  a {
    display: block;
    width: 100%;
    height: 100%;
    color: white;
    font-weight: normal;
  }
  div {
    padding: 3px;
    border: 0 solid white;
    border-width: 1px 0;
    aspect-ratio: 1 / 1;
  }
  .today,
  .today a {
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
