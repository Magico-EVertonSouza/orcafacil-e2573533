
export type ServiceType = 
  | 'reboco' 
  | 'piso' 
  | 'pladur' 
  | 'alvenaria' 
  | 'capoto' 
  | 'concreto' 
  | 'pintura';

export type RegionCode = 'PT' | 'BR' | 'ES';

export interface Region {
  code: RegionCode;
  name: string;
  currency: string;
  priceMultiplier: number;
}

export interface Material {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface Wall {
  id: string;
  width: number;
  height: number;
  area: number;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  totalArea: number;
}

export interface ServiceCalculation {
  id: string;
  type: ServiceType;
  rooms: Room[];
  totalArea: number;
  materials: Material[];
  totalPrice: number;
  region: Region;
}
