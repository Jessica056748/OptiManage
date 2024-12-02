<script lang="ts">
  import Nav from "./home/Nav.svelte"
  import Bar from "./home/Bar.svelte"
  import Calendar from "./home/Calendar.svelte"
</script>

<div class="home">
  <Nav />
  <div class="content">
    <Bar />
    <Calendar />
  </div>
</div>

<style>
.home {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;
}
.content {
  display: flex;
  flex-direction: column;
}
</style>