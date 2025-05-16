
import { ServiceType } from "@/types";
import { Construction, Layers, PaintRoller, BrickWall, FileText, Calculator, Pen } from "lucide-react";

export interface ServiceInfo {
  id: ServiceType;
  name: string;
  icon: any;
  description: string;
  backgroundColor: string;
}

export const services: ServiceInfo[] = [
  {
    id: 'reboco',
    name: 'Reboco',
    icon: Construction,
    description: 'Cálculo de materiais para reboco de paredes',
    backgroundColor: 'bg-service-reboco'
  },
  {
    id: 'piso',
    name: 'Piso',
    icon: Layers,
    description: 'Cálculo de materiais para assentamento de pisos',
    backgroundColor: 'bg-service-piso'
  },
  {
    id: 'pladur',
    name: 'Pladur',
    icon: FileText,
    description: 'Cálculo de materiais para instalação de pladur',
    backgroundColor: 'bg-service-pladur'
  },
  {
    id: 'alvenaria',
    name: 'Alvenaria',
    icon: BrickWall,
    description: 'Cálculo de materiais para alvenaria',
    backgroundColor: 'bg-service-alvenaria'
  },
  {
    id: 'capoto',
    name: 'Capoto',
    icon: Layers,
    description: 'Cálculo de materiais para sistema capoto',
    backgroundColor: 'bg-service-capoto'
  },
  {
    id: 'concreto',
    name: 'Concreto',
    icon: Calculator,
    description: 'Cálculo de materiais para concretagem',
    backgroundColor: 'bg-service-concreto'
  },
  {
    id: 'pintura',
    name: 'Pintura',
    icon: PaintRoller,
    description: 'Cálculo de materiais para pintura',
    backgroundColor: 'bg-service-pintura'
  },
];

// Export services as servicesList to match the import in Index.tsx
export const servicesList = services;

export const getServiceInfo = (serviceType: ServiceType): ServiceInfo => {
  return services.find(service => service.id === serviceType) || services[0];
};
