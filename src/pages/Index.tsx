
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orcafacil-blue mb-4">OrçaFácil - Orçamento para Construção Civil</h1>
          <p className="text-lg text-gray-600">
            Bem-vindo ao OrçaFácil, uma ferramenta para criar orçamentos para construção civil de forma rápida e fácil.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Selecione o tipo de serviço que deseja orçar</li>
              <li>Preencha as dimensões da área a ser trabalhada</li>
              <li>Adicione quantos serviços desejar ao seu orçamento</li>
              <li>Visualize os materiais e custos estimados</li>
              <li>Exporte seu orçamento para PDF</li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Comece seu orçamento agora!</h2>
            <Button 
              size="lg" 
              className="bg-orcafacil-blue hover:bg-orcafacil-blue/90"
            >
              Criar Novo Orçamento
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
