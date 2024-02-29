'use client';

import { Button } from '../ui/button';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

export default function Location() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [consent, setConsent] = useState<boolean>(user.consentLocation);

  const pictures = user.pictures?.split(',') || [];

  const userLoc = user?.loc?.split(',')?.map((loc) => parseFloat(loc)) || [
    '45.750000',
    '4.850000',
  ];

  const profilePicture = `${process.env.NEXT_PUBLIC_API}${pictures[0] ?? ''}`;

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await customAxios.put('/user/consentLocation', {
        consent,
      });
      setUser({ ...user, consentLocation: consent });
      toast.success('Updated');
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message, {
          description: 'Error',
        });
      } else
        toast.error('An error occurred', {
          description: 'Error',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Location</h3>
      <MapContainer
        center={userLoc as [number, number]}
        zoom={12}
        className="h-96 rounded-3xl"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <Marker position={userLoc as [number, number]} icon={iconPerson} />
      </MapContainer>
      <Button
        isLoading={loading}
        className="mx-auto mt-10 w-full dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleSubmit}
      >
        Save
      </Button>
    </div>
  );
}
