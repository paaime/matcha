'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';

export default function Map({ user }: { user: IUser }) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return null;

  const userLoc = user?.loc?.split(',')?.map((loc) => parseFloat(loc)) || [
    '45.750000',
    '4.850000',
  ];

  if (!userLoc || user.consentLocation === false) return null;

  const pictures = user.pictures?.split(',') || [];

  if (!pictures[0]) return null;

  const profilePicture = `${pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${pictures[0]}`

  const iconPerson = new L.Icon({
    iconUrl: profilePicture,
    iconRetinaUrl: profilePicture,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-marker',
  });

  return (
    <div onClick={() => router.push('/map')}>
      <MapContainer
        center={userLoc as [number, number]}
        zoom={12}
        className="h-96 rounded-3xl"
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={userLoc as [number, number]} icon={iconPerson} />
      </MapContainer>
    </div>
  );
}
