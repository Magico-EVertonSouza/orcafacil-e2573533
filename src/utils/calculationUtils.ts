import { Material, ServiceType, RegionPricing, Room, Wall } from "@/types";
import { calculateForUser } from "@/utils/calculationEngine";

/**
 * =========================================
 * ÁREA
 * =========================================
 */

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
 * =========================================
 * MATERIAIS (NOVO MOTOR - OPÇÃO B)
 * =========================================
 */

export const calculateMaterials = (
  serviceType: ServiceType,
  area: number,
  regionPricing?: RegionPricing
): Material[] => {
  const result = calculateForUser(serviceType, area, regionPricing);

  return result.materials.map((m) => ({
    name: m.material,
    quantity: m.valor_tecnico,
    unit: m.tecnico,
    pricePerUnit: m.pricePerUnit,
  }));
};

export const calculateRoomMaterials = (
  serviceType: ServiceType,
  room: Room,
  regionPricing: RegionPricing
): { materials: Material[]; totalPrice: number } => {
  const result = calculateForUser(serviceType, room.totalArea, regionPricing);

  return {
    materials: result.materials.map((m) => ({
      name: m.material,
      quantity: m.valor_tecnico,
      unit: m.tecnico,
      pricePerUnit: m.pricePerUnit,
    })),
    totalPrice: result.totalPrice,
  };
};

/**
 * =========================================
 * TOTAL
 * =========================================
 */

export const calculateTotalPrice = (materials: Material[]): number => {
  return materials.reduce((total, material) => {
    return total + material.quantity * material.pricePerUnit;
  }, 0);
};

/**
 * =========================================
 * FORMATAÇÃO
 * =========================================
 */

export const formatCurrency = (
  value: number,
  currency = "EUR",
  locale = "pt-PT"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-PT", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
};
