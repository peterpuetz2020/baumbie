<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate';
	import { waterEmoji } from '$lib/waterings';

	import type { WateringWithTree } from '$types/watering';

	export let watering: WateringWithTree;
	export let mode: 'tree' | 'user';
	export let currentUserId: string | null;
</script>

<div class="bg-white border-2 border-[#7C98B2] rounded-xl shadow-sm p-4 text-sm">
	{#if mode === 'user' && watering.tree?.uuid}
		<div class="flex justify-left mb-4">
			<slot name="treeButton" {watering} />
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
