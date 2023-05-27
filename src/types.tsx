export interface Character {
    id: string;
    name: string;
  }
  
export interface Location {
    id: string;
    name: string;
  }
  
export interface Scene {
    id: string;
    description: string;
    characters: Character[];
    location: Location;
  }