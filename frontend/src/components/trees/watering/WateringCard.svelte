<script lang="ts">
	import { formatDate, waterEmoji } from '$lib/utils/watering';
	import type { WateringWithTree } from '$types/watering';

	export let watering: WateringWithTree;
	export let mode: 'tree' | 'user';
	export let currentUserId: string | null;
</script>

<div class="bg-white rounded-lg shadow-sm p-4 text-sm">
	{#if mode === 'user' && watering.tree?.uuid}
		<div class="flex justify-center mb-4">
			<slot name="treeButton" {watering} />
		</div>
	{/if}

	<div class="flex justify-between text-gray-500 mb-2">
		<span class="font-semibold">Datum</span>
		<span class="text-black">{formatDate(watering.watered_at)}</span>
	</div>

	<div class="flex justify-between text-gray-500 mb-2">
		<span class="font-semibold">Liter</span>
		<span class="text-black">{watering.amount_liters}</span>
	</div>

	<div class="flex justify-between text-gray-500 mb-2">
		<span class="font-semibold">Gießkraft</span>
		<span class="text-black">{waterEmoji(watering.amount_liters)}</span>
	</div>

	{#if mode === 'tree'}
		<div class="flex justify-between text-gray-500 mb-2">
			<span class="font-semibold">Durch</span>
			<span class="text-black">
				<em>{currentUserId && watering.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
			</span>
		</div>
	{/if}

	{#if currentUserId && watering.user_uuid === currentUserId}
		<div class="mt-3 flex justify-center">
			<slot name="deleteButton" {watering} />
		</div>
	{/if}
</div>
