
export type ServiceType = 
  | 'reboco' 
  | 'piso' 
  | 'pladur' 
  | 'alvenaria' 
  | 'capoto' 
  | 'concreto' 
  | 'pintura';

export interface Material {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface ServiceCalculation {
  id: string;
  type: ServiceType;
  width: number;
  height: number;
  area: number;
  materials: Material[];
  totalPrice: number;
}
