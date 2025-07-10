<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';

	import type { TreeData } from '$types/tree';

	import { Accordion } from '$components/ui';
	import type AccordionType from '$components/ui/Accordion.svelte';

	import { DialogPanel } from '$components/overlay';
	import { Chat } from '$components/chat';
	import { AdoptTreeButton, WaterTreeButton, TreeMetric, WateringSection } from '$components/trees';
	import Notice from '$components/ui/Notice.svelte';

	export let activeTabIndex = 0;
	const handleTabChange = (tab: number) => (activeTabIndex = tab);

	let historyAccordionRef: AccordionType;

	let openAbout = true;
	let openWater = false;
	let openHistory = false;

	$: showInfo = activeTabIndex === 0;
	$: showChat = activeTabIndex === 1;

	let tree: TreeData;

	// Lädt den Baum neu, sobald sich die treeId in der URL ändert
	$: if ($page.params.treeId) {
		(async () => {
			const { data } = await supabase
				.from('trees')
				.select()
				.eq('uuid', $page.params.treeId)
				.maybeSingle();
			tree = data;
		})();
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
							<p class="text-black font-bold">Über diesen Baum</p>
						</div>
						<div slot="details">
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
					<Accordion bind:open={openWater}>
						<div slot="head">
							<p class="text-black font-bold">Wasserbedarf</p>
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
							<p class="text-black font-bold">Wer wann gegossen hat</p>
						</div>
						<div slot="details">
							<WateringSection
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
