
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { styles, coverStyles } from './PDFStyles';
import PDFHeader from './PDFHeader';
import PDFServiceSection from './PDFServiceSection';
import PDFSummary from './PDFSummary';
import PDFFooter from './PDFFooter';

interface OrcamentoPDFProps {
  services: ServiceCalculation[];
  budgetTitle?: string;
  clientName?: string;
}

const OrcamentoPDF = ({ services, budgetTitle, clientName }: OrcamentoPDFProps) => {
  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={coverStyles.page}>
        <View style={coverStyles.topBar} />
        <View style={coverStyles.content}>
          <Text style={coverStyles.brand}>OrçaFácil</Text>
          <View style={coverStyles.divider} />
          <Text style={coverStyles.title}>
            {budgetTitle || 'Orçamento de Obra'}
          </Text>
          {clientName && (
            <Text style={coverStyles.client}>Cliente: {clientName}</Text>
          )}
          <Text style={coverStyles.date}>Data: {today}</Text>
          <Text style={coverStyles.serviceCount}>
            {services.length} {services.length === 1 ? 'serviço' : 'serviços'} incluídos
          </Text>
        </View>
        <View style={coverStyles.bottomBar}>
          <Text style={coverStyles.bottomText}>
            Orçamento gerado automaticamente pelo OrçaFácil
          </Text>
        </View>
      </Page>

      {/* Detail Pages */}
      <Page size="A4" style={styles.page} wrap>
        <PDFHeader date={today} budgetTitle={budgetTitle} clientName={clientName} />

        {services.map((service, index) => (
          <PDFServiceSection key={index} service={service} />
        ))}

        <PDFSummary services={services} />
        <PDFFooter />
      </Page>
    </Document>
  );
};

export { OrcamentoPDF };
export default OrcamentoPDF;
