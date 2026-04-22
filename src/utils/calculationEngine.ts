/**
 * =========================================
 * ORÇA FÁCIL - MOTOR DE CÁLCULO v2.1
 * =========================================
 *
 * ✔ Camada 1: Técnico (100% preciso)
 * ✔ Camada 2: Obra (arredondado + humano)
 *
 * NÃO altera lógica original — só adiciona camada de leitura.
 */

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
 * CAMADA DE OBRA (NOVO)
 * =========================================
 */

export interface HumanMaterial {
  material: string;
  quantidade_tecnica: number;
  quantidade_obra: number;
  unidade_obra: string;
  explicacao: string;
  total_estimado: number;
}

/**
 * =========================================
 * ARREDONDAMENTO POR MATERIAL
 * =========================================
 */

function roundForConstruction(value: number, unit: string): number {
  switch (unit) {
    case "m3":
      return Math.ceil(value * 100) / 100; // 2 casas

    case "kg":
      return Math.ceil(value / 5) * 5; // blocos de 5kg

    case "L":
      return Math.ceil(value); // litros inteiros

    case "und":
      return Math.ceil(value);

    default:
      return value;
  }
}

/**
 * =========================================
 * CONVERSÃO PARA OBRA
 * =========================================
 */

function convertToConstruction(material: TechnicalMaterial): HumanMaterial {
  let quantidade_obra = material.valor_tecnico;
  let unidade_obra = material.tecnico;
  let explicacao = "";

  // AREIA → CARRO DE MÃO
  if (material.material.toLowerCase().includes("areia")) {
    const carros = material.valor_tecnico * 12; // 1m³ = 12 carros
    quantidade_obra = carros;
    unidade_obra = "carro de mão";
    explicacao = `≈ ${carros.toFixed(1)} carros de mão`;
  }

  // CIMENTO → SACOS 25KG
  if (material.material.toLowerCase().includes("cimento")) {
    const sacos = material.valor_tecnico / 25;
    quantidade_obra = Math.ceil(sacos);
    unidade_obra = "sacos (25kg)";
    explicacao = `≈ ${Math.ceil(sacos)} sacos de 25kg`;
  }

  // CAL → SACOS 20KG
  if (material.material.toLowerCase().includes("cal")) {
    const sacos = material.valor_tecnico / 20;
    quantidade_obra = Math.ceil(sacos);
    unidade_obra = "sacos (20kg)";
    explicacao = `≈ ${Math.ceil(sacos)} sacos de 20kg`;
  }

  // OUTROS → arredondamento padrão
  if (!explicacao) {
    quantidade_obra = roundForConstruction(material.valor_tecnico, material.tecnico);
    explicacao = `≈ valor arredondado para obra`;
  }

  return {
    material: material.material,
    quantidade_tecnica: material.valor_tecnico,
    quantidade_obra,
    unidade_obra,
    explicacao,
    total_estimado: material.valor_tecnico * material.pricePerUnit,
  };
}

/**
 * =========================================
 * MOTOR TÉCNICO (SEU ORIGINAL)
 * =========================================
 */

const SERVICE_SPECS: Record<ServiceType, any[]> = {
  reboco: [
    {
      material: "Areia",
      unit: "m3",
      factor: 0.012,
      basePricePerUnit: 40,
      conversions: [
        { tipo: "carro_de_mao", fator_label: "1 m³ = 12 carros", fator: 12 },
      ],
    },
    {
      material: "Cimento",
      unit: "kg",
      factor: 4.2,
      basePricePerUnit: 0.6,
      conversions: [
        { tipo: "saco_25kg", fator_label: "1 saco = 25kg", fator: 1 / 25 },
      ],
    },
    {
      material: "Cal",
      unit: "kg",
      factor: 1.05,
      basePricePerUnit: 0.5,
      conversions: [],
    },
    {
      material: "Água",
      unit: "L",
      factor: 2.5,
      basePricePerUnit: 0.005,
      conversions: [],
    },
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

  const materials: TechnicalMaterial[] = specs.map((spec) => {
    const valor_tecnico = area * spec.factor;

    return {
      material: spec.material,
      tecnico: spec.unit,
      valor_tecnico,
      pricePerUnit: spec.basePricePerUnit * multiplier,
      conversoes: spec.conversions,
    };
  });

  const totalPrice = materials.reduce(
    (sum, m) => sum + m.valor_tecnico * m.pricePerUnit,
    0
  );

  return { serviceType, area, materials, totalPrice };
}

/**
 * =========================================
 * CAMADA DE OBRA (EXPORT FINAL)
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
    materials: technical.materials.map(convertToConstruction),
  };
}
