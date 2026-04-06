
import { RegionPricing } from "@/types";

export const regions: RegionPricing[] = [
  // Portugal
  { country: "Portugal", region: "Lisboa", currency: "EUR", locale: "pt-PT", priceMultiplier: 1.15 },
  { country: "Portugal", region: "Porto", currency: "EUR", locale: "pt-PT", priceMultiplier: 1.05 },
  { country: "Portugal", region: "Algarve", currency: "EUR", locale: "pt-PT", priceMultiplier: 1.20 },
  { country: "Portugal", region: "Centro", currency: "EUR", locale: "pt-PT", priceMultiplier: 0.95 },
  { country: "Portugal", region: "Alentejo", currency: "EUR", locale: "pt-PT", priceMultiplier: 0.90 },
  { country: "Portugal", region: "Norte", currency: "EUR", locale: "pt-PT", priceMultiplier: 0.92 },
  // Brasil
  { country: "Brasil", region: "São Paulo", currency: "BRL", locale: "pt-BR", priceMultiplier: 1.10 },
  { country: "Brasil", region: "Rio de Janeiro", currency: "BRL", locale: "pt-BR", priceMultiplier: 1.15 },
  { country: "Brasil", region: "Minas Gerais", currency: "BRL", locale: "pt-BR", priceMultiplier: 0.90 },
  { country: "Brasil", region: "Bahia", currency: "BRL", locale: "pt-BR", priceMultiplier: 0.85 },
  { country: "Brasil", region: "Paraná", currency: "BRL", locale: "pt-BR", priceMultiplier: 0.95 },
  { country: "Brasil", region: "Rio Grande do Sul", currency: "BRL", locale: "pt-BR", priceMultiplier: 0.95 },
  // Espanha
  { country: "Espanha", region: "Madrid", currency: "EUR", locale: "es-ES", priceMultiplier: 1.20 },
  { country: "Espanha", region: "Barcelona", currency: "EUR", locale: "es-ES", priceMultiplier: 1.25 },
  { country: "Espanha", region: "Valência", currency: "EUR", locale: "es-ES", priceMultiplier: 1.00 },
  { country: "Espanha", region: "Sevilha", currency: "EUR", locale: "es-ES", priceMultiplier: 0.95 },
  // Angola
  { country: "Angola", region: "Luanda", currency: "AOA", locale: "pt-AO", priceMultiplier: 1.30 },
  { country: "Angola", region: "Benguela", currency: "AOA", locale: "pt-AO", priceMultiplier: 1.10 },
  // Moçambique
  { country: "Moçambique", region: "Maputo", currency: "MZN", locale: "pt-MZ", priceMultiplier: 0.80 },
  { country: "Moçambique", region: "Beira", currency: "MZN", locale: "pt-MZ", priceMultiplier: 0.75 },
];

export const getCountries = (): string[] => {
  return [...new Set(regions.map(r => r.country))];
};

export const getRegionsByCountry = (country: string): RegionPricing[] => {
  return regions.filter(r => r.country === country);
};

export const getDefaultRegion = (): RegionPricing => {
  return regions[0]; // Lisboa
};
