<script lang="ts">
	import { onMount } from 'svelte';
	import Typography from '$components/typography/Typography.svelte';
	import { supabase } from '../../supabase';
	import type { Tree } from '../../types/tree';
	import { Button } from '$components/button';

	export let tree: Tree;

	let errorMessage: string = '';
	let successMessage: string = '';
	let alertUnauthorized: string =
		'Bitte <a href="/login" class="text-blue-600 underline">einloggen</a>, um diese Funktion zu nutzen.';

	$: adopted = false;
	$: label = 'Adoptiere diesen Baum';
	$: tree, adopted;

	onMount(async () => {
		const user = await supabase.auth.getUser();
		const userId = user?.data?.user?.id;
		const treeId = tree.uuid;

		if (!userId) {
			return;
		}

		const adoptedData = await supabase
			.from('adoptions')
			.select('*')
			.eq('tree_uuid', treeId)
			.eq('user_uuid', userId);
		adopted = adoptedData.data?.length !== 0;

		label = adopted ? 'Adoption aufheben' : 'Adoptiere diesen Baum';
	});

	const handleAdoptTree = async () => {
		let { data, error }: any = await supabase.auth.getUser();
		let isLoggedIn = !!data?.user;

		if (!isLoggedIn) {
			console.log('user is not logged in', isLoggedIn);
			errorMessage = alertUnauthorized;
			return;
		}

		if (error) {
			errorMessage = error.message;
			return;
		}

		if (!adopted) {
			({ data, error } = await supabase
				.from('adoptions')
				.insert({ tree_uuid: tree.uuid, user_uuid: data?.user?.id })
				.select());
		} else {
			({ data, error } = await supabase
				.from('adoptions')
				.delete()
				.eq('tree_uuid', tree.uuid)
				.eq('user_uuid', data?.user?.id));
		}
		if (error) {
			errorMessage =
				'Beim Adoptieren des Baumes ist ein Fehler aufgetreten. Hast du ihn vielleicht bereits adoptiert?';
			successMessage = '';
			return;
		}

		adopted = !adopted;
		label = adopted ? 'Adoption aufheben' : 'Adoptiere diesen Baum';
		successMessage = adopted ? 'Du hast diesen Baum erfolgreich adoptiert!' : 'Adoption aufgehoben';
		errorMessage = '';
	};
</script>

{#if tree}
	<div class="flex flex-col gap-2">
		<Button
			variant="primary"
			className="{adopted ? 'bg-gray-300' : 'bg-green-600'} justify-center"
			on:click={handleAdoptTree}>{label}</Button
		>
		<p class="text-center text-orange-500">{@html errorMessage}</p>
		<p class="text-center text-green-600">{successMessage}</p>
		<Typography>
			Mit einer Adoption dieses Baums zeigst du deine Verbundenheit mit diesem Baum und mit
			Bielefeld. Denn Bäume helfen uns bei einem lebenswerten und gesunden Leben.</Typography
		>
	</div>
{/if}
