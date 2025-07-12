<script lang="ts">
	import { formatDate, waterEmoji } from '$lib/utils/watering';
	import type { WateringWithTree } from '$types/watering';

	export let waterings: WateringWithTree[] = [];
	export let currentUserId: string | null = null;
	export let mode: 'tree' | 'user' = 'tree';
</script>

<table class="w-full text-sm text-left border-separate border-spacing-y-1 mt-3 hidden md:table">
	<thead class="text-gray-500 text-xs tracking-wider">
		<tr>
			<th class="px-3 py-2">Datum</th>
			<th class="px-3 py-2">Liter</th>
			<th class="px-3 py-2">Gießkraft</th>
			{#if mode === 'tree'}
				<th class="px-3 py-2">Durch</th>
			{:else}
				<th class="px-3 py-2">Baum</th>
			{/if}
			<th class="px-3 py-2">Aktion</th>
		</tr>
	</thead>

	<tbody>
		{#each waterings as w}
			<tr
				class="bg-white shadow-sm rounded-md transition duration-300 ease-in-out hover:bg-gray-50"
			>
				<td class="px-3 py-2">{formatDate(w.watered_at)}</td>
				<td class="px-3 py-2">{w.amount_liters}</td>
				<td class="px-3 py-2">{waterEmoji(w.amount_liters)}</td>

				<td class="px-3 py-2">
					{#if mode === 'tree'}
						<em>{currentUserId && w.user_uuid === currentUserId ? 'Du' : 'anonym'}</em>
					{:else if w.tree?.uuid}
						<slot name="treeButton" {w} />
					{:else}
						<em>Unbekannter Baum</em>
					{/if}
				</td>

				<td class="px-3 py-2">
					{#if currentUserId && w.user_uuid === currentUserId}
						<slot name="deleteButton" {w} />
					{:else}
						<em>-</em>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
