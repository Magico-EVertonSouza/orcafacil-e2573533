
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import { ServiceCalculation } from '@/types';
import { styles } from './PDFStyles';
import PDFHeader from './PDFHeader';
import PDFServiceSection from './PDFServiceSection';
import PDFSummary from './PDFSummary';
import PDFFooter from './PDFFooter';

interface OrcamentoPDFProps {
  services: ServiceCalculation[];
}

const OrcamentoPDF = ({ services }: OrcamentoPDFProps) => {
  const today = new Date().toLocaleDateString('pt-PT');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader date={today} />

        {services.map((service, index) => (
          <PDFServiceSection key={index} service={service} />
        ))}

        <PDFSummary services={services} />

        <PDFFooter />
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
