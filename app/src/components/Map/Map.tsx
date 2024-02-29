'use client';

import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';
import { IMapUser, IUser } from '@/types/user';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store';

export default function Map() {
  const { user } = useUserStore();
  const { push } = useRouter();
  const [maps, setMaps] = useState<IMapUser[]>([]);

  const [isMounted, setIsMounted] = useState(false);

  const getMaps = async () => {
    try {
      const res = await customAxios.get(`/user/map`);
      setMaps(res.data);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occured while fetching users');
    }
  };

  useEffect(() => {
    getMaps();
  }, []);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return null;

  const myLoc = user?.loc?.split(',')?.map((loc) => parseFloat(loc)) || ['45.750000', '4.850000']

  const renderMarker = (map: IMapUser) => {
    const pictures = map.pictures?.split(',') || [];

    if (!pictures[0]) return;

    const profilePicture = `${process.env.NEXT_PUBLIC_API}${pictures[0] ?? ''}`;

    return (
      <Marker
        key={map.id}
        position={[parseFloat(map.loc[0]), parseFloat(map.loc[1])]}
        eventHandlers={{
          click: () => push(`/profile/${map.username}`),
        }}
        icon={
          new L.Icon({
            iconUrl: profilePicture,
            iconSize: new L.Point(30, 50),
            className: 'leaflet-marker',
          })
        }
      />
    );
  }

  return (
    <MapContainer
      center={myLoc as [number, number]}
      zoom={4}
      className="rounded-3xl mt-5 z-10"
      scrollWheelZoom
      dragging
      worldCopyJump
      doubleClickZoom
      style={{
        height: 'calc(100vh - 270px)',
      }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {maps?.map(renderMarker)}
    </MapContainer>
  );
}
