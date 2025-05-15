
import { Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { formatNumber } from '@/utils/calculationUtils';
import { formatCurrencyByRegion } from '@/utils/regionData';
import { styles } from './PDFStyles';

interface PDFSummaryProps {
  services: ServiceCalculation[];
}

const PDFSummary = ({ services }: PDFSummaryProps) => {
  const calculateTotalArea = () => {
    return services.reduce((total, service) => total + service.totalArea, 0);
  };

  const calculateTotalPrice = () => {
    return services.reduce((total, service) => total + service.totalPrice, 0);
  };

  const totalRooms = services.reduce((total, service) => total + service.rooms.length, 0);

  // Todos os orçamentos devem usar a mesma região
  const region = services[0]?.region;

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>Resumo do Orçamento</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Número de serviços:</Text>
        <Text style={styles.summaryValue}>{services.length}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total de cômodos:</Text>
        <Text style={styles.summaryValue}>{totalRooms}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Área total:</Text>
        <Text style={styles.summaryValue}>{formatNumber(calculateTotalArea())} m²</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Região:</Text>
        <Text style={styles.summaryValue}>{region?.name || 'Portugal'}</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO:</Text>
        <Text style={styles.totalValue}>
          {region ? formatCurrencyByRegion(calculateTotalPrice(), region) : ''}
        </Text>
      </View>
    </View>
  );
};

export default PDFSummary;
