<script lang="ts">
	import L from 'leaflet';

	export let map: L.Map;

	let userMarker: L.Marker | null = null;

    // Platzhalter für Positionsmarker
	const userMarkerHtml = `
		<div class="relative">
			<div class="w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
			<button
				class="absolute -top-2 -right-2 bg-white text-black border border-gray-300 rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow"
				data-remove-marker
				title="Marker entfernen"
			>
				×
			</button>
		</div>
	`;

	function zoomIn() {
		map?.zoomIn();
	}

	function zoomOut() {
		map?.zoomOut();
	}

	function centerOnUser() {
		if (!map) return;

		if (userMarker) {
			map.removeLayer(userMarker);
			userMarker = null;
		}

		map.off('locationfound');
		map.off('locationerror');
		map.locate();

		map.once('locationfound', (e) => {
			map.flyTo(e.latlng, 20, {
				animate: true,
				duration: 1.5
			});

			const icon = L.divIcon({
				html: userMarkerHtml,
				className: '',
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			});

			userMarker = L.marker(e.latlng, { icon }).addTo(map);

			const markerEl = userMarker.getElement();
			if (markerEl) {
				markerEl.querySelector('[data-remove-marker]')?.addEventListener('click', () => {
					map.removeLayer(userMarker!);
					userMarker = null;
				});
			}
		});

		map.once('locationerror', () => {
			alert('Standort konnte nicht ermittelt werden.');
		});
	}
</script>

<!-- UI für Zoom + Standort -->
<div class="absolute bottom-[80px] right-4 flex flex-col gap-2 z-[1000]">
	<!-- 📍 Standort zentrieren -->
	<button
		on:click={centerOnUser}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Standort zentrieren"
	>
		<img src="/buttons/locate.svg" alt="Standort zentrieren" class="w-7 h-7" />
	</button>

	<!-- ➕ Zoom In -->
	<button
		on:click={zoomIn}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Zoom in"
	>
		<img src="/buttons/zoom-in.svg" alt="Zoom in" class="w-8 h-8" />
	</button>

	<!-- ➖ Zoom Out -->
	<button
		on:click={zoomOut}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Zoom out"
	>
		<img src="/buttons/zoom-out.svg" alt="Zoom out" class="w-8 h-8" />
	</button>
</div>