export type FoundPlace = { id: string; name: string; link: string };
export type FoundSector = { id: string; name: string; link: string };
export type FoundRoute = { id: string; uniqId: string; name: string; sectorLink: string };

export type FoundResults = {
  places: FoundPlace[];
  sectors: FoundSector[];
  routes: FoundRoute[];
};