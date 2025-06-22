<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button, Notice } from '$components/ui';
	import { DialogPanel } from '$components/overlay';
	import { logout, getCurrentUser, deleteCurrentUser } from '$lib/supabase';

	let user: { email?: string } | null = null;

	let deleteSuccess: boolean = false;
	let deleteError: string | null = null;

	onMount(async () => {
		user = await getCurrentUser();
	});

	const handleLogout = async () => {
		await logout();
		goto('/login');
	};

	const handleDelete = async () => {
		const result = await deleteCurrentUser();
		if (result.ok) {
			deleteSuccess = true;
			setTimeout(() => goto('/'), 2000);
		} else {
			deleteError = result.error ?? 'Unbekannter Fehler';
		}
	};
</script>

<DialogPanel title={'Mein Benutzerkonto'} open={true}>
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

			<Button variant="secondary" className="mt-4 w-full justify-center" onClick={handleLogout}
				>Ausloggen</Button
			>

			<p class="mt-4">
				Möchtest du deinen Account löschen? <br /> Damit werden alle von dir generierten Wässerungsdaten
				einem anonymen Benutzer zugeordnet. Dein Benutzer bei unserem Authentifizierungsdienst supabase.com
				wird sofort und unwideruflich gelöscht.
			</p>
			<Button variant="secondary" className="justify-center w-full mt-4" onClick={handleDelete}
				>Account löschen</Button
			>
			{#if deleteSuccess}
				<Notice message="Dein Account wurde gelöscht. Du wirst weitergeleitet..." tone="success" />
			{:else if deleteError}
				<Notice message={deleteError} tone="warning" />
			{/if}
		{:else}
			<p>Logge dich ein, um BaumBie mit allen Funktionen nutzen zu können.</p>
			<Button
				variant="secondary"
				className="justify-center w-full mt-4"
				onClick={() => goto('/login')}>Einloggen</Button
			>
		{/if}

		<p class="mt-8">
			<a class="underline" href="/imprint">Impressum</a> |
			<a class="underline" href="https://codefor.de/bielefeld/">Code for Bielefeld e.V.</a>
		</p>
	</div>
</DialogPanel>
