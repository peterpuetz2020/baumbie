<script lang="ts">
	import { onMount, createEventDispatcher, tick } from 'svelte';

	let step = 0;
	let steps = ['🌱', '🌱🚿', '🌳'];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		for (let i = 1; i < steps.length; i++) {
			await new Promise((r) => setTimeout(r, 500));
			step = i;
			await tick();
		}
		await new Promise((r) => setTimeout(r, 2000));
		dispatch('done');
	});
</script>

<div class="flex flex-col items-center justify-center gap-4 py-6 text-center">
	<div class="text-6xl transition-all duration-300 ease-in-out">{steps[step]}</div>
	<div class="text-green-700 font-semibold text-lg">Gießung erfolgreich gespeichert!</div>
</div>

<style>
	@keyframes pop {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.text-6xl {
		animation: pop 0.3s ease-out;
	}
</style>
