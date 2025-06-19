<script lang="ts">
	import { onMount } from 'svelte';
	import Typography from '$components/typography/Typography.svelte';
	import { supabase } from '../../supabase';
	import type { Tree } from '../../types/Tree.ts';
	import { Button } from '$components/button';

	export let tree: Tree;

	let adopted = false;
	let label = '';
	let errorMessage = '';
	let successMessage = '';
	let authorized = false;

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
			errorMessage = '';
			successMessage = '';
			return;
		}
		authorized = true;

		if (error) {
			errorMessage = error.message;
			successMessage = '';
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
			errorMessage =
				'Beim Adoptieren des Baumes ist ein Fehler aufgetreten. Hast du ihn vielleicht bereits adoptiert?';
			successMessage = '';
			return;
		}

		adopted = !adopted;
		successMessage = adopted ? 'Du hast diesen Baum erfolgreich adoptiert!' : 'Adoption aufgehoben';
		errorMessage = '';
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
			<p class="text-center text-orange-500">
				Bitte <a href="/login" class="text-blue-600 underline">einloggen</a>, um diese Funktion zu
				nutzen.
			</p>
		{:else if errorMessage}
			<p class="text-center text-orange-500">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="text-center text-green-600">{successMessage}</p>
		{/if}

		<Typography>
			Mit einer Adoption dieses Baums zeigst du deine Verbundenheit mit diesem Baum und mit
			Bielefeld. Denn Bäume helfen uns bei einem lebenswerten und gesunden Leben.
		</Typography>
	</div>
{/if}
