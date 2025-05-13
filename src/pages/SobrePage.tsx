
import Layout from "@/components/Layout";

const SobrePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Sobre o OrçaFácil</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="mb-4">
            O <strong>OrçaFácil</strong> é uma ferramenta online desenvolvida para ajudar profissionais da construção civil e leigos 
            a calcularem materiais e gerarem orçamentos para obras de forma simples e visual.
          </p>
          
          <p className="mb-4">
            Nossa missão é tornar o processo de orçamentação mais acessível, eliminando a necessidade de cálculos complexos 
            e planilhas complicadas. Com o OrçaFácil, você pode obter estimativas rapidamente para diversos tipos de serviços 
            de construção.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Recursos Principais</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Cálculo automático de materiais com base nas dimensões informadas</li>
            <li>Suporte para diversos tipos de serviços (reboco, piso, pladur, alvenaria, etc.)</li>
            <li>Geração de orçamentos em formato PDF</li>
            <li>Interface intuitiva e fácil de usar</li>
            <li>Aplicação responsiva que funciona em qualquer dispositivo</li>
          </ul>
          
          <p className="mt-6 text-sm text-gray-600">
            Versão 1.0 - Esta é a primeira versão do OrçaFácil e estamos constantemente trabalhando para melhorar e adicionar 
            mais funcionalidades. Agradecemos qualquer feedback ou sugestão para tornar a ferramenta ainda mais útil.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SobrePage;
