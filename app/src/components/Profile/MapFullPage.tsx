'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { IMapUser } from '@/types/user';
import customAxios from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function Map() {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  const [mapUsers, setMapUsers] = useState<IMapUser[]>([]);

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      const datas = await customAxios.get('/user/map');
      console.log(datas.data);
      setMapUsers(datas.data);
    }
    fetchData();

    return () => {
      setIsMounted(false);
    }
  }, []);

  if (!isMounted) return null;

  const renderMarker = (usr: IMapUser) => {
    const iconPersons = new L.Icon({
      iconUrl: usr.pictures?.split(',')[0],
      iconRetinaUrl: usr.pictures?.split(',')[0],
      iconAnchor: null,
      popupAnchor: null,
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
      iconSize: new L.Point(60, 75),
      className: 'leaflet-marker'
    });

    return (
      <Marker
        position={[parseFloat(usr.loc[0]), parseFloat(usr.loc[1])]}
        icon={iconPersons}
        key={usr.id}
        riseOnHover
        eventHandlers={
          {
            click: () => {
              router.push(`/profile/${usr.id}`);
            }
          }
        }
      />
    );
  }

  const me = mapUsers.find((u) => u.isConnected);

  if (!mapUsers || mapUsers.length === 0 || !me) return "loading...";

  return (
    <MapContainer
      center={me.loc as unknown as L.LatLngExpression}
      zoom={10}
      className="h-96 rounded-3xl"
      scrollWheelZoom={true}
      zoomControl={true}
      dragging={true}
      worldCopyJump={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {mapUsers.map(renderMarker)}
    </MapContainer>
  );
}
