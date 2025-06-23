<!--Übernommen aus https://svelte.dev/playground/c109f83f3c114cb7829f04fe2440ef94?version=5.28.2 -->
<script>
	export let open = false;
	import { slide } from 'svelte/transition';
	const handleClick = () => (open = !open);
</script>

<div class="accordion">
	<div class="header">
		<div class="text">
			<slot name="head" />
		</div>

		<button on:click={handleClick} class="toggle-button" aria-label="Abschnitt umschalten">
			<img
				src={open ? "/trees/accordion-close.svg" : "/trees/accordion-open.svg"}
				alt={open ? "Schließen" : "Öffnen"}
				class="w-4 h-4 m-4"
			/>
		</button>
	</div>

	{#if open}
		<div class="details" transition:slide>
			<slot name="details" />
		</div>
	{/if}
</div>

<style>
	.accordion {
		margin: 1rem 0;
	}

	.header {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.text {
		flex: 1;
	}

	.toggle-button {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-right: 0.75rem;
		padding-left: 0.75rem;
		padding-bottom: 0.2rem;
		padding-top: 0.2rem;
		margin-left: auto;
	}
	
	.details {
		padding: 0.5rem 0;
	}
</style>
