export type Location = {
  id: number
  location: string
  db_name: string[]
}

export const LOCATIONS: Location[] = [
  { id: 5, location: 'Sydney', db_name: ['Sydney'] },
  { id: 6, location: 'SG', db_name: ['SG', 'Sg'] },
  { id: 1, location: 'Alam Sutera', db_name: ['Alsut'] },
  { id: 2, location: 'Gading Serpong', db_name: ['GS'] },
  { id: 3, location: 'BSD', db_name: ['BSD'] },
  { id: 4, location: 'PIK', db_name: ['PIK'] },
  // { id: 7, location: 'Bandung', db_name: ['Bandung'] },
]

// Maps a raw `Area` value from the data (e.g. "Alsut") to its display name.
export const areaLabel = (area: string) =>
  LOCATIONS.find(l => l.db_name.includes(area))?.location ?? area
