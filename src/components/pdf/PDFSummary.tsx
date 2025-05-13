
import { Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/calculationUtils';
import { styles } from './PDFStyles';

interface PDFSummaryProps {
  services: ServiceCalculation[];
}

const PDFSummary = ({ services }: PDFSummaryProps) => {
  const calculateTotalArea = () => {
    return services.reduce((total, service) => total + service.area, 0);
  };

  const calculateTotalPrice = () => {
    return services.reduce((total, service) => total + service.totalPrice, 0);
  };

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>Resumo do Orçamento</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Número de serviços:</Text>
        <Text style={styles.summaryValue}>{services.length}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Área total:</Text>
        <Text style={styles.summaryValue}>{formatNumber(calculateTotalArea())} m²</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO:</Text>
        <Text style={styles.totalValue}>{formatCurrency(calculateTotalPrice())}</Text>
      </View>
    </View>
  );
};

export default PDFSummary;
