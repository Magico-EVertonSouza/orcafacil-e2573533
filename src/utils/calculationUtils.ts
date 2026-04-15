
import { Material, ServiceType, RegionPricing, Room, Wall } from "@/types";
import { calculateTechnical, toMaterialArray } from "@/utils/calculationEngine";

export const calculateArea = (width: number, height: number): number => {
  return width * height;
};

export const calculateWallArea = (wall: Wall): number => {
  return wall.width * wall.height;
};

export const calculateRoomTotalArea = (walls: Wall[]): number => {
  return walls.reduce((total, wall) => total + wall.area, 0);
};

/**
 * Calcula materiais delegando ao motor técnico v2.
 * Retorna Material[] para compatibilidade com a UI existente.
 */
export const calculateMaterials = (
  serviceType: ServiceType,
  area: number,
  regionPricing?: RegionPricing
): Material[] => {
  const result = calculateTechnical(serviceType, area, regionPricing);
  return toMaterialArray(result.materials);
};

export const calculateRoomMaterials = (
  serviceType: ServiceType,
  room: Room,
  regionPricing: RegionPricing
): { materials: Material[]; totalPrice: number } => {
  const result = calculateTechnical(serviceType, room.totalArea, regionPricing);
  const materials = toMaterialArray(result.materials);
  return { materials, totalPrice: result.totalPrice };
};

export const calculateTotalPrice = (materials: Material[]): number => {
  return materials.reduce((total, material) => {
    return total + (material.quantity * material.pricePerUnit);
  }, 0);
};

export const formatCurrency = (value: number, currency = 'EUR', locale = 'pt-PT'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};
