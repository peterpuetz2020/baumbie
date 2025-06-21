<script lang="ts">
	import { Accordion } from '$components/ui';
	import WaterColumn from '$components/WaterColumn.svelte';
	import Chat from '$components/chat/Chat.svelte';
	import { DialogPanel } from '$components/overlay';

	import AdoptTree from '../../../features/adoption/AdoptTree.svelte';
	import { supabase } from '../../../supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Tree as TreeType } from '../../../types/Tree';
	import TreeMetric from '$components/trees/TreeMetric.svelte';

	export let activeTabIndex: number = 0;

	function handleTabChange(tab: number) {
		activeTabIndex = tab;
	}

	let openAbout = true;
	let openWater = false;
	let openHistory = false;

	$: showInfo = true;
	$: showChat = false;

	let tree: TreeType;

	onMount(async () => {
		const { data, error } = await supabase
			.from('trees')
			.select()
			.eq('uuid', $page.params.treeId)
			.maybeSingle();
		tree = data;
	});
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
							<p class="text-black font-bold">Über mich</p>
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
							<p class="text-sm text-gray-800">
								Das ist eine Beispielansicht. Wir sind noch dabei, alle nötigen Daten einzusammeln.
							</p>
							<WaterColumn />
						</div>
					</Accordion>
					<hr />
					<Accordion bind:open={openHistory}>
						<div slot="head">
							<p class="text-black font-bold">Wer wann gegossen hat</p>
						</div>
						<div slot="details">
							<p class="text-sm text-gray-800">Hier werden die letzten 10 Gießungen angezeigt.</p>
						</div>
					</Accordion>
					<hr />

					<AdoptTree {tree} />
				{:else}
					<Chat treeId={tree.uuid} />
				{/if}
			</div>
		</div>
	</DialogPanel>
{/if}
