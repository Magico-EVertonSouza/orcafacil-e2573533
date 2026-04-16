import { supabase } from "@/integrations/supabase/client";
import { ServiceCalculation } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

/**
 * =========================================
 * TIPOS
 * =========================================
 */

export interface BudgetSummary {
  id: string;
  title: string;
  client_name: string | null;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

/**
 * =========================================
 * LISTAR ORÇAMENTOS
 * =========================================
 */
export const useListBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async (): Promise<BudgetSummary[]> => {
      const { data, error } = await supabase
        .from("budgets")
        .select("id, title, client_name, status, total_price, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Erro ao listar orçamentos:", error);
        throw error;
      }

      return data || [];
    },
  });
};

/**
 * =========================================
 * MUTAÇÕES
 * =========================================
 */
export const useBudgetMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /**
   * =========================================
   * CRIAR ORÇAMENTO (LIVRE - SEM LOGIN OBRIGATÓRIO)
   * =========================================
   */
  const createBudget = async (
    title: string,
    clientName?: string
  ): Promise<string> => {
    const payload: any = {
      title,
      client_name: clientName || null,
      total_price: 0,
    };

    /**
     * 👇 user_id agora é OPCIONAL
     * - se logado → salva user_id
     * - se não → cria orçamento anônimo
     */
    if (user?.id) {
      payload.user_id = user.id;
    }

    console.log("📦 Criando orçamento com payload:", payload);

    const { data, error } = await supabase
      .from("budgets")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("💥 Erro ao criar orçamento:", error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["budgets"] });

    return data.id;
  };

  /**
   * =========================================
   * DELETAR ORÇAMENTO
   * =========================================
   */
  const deleteBudget = async (budgetId: string) => {
    const { data: rooms } = await supabase
      .from("budget_rooms")
      .select("id")
      .eq("budget_id", budgetId);

    if (rooms?.length) {
      const roomIds = rooms.map((r) => r.id);

      const { data: services } = await supabase
        .from("budget_services")
        .select("id")
        .in("room_id", roomIds);

      if (services?.length) {
        const serviceIds = services.map((s) => s.id);

        await supabase
          .from("budget_service_materials")
          .delete()
          .in("budget_service_id", serviceIds);

        await supabase
          .from("budget_services")
          .delete()
          .in("room_id", roomIds);
      }

      await supabase
        .from("budget_rooms")
        .delete()
        .eq("budget_id", budgetId);
    }

    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budgetId);

    if (error) {
      console.error("Erro ao deletar orçamento:", error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  };

  /**
   * =========================================
   * SALVAR SERVIÇO NO ORÇAMENTO
   * =========================================
   */
  const saveServiceToBudget = async (
    budgetId: string,
    service: ServiceCalculation
  ) => {
    for (const room of service.rooms) {
      const { data: roomData, error: roomErr } = await supabase
        .from("budget_rooms")
        .insert({
          budget_id: budgetId,
          name: room.name,
          sort_order: 0,
        })
        .select("id")
        .single();

      if (roomErr) {
        console.error("Erro ao criar room:", roomErr);
        throw roomErr;
      }

      const wallsData = room.walls.map((w) => ({
        id: w.id,
        width: w.width,
        height: w.height,
        area: w.area,
      }));

      const { data: svcData, error: svcErr } = await supabase
        .from("budget_services")
        .insert({
          room_id: roomData.id,
          service_type_id: service.type,
          area: room.totalArea,
          width: service.width || 0,
          height: service.height || 0,
          total_price: room.totalPrice,
          region_country: service.regionPricing.country,
          region_name: service.regionPricing.region,
          region_currency: service.regionPricing.currency,
          region_locale: service.regionPricing.locale,
          region_multiplier: service.regionPricing.priceMultiplier,
          walls_data: wallsData,
        })
        .select("id")
        .single();

      if (svcErr) {
        console.error("Erro ao criar service:", svcErr);
        throw svcErr;
      }

      if (room.materials.length > 0) {
        const materialsInsert = room.materials.map((m) => ({
          budget_service_id: svcData.id,
          material_name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          price_per_unit: m.pricePerUnit,
          total_price: m.quantity * m.pricePerUnit,
        }));

        const { error: matErr } = await supabase
          .from("budget_service_materials")
          .insert(materialsInsert);

        if (matErr) {
          console.error("Erro ao inserir materiais:", matErr);
          throw matErr;
        }
      }
    }

    /**
     * =========================================
     * ATUALIZAR TOTAL
     * =========================================
     */
    const { data: allRooms } = await supabase
      .from("budget_rooms")
      .select("id")
      .eq("budget_id", budgetId);

    if (allRooms?.length) {
      const roomIds = allRooms.map((r) => r.id);

      const { data: allSvcs } = await supabase
        .from("budget_services")
        .select("total_price")
        .in("room_id", roomIds);

      const total =
        allSvcs?.reduce((sum, s) => sum + Number(s.total_price), 0) || 0;

      const { error } = await supabase
        .from("budgets")
        .update({ total_price: total })
        .eq("id", budgetId);

      if (error) {
        console.error("Erro ao atualizar total:", error);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["budget", budgetId] });
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  };

  return {
    createBudget,
    deleteBudget,
    saveServiceToBudget,
  };
};
