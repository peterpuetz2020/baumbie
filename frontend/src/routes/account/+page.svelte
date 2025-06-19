<script lang="ts">
	import LinkButton from '../../components/button/LinkButton.svelte';
	import Card from '../../components/card/Card.svelte';
	import Heading from '../../components/typography/Heading.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';

	let user: { email?: string } | null = null;

	onMount(async () => {
		const { data } = await supabase.auth.getUser();
		user = data.user ?? null;
	});

	const handleLogout = async () => {
		await supabase.auth.signOut();
		goto('/login');
	};
</script>

<Card title={''} open={true}>
	<Heading level={1}>Mein Account</Heading>
	<div>
		{#if user}
			<p>
				<strong>Nutzer</strong> <br />
				{user.email}
			</p>
			<p class="mt-4">
				Benutzername oder E-Mail <button class="underline">bearbeiten</button>?
			</p>
			<p>
				Passwort <button class="underline">ändern</button>?
			</p>

			<LinkButton class="mt-4 w-full justify-center" href="/login" label={'Ausloggen'} on:click={handleLogout}/>

			<p class="mt-4">
				Möchtest du deinen Account löschen? <br /> Damit werden alle von dir generierten Wässerungsdaten
				einem anonymen Benutzer zugeordnet. Dein Benutzer bei unserem Authentifizierungsdienst supabase.com
				wird sofort und unwideruflich gelöscht.
			</p>
			<LinkButton class="mt-4 w-full justify-center" href="/login" label={'Account löschen'} />
		{:else}
			<p>Logge dich ein, um BaumBie mit allen Funktionen nutzen zu können.</p>
			<LinkButton class="mt-4 w-full justify-center" href="/login" label={'Einloggen'} />
		{/if}
		
		<p class="mt-8">
			<a class="underline" href="/imprint">Impressum</a> |
			<a class="underline" href="https://codefor.de/bielefeld/">Code for Bielefeld e.V.</a>
		</p>
	</div>
</Card>
