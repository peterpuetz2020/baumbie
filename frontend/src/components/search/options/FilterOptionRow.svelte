<script lang="ts">
	import FilterOptionButton from './FilterOptionButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let options: { label: string; count: number }[] = [];
	export let selected: string[] = [];

	const dispatch = createEventDispatcher();

	// Keyboard navigation for horizontal scrolling
	function handleKeydown(event: KeyboardEvent) {
		const container = event.currentTarget as HTMLElement;

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			container.scrollBy({ left: -100, behavior: 'smooth' });
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			container.scrollBy({ left: 100, behavior: 'smooth' });
		} else if (event.key === 'Home') {
			event.preventDefault();
			container.scrollTo({ left: 0, behavior: 'smooth' });
		} else if (event.key === 'End') {
			event.preventDefault();
			container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
		}
	}
</script>

<!-- A11y: Scrollable region with keyboard navigation is a valid pattern -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="scroll-fade overflow-x-auto -mx-2 px-2"
	role="region"
	aria-label="Filter-Optionen - Pfeiltasten zum Scrollen verwenden"
	tabindex="0"
	on:keydown={handleKeydown}
>
	<div class="flex gap-2 pb-1 mb-4" style="width: max-content; min-width: 100%;" role="group">
		{#each options as item}
			<FilterOptionButton
				label={item.label}
				count={item.count}
				selected={selected.includes(item.label)}
				on:toggle={(e) => dispatch('toggle', e.detail)}
			/>
		{/each}
	</div>
</div>

<style>
	/* Horizontal scroll area with fading mask and custom scrollbar */
	.scroll-fade {
		/* Fading mask at left and right edges */
		mask-image: linear-gradient(
			to right,
			transparent 0,
			black 16px,
			black calc(100% - 16px),
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0,
			black 16px,
			black calc(100% - 16px),
			transparent 100%
		);

		/* Thin custom scrollbar for Firefox */
		scrollbar-color: #51af8b #e5e7eb;
		scrollbar-width: thin;
	}

	/* WebKit scrollbar styles (Chrome, Safari) */
	.scroll-fade::-webkit-scrollbar {
		height: 8px;
	}

	.scroll-fade::-webkit-scrollbar-track {
		background: #e5e7eb;
		border-radius: 4px;
	}

	.scroll-fade::-webkit-scrollbar-thumb {
		background-color: #51af8b;
		border-radius: 4px;
	}

	/* Focus outline for keyboard navigation */
	.scroll-fade:focus {
		outline: 2px solid #51af8b;
		outline-offset: 2px;
	}
</style>
