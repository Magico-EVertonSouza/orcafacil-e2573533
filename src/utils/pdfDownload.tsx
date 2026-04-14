
import { pdf } from '@react-pdf/renderer';
import { OrcamentoPDF } from '@/components/pdf/PDFDocument';
import { ServiceCalculation } from '@/types';

export const downloadBudgetPDF = async (
  services: ServiceCalculation[],
  budgetTitle?: string,
  clientName?: string
): Promise<void> => {
  const blob = await pdf(
    <OrcamentoPDF services={services} budgetTitle={budgetTitle} clientName={clientName} />
  ).toBlob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = budgetTitle
    ? `OrçaFácil-${budgetTitle.replace(/\s+/g, '-')}.pdf`
    : 'OrçaFácil-Orçamento.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
};
