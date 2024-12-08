<script lang="ts">
	import { spring } from 'svelte/motion';

	let count = $state(0);

	// svelte-ignore state_referenced_locally
	const displayedCount = spring(count);

	$effect(() => {
		displayedCount.set(count);
	});
	let offset = $derived(modulo($displayedCount, 1));

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="counter">
	<button onclick={() => (count -= 1)} aria-label="Decrease the counter by one">
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5" />
		</svg>
	</button>

	<div class="counter-viewport">
		<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
			<strong class="hidden" aria-hidden="true">{Math.floor($displayedCount + 1)}</strong>
			<strong>{Math.floor($displayedCount)}</strong>
		</div>
	</div>

	<button onclick={() => (count += 1)} aria-label="Increase the counter by one">
		<svg aria-hidden="true" viewBox="0 0 1 1">
			<path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
		</svg>
	</button>
</div>
