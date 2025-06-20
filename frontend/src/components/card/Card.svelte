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
		role="dialog"
		aria-label="Dialogfenster"
		aria-modal="true"
		on:click|stopPropagation
		on:keyup={handleKeyUp}
		class="fixed bottom-[64px] top-[80px] left-0 right-0 z-[800] flex justify-center"
	>
		<!-- Inhalt mit max-Breite und Padding -->
		<div
			class="bg-white px-4 pt-4 rounded-t-xl shadow-xl flex flex-col w-full max-w-5xl mx-auto h-full overflow-hidden"
		>
			<!-- Header -->
			<header class="flex flex-row items-center justify-between shrink-0">
				<h1 class="text-2xl font-bold">{title}</h1>
				{#if closeable}
					<button on:click={close}>
						<img src="/card/cross.svg" alt="close" />
					</button>
				{/if}
			</header>

			<slot name="navigation" />

			<!-- Hauptinhalt -->
			<div class="grow min-h-0 flex flex-col">
				<div class="overflow-y-auto grow min-h-0">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
<!-- Card END -->
