
import { Text, View } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface PDFHeaderProps {
  date: string;
  budgetTitle?: string;
  clientName?: string;
}

const PDFHeader = ({ date, budgetTitle, clientName }: PDFHeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>OrçaFácil</Text>
    {budgetTitle && (
      <Text style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>{budgetTitle}</Text>
    )}
    {clientName && (
      <Text style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Cliente: {clientName}</Text>
    )}
    <Text style={styles.headerSubtitle}>Orçamento gerado em {date}</Text>
  </View>
);

export default PDFHeader;
