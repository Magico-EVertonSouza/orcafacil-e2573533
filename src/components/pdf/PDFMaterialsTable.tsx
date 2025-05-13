
import { Text, View } from '@react-pdf/renderer';
import { Material } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/calculationUtils';
import { styles } from './PDFStyles';

interface PDFMaterialsTableProps {
  materials: Material[];
}

const PDFMaterialsTable = ({ materials }: PDFMaterialsTableProps) => (
  <View style={styles.table}>
    <View style={styles.tableHeaderRow}>
      <View style={[styles.tableHeader, styles.nameColumn]}>
        <Text>Material</Text>
      </View>
      <View style={[styles.tableHeader, styles.quantityColumn]}>
        <Text>Qnt.</Text>
      </View>
      <View style={[styles.tableHeader, styles.unitColumn]}>
        <Text>Unid.</Text>
      </View>
      <View style={[styles.tableHeader, styles.priceColumn]}>
        <Text>Preço Un.</Text>
      </View>
      <View style={[styles.tableHeader, styles.subtotalColumn]}>
        <Text>Subtotal</Text>
      </View>
    </View>

    {materials.map((material, mIdx) => (
      <View style={styles.tableRow} key={mIdx}>
        <View style={[styles.tableCell, styles.nameColumn]}>
          <Text>{material.name}</Text>
        </View>
        <View style={[styles.tableCell, styles.quantityColumn]}>
          <Text>{formatNumber(material.quantity)}</Text>
        </View>
        <View style={[styles.tableCell, styles.unitColumn]}>
          <Text>{material.unit}</Text>
        </View>
        <View style={[styles.tableCell, styles.priceColumn]}>
          <Text>{formatCurrency(material.pricePerUnit)}</Text>
        </View>
        <View style={[styles.tableCell, styles.subtotalColumn]}>
          <Text>{formatCurrency(material.quantity * material.pricePerUnit)}</Text>
        </View>
      </View>
    ))}
  </View>
);

export default PDFMaterialsTable;
