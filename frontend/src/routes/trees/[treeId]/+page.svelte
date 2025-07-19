<script lang="ts">
	// SvelteKit stores
	import { page } from '$app/stores';

	// Typen
	import type { TreeData } from '$types/tree';
	import type AccordionType from '$components/ui/Accordion.svelte';

	// Supabase-Funktionen
	import { getTreeById, getTreeSpeciesDescription } from '$lib/supabase';

	// Komponenten
	import { Accordion, Notice } from '$components/ui';
	import { DialogPanel } from '$components/overlay';
	import { Chat } from '$components/chat';
	import { AdoptTreeButton, WaterTreeButton, TreeMetric, TreeWaterings } from '$components/trees';

	export let activeTabIndex = 0;
	const handleTabChange = (tab: number) => (activeTabIndex = tab);

	let historyAccordionRef: AccordionType;

	let openAbout = true;
	let openWater = false;
	let openHistory = false;
	let openEnvironment = false;
	let treeDescription: string | null = null;

	$: showInfo = activeTabIndex === 0;
	$: showChat = activeTabIndex === 1;

	let tree: TreeData;

	async function loadTree(treeId: string) {
		tree = await getTreeById(treeId);

		if (tree) {
			treeDescription = await getTreeSpeciesDescription(tree.tree_type_botanic);
		}
	}

	// Reloads the tree whenever the treeId in the URL changes
	$: if ($page.params.treeId) {
		loadTree($page.params.treeId);
	}
</script>

{#if tree}
	<DialogPanel title={tree.tree_type_german} open={true}>
		<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
		<div slot="navigation">
			<nav
				id="single-tree-navigation"
				class="flex flex-col justify-center px-3 py-2 mb-4 text-base font-medium text-center bg-green-600 rounded-md shadow-sm bg-opacity-60 whitespace-nowrap"
				role="tablist"
				aria-label="Content sections"
			>
				<section class="relative flex items-center justify-between w-full">
					<div
						class={`absolute transition-transform ${activeTabIndex === 0 ? 'translate-x-0' : 'translate-x-full'} z-0 bg-white rounded h-[100%] shadow-[0px_1px_4px_rgba(0,0,0,0.15)] w-[50%]`}
					/>

					<button
						role="tab"
						aria-selected={activeTabIndex === 0}
						class="flex-1 py-2 shrink gap-2.5 self-stretch my-auto ${showInfo
							? 'text-zinc-600'
							: 'text-neutral-500'} z-10"
						on:click={() => handleTabChange(0)}
						tabindex="0"
					>
						Infos
					</button>
					<button
						role="tab"
						aria-selected={activeTabIndex === 1}
						class="flex-1 py-2 shrink gap-2.5 self-stretch my-auto ${showChat
							? 'text-zinc-600'
							: 'text-neutral-500'} z-10"
						on:click={() => handleTabChange(1)}
						tabindex="0"
					>
						Chat
					</button>
				</section>
			</nav>
		</div>

		<div id="single-tree-content" class="flex flex-col h-full">
			<div class="flex flex-col gap-4 h-full">
				{#if activeTabIndex === 0}
					<Accordion bind:open={openAbout}>
						<div slot="head">
							<p class="text-black font-bold">🌳 Über diesen Baum</p>
						</div>
						<div slot="details">
							<p class="text-sm text-gray-800">
								{treeDescription
									? treeDescription
									: 'Hej, wie mein Name schon verrät komme ich ursprünglich aus dem Norden von Europa. …'}
							</p>
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800">
								<TreeMetric label="Höhe" value={tree.height} unit="m" max={39} position="right" />
								<TreeMetric
									label="Kronendurchmesser"
									value={tree.crown_diameter}
									unit="m"
									max={29}
									position="top"
								/>
								<TreeMetric
									label="Stammdurchmesser"
									value={tree.trunk_diameter}
									unit="cm"
									max={297}
									position="bottom"
								/>
							</div>
						</div>
					</Accordion>
					<hr />
					<Accordion bind:open={openEnvironment}>
						<div slot="head">
							<p class="text-black font-bold">🏙️ Wirkung auf das Stadtklima</p>
						</div>
						<div slot="details">
							<Notice tone="info">
								Dieser Baum beeinflusst seine Umgebung positiv: Er spendet Schatten, reguliert das
								Mikroklima, verbessert die Luftqualität und bietet Lebensraum für Tiere und
								Insekten. Weitere Informationen folgen in einem späteren Update.
							</Notice>
						</div>
					</Accordion>
					<hr />
					<Accordion bind:open={openWater}>
						<div slot="head">
							<p class="text-black font-bold">💦 Wasserbedarf</p>
						</div>
						<div slot="details">
							<Notice tone="info">
								Hier wird künftig sichtbar, wie viel Wasser dieser Baum braucht und ob der Regen in
								letzter Zeit gereicht hat.
							</Notice>
						</div>
					</Accordion>
					<hr />
					<Accordion bind:open={openHistory} bind:this={historyAccordionRef}>
						<div slot="head">
							<p class="text-black font-bold">🚿 Gießungen</p>
						</div>
						<div slot="details">
							<TreeWaterings
								treeId={tree.uuid}
								on:contentChanged={() => historyAccordionRef?.updateHeightExternally()}
							/>
						</div>
					</Accordion>

					<hr />
					<WaterTreeButton {tree} />
					<AdoptTreeButton {tree} />
				{:else}
					<Chat treeId={tree.uuid} />
				{/if}
			</div>
		</div>
	</DialogPanel>
{/if}
