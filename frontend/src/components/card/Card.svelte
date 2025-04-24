<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let title;
	export let closeable: boolean | undefined = true;
	export let open: boolean = true;

	$: open, closeable;

	onMount(() => {
		if (closeable === undefined) {
			closeable = true;
		}
	});

	const close = () => {
		open = false;
		goto('/');
	};

	function handleKeyUp(e: KeyboardEvent) {
		const target = e.target as HTMLElement;

		if (!target || typeof target.click !== 'function') return;

		if (e.key === 'Enter') {
			e.preventDefault();
			target.click();
		}
	}
</script>

<!-- Card START -->
{#if open}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		id="card"
		aria-label="Dialogfenster"
		aria-modal="true"
		class="container mx-auto z-[1100] bg-white px-4 pt-4 rounded-t-xl h-[80vh] max-h-[80vh]"
		on:click|stopPropagation
		role="dialog"
		on:keyup={handleKeyUp}
	>
		<div id="card-content" class="flex flex-col h-full">
			<!-- Navigation -->
			<div class="flex flex-row items-center justify-between shrink">
				<div>
					<h1 class="text-2xl font-bold">{title}</h1>
				</div>
				{#if closeable}
					<button class="shrink" on:click={close}>
						<img src="/card/cross.svg" alt="close" />
					</button>
				{/if}
			</div>
			<!-- Navigation END -->

			<slot name="navigation" />

			<!-- Card Content -->
			<div class="grow">
				<slot />
			</div>
			<!-- Card Content END -->
		</div>
	</div>
{/if}
<!-- Card END -->

