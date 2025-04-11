<script lang="ts">
	import L from 'leaflet';

	export let map: L.Map;

	let userMarker: L.Marker | null = null;

    // Platzhalter für Positionsmarker

// ... existing code ...
const userMarkerHtml = `
    <div class="relative">
        <svg width="28" height="27" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.4 18.6 0 12 0Z" fill="#EF4444"/>
            <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
        <button
            class="absolute -top-2 -right-2 bg-white text-red-500 border border-red-300 rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow hover:bg-red-50"
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
<div class="absolute bottom-[90px] right-4 flex flex-col gap-2 z-[1000]">
	<!-- 📍 Standort zentrieren -->
	<button
		on:click={centerOnUser}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Standort zentrieren"
	>
		<img src="/map/controls/locate.svg" alt="Standort zentrieren" class="w-7 h-7" />
	</button>

	<!-- ➕ Zoom In -->
	<button
		on:click={zoomIn}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Zoom in"
	>
		<img src="/map/controls/zoom-in.svg" alt="Zoom in" class="w-8 h-8" />
	</button>

	<!-- ➖ Zoom Out -->
	<button
		on:click={zoomOut}
		class="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition"
		aria-label="Zoom out"
	>
		<img src="/map/controls/zoom-out.svg" alt="Zoom out" class="w-8 h-8" />
	</button>
</div>