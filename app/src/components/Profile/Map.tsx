'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';

export default function Map({ user }: { user: IUser }) {
  const [isMounted, setIsMounted] = useState(false);
  const iconPerson = new L.Icon({
    iconUrl: user.pictures,
    iconRetinaUrl: user.pictures,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-marker',
  });

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    }
  }, []);

  if (!isMounted) return null;

  const userLoc = user.loc.split(',');

  if (!userLoc || user.consentLocation === false) return null;

  return (
    <MapContainer
      center={[parseFloat(userLoc[0]), parseFloat(userLoc[1])]}
      zoom={12}
      className="h-96 rounded-3xl"
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <Marker position={[parseFloat(userLoc[0]), parseFloat(userLoc[1])]} icon={iconPerson} />
    </MapContainer>
  );
}
