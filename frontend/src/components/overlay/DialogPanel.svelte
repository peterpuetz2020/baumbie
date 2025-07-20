<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Heading } from '$components/ui';
	import { resetHighlight } from '$lib/map';
	import { dialogMinimized } from '$lib/ui';

	export let title;
	export let closeable: boolean | undefined = true;
	export let open: boolean = true;

	$: open, closeable;

	$: minimized = $dialogMinimized;

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

	function handleKeyUp(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (!target || typeof target.click !== 'function') return;

		if (e.key === 'Enter') {
			e.preventDefault();
			target.click();
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-no-noninteractive-tabindex -->
	<div
		role="dialog"
		tabindex="0"
		aria-label="Dialogfenster"
		aria-modal="true"
		on:click|stopPropagation
		on:keyup={handleKeyUp}
		class="dialog-panel fixed bottom-[64px] left-0 right-0 z-[800] flex justify-center {minimized
			? 'minimized'
			: 'maximized'}"
	>
		<!-- Inhalt mit max-Breite und Padding -->
		<div
			class="dialog-content bg-white px-4 pt-4 shadow-xl flex flex-col w-full max-w-5xl mx-auto {minimized
				? 'h-[30vh]'
				: 'h-[calc(100vh-144px)]'} rounded-t-xl"
		>
			<!-- Header -->
			<header class="flex flex-row items-center justify-between shrink-0">
				<Heading level={1}>{title}</Heading>
				<div class="flex items-center gap-6">
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

<style>
	.dialog-panel {
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.dialog-content {
		transition: height 0.3s ease-out;
		box-shadow:
			0 -4px 6px -1px rgb(0 0 0 / 0.1),
			0 -2px 4px -2px rgb(0 0 0 / 0.1);
	}

	/* Geschlossen: Drawer ist komplett unter der Navbar versteckt */
	.dialog-panel:not(.maximized):not(.minimized) {
		transform: translateY(calc(100% + 64px));
	}

	/* Minimiert: Nur oberer Teil sichtbar, über der Navbar */
	.dialog-panel.minimized {
		transform: translateY(calc(100% - 30vh));
	}

	/* Maximiert: Vollständig sichtbar, über der Navbar */
	.dialog-panel.maximized {
		transform: translateY(0);
	}

	/* Initial state für smooth entrance */
	.dialog-panel {
		transform: translateY(calc(100% + 64px));
	}
</style>
