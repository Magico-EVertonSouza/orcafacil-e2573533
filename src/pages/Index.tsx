
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Layout from "@/components/Layout";
import { services } from "@/utils/serviceData";
import ServiceCard from "@/components/ServiceCard";
import ServiceItem from "@/components/ServiceItem";
import { calculateMaterials, calculateTotalPrice } from "@/utils/calculationUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ServiceType, ServiceCalculation, Region, Room } from "@/types";
import RegionSelector from "@/components/RegionSelector";
import RoomCounter from "@/components/RoomCounter";
import RoomForm from "@/components/RoomForm";
import RoomsList from "@/components/RoomsList";
import { regions, getRegionByCode, formatCurrencyByRegion } from "@/utils/regionData";

// Enum para os diferentes passos no processo de orçamentação
enum OrcamentoStep {
  SELECT_SERVICE,
  SELECT_REGION,
  CONFIGURE_ROOMS_COUNT,
  ADD_ROOMS,
  REVIEW_ROOMS,
}

const Index = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const [servicesList, setServicesList] = useState<ServiceCalculation[]>([]);
  const [currentStep, setCurrentStep] = useState<OrcamentoStep>(OrcamentoStep.SELECT_SERVICE);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [roomsAdded, setRoomsAdded] = useState<Room[]>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState<number>(0);
  
  const { toast } = useToast();

  const handleSelectService = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    setCurrentStep(OrcamentoStep.SELECT_REGION);
    setRoomsAdded([]);
    setCurrentRoomIndex(0);
  };

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    setCurrentStep(OrcamentoStep.CONFIGURE_ROOMS_COUNT);
  };

  const handleRoomCountConfirm = (count: number) => {
    setRoomsCount(count);
    setCurrentStep(OrcamentoStep.ADD_ROOMS);
  };

  const handleRoomComplete = (room: Room) => {
    setRoomsAdded([...roomsAdded, room]);
    
    if (currentRoomIndex + 1 < roomsCount) {
      // Avança para o próximo cômodo
      setCurrentRoomIndex(currentRoomIndex + 1);
    } else {
      // Todos os cômodos foram adicionados
      setCurrentStep(OrcamentoStep.REVIEW_ROOMS);
    }
  };

  const handleRemoveRoom = (id: string) => {
    const updatedRooms = roomsAdded.filter(room => room.id !== id);
    setRoomsAdded(updatedRooms);
    
    if (updatedRooms.length < roomsCount) {
      setCurrentRoomIndex(updatedRooms.length);
    }
  };

  const handleCancelSelection = () => {
    if (currentStep === OrcamentoStep.SELECT_REGION) {
      setCurrentStep(OrcamentoStep.SELECT_SERVICE);
      setSelectedService(null);
    } else if (currentStep === OrcamentoStep.CONFIGURE_ROOMS_COUNT) {
      setCurrentStep(OrcamentoStep.SELECT_REGION);
    } else if (currentStep === OrcamentoStep.ADD_ROOMS) {
      setCurrentStep(OrcamentoStep.CONFIGURE_ROOMS_COUNT);
    } else if (currentStep === OrcamentoStep.REVIEW_ROOMS) {
      setCurrentStep(OrcamentoStep.ADD_ROOMS);
    }
  };

  const handleAddService = () => {
    if (!selectedService || !roomsAdded.length) return;
    
    // Calcular área total de todos os cômodos
    const totalArea = roomsAdded.reduce((total, room) => total + room.totalArea, 0);
    
    // Calcular materiais com base no tipo de serviço, área total e região
    const materials = calculateMaterials(selectedService, totalArea, selectedRegion);
    const totalPrice = calculateTotalPrice(materials);

    const newService: ServiceCalculation = {
      id: uuidv4(),
      type: selectedService,
      rooms: [...roomsAdded],
      totalArea,
      materials,
      totalPrice,
      region: selectedRegion
    };

    setServicesList([...servicesList, newService]);
    
    toast({
      title: "Serviço adicionado",
      description: `${services.find((s) => s.id === selectedService)?.name} foi adicionado ao orçamento.`
    });

    // Reiniciar o processo
    setSelectedService(null);
    setRoomsAdded([]);
    setCurrentRoomIndex(0);
    setCurrentStep(OrcamentoStep.SELECT_SERVICE);
  };

  const handleAddAnotherRoom = () => {
    setCurrentStep(OrcamentoStep.ADD_ROOMS);
  };

  const handleRemoveService = (id: string) => {
    setServicesList(servicesList.filter((service) => service.id !== id));
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido do orçamento."
    });
  };

  const handleStartNewService = () => {
    setSelectedService(null);
    setRoomsAdded([]);
    setCurrentRoomIndex(0);
    setCurrentStep(OrcamentoStep.SELECT_SERVICE);
  };

  const calculateTotalOrcamento = () => {
    return servicesList.reduce((total, service) => total + service.totalPrice, 0);
  };

  const renderCurrentStep = () => {
    const serviceInfo = selectedService ? services.find(s => s.id === selectedService) : null;
    const serviceName = serviceInfo?.name || '';
    
    switch (currentStep) {
      case OrcamentoStep.SELECT_SERVICE:
        return (
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
                    onClick={() => handleSelectService(service.id as ServiceType)} 
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case OrcamentoStep.SELECT_REGION:
        return (
          <div className="flex justify-center">
            <RegionSelector 
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
            />
          </div>
        );

      case OrcamentoStep.CONFIGURE_ROOMS_COUNT:
        return (
          <div className="flex justify-center">
            <RoomCounter 
              onRoomCountConfirm={handleRoomCountConfirm}
              onCancel={handleCancelSelection}
              serviceType={serviceName}
            />
          </div>
        );

      case OrcamentoStep.ADD_ROOMS:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {serviceName}: Cômodo {currentRoomIndex + 1} de {roomsCount}
              </h2>
              <Button variant="outline" onClick={handleCancelSelection}>
                Voltar
              </Button>
            </div>
            
            <div className="flex justify-center">
              <RoomForm 
                onRoomComplete={handleRoomComplete}
                onCancel={handleCancelSelection}
                serviceType={serviceName}
              />
            </div>
            
            {roomsAdded.length > 0 && (
              <div className="mt-8">
                <RoomsList 
                  rooms={roomsAdded} 
                  onRemoveRoom={handleRemoveRoom}
                  serviceType={serviceName}
                />
              </div>
            )}
          </div>
        );

      case OrcamentoStep.REVIEW_ROOMS:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Revisar Cômodos para {serviceName}
              </h2>
              <Button variant="outline" onClick={handleCancelSelection}>
                Voltar
              </Button>
            </div>
            
            <RoomsList 
              rooms={roomsAdded} 
              onRemoveRoom={handleRemoveRoom}
              serviceType={serviceName}
            />
            
            <div className="flex justify-between pt-4 border-t">
              {roomsAdded.length < roomsCount && (
                <Button 
                  variant="outline" 
                  onClick={handleAddAnotherRoom}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> 
                  <span>Adicionar Mais um Cômodo</span>
                </Button>
              )}
              
              <Button onClick={handleAddService}>
                Finalizar e Adicionar ao Orçamento
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Layout>
      {renderCurrentStep()}

      {servicesList.length > 0 && currentStep === OrcamentoStep.SELECT_SERVICE && (
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Seu Orçamento:</h2>
            <Button 
              variant="outline" 
              onClick={handleStartNewService}
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
                {formatCurrencyByRegion(calculateTotalOrcamento(), servicesList[0].region)}
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
    </Layout>
  );
};

export default Index;
