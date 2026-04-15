/**
 * OrçaFácil – Motor de Cálculo Técnico (v2)
 *
 * Camada técnica pura: trabalha exclusivamente com unidades padrão da
 * construção civil (m², m³, kg, L). Nenhum arredondamento é aplicado aqui.
 *
 * Exporta também a estrutura de conversão que alimenta o motor de explicação
 * existente sem gerar texto algum.
 */

import { ServiceType, RegionPricing } from "@/types";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Uma conversão "humana" de uma unidade técnica para uma unidade prática. */
export interface HumanConversion {
  tipo: string;          // ex: "carro_de_mao", "saco_50kg", "lata_18L"
  fator_label: string;   // ex: "1 m³ = 12 carros"
  fator: number;         // ex: 12
  valor_convertido: number;
}

/** Resultado técnico de um único material. */
export interface TechnicalMaterial {
  material: string;
  tecnico: string;       // unidade técnica: "m3", "kg", "L", "m2", "m", "und"
  valor_tecnico: number; // valor exato, sem arredondamento
  pricePerUnit: number;  // preço unitário base (antes do multiplicador regional)
  conversoes: HumanConversion[];
}

/** Resultado completo para uma área de serviço. */
export interface TechnicalResult {
  serviceType: ServiceType;
  area: number;
  materials: TechnicalMaterial[];
  totalPrice: number; // soma exata (qty × preço)
}

// ---------------------------------------------------------------------------
// Coeficientes técnicos por serviço
// ---------------------------------------------------------------------------

interface MaterialSpec {
  material: string;
  /** Unidade técnica padrão */
  unit: string;
  /** Fator de quantidade: qty = area × factor */
  factor: number;
  /** Preço base por unidade (EUR, Portugal baseline) */
  basePricePerUnit: number;
  /** Conversões humanas possíveis */
  conversions: Array<{
    tipo: string;
    fator_label: string;
    /** Quanto de "tipo" por 1 unidade técnica. Ex: 1 m³ = 12 carros → fator = 12 */
    fator: number;
  }>;
}

const SERVICE_SPECS: Record<ServiceType, MaterialSpec[]> = {
  reboco: [
    {
      material: "Areia",
      unit: "m3",
      factor: 0.012,          // 0.012 m³/m² (espessura ~12mm)
      basePricePerUnit: 40,
      conversions: [
        { tipo: "carro_de_mao", fator_label: "1 m³ = 12 carros de mão", fator: 12 },
      ],
    },
    {
      material: "Cimento",
      unit: "kg",
      factor: 4.2,            // ~4.2 kg/m² (traço 1:4 vol)
      basePricePerUnit: 0.6,
      conversions: [
        { tipo: "saco_50kg", fator_label: "1 saco = 50 kg", fator: 1 / 50 },
      ],
    },
    {
      material: "Cal",
      unit: "kg",
      factor: 1.05,           // ~1.05 kg/m² (traço 1:4 com adição)
      basePricePerUnit: 0.5,
      conversions: [
        { tipo: "saco_20kg", fator_label: "1 saco = 20 kg", fator: 1 / 20 },
      ],
    },
    {
      material: "Água",
      unit: "L",
      factor: 2.5,            // ~2.5 L/m²
      basePricePerUnit: 0.005,
      conversions: [],
    },
  ],

  piso: [
    {
      material: "Argamassa colante",
      unit: "kg",
      factor: 5,              // ~5 kg/m²
      basePricePerUnit: 0.5,
      conversions: [
        { tipo: "saco_20kg", fator_label: "1 saco = 20 kg", fator: 1 / 20 },
      ],
    },
    {
      material: "Piso cerâmico",
      unit: "m2",
      factor: 1.1,            // +10% quebra
      basePricePerUnit: 25,
      conversions: [
        { tipo: "caixa_2m2", fator_label: "1 caixa ≈ 2 m²", fator: 1 / 2 },
      ],
    },
    {
      material: "Rejunte",
      unit: "kg",
      factor: 0.5,            // ~0.5 kg/m²
      basePricePerUnit: 8,
      conversions: [
        { tipo: "saco_1kg", fator_label: "1 saco = 1 kg", fator: 1 },
      ],
    },
  ],

  pladur: [
    {
      material: "Placas de gesso",
      unit: "m2",
      factor: 1.05,           // +5% desperdício
      basePricePerUnit: 15,
      conversions: [
        { tipo: "placa_1.2x2.6", fator_label: "1 placa ≈ 3.12 m²", fator: 1 / 3.12 },
      ],
    },
    {
      material: "Perfis metálicos",
      unit: "m",
      factor: 2.5,
      basePricePerUnit: 3,
      conversions: [
        { tipo: "barra_3m", fator_label: "1 barra = 3 m", fator: 1 / 3 },
      ],
    },
    {
      material: "Parafusos",
      unit: "und",
      factor: 15,
      basePricePerUnit: 0.05,
      conversions: [
        { tipo: "caixa_500", fator_label: "1 caixa = 500 und", fator: 1 / 500 },
      ],
    },
    {
      material: "Massa para juntas",
      unit: "kg",
      factor: 0.3,
      basePricePerUnit: 2,
      conversions: [
        { tipo: "saco_5kg", fator_label: "1 saco = 5 kg", fator: 1 / 5 },
      ],
    },
  ],

  alvenaria: [
    {
      material: "Tijolos",
      unit: "und",
      factor: 25,             // ~25 un/m²
      basePricePerUnit: 0.8,
      conversions: [
        { tipo: "milheiro", fator_label: "1 milheiro = 1000 und", fator: 1 / 1000 },
      ],
    },
    {
      material: "Cimento",
      unit: "kg",
      factor: 5,
      basePricePerUnit: 0.6,
      conversions: [
        { tipo: "saco_50kg", fator_label: "1 saco = 50 kg", fator: 1 / 50 },
      ],
    },
    {
      material: "Areia",
      unit: "m3",
      factor: 0.01,
      basePricePerUnit: 40,
      conversions: [
        { tipo: "carro_de_mao", fator_label: "1 m³ = 12 carros de mão", fator: 12 },
      ],
    },
    {
      material: "Cal",
      unit: "kg",
      factor: 1,
      basePricePerUnit: 0.5,
      conversions: [
        { tipo: "saco_20kg", fator_label: "1 saco = 20 kg", fator: 1 / 20 },
      ],
    },
  ],

  capoto: [
    {
      material: "Placas EPS (esferovite)",
      unit: "m2",
      factor: 1.05,           // +5% desperdício
      basePricePerUnit: 12,
      conversions: [],
    },
    {
      material: "Cola ETICS",
      unit: "kg",
      factor: 6,
      basePricePerUnit: 1.2,
      conversions: [
        { tipo: "saco_25kg", fator_label: "1 saco = 25 kg", fator: 1 / 25 },
      ],
    },
    {
      material: "Rede de fibra de vidro",
      unit: "m2",
      factor: 1.1,
      basePricePerUnit: 2,
      conversions: [
        { tipo: "rolo_50m2", fator_label: "1 rolo ≈ 50 m²", fator: 1 / 50 },
      ],
    },
    {
      material: "Buchas de fixação",
      unit: "und",
      factor: 6,
      basePricePerUnit: 0.3,
      conversions: [
        { tipo: "caixa_100", fator_label: "1 caixa = 100 und", fator: 1 / 100 },
      ],
    },
  ],

  concreto: [
    {
      material: "Cimento",
      unit: "kg",
      factor: 5.25,           // espessura 15cm, traço C25: 350 kg/m³ × 0.015 m
      basePricePerUnit: 0.6,
      conversions: [
        { tipo: "saco_50kg", fator_label: "1 saco = 50 kg", fator: 1 / 50 },
      ],
    },
    {
      material: "Areia",
      unit: "m3",
      factor: 0.0105,         // 0.7 m³/m³ × 0.015
      basePricePerUnit: 40,
      conversions: [
        { tipo: "carro_de_mao", fator_label: "1 m³ = 12 carros de mão", fator: 12 },
      ],
    },
    {
      material: "Brita",
      unit: "m3",
      factor: 0.012,          // 0.8 m³/m³ × 0.015
      basePricePerUnit: 45,
      conversions: [
        { tipo: "carro_de_mao", fator_label: "1 m³ = 12 carros de mão", fator: 12 },
      ],
    },
    {
      material: "Água",
      unit: "L",
      factor: 2.625,          // 175 L/m³ × 0.015
      basePricePerUnit: 0.005,
      conversions: [],
    },
  ],

  pintura: [
    {
      material: "Tinta",
      unit: "L",
      factor: 0.1,            // rendimento ~10 m²/L
      basePricePerUnit: 15,
      conversions: [
        { tipo: "lata_18L", fator_label: "1 lata = 18 L", fator: 1 / 18 },
        { tipo: "galao_3.6L", fator_label: "1 galão = 3.6 L", fator: 1 / 3.6 },
      ],
    },
    {
      material: "Primer",
      unit: "L",
      factor: 0.05,           // rendimento ~20 m²/L
      basePricePerUnit: 10,
      conversions: [
        { tipo: "galao_3.6L", fator_label: "1 galão = 3.6 L", fator: 1 / 3.6 },
      ],
    },
    {
      material: "Fita adesiva",
      unit: "und",
      factor: 0.05,           // 1 rolo/20 m²
      basePricePerUnit: 3,
      conversions: [],
    },
    {
      material: "Lixa",
      unit: "und",
      factor: 0.033,          // 1 und/30 m²
      basePricePerUnit: 0.8,
      conversions: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Motor de cálculo
// ---------------------------------------------------------------------------

/**
 * Calcula materiais para uma dada área e serviço.
 * Retorna valores técnicos exatos – sem arredondamento.
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
    const pricePerUnit = spec.basePricePerUnit * multiplier;

    const conversoes: HumanConversion[] = spec.conversions.map((c) => ({
      tipo: c.tipo,
      fator_label: c.fator_label,
      fator: c.fator,
      valor_convertido: valor_tecnico * c.fator,
    }));

    return {
      material: spec.material,
      tecnico: spec.unit,
      valor_tecnico,
      pricePerUnit,
      conversoes,
    };
  });

  const totalPrice = materials.reduce(
    (sum, m) => sum + m.valor_tecnico * m.pricePerUnit,
    0
  );

  return { serviceType, area, materials, totalPrice };
}

// ---------------------------------------------------------------------------
// Adaptadores de compatibilidade (camada legada)
// ---------------------------------------------------------------------------

import { Material } from "@/types";

/**
 * Converte TechnicalMaterial[] para o formato Material[] usado pela UI e PDF.
 * Aqui os valores são mantidos exatos para que a camada de apresentação
 * decida o arredondamento.
 */
export function toMaterialArray(technicalMaterials: TechnicalMaterial[]): Material[] {
  return technicalMaterials.map((tm) => ({
    name: tm.material,
    quantity: tm.valor_tecnico,
    unit: tm.tecnico,
    pricePerUnit: tm.pricePerUnit,
  }));
}
