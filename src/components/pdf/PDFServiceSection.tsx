
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
  const { currency, locale, region, country } = service.regionPricing;
  
  return (
    <View style={styles.section}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{serviceInfo.name}</Text>
        <Text style={styles.serviceDetails}>
          {region}, {country} — {service.rooms.length} {service.rooms.length === 1 ? 'cômodo' : 'cômodos'} — {formatNumber(service.totalArea)} m²
        </Text>
      </View>

      {service.rooms.map((room, idx) => (
        <View key={room.id} style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>
            {room.name} ({formatNumber(room.totalArea)} m²)
          </Text>
          <Text style={{ fontSize: 8, color: '#666', marginBottom: 4 }}>
            {room.walls.map((w, i) => 
              `${service.type === 'piso' ? 'Área' : 'Parede'} ${i+1}: ${formatNumber(w.width)}m × ${formatNumber(w.height)}m = ${formatNumber(w.area)} m²`
            ).join('  |  ')}
          </Text>
          <PDFMaterialsTable materials={room.materials} currency={currency} locale={locale} />
        </View>
      ))}

      <View style={styles.serviceTotal}>
        <Text style={styles.serviceTotalText}>Total do serviço:</Text>
        <Text style={styles.serviceTotalValue}>{formatCurrency(service.totalPrice, currency, locale)}</Text>
      </View>
    </View>
  );
};

export default PDFServiceSection;
