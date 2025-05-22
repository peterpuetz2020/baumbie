<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import WaterColumn from '../../../components/WaterColumn.svelte';
	import Chat from '../../../components/chat/Chat.svelte';
	import Card from '../../../components/card/Card.svelte';
	import AdoptTree from '../../../features/adoption/AdoptTree.svelte';
	import { supabase } from '../../../supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Tree } from '../../../types/Tree';
	import type { TreeMetadata } from '../../../types/TreeCharacter';
	import TreeMetric from '../../../components/trees/TreeMetric.svelte';

	export let activeTabIndex: number = 0;

	function handleTabChange(tab: number) {
		activeTabIndex = tab;
	}

	let openAbout = true;
	let openWater = false;
	let openEnvironment = false;
	let openHistory = false;

	$: showInfo = true;
	$: showChat = false;

	let tree: Tree;
	let treeCharacter: TreeMetadata;

	onMount(async () => {
		const { data: treeData, error: treeError } = await supabase
			.from('trees')
			.select()
			.eq('uuid', $page.params.treeId)
			.maybeSingle();
		tree = treeData;
		console.log('treeData', treeData);

		if (tree) {
			const { data: characterData, error: characterError } = await supabase
				.from('Baumarten')
				.select("*")
				.eq('baumart_bo', tree.tree_type_botanic)
				.maybeSingle();
			treeCharacter = characterData;
		}
	});

	$:console.log('treeCharacter', treeCharacter);
</script>

{#if tree}
	<Card title={tree.tree_type_german} open={true}>
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
						class="flex-1 py-2 shrink gap-2.5 self-stretch my-auto ${showInfo ? 'text-zinc-600' : 'text-neutral-500'} z-10"
						on:click={() => handleTabChange(0)}
						tabindex="0"
					>
						Infos
					</button>
					<button
						role="tab"
						aria-selected={activeTabIndex === 1}
						class="flex-1 py-2 shrink gap-2.5 self-stretch my-auto ${showChat ? 'text-zinc-600' : 'text-neutral-500'} z-10"
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


						<div>
							<p class="text-black font-bold">Über mich</p>
							<p class="text-sm text-gray-800">
							{treeCharacter?.Vorstellungstext_emotional?
								treeCharacter.Vorstellungstext_emotional :
								"Hej, wie mein Name schon verrät komme ich ursprünglich aus dem Norden von Europa. Ich bin sehr variabel in meinem Äußeren. Entweder wachse ich bis zu 15m mit einem geraden Stamm, oder aber du findest mich als mehrstämmigen großen Strauch."
							}
							</p>
						</div>
						<div >
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800">
								<TreeMetric label="Höhe" value={tree.height} unit="m" max={39} position="right" />
								<TreeMetric label="Kronendurchmesser" value={tree.crown_diameter} unit="m" max={29} position="top" />
								<TreeMetric label="Stammdurchmesser" value={tree.trunk_diameter} unit="cm" max={297} position="bottom" />
							</div>
						</div>

					<hr>
					<Accordion bind:open={openEnvironment}>
						<div slot="head">
							<p class="text-black font-bold">Meine Bedeutung für die Umwelt</p>
						</div>
						<div slot="details">
							<p class="text-sm text-gray-800">
								Hier wollen wir zeigen, welche Wirkung dieser Baum auf seine direkte Umwelt hat: Schatten, Luftfeuchtigkeit, Temperatur, etc. Das Feature ist noch in der Entwicklung.
							</p>
						</div>
					</Accordion>
					<hr>
					<Accordion bind:open={openWater}>
						<div slot="head">
							<p class="text-black font-bold">Mein Wasserbedarf</p>
						</div>
						<div slot="details">
							<p class="text-sm text-gray-800">
								Das ist eine Beispielansicht. Wir sind noch dabei, alle nötigen Daten einzusammeln.
							</p>
							<WaterColumn />
						</div>
					</Accordion>
					<hr>
					<Accordion bind:open={openHistory}>
						<div slot="head">
							<p class="text-black font-bold">Wer mich wann gegossen hat</p>
						</div>
						<div slot="details">
							<p class="text-sm text-gray-800">
								Hier werden die letzten 10 Gießungen angezeigt.
							</p>
						</div>
					</Accordion>
					<hr>
							


					<AdoptTree {tree} />
				{:else}
					<Chat treeId={tree.uuid} />
				{/if}
			</div>
		</div>
	</Card>
{/if}
