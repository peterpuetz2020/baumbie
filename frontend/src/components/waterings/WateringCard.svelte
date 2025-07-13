<script lang="ts">
	// Svelte lifecycle
	import { onDestroy } from 'svelte';

	// UI & Utilities
	import { Notice } from '$components/ui';
	import { formatDate } from '$lib/utils/formatDate';
	import { waterEmoji } from '$lib/waterings';

	// Types
	import type { Watering } from '$types/watering';

	// Props
	export let watering: Watering;
	export let mode: 'tree' | 'user';
	export let currentUserId: string | null;

	// Local state for warning message
	let warningMessage: string | null = null;
	let warningTimeout: ReturnType<typeof setTimeout> | null = null;

	function setWarning(msg: string) {
		warningMessage = msg;

		if (warningTimeout) {
			clearTimeout(warningTimeout);
		}

		warningTimeout = setTimeout(() => {
			warningMessage = null;
			warningTimeout = null;
		}, 5000);
	}

	onDestroy(() => {
		if (warningTimeout) {
			clearTimeout(warningTimeout);
		}
	});
</script>

<div class="bg-white border-2 border-[#7C98B2] rounded-xl shadow-sm p-4 text-sm">
	{#if mode === 'user'}
		<div class="flex justify-left mb-4">
			<slot name="treeButton" {watering} {setWarning} />
		</div>
	{/if}

	{#if warningMessage}
		<div class="mb-3 text-xs text-left leading-snug">
			<Notice tone="warning">{warningMessage}</Notice>
		</div>
	{/if}

	<div class="flex items-center justify-between text-gray-600 mb-2">
		<span class="text-xs tracking-wide font-medium text-gray-500">🗓️ Datum</span>
		<span class="text-black">{formatDate(watering.watered_at)}</span>
	</div>

	<div class="flex items-center justify-between text-gray-600 mb-2">
		<span class="text-xs tracking-wide font-medium text-gray-500">🚰 Liter</span>
		<span class="text-black">{watering.amount_liters}</span>
	</div>

	<div class="flex items-center justify-between text-gray-600 mb-2">
		<span class="text-xs tracking-wide font-medium text-gray-500">🚿 Gießkraft</span>
		<span class="text-black">{waterEmoji(watering.amount_liters)}</span>
	</div>

	{#if mode === 'tree'}
		<div class="flex items-center justify-between text-gray-600 mb-2">
			<span class="text-xs tracking-wide font-medium text-gray-500">👤 Durch</span>
			<span class="text-black">
				<em>{currentUserId && watering.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
			</span>
		</div>
	{/if}

	{#if currentUserId && watering.user_uuid === currentUserId}
		<div class="mt-2 flex justify-end">
			<slot name="deleteButton" {watering} />
		</div>
	{/if}
</div>
