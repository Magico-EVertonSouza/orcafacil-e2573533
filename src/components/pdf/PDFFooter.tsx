
import { Text } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

const PDFFooter = () => (
  <Text style={styles.footer}>
    Orçamento gerado pelo OrçaFácil - Este é um orçamento estimativo baseado em médias de consumo.
    Os valores podem variar de acordo com as condições reais da obra.
  </Text>
);

export default PDFFooter;
