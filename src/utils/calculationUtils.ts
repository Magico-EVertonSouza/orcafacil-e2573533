
import { Material, ServiceType, Region, Room, Wall } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Funções para cálculo de paredes e áreas
export const calculateWallArea = (width: number, height: number): number => {
  return width * height;
};

export const calculateRoomTotalArea = (walls: Wall[]): number => {
  return walls.reduce((total, wall) => total + wall.area, 0);
};

export const createWall = (width: number, height: number): Wall => {
  const area = calculateWallArea(width, height);
  return {
    id: uuidv4(),
    width,
    height,
    area
  };
};

export const createRoom = (name: string, walls: Wall[]): Room => {
  const totalArea = calculateRoomTotalArea(walls);
  return {
    id: uuidv4(),
    name,
    walls,
    totalArea
  };
};

// Função para calcular materiais com base no tipo de serviço, área total e região
export const calculateMaterials = (serviceType: ServiceType, totalArea: number, region: Region): Material[] => {
  const materials = getBaseMaterials(serviceType, totalArea);
  
  // Aplicar o multiplicador de preço da região
  return materials.map(material => ({
    ...material,
    pricePerUnit: material.pricePerUnit * region.priceMultiplier
  }));
};

// Função para obter os materiais base sem ajuste regional
const getBaseMaterials = (serviceType: ServiceType, area: number): Material[] => {
  switch (serviceType) {
    case 'reboco':
      return [
        { name: 'Areia', quantity: area * 0.015, unit: 'm³', pricePerUnit: 40 },
        { name: 'Cal', quantity: area * 1.5, unit: 'kg', pricePerUnit: 0.5 },
        { name: 'Cimento', quantity: area * 2, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Carros de Mão (Areia)', quantity: Math.ceil(area * 0.005 * 12), unit: 'und', pricePerUnit: 0 },
      ];
    case 'piso':
      return [
        { name: 'Argamassa', quantity: area * 5, unit: 'kg', pricePerUnit: 0.5 },
        { name: 'Piso (cerâmica)', quantity: area * 1.1, unit: 'm²', pricePerUnit: 25 },
        { name: 'Rejunte', quantity: area * 0.2, unit: 'kg', pricePerUnit: 8 },
      ];
    case 'pladur':
      return [
        { name: 'Placas de Gesso', quantity: area, unit: 'm²', pricePerUnit: 15 },
        { name: 'Perfis Metálicos', quantity: area * 2.5, unit: 'm', pricePerUnit: 3 },
        { name: 'Parafusos', quantity: area * 15, unit: 'und', pricePerUnit: 0.05 },
        { name: 'Massa para Juntas', quantity: area * 0.3, unit: 'kg', pricePerUnit: 2 },
      ];
    case 'alvenaria':
      return [
        { name: 'Tijolos', quantity: area * 25, unit: 'und', pricePerUnit: 0.8 },
        { name: 'Cimento', quantity: area * 5, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Areia', quantity: area * 0.01, unit: 'm³', pricePerUnit: 40 },
        { name: 'Cal', quantity: area * 1, unit: 'kg', pricePerUnit: 0.5 },
      ];
    case 'capoto':
      return [
        { name: 'Placas de Esferovite', quantity: area * 1.05, unit: 'm²', pricePerUnit: 12 },
        { name: 'Cola', quantity: area * 6, unit: 'kg', pricePerUnit: 1.2 },
        { name: 'Rede', quantity: area * 1.1, unit: 'm²', pricePerUnit: 2 },
        { name: 'Buchas', quantity: area * 6, unit: 'und', pricePerUnit: 0.3 },
      ];
    case 'concreto':
      return [
        { name: 'Cimento', quantity: area * 0.015 * 350, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Areia', quantity: area * 0.015 * 0.7, unit: 'm³', pricePerUnit: 40 },
        { name: 'Brita', quantity: area * 0.015 * 0.8, unit: 'm³', pricePerUnit: 45 },
        { name: 'Água', quantity: area * 0.015 * 175, unit: 'L', pricePerUnit: 0.005 },
      ];
    case 'pintura':
      return [
        { name: 'Tinta', quantity: area / 10, unit: 'L', pricePerUnit: 15 },
        { name: 'Primer', quantity: area / 20, unit: 'L', pricePerUnit: 10 },
        { name: 'Fita Adesiva', quantity: Math.ceil(area / 20), unit: 'rolo', pricePerUnit: 3 },
        { name: 'Lixa', quantity: Math.ceil(area / 30), unit: 'und', pricePerUnit: 0.8 },
      ];
    default:
      return [];
  }
};

export const calculateTotalPrice = (materials: Material[]): number => {
  return materials.reduce((total, material) => {
    return total + (material.quantity * material.pricePerUnit);
  }, 0);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};
