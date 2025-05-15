
import { Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { getServiceInfo } from '@/utils/serviceData';
import { formatNumber } from '@/utils/calculationUtils';
import { formatCurrencyByRegion } from '@/utils/regionData';
import { styles } from './PDFStyles';
import PDFMaterialsTable from './PDFMaterialsTable';
import PDFRoomsList from './PDFRoomsList';

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
          Área Total: {formatNumber(service.totalArea)}m²
        </Text>
      </View>
      
      <PDFRoomsList rooms={service.rooms} serviceType={service.type} />

      <PDFMaterialsTable materials={service.materials} />

      <View style={styles.serviceTotal}>
        <Text style={styles.serviceTotalText}>Total do serviço:</Text>
        <Text style={styles.serviceTotalValue}>
          {formatCurrencyByRegion(service.totalPrice, service.region)}
        </Text>
      </View>
    </View>
  );
};

export default PDFServiceSection;
