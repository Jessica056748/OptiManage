<script>
  import { globalState } from '../state.svelte'
  import { Role } from '../role'
  import '../css/app.css'

  const { role } = globalState
  let { children } = $props()
</script>

{@render children()}

<style>
  nav {
    width: 50px;
    background-color: hsla(0, 0%, 0%, 0.5);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 10px;
  }
  ul {
    list-style-type: none;
  }
  svg {
    width: 25px;
    transition: width 0.3s ease;
  }
  svg:hover {
    width: 30px;
    cursor: pointer;
  }
  svg.shake {
    animation: shake 1s ease 0 forwards;
  }

  @media (prefers-color-scheme: light) {
    svg {
      fill: hsl(0, 0%, 14%);
      stroke-width: 1px;
    }
  }
  @media (prefers-color-scheme: dark) {
    svg {
      fill: white;
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      fill: white;
    }
    12.5% {
      transform: rotate(15deg);
    }
    37.5% {
      transform: rotate(-15deg);
    }
    50% {
      fill: hsl(0, 100%, 50%);
    }
    67.5% {
      transform: rotate(15deg);
    }
    87.5% {
      transform: rotate(-15deg);
    }
    100% {
      transform: rotate(0deg);
      fill: white;
    }
  }
</style>