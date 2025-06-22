import L from 'leaflet';
import type { MarkerCluster } from '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src';
import { MarkerClusterGroup } from '@tronscanteam/leaflet.markercluster/dist/leaflet.markercluster-src';

const MAX_CLUSTER_ZOOM = 20;

export function createClusterGroup(): MarkerClusterGroup {
	return new MarkerClusterGroup({
		spiderfyOnMaxZoom: false,
		showCoverageOnHover: false,
		zoomToBoundsOnClick: true,
		disableClusteringAtZoom: MAX_CLUSTER_ZOOM,
		iconCreateFunction: (cluster: MarkerCluster) => {
			const count = cluster.getChildCount();
			const size = count > 1000 ? 100 : count > 500 ? 50 : count > 100 ? 10 : 20;
			return L.divIcon({
				html: '',
				className: 'marker-cluster',
				iconSize: L.point(size, size)
			});
		}
	});
}