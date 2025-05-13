
import { useState } from "react";
import Layout from "@/components/Layout";
import { ServiceType, ServiceCalculation } from "@/types";
import { services } from "@/utils/serviceData";
import ServiceCard from "@/components/ServiceCard";
import ServiceCalculator from "@/components/ServiceCalculator";
import ServiceItem from "@/components/ServiceItem";
import { calculateArea, calculateMaterials, calculateTotalPrice, formatCurrency } from "@/utils/calculationUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [servicesList, setServicesList] = useState<ServiceCalculation[]>([]);
  const { toast } = useToast();

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
  };

  const handleCancelSelection = () => {
    setSelectedService(null);
  };

  const handleAddService = (width: number, height: number) => {
    if (!selectedService) return;

    const area = calculateArea(width, height);
    const materials = calculateMaterials(selectedService, area);
    const totalPrice = calculateTotalPrice(materials);

    const newService: ServiceCalculation = {
      id: uuidv4(),
      type: selectedService,
      width,
      height,
      area,
      materials,
      totalPrice,
    };

    setServicesList([...servicesList, newService]);
    setSelectedService(null);

    toast({
      title: "Serviço adicionado",
      description: `${services.find(s => s.id === selectedService)?.name} foi adicionado ao orçamento.`,
    });
  };

  const handleRemoveService = (id: string) => {
    setServicesList(servicesList.filter(service => service.id !== id));
    
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido do orçamento.",
    });
  };

  const calculateTotalOrcamento = () => {
    return servicesList.reduce((total, service) => total + service.totalPrice, 0);
  };

  return (
    <Layout>
      {selectedService ? (
        <div className="flex justify-center">
          <ServiceCalculator 
            serviceType={selectedService} 
            onAddService={handleAddService}
            onCancel={handleCancelSelection}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OrçaFácil</h1>
            <p className="text-lg text-gray-600">
              Calcule materiais e gere orçamentos para sua obra de forma simples
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">Selecione um serviço para começar:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={() => handleSelectService(service.id)} 
                />
              ))}
            </div>
          </section>

          {servicesList.length > 0 && (
            <section className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Seu Orçamento:</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedService(services[0].id)}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>Adicionar Serviço</span>
                </Button>
              </div>

              <div className="space-y-4">
                {servicesList.map((service) => (
                  <ServiceItem 
                    key={service.id} 
                    service={service} 
                    onRemove={handleRemoveService} 
                  />
                ))}
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Total do Orçamento:</p>
                    <p className="text-sm text-gray-600">
                      {servicesList.length} {servicesList.length === 1 ? 'serviço' : 'serviços'}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-orcafacil-blue">
                    {formatCurrency(calculateTotalOrcamento())}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link to="/pdf" state={{ services: servicesList }}>
                    <Button>Gerar Orçamento em PDF</Button>
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Index;
