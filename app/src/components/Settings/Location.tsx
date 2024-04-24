'use client';

import { Button } from '../ui/button';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

const MapClick = ({ icon, setLocation }) => {
  const map = useMapEvent('click', (e) => {
    const { lat, lng } = e.latlng;

    // remove previous marker
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    // add new marker
    L.marker([lat, lng], {
      icon,
    }).addTo(map);
    setLocation(`${lat},${lng}`);
  });

  return null;
};

export default function Location() {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const [location, setLocation] = useState();

  const pictures = user.pictures?.split(',') || [];

  const userLoc = user?.loc?.split(',')?.map((loc) => parseFloat(loc)) || [
    '45.750000',
    '4.850000',
  ];

  const profilePicture = `${pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${pictures[0] ?? ''}`;

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
      if (!location) toast.error('Please select a location');
      setLoading(true);
      await customAxios.put('/user/location', {
        location
      });
      const { data } = await customAxios.get('/user/me');
      setUser(data);
      toast.success('Updated');

      // Save to local storage
      localStorage.setItem('loc-updated', "true");
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
        className="h-96 rounded-3xl z-10"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <Marker position={userLoc as [number, number]} icon={iconPerson} />
        <MapClick icon={iconPerson} setLocation={setLocation} />
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
