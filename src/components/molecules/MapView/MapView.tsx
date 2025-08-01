import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { initializeMap } from "./mapInitialization.tsx";
import styles from './styles.module.css';
import { MapConfig } from "@models/map.type.ts";
import { createUUID } from "@utils/uuid.ts";
import useScreenSize from "@hooks/useScreenSize.tsx";
import { mapEventChannel } from "@utils/mapEvents.tsx";
import { cn } from "@libs/style.ts";
import { PositionInfo } from "@components/molecules";

interface MapViewProps {
  mapConfigs?: MapConfig;
};

mapboxgl.accessToken = import.meta.env?.REACT_APP_MAPBOX_ACCESS_TOKEN!;

const MapView = ({ mapConfigs }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [update3D, setUpdate3D] = useState(createUUID());
  const [selectedModel, setSelectedModel] = useState('tower');
  const [clickMapEvent, setClickMapEvent] = useState<any>(null);
  const screenSize = useScreenSize();
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
  
  useEffect(() => {
    const unsubscribeOnMapIdle = mapEventChannel.on('onAdd3D', (payload) => {
      setUpdate3D(payload.isAdded);
      setSelectedModel(payload.selectedModel);
    })
    const unsubscribeOnRemove = mapEventChannel.on('onRemove3D', (_payload) => {
      setUpdate3D(createUUID());
    })

    // unsubscribe events when unmount
    return () => {
      unsubscribeOnMapIdle()
      unsubscribeOnRemove()
    }
  }, [])

  useEffect(() => {
    // if (map.current) {
    //   return; // initialize map only once
    // }

    // Call the initializeMap function to set up the Mapbox map
    map.current = initializeMap(
      map.current!,
      mapContainer.current!,
      mapConfigs,
      update3D,
      selectedModel,
      setClickMapEvent,
      popUpRef,
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapConfigs, update3D, selectedModel, screenSize]);

  return (
    <div>
      <div className='absolute z-50 left-8 mt-6 w-[17rem]'>
        {/* @ts-expect-error Server Component */}
        <SearchBox
          accessToken={import.meta.env?.REACT_APP_MAPBOX_ACCESS_TOKEN}
          map={map.current as any}
          mapboxgl={mapboxgl}
          value={inputValue}
          onChange={(d: any) => { setInputValue(d) }}
          marker
          placeholder='Search by Address or Lot/Plan'
          options={{ country: 'AU' }}
          onRetrieve={(res: any) => console.log('res', res)}
        />
      </div>
      <div ref={mapContainer} className={cn('map-container', styles.mapContainer)} />
      {clickMapEvent && (
        <div className='flex justify-center'>
          <PositionInfo
            isAlert={false}
            onClose={() => setClickMapEvent(null)}
            lat={Math.abs(clickMapEvent.lngLat.wrap().lat).toFixed(5)}
            lng={Number(clickMapEvent.lngLat.wrap().lng).toFixed(5)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
