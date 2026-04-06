
export type ServiceType = 
  | 'reboco' 
  | 'piso' 
  | 'pladur' 
  | 'alvenaria' 
  | 'capoto' 
  | 'concreto' 
  | 'pintura';

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
  materials: Material[];
  totalPrice: number;
}

export interface Material {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface RegionPricing {
  country: string;
  region: string;
  currency: string;
  locale: string;
  /** Multiplier applied to base prices */
  priceMultiplier: number;
}

export interface ServiceCalculation {
  id: string;
  type: ServiceType;
  rooms: Room[];
  totalArea: number;
  materials: Material[];
  totalPrice: number;
  regionPricing: RegionPricing;
  // legacy compat
  width: number;
  height: number;
  area: number;
}
