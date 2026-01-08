export type FoundPlace = { id: number; name: string; uniqId: string; link: string };
export type FoundSector = { id: number; name: string; uniqId: string; link: string | null };
export type FoundRoute = { id: number; name: string; uniqId: string; sectorLink: string | null };

export type FoundResults = {
  places: FoundPlace[];
  sectors: FoundSector[];
  routes: FoundRoute[];
};