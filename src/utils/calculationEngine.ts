import { ServiceType, RegionPricing } from "@/types";

/**
 * =========================================
 * TIPOS
 * =========================================
 */

export interface HumanConversion {
  tipo: string;
  fator_label: string;
  fator: number;
  valor_convertido: number;
}

export interface TechnicalMaterial {
  material: string;
  tecnico: string;
  valor_tecnico: number;
  pricePerUnit: number;
  conversoes: HumanConversion[];
}

export interface TechnicalResult {
  serviceType: ServiceType;
  area: number;
  materials: TechnicalMaterial[];
  totalPrice: number;
}

/**
 * =========================================
 * MOTOR BASE (NÃO MEXER NA FÍSICA)
 * =========================================
 */

const SERVICE_SPECS: Record<ServiceType, any[]> = {
  reboco: [
    { material: "Areia", unit: "m3", factor: 0.012, basePricePerUnit: 40 },
    { material: "Cimento", unit: "kg", factor: 4.2, basePricePerUnit: 0.6 },
    { material: "Cal", unit: "kg", factor: 1.05, basePricePerUnit: 0.5 },
    { material: "Água", unit: "L", factor: 2.5, basePricePerUnit: 0.005 },
  ],

  piso: [
    { material: "Argamassa", unit: "kg", factor: 5, basePricePerUnit: 0.5 },
    { material: "Piso", unit: "m2", factor: 1.1, basePricePerUnit: 25 },
  ],

  pladur: [
    { material: "Placa", unit: "m2", factor: 1.05, basePricePerUnit: 15 },
  ],

  alvenaria: [
    { material: "Tijolo", unit: "und", factor: 25, basePricePerUnit: 0.8 },
  ],

  capoto: [
    { material: "EPS", unit: "m2", factor: 1.05, basePricePerUnit: 12 },
  ],

  concreto: [
    { material: "Cimento", unit: "kg", factor: 5.25, basePricePerUnit: 0.6 },
  ],

  pintura: [
    { material: "Tinta", unit: "L", factor: 0.1, basePricePerUnit: 15 },
  ],
};

/**
 * =========================================
 * CÁLCULO TÉCNICO
 * =========================================
 */

export function calculateTechnical(
  serviceType: ServiceType,
  area: number,
  regionPricing?: RegionPricing
): TechnicalResult {
  const specs = SERVICE_SPECS[serviceType] ?? [];
  const multiplier = regionPricing?.priceMultiplier ?? 1;

  const materials = specs.map((spec) => {
    const valor = area * spec.factor;

    return {
      material: spec.material,
      tecnico: spec.unit,
      valor_tecnico: valor,
      pricePerUnit: spec.basePricePerUnit * multiplier,
      conversoes: [],
    };
  });

  const totalPrice = materials.reduce(
    (sum, m) => sum + m.valor_tecnico * m.pricePerUnit,
    0
  );

  return {
    serviceType,
    area,
    materials,
    totalPrice,
  };
}

/**
 * =========================================
 * 🔥 OPÇÃO B (OBRA - PADRÃO DO SISTEMA)
 * =========================================
 */

function roundForConstruction(value: number, unit: string): number {
  switch (unit) {
    case "m3":
      return Math.ceil(value * 100) / 100;

    case "kg":
      return Math.ceil(value / 5) * 5;

    case "L":
      return Math.ceil(value);

    case "und":
      return Math.ceil(value);

    default:
      return Math.ceil(value * 10) / 10;
  }
}

export function calculateForUser(
  serviceType: ServiceType,
  area: number,
  regionPricing?: RegionPricing
) {
  const technical = calculateTechnical(serviceType, area, regionPricing);

  return {
    ...technical,
    materials: technical.materials.map((m) => ({
      ...m,

      // 🔥 AQUI está a diferença (OPÇÃO B)
      valor_tecnico: roundForConstruction(m.valor_tecnico, m.tecnico),
    })),
  };
}

/**
 * =========================================
 * EXPORT PRINCIPAL (AGORA USA OBRA)
 * =========================================
 */
export default calculateForUser;
