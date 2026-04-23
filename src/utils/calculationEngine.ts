import { ServiceType, RegionPricing } from "@/types";

/**
 * =========================================
 * TIPOS
 * =========================================
 */

export interface TechnicalMaterial {
  material: string;
  tecnico: string;
  valor_tecnico: number;
  pricePerUnit: number;
}

export interface TechnicalResult {
  serviceType: ServiceType;
  area: number;
  materials: TechnicalMaterial[];
  totalPrice: number;
}

/**
 * =========================================
 * MOTOR PROFISSIONAL (AGORA COMPLETO)
 * =========================================
 */

const SERVICE_SPECS: Record<ServiceType, any[]> = {
  /**
   * REBOCO (já estava bom)
   */
  reboco: [
    { material: "Areia", unit: "m3", factor: 0.012, basePricePerUnit: 40 },
    { material: "Cimento", unit: "kg", factor: 4.2, basePricePerUnit: 0.6 },
    { material: "Cal", unit: "kg", factor: 1.05, basePricePerUnit: 0.5 },
    { material: "Água", unit: "L", factor: 2.5, basePricePerUnit: 0.005 },
  ],

  /**
   * 🔥 PISO (AGORA COMPLETO)
   */
  piso: [
    { material: "Argamassa", unit: "kg", factor: 5, basePricePerUnit: 0.5 },
    { material: "Piso Cerâmico", unit: "m2", factor: 1.1, basePricePerUnit: 25 },
    { material: "Rejunte", unit: "kg", factor: 0.5, basePricePerUnit: 8 },
    { material: "Cruzeta", unit: "und", factor: 20, basePricePerUnit: 0.05 },
  ],

  /**
   * 🔥 PLADUR COMPLETO
   */
  pladur: [
    { material: "Placa de gesso", unit: "m2", factor: 1.05, basePricePerUnit: 15 },
    { material: "Perfil metálico", unit: "m", factor: 2.5, basePricePerUnit: 3 },
    { material: "Parafusos", unit: "und", factor: 15, basePricePerUnit: 0.05 },
    { material: "Massa para juntas", unit: "kg", factor: 0.3, basePricePerUnit: 2 },
  ],

  /**
   * 🔥 ALVENARIA COMPLETA
   */
  alvenaria: [
    { material: "Tijolo", unit: "und", factor: 25, basePricePerUnit: 0.8 },
    { material: "Cimento", unit: "kg", factor: 5, basePricePerUnit: 0.6 },
    { material: "Areia", unit: "m3", factor: 0.01, basePricePerUnit: 40 },
    { material: "Cal", unit: "kg", factor: 1, basePricePerUnit: 0.5 },
  ],

  /**
   * 🔥 CAPOTO PROFISSIONAL
   */
  capoto: [
    { material: "EPS", unit: "m2", factor: 1.05, basePricePerUnit: 12 },
    { material: "Cola ETICS", unit: "kg", factor: 6, basePricePerUnit: 1.2 },
    { material: "Rede fibra vidro", unit: "m2", factor: 1.1, basePricePerUnit: 2 },
    { material: "Massa acabamento", unit: "kg", factor: 3, basePricePerUnit: 1.5 },
  ],

  /**
   * 🔥 CONCRETO (AGORA COMO BETÃO POR M²)
   * Considerando 10cm de espessura
   */
  concreto: [
    { material: "Cimento", unit: "kg", factor: 3.5, basePricePerUnit: 0.6 },
    { material: "Areia", unit: "m3", factor: 0.007, basePricePerUnit: 40 },
    { material: "Brita", unit: "m3", factor: 0.008, basePricePerUnit: 45 },
    { material: "Água", unit: "L", factor: 1.8, basePricePerUnit: 0.005 },
  ],

  /**
   * 🔥 PINTURA COMPLETA
   */
  pintura: [
    { material: "Tinta", unit: "L", factor: 0.1, basePricePerUnit: 15 },
    { material: "Primer", unit: "L", factor: 0.05, basePricePerUnit: 10 },
    { material: "Selante", unit: "L", factor: 0.03, basePricePerUnit: 12 },
    { material: "Fita adesiva", unit: "und", factor: 0.05, basePricePerUnit: 3 },
    { material: "Lixa", unit: "und", factor: 0.03, basePricePerUnit: 0.8 },
  ],
};

/**
 * =========================================
 * CÁLCULO TÉCNICO (BASE)
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
 * 🔥 CAMADA OBRA (ARREDONDAMENTO INTELIGENTE)
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

/**
 * =========================================
 * EXPORT PRINCIPAL (O QUE A UI USA)
 * =========================================
 */
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
      valor_tecnico: roundForConstruction(m.valor_tecnico, m.tecnico),
    })),
  };
}

export default calculateForUser;
