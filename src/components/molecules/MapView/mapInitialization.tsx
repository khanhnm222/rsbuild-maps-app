import mapboxgl, { FullscreenControlOptions, Map, MapOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  API_BASE_URL,
  INITIAL_CENTER,
  INITIAL_ZOOM,
} from "@configs/map-config";
import { MapConfig } from "@models/map.type";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createRoot } from 'react-dom/client';
import { getAddressFromCoordinates } from "@utils/mapHelpers";

const GEOSCAPE_MAPSAPI_KEY = import.meta.env?.GEOSCAPE_MAPSAPI_KEY ?? 'BDVcF3tDodXJLZYeyCqlbenei7ZZMjH9';
const polygon = {
  id: 'my-polygon',
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [151.21036085497565, -33.87041278176902],
        [151.21036085497565, -33.873179223355564],
        [151.2124546788873, -33.873179223355564],
        [151.2124546788873, -33.87041278176902],
        [151.21036085497565, -33.87041278176902]
      ]
    ],
  },
};

const Popup = ({ area, parcelType, address }: any) => {
  console.log('props', area, parcelType)
  return (
    <div className="popup">
      <h3 className="text-[rgba(0,0,0,0.7)] text-sm m-0 font-semibold">Cadastre Properties</h3>
      <div className="items-center bg-neutral-50 border flex justify-between mx-0 my-2 pr-[4px_12px] rounded-2xl border-solid border-[#ddd]">
        <h4 className="items-center justify-center text-center m-0 px-3 py-1">Area:</h4>
        <div className="text-[rgba(0,0,0,0.7)] text-sm text-right pr-4">{area}</div>
      </div>
      <div className="items-center bg-neutral-50 border flex justify-between mx-0 my-2 pr-[4px_12px] rounded-2xl border-solid border-[#ddd]">
        <h4 className="items-center justify-center text-center m-0 px-3 py-1">Parcel Type:</h4>
        <div className="text-[rgba(0,0,0,0.7)] text-sm text-right pr-4">{parcelType}</div>
      </div>
      <p className="bg-neutral-50 border rounded text-[rgba(0,0,0,0.65)] text-[0.8rem] mb-0 p-2 border-solid border-[#ddd]">Address: {address}</p>
    </div>
  )
}

export const initializeMap = (
  map: Map,
  mapContainer: HTMLElement,
  mapConfigs?: MapConfig,
  update3D?: any,
  selectedModel?: string,
  setClickMapEvent?: (value: any) => void,
  popUpRef?: any,
) => {

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: { polygon: true, trash: true },
  });

  const initMap = {
    container: mapContainer,
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    antialias: true,
    essential: true,
    hash: true,
    preserveDrawingBuffer: true,
    projection: 'mercator',
    config: {
      basemap: {
        lightPreset: mapConfigs?.lightPreset
      }
    },
    transformRequest: function transformRequest(url: string, resourceType: string) {
      // Add authorization header for requests to the specified API base URL
      if (
        (resourceType === "Source" || resourceType === "Tile") &&
        url.startsWith(API_BASE_URL)
      ) {
        return {
          url: url,
          headers: { Authorization: GEOSCAPE_MAPSAPI_KEY },
        };
      }
      return {
        url: url,
      };
    },
  } as MapOptions;

  if (!mapConfigs?.enableBasemap) {
    delete initMap.config;
    initMap['style'] = `mapbox://styles/mapbox/${mapConfigs?.mapStyleId ?? 'satellite-v9'}`;
  }

  map = new mapboxgl.Map(initMap);

  map.on("load", function () {
    // Add source cadastre-polygon-fill
    map.addSource('cadastre-polygon-fill-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      }
    });

    // Add layer cadastre-polygon-fill
    map.addLayer({
      id: 'cadastre-polygon-fill',
      type: 'fill',
      source: 'cadastre-polygon-fill-source',
      paint: {
        'fill-opacity': 0.2,
        'fill-color': '#ff0000',
      },
      layout: {
        visibility: 'none',
      },
    });
    map.addLayer({
      id: 'cadastre-polygon-line',
      type: 'line',
      source: 'cadastre-polygon-fill-source',
      paint: {
        'line-color': '#ff0000',
        'line-width': 2,
      },
      layout: {
        visibility: 'none',
      },
    });
  });

  map.on('style.load', () => {
    map.addSource('eraser', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              coordinates: [
                [
                  [151.21036085497565, -33.87041278176902],
                  [151.21036085497565, -33.873179223355564],
                  [151.2124546788873, -33.873179223355564],
                  [151.2124546788873, -33.87041278176902],
                  [151.21036085497565, -33.87041278176902]
                ]
              ],
              type: 'Polygon'
            }
          }
        ]
      }
    });
    map.addSource('model', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          // 'model-uri': 'https://docs.mapbox.com/mapbox-gl-js/assets/tower.glb'
          'model-uri': `${import.meta.env?.REACT_APP_BASE_URL ?? 'http://localhost:3000'}/models/${selectedModel}.glb`
        },
        geometry: {
          coordinates: [151.21173137539506, -33.87186373847624],
          type: 'Point'
        }
      }
    });

    map.addLayer({
      id: 'polygon-fill',
      type: 'fill',
      source: { type: 'geojson', data: polygon as any },
      paint: { 'fill-opacity': 0.2, 'fill-color': '#4264fb' },
    });
    map.addLayer({
      id: 'polygon-line',
      type: 'line',
      source: { type: 'geojson', data: polygon as any },
      paint: { 'line-width': 2, 'line-color': '#4264fb' },
    });

    map.addControl(new mapboxgl.FullscreenControl({
      container: document.querySelector('body')
    } as FullscreenControlOptions), 'bottom-right');
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(draw as any, 'bottom-right');
    map.setFog({
      color: 'rgb(186, 210, 235)', // Lower atmosphere
      'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
      'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
      'space-color': 'rgb(11, 11, 25)', // Background color
      'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
    });
  })

  map.on('load', () => {
    // 3D Map
    if (mapConfigs?.threeDmap && map) {
      const layers = map.getStyle()?.layers;
      const labelLayerId = layers?.find(
        (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      )?.id;

      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    }
    if (update3D && !update3D.includes('-')) {
      map.addLayer({
        id: 'eraser',
        type: 'clip',
        source: 'eraser',
        layout: {
          'clip-layer-types': ['symbol', 'model']
        }
      });

      map.addLayer({
        id: 'tower',
        type: 'model',
        source: 'model',
        minzoom: 15,
        layout: {
          'model-id': ['get', 'model-uri']
        },
        paint: {
          'model-opacity': 1,
          'model-rotation': [0.0, 0.0, 35.0],
          'model-scale': [0.8, 0.8, 1.2],
          'model-color-mix-intensity': 0,
          'model-cast-shadows': true as any,
          'model-emissive-strength': 0.8
        }
      });

      map.flyTo({
        ...{
          center: [151.210909, -33.871419],
          zoom: 15.57,
          pitch: 58,
          bearing: -85.8,
        }, // Fly to the selected target
        duration: 1200, // Animate over 12 seconds
        essential: true // This animation is considered essential with
        //respect to prefers-reduced-motion
      });
    }
  })

  map.on('click', (e: any) => {
    setClickMapEvent?.(e);
  });

  map.on('draw.selectionchange' as any, function (e: any) {
    console.log('selected', e.features);
  });

  const marker = new mapboxgl.Marker();
  map.on('load', () => {

    map.on('click', 'cadastre', async (e) => {
      const features = e.features ?? [];
      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
        const feature = features[0];
        const selectedGeoJson = {
          type: 'FeatureCollection',
          features: [feature],
        };

        (map?.getSource('cadastre-polygon-fill-source') as any)?.setData(selectedGeoJson);
        map.setLayoutProperty('cadastre-polygon-fill', 'visibility', 'visible');
        map.setLayoutProperty('cadastre-polygon-line', 'visibility', 'visible');

        const address = await getAddressFromCoordinates(e.lngLat.lng, e.lngLat.lat);
        const popupNode = document.createElement("div");
        const root = createRoot(popupNode);
        root.render(<Popup area={feature?.properties?.area} parcelType={feature?.properties?.parcel_type} address={address} />);

        popUpRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map);
        const markerLngLat = marker.getLngLat()
        // if (JSON.stringify(e.lngLat) !== JSON.stringify(markerLngLat)) {
        //   marker.remove();
        // }
        marker.setLngLat(e.lngLat).addTo(map);
      }
    });
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['cadastre'] });
    if (features.length === 0) {
      // map.setLayoutProperty('cadastre-polygon-fill', 'visibility', 'none');
    }
  });

  return map;
};

