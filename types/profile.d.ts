// import { LatLngExpression } from 'leaflet';

export interface IProfile {
  name: string;
  age: number;
  location: string;
  distance: number;
  image: string;
  gender: string;
  fameRating: number;
  about: string;
  gps: any; // TODO: LatLngExpression;
}
