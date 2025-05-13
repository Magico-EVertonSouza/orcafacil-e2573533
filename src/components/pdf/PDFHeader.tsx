
import { Text, View } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface PDFHeaderProps {
  date: string;
}

const PDFHeader = ({ date }: PDFHeaderProps) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>OrçaFácil</Text>
    <Text style={styles.headerSubtitle}>Orçamento gerado em {date}</Text>
  </View>
);

export default PDFHeader;
