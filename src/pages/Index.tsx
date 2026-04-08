
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { ServiceCalculation, ServiceType } from "@/types";
import { servicesList } from "@/utils/serviceData";
import { formatCurrency } from "@/utils/calculationUtils";
import ServiceItem from "@/components/ServiceItem";
import ServiceCalculator from "@/components/ServiceCalculator";
import BudgetHeader from "@/components/BudgetHeader";
import { useBudgetMutations } from "@/hooks/useBudget";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import WelcomeSection from "@/components/WelcomeSection";

const Index = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceCalculation[]>([]);
  const [activeServiceType, setActiveServiceType] = useState<ServiceType | null>(null);
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [budgetTitle, setBudgetTitle] = useState("");
  const [budgetClientName, setBudgetClientName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { createBudget, saveServiceToBudget } = useBudgetMutations();

  const totalPrice = services.reduce((sum, s) => sum + s.totalPrice, 0);

  const handleCreateBudget = async (title: string, clientName?: string) => {
    try {
      const id = await createBudget(title, clientName);
      setBudgetId(id);
      setBudgetTitle(title);
      setBudgetClientName(clientName || "");
      toast.success("Orçamento criado!");
    } catch (err) {
      toast.error("Erro ao criar orçamento");
      console.error(err);
    }
  };

  const handleServiceSelect = (serviceType: ServiceType) => {
    setActiveServiceType(serviceType);
  };

  const handleAddService = async (calculation: ServiceCalculation) => {
    setServices(prev => [...prev, calculation]);
    setActiveServiceType(null);

    if (budgetId) {
      try {
        setIsSaving(true);
        await saveServiceToBudget(budgetId, calculation);
        toast.success("Serviço salvo no orçamento!");
      } catch (err) {
        toast.error("Erro ao salvar serviço");
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleRemoveService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleCancel = () => {
    setActiveServiceType(null);
  };

  const handleGeneratePDF = () => {
    navigate("/pdf", {
      state: {
        services,
        budgetTitle,
        clientName: budgetClientName,
      },
    });
  };

  const currency = services.length > 0 ? services[0].regionPricing.currency : "EUR";
  const locale = services.length > 0 ? services[0].regionPricing.locale : "pt-PT";

  return (
    <Layout>
      {!budgetId ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Orçamento Fácil para Construção</h1>
            <p className="text-lg text-muted-foreground">
              Calcule materiais e custos para diversos serviços de construção
            </p>
          </div>
          <BudgetHeader mode="create" onCreate={handleCreateBudget} />
        </>
      ) : (
        <>
          <BudgetHeader
            mode="editing"
            title={budgetTitle}
            clientName={budgetClientName}
            status="rascunho"
          />

          {activeServiceType ? (
            <section className="mb-8">
              <ServiceCalculator
                serviceType={activeServiceType}
                onAddService={handleAddService}
                onCancel={handleCancel}
              />
            </section>
          ) : (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Escolha um serviço para adicionar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {servicesList.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => handleServiceSelect(service.id)}
                  />
                ))}
              </div>
            </section>
          )}

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
                <CardContent className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(totalPrice, currency, locale)}
                  </p>
                  <Button onClick={handleGeneratePDF} className="flex items-center gap-2">
                    <FileDown size={16} />
                    Gerar PDF
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}
        </>
      )}
    </Layout>
  );
};

export default Index;
