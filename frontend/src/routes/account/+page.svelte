<script lang="ts">
		import LinkButton from '../../components/button/LinkButton.svelte';
	import Card from '../../components/card/Card.svelte';
	import Heading from '../../components/typography/Heading.svelte';
</script>

<Card title={''} open={true}>
	<Heading level={1}>Mein Account</Heading>
	<div>
		<p>
			<strong>Benutzername</strong> <br />
			Max Mustermann
		</p>
		<p class="mt-4">Benutzername oder E-Mail <button class="underline">bearbeiten</button>?</p>
		<p>Passwort <button class="underline">ändern</button>?</p>

		<LinkButton class="mt-4 w-full justify-center" href="/register" label={'Ausloggen'} />

		<p class="mt-4">
			Möchtest du deinen Account löschen? <br /> Damit werden alle von dir generierten Wässerungsdaten
			einem anonymen Benutzer zugeordnet. Dein Benutzer bei unserem Authentifizierungsdienst supabase.com
			wird sofort und unwideruflich gelöscht.
		</p>
		<LinkButton class="mt-4 w-full justify-center" href="/register" label={'Account löschen'} />
		<p class="mt-8">
			<a class="underline" href="/imprint">Impressum</a> |
			<a class="underline" href="https://codefor.de/bielefeld/">Code for Bielefeld e.V.</a>
		</p>
	</div>
</Card>
