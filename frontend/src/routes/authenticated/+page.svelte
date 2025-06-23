<script lang="ts">
	import { onMount } from 'svelte';
	import { DialogPanel } from '$components/overlay';
	import { getCurrentUser } from '$lib/supabase';

	let userEmail: string | undefined = '';

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const emailFromParam = urlParams.get('email');

		const user = await getCurrentUser();
		userEmail = user?.email ?? emailFromParam ?? 'Unbekannt';
	});
</script>

<DialogPanel title="Registrierung erfolgreich">
	<p>
		Wir haben eine Bestätigungsmail an <strong>{userEmail}</strong> gesendet. <br />
		Bitte klicke auf den Link darin, um dein Benutzerkonto zu aktivieren.
	</p>
</DialogPanel>
