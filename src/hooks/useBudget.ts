
import { supabase } from "@/integrations/supabase/client";
import { ServiceCalculation } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface BudgetSummary {
  id: string;
  title: string;
  client_name: string | null;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetFull extends BudgetSummary {
  notes: string | null;
  rooms: BudgetRoomFull[];
}

export interface BudgetRoomFull {
  id: string;
  name: string;
  sort_order: number;
  services: BudgetServiceFull[];
}

export interface BudgetServiceFull {
  id: string;
  service_type_id: string;
  area: number;
  width: number;
  height: number;
  total_price: number;
  region_country: string | null;
  region_name: string | null;
  region_currency: string | null;
  region_locale: string | null;
  region_multiplier: number | null;
  walls_data: any;
  materials: BudgetMaterialRow[];
}

export interface BudgetMaterialRow {
  id: string;
  material_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
}

export const useListBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async (): Promise<BudgetSummary[]> => {
      const { data, error } = await supabase
        .from("budgets")
        .select("id, title, client_name, status, total_price, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useLoadBudget = (budgetId: string | null) => {
  return useQuery({
    queryKey: ["budget", budgetId],
    enabled: !!budgetId,
    queryFn: async (): Promise<BudgetFull | null> => {
      if (!budgetId) return null;

      const { data: budget, error: bErr } = await supabase
        .from("budgets")
        .select("*")
        .eq("id", budgetId)
        .single();
      if (bErr) throw bErr;

      const { data: rooms, error: rErr } = await supabase
        .from("budget_rooms")
        .select("*")
        .eq("budget_id", budgetId)
        .order("sort_order");
      if (rErr) throw rErr;

      const roomIds = (rooms || []).map((r: any) => r.id);
      let services: any[] = [];
      if (roomIds.length > 0) {
        const { data: sData, error: sErr } = await supabase
          .from("budget_services")
          .select("*")
          .in("room_id", roomIds);
        if (sErr) throw sErr;
        services = sData || [];
      }

      const serviceIds = services.map((s: any) => s.id);
      let materials: any[] = [];
      if (serviceIds.length > 0) {
        const { data: mData, error: mErr } = await supabase
          .from("budget_service_materials")
          .select("*")
          .in("budget_service_id", serviceIds);
        if (mErr) throw mErr;
        materials = mData || [];
      }

      const roomsFull: BudgetRoomFull[] = (rooms || []).map((room: any) => {
        const roomServices = services
          .filter((s: any) => s.room_id === room.id)
          .map((s: any) => ({
            ...s,
            materials: materials.filter((m: any) => m.budget_service_id === s.id),
          }));
        return { id: room.id, name: room.name, sort_order: room.sort_order, services: roomServices };
      });

      return { ...budget, rooms: roomsFull };
    },
  });
};

export const useBudgetMutations = () => {
  const queryClient = useQueryClient();

  const createBudget = async (title: string, clientName?: string): Promise<string> => {
    const { data, error } = await supabase
      .from("budgets")
      .insert({ title, client_name: clientName || null })
      .select("id")
      .single();
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
    return data.id;
  };

  const deleteBudget = async (budgetId: string) => {
    const { data: rooms } = await supabase
      .from("budget_rooms")
      .select("id")
      .eq("budget_id", budgetId);
    
    if (rooms && rooms.length > 0) {
      const roomIds = rooms.map(r => r.id);
      const { data: services } = await supabase
        .from("budget_services")
        .select("id")
        .in("room_id", roomIds);
      
      if (services && services.length > 0) {
        const svcIds = services.map(s => s.id);
        await supabase.from("budget_service_materials").delete().in("budget_service_id", svcIds);
        await supabase.from("budget_services").delete().in("room_id", roomIds);
      }
      await supabase.from("budget_rooms").delete().eq("budget_id", budgetId);
    }
    
    const { error } = await supabase.from("budgets").delete().eq("id", budgetId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  };

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
      if (roomErr) throw roomErr;

      const wallsData = room.walls.map(w => ({
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
      if (svcErr) throw svcErr;

      if (room.materials.length > 0) {
        const materialsInsert = room.materials.map(m => ({
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
        if (matErr) throw matErr;
      }
    }

    // Update budget total
    const { data: allRooms } = await supabase
      .from("budget_rooms")
      .select("id")
      .eq("budget_id", budgetId);
    
    if (allRooms && allRooms.length > 0) {
      const rIds = allRooms.map(r => r.id);
      const { data: allSvcs } = await supabase
        .from("budget_services")
        .select("total_price")
        .in("room_id", rIds);
      
      const total = (allSvcs || []).reduce((sum: number, s: any) => sum + Number(s.total_price), 0);
      await supabase
        .from("budgets")
        .update({ total_price: total })
        .eq("id", budgetId);
    }

    queryClient.invalidateQueries({ queryKey: ["budget", budgetId] });
    queryClient.invalidateQueries({ queryKey: ["budgets"] });
  };

  return { createBudget, deleteBudget, saveServiceToBudget };
};
