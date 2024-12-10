<script lang="ts">
  import { getUserContext } from '../../context'
  import type { PopUpData } from '../../types'

  let { datePopUp = $bindable() }: { datePopUp: PopUpData | undefined } =
      $props(),
    animation = $state('show')
  const user = getUserContext(),
    shifts = user.shifts.filter(
      ({ day: shiftDay, month: shiftMonth, esin: shiftSIN }) =>
        // TODO: adjust this filter function so it actually works. Wait until an actual shift is present to edit.
        shiftDay === datePopUp?.day && shiftMonth && shiftSIN === user.sin
    )

  function hide() {
    animation = 'hide'
    setTimeout(() => {
      datePopUp = undefined
    }, 300) // 300ms
  }

  console.log('datePopUp:', datePopUp)
</script>

<div class={animation}>
  {datePopUp?.day || 'No day found'}
  {datePopUp?.month || 'No month found'}

  {#each shifts as shift}
    <!-- TODO: display the employee's name, and the time of their shift. Color-coded shifts (a different color for each employee) would be awesome. -->
    <div class="shift">{shift.esin}</div>
  {/each}
  <button aria-label="close popup" title="Close popup" onclick={hide}>
    <svg viewBox="0 0 384 512">
      <path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
      />
    </svg>
  </button>
</div>

<style>
  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;

    color: white;
    background-color: hsla(0, 0%, 0%, 0.5);
  }
  .show {
    animation: fade-in 0.2s ease forwards;
  }
  .hide {
    animation: fade-out 0.2s ease forwards;
  }
  button {
    padding: 3px;
    background-color: transparent;
  }

  svg {
    width: 30px;
    fill: white;
    aspect-ratio: 1 / 1;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
