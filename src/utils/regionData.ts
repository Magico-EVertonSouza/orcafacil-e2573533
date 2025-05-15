
import { Region, RegionCode } from '@/types';

export const regions: Region[] = [
  {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    priceMultiplier: 1.0
  },
  {
    code: 'BR',
    name: 'Brasil',
    currency: 'BRL',
    priceMultiplier: 0.8
  },
  {
    code: 'ES',
    name: 'Espanha',
    currency: 'EUR',
    priceMultiplier: 1.2
  }
];

export const getRegionByCode = (code: RegionCode): Region => {
  return regions.find(region => region.code === code) || regions[0];
};

export const formatCurrencyByRegion = (value: number, region: Region): string => {
  return new Intl.NumberFormat(region.code === 'BR' ? 'pt-BR' : 'pt-PT', {
    style: 'currency',
    currency: region.currency
  }).format(value);
};
