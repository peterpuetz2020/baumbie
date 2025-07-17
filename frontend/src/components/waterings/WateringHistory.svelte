<script lang="ts">
	// Svelte intern
	import { createEventDispatcher } from 'svelte';

	// UI-Komponenten
	import { Notice } from '$components/ui';
	import WateringCard from './WateringCard.svelte';
	import WateringTable from './WateringTable.svelte';
	import DeleteWateringButton from './DeleteWateringButton.svelte';
	import { FlyToTreeButton } from '$components/actions';

	// Utilities & Typen
	import { isMobile } from '$lib/utils/media';
	import type { Watering } from '$types/watering';

	// Liste der Gießvorgänge
	export let waterings: Watering[] = [];

	// ID des aktuell eingeloggten Nutzers (zur Rechteprüfung)
	export let currentUserId: string | null = null;

	// Optional: Map für benutzerdefinierte Labels je Baum-UUID.
	// Ermöglicht eine schnellere Anzeige, da der Button nicht selbst nachladen muss.
	// Diese Komponente benötigt sie nicht zwingend – sie zeigt Nutzer-Gießungen an –
	// aber die zusätzliche Prop kann zur Optimierung der Darstellung genutzt werden.
	export let labelsByTreeId: Map<string, string> = new Map();

	// Modus zur Darstellung (z.B. zeigt in "user"-Modus den Baum statt den Gießer an)
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
				<svelte:fragment slot="treeButton" let:watering let:setWarning>
					<FlyToTreeButton
						treeId={watering.tree_uuid}
						label={labelsByTreeId.get(watering.tree_uuid)}
						on:warning={(e) => setWarning(e.detail.message)}
					/>
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
		<svelte:fragment slot="treeButton" let:watering let:setWarning>
			<FlyToTreeButton
				treeId={watering.tree_uuid}
				label={labelsByTreeId.get(watering.tree_uuid)}
				on:warning={(e) => setWarning?.(e.detail.message, watering.uuid)}
			/>
		</svelte:fragment>

		<svelte:fragment slot="deleteButton" let:watering>
			<DeleteWateringButton {watering} on:reload={() => dispatch('reload')} />
		</svelte:fragment>
	</WateringTable>
{/if}
