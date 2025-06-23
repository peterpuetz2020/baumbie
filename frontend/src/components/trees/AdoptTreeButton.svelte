<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import type { TreeData } from '$types/tree';
	import { Button, Notice } from '$components/ui';

	export let tree: TreeData;

	let adopted = false;
	let authorized = false;
	let label = '';
	let message: string | null = null;
	let messageTone: 'success' | 'warning' | 'info' | undefined = undefined;

	$: label = adopted ? 'Adoption aufheben' : 'Adoptiere diesen Baum';

	onMount(async () => {
		const { data } = await supabase.auth.getUser();
		const user = data?.user;

		if (!user) {
			authorized = false;
			return;
		}
		authorized = true;

		const { data: adoptedData } = await supabase
			.from('adoptions')
			.select('*')
			.eq('tree_uuid', tree.uuid)
			.eq('user_uuid', user.id);

		adopted = Array.isArray(adoptedData) && adoptedData.length > 0;
	});

	const handleAdoptTree = async () => {
		const { data, error } = await supabase.auth.getUser();
		const user = data?.user;

		if (!user) {
			authorized = false;
			message = null;
			return;
		}
		authorized = true;

		if (error) {
			message = error.message;
			messageTone = 'warning';
			return;
		}

		let op;
		if (!adopted) {
			op = supabase.from('adoptions').insert({ tree_uuid: tree.uuid, user_uuid: user.id }).select();
		} else {
			op = supabase.from('adoptions').delete().eq('tree_uuid', tree.uuid).eq('user_uuid', user.id);
		}

		const { error: opError } = await op;

		if (opError) {
			message =
				'Beim Adoptieren des Baumes ist ein Fehler aufgetreten. Hast du ihn vielleicht bereits adoptiert?';
			messageTone = 'warning';
			return;
		}

		adopted = !adopted;
		message = adopted
			? 'Du hast diesen Baum erfolgreich adoptiert!'
			: 'Die Adoption wurde aufgehoben.';
		messageTone = 'success';
	};
</script>

{#if tree}
	<div class="flex flex-col gap-2">
		<Button
			variant="primary"
			className="{adopted || !authorized
				? 'bg-gray-300'
				: 'bg-green-600'} justify-center opacity-{authorized ? '100' : '50'} cursor-{authorized
				? 'pointer'
				: 'default'}"
			onClick={handleAdoptTree}
		>
			{label}
		</Button>

		{#if !authorized}
			<Notice tone="warning">"Bitte einloggen, um diese Funktion zu nutzen."</Notice>
		{:else if message}
			<Notice tone={messageTone}>{message}</Notice>
		{/if}

		<p class="mt-2">
			Mit einer Adoption dieses Baums zeigst du deine Verbundenheit mit diesem Baum und mit
			Bielefeld. Denn Bäume helfen uns bei einem lebenswerten und gesunden Leben.
		</p>
	</div>
{/if}
