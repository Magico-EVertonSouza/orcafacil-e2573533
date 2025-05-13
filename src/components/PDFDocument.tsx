
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { getServiceInfo } from '@/utils/serviceData';
import { formatCurrency, formatNumber } from '@/utils/calculationUtils';

// Estilos para o documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#33C3F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#33C3F0',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E9196',
  },
  section: {
    marginBottom: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    padding: 10,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceDetails: {
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F7',
  },
  tableHeader: {
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  nameColumn: {
    width: '40%',
  },
  quantityColumn: {
    width: '15%',
    textAlign: 'right',
  },
  unitColumn: {
    width: '15%',
  },
  priceColumn: {
    width: '15%',
    textAlign: 'right',
  },
  subtotalColumn: {
    width: '15%',
    textAlign: 'right',
  },
  serviceTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 5,
  },
  serviceTotalText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  serviceTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#33C3F0',
    paddingTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    padding: 10,
    backgroundColor: '#F1F1F1',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#8E9196',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingTop: 10,
  },
});

interface PDFDocumentProps {
  services: ServiceCalculation[];
}

const OrcamentoPDF = ({ services }: PDFDocumentProps) => {
  const calculateTotalArea = () => {
    return services.reduce((total, service) => total + service.area, 0);
  };

  const calculateTotalPrice = () => {
    return services.reduce((total, service) => total + service.totalPrice, 0);
  };

  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>OrçaFácil</Text>
          <Text style={styles.headerSubtitle}>Orçamento gerado em {today}</Text>
        </View>

        {services.map((service, index) => {
          const serviceInfo = getServiceInfo(service.type);
          return (
            <View style={styles.section} key={index}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{serviceInfo.name}</Text>
                <Text style={styles.serviceDetails}>
                  {formatNumber(service.width)}m x {formatNumber(service.height)}m = {formatNumber(service.area)}m²
                </Text>
              </View>

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

                {service.materials.map((material, mIdx) => (
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

              <View style={styles.serviceTotal}>
                <Text style={styles.serviceTotalText}>Total do serviço:</Text>
                <Text style={styles.serviceTotalValue}>{formatCurrency(service.totalPrice)}</Text>
              </View>
            </View>
          );
        })}

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

        <Text style={styles.footer}>
          Orçamento gerado pelo OrçaFácil - Este é um orçamento estimativo baseado em médias de consumo.
          Os valores podem variar de acordo com as condições reais da obra.
        </Text>
      </Page>
    </Document>
  );
};

interface PDFViewerContainerProps {
  services: ServiceCalculation[];
}

const PDFViewerContainer = ({ services }: PDFViewerContainerProps) => {
  return (
    <PDFViewer style={{ width: '100%', height: '70vh' }}>
      <OrcamentoPDF services={services} />
    </PDFViewer>
  );
};

export default PDFViewerContainer;
