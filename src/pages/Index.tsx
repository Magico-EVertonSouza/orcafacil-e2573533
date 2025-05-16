
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServiceCalculation, ServiceType } from "@/types";
import { getServiceInfo, servicesList } from "@/utils/serviceData";
import { calculateArea, calculateMaterials, calculateTotalPrice } from "@/utils/calculationUtils";
import ServiceItem from "@/components/ServiceItem";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [services, setServices] = useState<ServiceCalculation[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleServiceSelect = (serviceType: ServiceType) => {
    // Aqui podemos implementar um diálogo para capturar as dimensões
    const width = 3;  // Valores padrão para exemplo
    const height = 2;
    const area = calculateArea(width, height);
    const materials = calculateMaterials(serviceType, area);
    const serviceTotal = calculateTotalPrice(materials);

    const newService: ServiceCalculation = {
      id: uuidv4(),
      type: serviceType,
      width,
      height,
      area,
      materials,
      totalPrice: serviceTotal
    };

    setServices(prev => [...prev, newService]);
    setTotalPrice(prev => prev + serviceTotal);
  };

  const handleRemoveService = (id: string) => {
    const serviceToRemove = services.find(service => service.id === id);
    if (serviceToRemove) {
      setServices(prev => prev.filter(service => service.id !== id));
      setTotalPrice(prev => prev - serviceToRemove.totalPrice);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orçamento Fácil para Construção</h1>
        <p className="text-lg text-gray-600">
          Calcule materiais e custos para diversos serviços de construção
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Escolha um serviço para adicionar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {servicesList.map((service) => (
            <ServiceCard 
              key={service.type} 
              service={service} 
              onClick={() => handleServiceSelect(service.type)}
            />
          ))}
        </div>
      </section>

      {services.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Serviços adicionados</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <ServiceItem 
                key={service.id} 
                service={service} 
                onRemove={handleRemoveService}
              />
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Total do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(totalPrice)}
              </p>
            </CardContent>
          </Card>
        </section>
      )}
    </Layout>
  );
};

export default Index;
