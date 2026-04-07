
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useListBudgets, useLoadBudget, useBudgetMutations, BudgetSummary } from "@/hooks/useBudget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { ServiceCalculation, Room, Wall, Material, RegionPricing } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrcamentosPage = () => {
  const navigate = useNavigate();
  const { data: budgets, isLoading } = useListBudgets();
  const { deleteBudget } = useBudgetMutations();
  const [loadingBudgetId, setLoadingBudgetId] = useState<string | null>(null);
  const { data: loadedBudget } = useLoadBudget(loadingBudgetId);

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success("Orçamento excluído!");
    } catch {
      toast.error("Erro ao excluir orçamento");
    }
  };

  // When budget loads, navigate to PDF
  if (loadedBudget && loadingBudgetId) {
    const services: ServiceCalculation[] = loadedBudget.rooms.flatMap((room) =>
      room.services.map((svc) => {
        const walls: Wall[] = (svc.walls_data || []).map((w: any) => ({
          id: w.id || crypto.randomUUID(),
          width: w.width || 0,
          height: w.height || 0,
          area: w.area || 0,
        }));

        const materials: Material[] = svc.materials.map((m) => ({
          name: m.material_name,
          quantity: m.quantity,
          unit: m.unit,
          pricePerUnit: m.price_per_unit,
        }));

        const regionPricing: RegionPricing = {
          country: svc.region_country || "Portugal",
          region: svc.region_name || "Lisboa",
          currency: svc.region_currency || "EUR",
          locale: svc.region_locale || "pt-PT",
          priceMultiplier: Number(svc.region_multiplier) || 1,
        };

        const roomObj: Room = {
          id: room.id,
          name: room.name,
          walls,
          totalArea: svc.area,
          materials,
          totalPrice: svc.total_price,
        };

        const calc: ServiceCalculation = {
          id: svc.id,
          type: svc.service_type_id as any,
          rooms: [roomObj],
          totalArea: svc.area,
          materials,
          totalPrice: svc.total_price,
          regionPricing,
          width: svc.width,
          height: svc.height,
          area: svc.area,
        };
        return calc;
      })
    );

    setTimeout(() => {
      setLoadingBudgetId(null);
      navigate("/pdf", {
        state: {
          services,
          budgetTitle: loadedBudget.title,
          clientName: loadedBudget.client_name,
        },
      });
    }, 0);
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(price);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meus Orçamentos</h1>
        <p className="text-muted-foreground">
          Gerencie seus orçamentos salvos
        </p>
      </div>

      {isLoading ? (
        <p className="text-center py-10 text-muted-foreground">Carregando...</p>
      ) : !budgets || budgets.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">Nenhum orçamento salvo ainda.</p>
            <Button onClick={() => navigate("/")}>Criar Orçamento</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.title}</CardTitle>
                  <Badge variant={budget.status === "finalizado" ? "default" : "secondary"}>
                    {budget.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {budget.client_name && <p>Cliente: {budget.client_name}</p>}
                    <p>Criado em: {formatDate(budget.created_at)}</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(budget.total_price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLoadingBudgetId(budget.id)}
                      disabled={!!loadingBudgetId}
                    >
                      <FileDown size={14} className="mr-1" />
                      PDF
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O orçamento "{budget.title}" será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(budget.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default OrcamentosPage;
