import Map from '@/components/Map/Map';

export const metadata = {
  title: 'Matcha | Map',
};

export default function Page() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold">Map</h2>
      <p className="text-gray-500">Find the love in your area</p>
      <Map />
    </div>
  );
}
