<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Notice } from '$components/ui';
	import WateringCard from './WateringCard.svelte';
	import WateringTable from './WateringTable.svelte';
	import DeleteWateringButton from './DeleteWateringButton.svelte';
	import { FlyToTreeButton } from '$components/actions';
	import { isMobile } from '$lib/utils/media';

	import type { WateringWithTree } from '$types/watering';

	export let waterings: WateringWithTree[] = [];
	export let currentUserId: string | null = null;
	export let mode: 'tree' | 'user' = 'tree';

	const dispatch = createEventDispatcher();
</script>

{#if waterings.length === 0}
	<Notice tone="info">Bisher wurden noch keine Gießungen für diesen Baum eingetragen.</Notice>
{:else if $isMobile}
	<!-- 📱 Mobile Darstellung -->
	<div class="mt-3 space-y-3">
		{#each waterings as watering}
			<WateringCard {watering} {mode} {currentUserId}>
				<svelte:fragment slot="treeButton" let:watering>
					{#if watering.tree?.uuid}
						<FlyToTreeButton
							treeId={watering.tree.uuid}
							label={watering.tree.tree_type_german ?? 'Baum'}
						/>
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="deleteButton" let:watering>
					<DeleteWateringButton {watering} on:reload={() => dispatch('reload')} />
				</svelte:fragment>
			</WateringCard>
		{/each}
	</div>
{:else}
	<!-- 💻 Desktop/Tabletdarstellung -->
	<WateringTable {waterings} {currentUserId} {mode}>
		<svelte:fragment slot="treeButton" let:w>
			<FlyToTreeButton treeId={w.tree?.uuid} label={w.tree?.tree_type_german ?? 'Baum'} />
		</svelte:fragment>

		<svelte:fragment slot="deleteButton" let:w>
			<DeleteWateringButton watering={w} on:reload={() => dispatch('reload')} />
		</svelte:fragment>
	</WateringTable>
{/if}
