// Importa os tipos personalizados usados neste módulo
import { Material, ServiceCalculation, ServiceType } from "@/types";

/*
 * Função que calcula a área de uma superfície (ex: parede ou piso)
 * Multiplica a largura pela altura e retorna o resultado
 */
export const calculateArea = (width: number, height: number): number => {
  return width * height;
};

/*
 * Função principal que calcula a lista de materiais com base no tipo de serviço e na área informada
 * Ela retorna um array de objetos "Material", com nome, quantidade e preço por unidade
 */
export const calculateMaterials = (serviceType: ServiceType, area: number): Material[] => {
  switch (serviceType) {

    // Reboco de parede
    case 'reboco':
      return [
        { name: 'Areia', quantity: area * 0.015, unit: 'm³', pricePerUnit: 40 },
        { name: 'Cal', quantity: area * 1.5, unit: 'kg', pricePerUnit: 0.5 },
        { name: 'Cimento', quantity: area * 2, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Carros de Mão (Areia)', quantity: Math.ceil(area * 0.005 * 12), unit: 'und', pricePerUnit: 0 },
      ];

    // Assentamento de piso cerâmico
    case 'piso':
      return [
        { name: 'Argamassa', quantity: area * 5, unit: 'kg', pricePerUnit: 0.5 },
        { name: 'Piso (cerâmica)', quantity: area * 1.1, unit: 'm²', pricePerUnit: 25 },
        { name: 'Rejunte', quantity: area * 0.2, unit: 'kg', pricePerUnit: 8 },
      ];

    // Pladur (divisórias em gesso cartonado)
    case 'pladur':
      return [
        { name: 'Placas de Gesso', quantity: area, unit: 'm²', pricePerUnit: 15 },
        { name: 'Perfis Metálicos', quantity: area * 2.5, unit: 'm', pricePerUnit: 3 },
        { name: 'Parafusos', quantity: area * 15, unit: 'und', pricePerUnit: 0.05 },
        { name: 'Massa para Juntas', quantity: area * 0.3, unit: 'kg', pricePerUnit: 2 },
      ];

    // Alvenaria (construção de paredes com tijolos)
    case 'alvenaria':
      return [
        { name: 'Tijolos', quantity: area * 25, unit: 'und', pricePerUnit: 0.8 },
        { name: 'Cimento', quantity: area * 5, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Areia', quantity: area * 0.01, unit: 'm³', pricePerUnit: 40 },
        { name: 'Cal', quantity: area * 1, unit: 'kg', pricePerUnit: 0.5 },
      ];

    // Capoto (isolamento térmico externo)
    case 'capoto':
      return [
        { name: 'Placas de Esferovite', quantity: area * 1.05, unit: 'm²', pricePerUnit: 12 },
        { name: 'Cola', quantity: area * 6, unit: 'kg', pricePerUnit: 1.2 },
        { name: 'Rede', quantity: area * 1.1, unit: 'm²', pricePerUnit: 2 },
        { name: 'Buchas', quantity: area * 6, unit: 'und', pricePerUnit: 0.3 },
      ];

    // Concreto (lajes ou fundações)
    case 'concreto':
      return [
        { name: 'Cimento', quantity: area * 0.015 * 350, unit: 'kg', pricePerUnit: 0.6 },
        { name: 'Areia', quantity: area * 0.015 * 0.7, unit: 'm³', pricePerUnit: 40 },
        { name: 'Brita', quantity: area * 0.015 * 0.8, unit: 'm³', pricePerUnit: 45 },
        { name: 'Água', quantity: area * 0.015 * 175, unit: 'L', pricePerUnit: 0.005 },
      ];

    // Pintura
    case 'pintura':
      return [
        { name: 'Tinta', quantity: area / 10, unit: 'L', pricePerUnit: 15 },
        { name: 'Primer', quantity: area / 20, unit: 'L', pricePerUnit: 10 },
        { name: 'Fita Adesiva', quantity: Math.ceil(area / 20), unit: 'rolo', pricePerUnit: 3 },
        { name: 'Lixa', quantity: Math.ceil(area / 30), unit: 'und', pricePerUnit: 0.8 },
      ];

    // Se não for nenhum dos tipos conhecidos, retorna lista vazia
    default:
      return [];
  }
};

/*
 * Função que soma o custo total de todos os materiais usados
 * Multiplica a quantidade pelo preço unitário de cada item
 */
export const calculateTotalPrice = (materials: Material[]): number => {
  return materials.reduce((total, material) => {
    return total + (material.quantity * material.pricePerUnit);
  }, 0);
};

/*
 * Formata um número para moeda (€), usando padrão português (pt-PT)
 * Ex: 25.5 → €25,50
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

/*
 * Formata número com 2 casas decimais fixas
 * Ex: 12 → 12,00 | 7.5 → 7,50
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};
