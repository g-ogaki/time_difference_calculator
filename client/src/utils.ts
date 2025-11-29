export type LocationProp = {
  lat: number;
  lng: number;
}

export type CitiesProp = {
  [cityname: string]: LocationProp
}

export type OffsetProp = {
  offset: number;
  timezone: string;
}