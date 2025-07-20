<script lang="ts">
	import { goto } from '$app/navigation';
	import Heading from '$components/ui/Heading.svelte';
	import { onMount } from 'svelte';
	import { resetHighlight } from '$lib/map';

	export let title;
	export let closeable: boolean | undefined = true;
	export let open: boolean = true;

	$: open, closeable;

	let minimized = true;

	onMount(() => {
		if (closeable === undefined) {
			closeable = true;
		}
	});

	const close = () => {
		resetHighlight();

		open = false;
		goto('/');
	};

	function toggleMinimize() {
		minimized = !minimized;
	}

	function handleKeyUp(e: KeyboardEvent) {
		const target = e.target as HTMLElement;

		if (!target || typeof target.click !== 'function') return;

		if (e.key === 'Enter') {
			e.preventDefault();
			target.click();
		}
	}
</script>

<!-- Panel START -->
{#if open}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-no-noninteractive-tabindex -->
	<div
		role="dialog"
		tabindex="0"
		aria-label="Dialogfenster"
		aria-modal="true"
		on:click|stopPropagation
		on:keyup={handleKeyUp}
		class="dialog-panel fixed bottom-[64px] top-[80px] left-0 right-0 z-[800] flex justify-center {minimized
			? 'minimized'
			: 'maximized'}"
	>
		<!-- Inhalt mit max-Breite und Padding -->
		<div
			class="dialog-content bg-white px-4 pt-4 shadow-xl flex flex-col w-full max-w-5xl mx-auto {minimized
				? 'h-[30vh]'
				: 'h-full'} rounded-t-xl"
		>
			<!-- Header -->
			<header class="flex flex-row items-center justify-between shrink-0">
				<Heading level={1}>{title}</Heading>
				<div class="flex items-center gap-6">
					{#if minimized}
						<button on:click={toggleMinimize} aria-label="Maximieren" class="translate-y-[-12px]">
							↑
						</button>
					{/if}

					{#if closeable}
						<button on:click={close} class="translate-y-[-12px]">
							<img src="/card/cross.svg" alt="close" />
						</button>
					{/if}
				</div>
			</header>

			<slot name="navigation" />

			<!-- Hauptinhalt -->
			<div class="flex-1 min-h-0 flex flex-col">
				<div class="flex-1 min-h-0 overflow-y-auto">
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
<!-- Panel END -->

<style>
	.dialog-panel {
		transition: transform 0.3s ease-out;
	}

	.dialog-content {
		transition: height 0.3s ease-out;
	}

	.dialog-panel.minimized {
		transform: translateY(calc(100% - 30vh));
	}

	.dialog-panel.maximized {
		transform: translateY(0);
	}
</style>
