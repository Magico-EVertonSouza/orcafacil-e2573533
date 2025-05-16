
import { Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { getServiceInfo } from '@/utils/serviceData';
import { formatNumber, formatCurrency } from '@/utils/calculationUtils';
import { styles } from './PDFStyles';
import PDFMaterialsTable from './PDFMaterialsTable';

interface PDFServiceSectionProps {
  service: ServiceCalculation;
}

const PDFServiceSection = ({ service }: PDFServiceSectionProps) => {
  const serviceInfo = getServiceInfo(service.type);
  
  return (
    <View style={styles.section}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{serviceInfo.name}</Text>
        <Text style={styles.serviceDetails}>
          {formatNumber(service.width)}m x {formatNumber(service.height)}m = {formatNumber(service.area)}m²
        </Text>
      </View>

      <PDFMaterialsTable materials={service.materials} />

      <View style={styles.serviceTotal}>
        <Text style={styles.serviceTotalText}>Total do serviço:</Text>
        <Text style={styles.serviceTotalValue}>{formatCurrency(service.totalPrice)}</Text>
      </View>
    </View>
  );
};

export default PDFServiceSection;
