export type LocationCoords = {
  lat: number;
  long: number;
};

export const locationCoords: Record<string, LocationCoords> = {
  manchester: {
    lat: 53.4808,
    long: -2.2426,
  },
  melbourne: {
    lat: -37.8136,
    long: 144.9631,
  },
  nigeria: {
    lat: 9.082,
    long: 8.6753,
  },
  durban: {
    lat: -29.8587,
    long: 31.0218,
  },
  barcelona: {
    lat: 41.3874,
    long: 2.1686,
  },
  miami: {
    lat: 25.7617,
    long: -80.1918,
  },
};
