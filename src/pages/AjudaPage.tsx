
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AjudaPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Ajuda - Como usar o OrçaFácil</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Como começar um novo orçamento?</AccordionTrigger>
            <AccordionContent>
              <p>Para começar um novo orçamento, selecione um dos serviços disponíveis na página inicial. 
              Em seguida, informe as dimensões (largura e altura/comprimento) da área onde o serviço será realizado. 
              O sistema calculará automaticamente a quantidade de materiais necessários e o valor estimado.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Como são calculadas as quantidades de materiais?</AccordionTrigger>
            <AccordionContent>
              <p>As quantidades de materiais são calculadas com base em médias de consumo predefinidas para cada tipo de serviço. 
              Por exemplo:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Para reboco, usamos o traço 7:3:1 (areia:cal:cimento)</li>
                <li>Para piso, calculamos argamassa, rejunte e o próprio piso</li>
                <li>Para capoto, as placas de esferovite, cola e rede</li>
                <li>Para concreto, as proporções de cimento, areia, brita e água</li>
              </ul>
              <p className="mt-2">Lembre-se que estas são estimativas e podem variar de acordo com as condições reais da obra.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Como adicionar mais serviços ao meu orçamento?</AccordionTrigger>
            <AccordionContent>
              <p>Depois de adicionar um serviço, você verá o botão "Adicionar Serviço" acima da lista de serviços já adicionados. 
              Clique nele e selecione o novo serviço que deseja incluir no orçamento.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Como gerar um PDF do meu orçamento?</AccordionTrigger>
            <AccordionContent>
              <p>Após adicionar todos os serviços desejados, clique no botão "Gerar Orçamento em PDF" que aparece abaixo 
              do resumo do orçamento. Você será direcionado para uma página onde poderá visualizar, salvar ou imprimir o PDF gerado.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Os preços dos materiais são precisos?</AccordionTrigger>
            <AccordionContent>
              <p>Os preços utilizados no OrçaFácil são médias de mercado e podem variar de acordo com a região, 
              fornecedor e época do ano. Recomendamos que você utilize os valores como uma estimativa inicial e 
              consulte fornecedores locais para obter preços mais precisos.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
};

export default AjudaPage;
