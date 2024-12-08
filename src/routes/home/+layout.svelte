<script>
  import { globalState } from '../state.svelte'
  import { Role } from '../role'
  import '../css/app.css'

  const { role } = globalState
  let { children } = $props()
</script>

<nav>
  <ul>
    <li class="notifications">
      <svg viewBox="0 0 448 512">
        <path
          d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
        />
      </svg>
    </li>
    <li class="home">
      <svg viewBox="0 0 576 512">
        <path
          d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
        />
      </svg>
    </li>
    {#if role === Role.Manager}
      <li class="employees">
        <svg viewBox="0 0 640 512">
          <path
            d="M335.5 4l288 160c15.4 8.6 21 28.1 12.4 43.5s-28.1 21-43.5 12.4L320 68.6 47.5 220c-15.4 8.6-34.9 3-43.5-12.4s-3-34.9 12.4-43.5L304.5 4c9.7-5.4 21.4-5.4 31.1 0zM320 160a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM144 256a40 40 0 1 1 0 80 40 40 0 1 1 0-80zm312 40a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM226.9 491.4L200 441.5l0 38.5c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32l0-38.5L61.1 491.4c-6.3 11.7-20.8 16-32.5 9.8s-16-20.8-9.8-32.5l37.9-70.3c15.3-28.5 45.1-46.3 77.5-46.3l19.5 0c16.3 0 31.9 4.5 45.4 12.6l33.6-62.3c15.3-28.5 45.1-46.3 77.5-46.3l19.5 0c32.4 0 62.1 17.8 77.5 46.3l33.6 62.3c13.5-8.1 29.1-12.6 45.4-12.6l19.5 0c32.4 0 62.1 17.8 77.5 46.3l37.9 70.3c6.3 11.7 1.9 26.2-9.8 32.5s-26.2 1.9-32.5-9.8L552 441.5l0 38.5c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32l0-38.5-26.9 49.9c-6.3 11.7-20.8 16-32.5 9.8s-16-20.8-9.8-32.5l36.3-67.5c-1.7-1.7-3.2-3.6-4.3-5.8L376 345.5l0 54.5c0 17.7-14.3 32-32 32l-48 0c-17.7 0-32-14.3-32-32l0-54.5-26.9 49.9c-1.2 2.2-2.6 4.1-4.3 5.8l36.3 67.5c6.3 11.7 1.9 26.2-9.8 32.5s-26.2 1.9-32.5-9.8z"
          />
        </svg>
      </li>
    {/if}
  </ul>
</nav>

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
