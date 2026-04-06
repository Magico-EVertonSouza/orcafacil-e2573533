
import { Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/calculationUtils';
import { styles } from './PDFStyles';

interface PDFSummaryProps {
  services: ServiceCalculation[];
}

const PDFSummary = ({ services }: PDFSummaryProps) => {
  const totalArea = services.reduce((total, s) => total + s.totalArea, 0);
  const totalPrice = services.reduce((total, s) => total + s.totalPrice, 0);
  const currency = services.length > 0 ? services[0].regionPricing.currency : "EUR";
  const locale = services.length > 0 ? services[0].regionPricing.locale : "pt-PT";

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>Resumo do Orçamento</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Número de serviços:</Text>
        <Text style={styles.summaryValue}>{services.length}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Área total:</Text>
        <Text style={styles.summaryValue}>{formatNumber(totalArea)} m²</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO:</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalPrice, currency, locale)}</Text>
      </View>
    </View>
  );
};

export default PDFSummary;
