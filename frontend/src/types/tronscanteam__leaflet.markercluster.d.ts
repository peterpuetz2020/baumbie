declare module '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src' {
	import * as L from 'leaflet';

	export interface MarkerCluster extends L.Marker {
		getChildCount(): number;
		getAllChildMarkers(): L.Marker[];
	}

	export interface MarkerClusterOptions extends L.MarkerOptions {
		spiderfyOnMaxZoom?: boolean;
		showCoverageOnHover?: boolean;
		zoomToBoundsOnClick?: boolean;
		disableClusteringAtZoom?: number;
		iconCreateFunction?: (cluster: MarkerCluster) => L.DivIcon;
	}

	export class MarkerClusterGroup extends L.FeatureGroup {
		constructor(options?: MarkerClusterOptions);

		addLayer(layer: L.Layer): this;
		removeLayer(layer: L.Layer): this;
		clearLayers(): this;
		getChildCount(): number;
		getAllChildMarkers(): L.Marker[];
		getBounds(): L.LatLngBounds;
	}
}
