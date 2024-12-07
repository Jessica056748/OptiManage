<script>
  import { SvelteSet } from 'svelte/reactivity';
	import { setContext } from 'svelte';

	let canvas;
	let notifications = new SvelteSet();

	setContext('canvas', { addItem })
	
	function addItem(fn) {
		$effect(() => {
			notifications.add(fn);
			return () => notifications.delete(fn);
		});
	}

	$effect(() => {
		const ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, width, height);
		notifications.forEach(fn => fn(ctx));
	});
</script>

{#each }
  <div className='notification' key={i}>
          {notification}
        </div>
{/each}
{@render children()}

<style>
</style>
