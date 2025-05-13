
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { ServiceCalculation } from "@/types";
import PDFViewerContainer from "@/components/pdf/PDFDocument";
import { ArrowLeft } from "lucide-react";

const PDFPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { services } = location.state as { services: ServiceCalculation[] } || { services: [] };

  if (!services || services.length === 0) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Nenhum serviço encontrado</h1>
          <p className="mb-6">Você precisa adicionar serviços ao orçamento para gerar um PDF.</p>
          <Button onClick={() => navigate('/')}>Voltar para o início</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft size={16} /> 
            Voltar para o orçamento
          </Button>
          <h1 className="text-xl font-semibold">Orçamento em PDF</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <PDFViewerContainer services={services} />
        </div>

        <p className="text-sm text-gray-600 text-center">
          Você pode imprimir ou salvar este PDF usando as opções do visualizador acima.
        </p>
      </div>
    </Layout>
  );
};

export default PDFPage;
