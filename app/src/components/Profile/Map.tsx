'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store';

export default function Map({ user }: { user: IUser }) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const datas = useUserStore();

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
  const myPictures = datas?.user?.pictures?.split(',') || [];

  if (!pictures[0]) return null;

  const profilePicture = `${pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${pictures[0]}`;
  const myProfilePicture = `${myPictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${myPictures[0]}`;

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

  // My location if consent
  const myIcon = new L.Icon({
    iconUrl: myProfilePicture,
    iconRetinaUrl: myProfilePicture,
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

        {user.id !== datas?.user?.id && datas.user?.consentLocation && (
          <Marker
            position={datas.user?.loc?.split(',')?.map((loc) => parseFloat(loc)) as [number, number]}
            icon={myIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
