
-- Add user_id to budgets
ALTER TABLE public.budgets ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create helper function to check budget ownership (avoids recursion in child table policies)
CREATE OR REPLACE FUNCTION public.budget_belongs_to_user(_budget_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.budgets WHERE id = _budget_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.room_belongs_to_user(_room_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.budget_rooms br
    JOIN public.budgets b ON b.id = br.budget_id
    WHERE br.id = _room_id AND b.user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.service_belongs_to_user(_service_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.budget_services bs
    JOIN public.budget_rooms br ON br.id = bs.room_id
    JOIN public.budgets b ON b.id = br.budget_id
    WHERE bs.id = _service_id AND b.user_id = _user_id
  );
$$;

-- Drop old permissive policies on budgets
DROP POLICY IF EXISTS "Anyone can create budgets" ON public.budgets;
DROP POLICY IF EXISTS "Anyone can delete budgets" ON public.budgets;
DROP POLICY IF EXISTS "Anyone can update budgets" ON public.budgets;
DROP POLICY IF EXISTS "Budgets are readable by everyone" ON public.budgets;

-- New budgets policies
CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create own budgets" ON public.budgets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Drop old permissive policies on budget_rooms
DROP POLICY IF EXISTS "Anyone can create budget rooms" ON public.budget_rooms;
DROP POLICY IF EXISTS "Anyone can delete budget rooms" ON public.budget_rooms;
DROP POLICY IF EXISTS "Anyone can update budget rooms" ON public.budget_rooms;
DROP POLICY IF EXISTS "Budget rooms are readable by everyone" ON public.budget_rooms;

-- New budget_rooms policies
CREATE POLICY "Users can view own budget rooms" ON public.budget_rooms FOR SELECT TO authenticated USING (public.budget_belongs_to_user(budget_id, auth.uid()));
CREATE POLICY "Users can create own budget rooms" ON public.budget_rooms FOR INSERT TO authenticated WITH CHECK (public.budget_belongs_to_user(budget_id, auth.uid()));
CREATE POLICY "Users can update own budget rooms" ON public.budget_rooms FOR UPDATE TO authenticated USING (public.budget_belongs_to_user(budget_id, auth.uid()));
CREATE POLICY "Users can delete own budget rooms" ON public.budget_rooms FOR DELETE TO authenticated USING (public.budget_belongs_to_user(budget_id, auth.uid()));

-- Drop old permissive policies on budget_services
DROP POLICY IF EXISTS "Anyone can create budget services" ON public.budget_services;
DROP POLICY IF EXISTS "Anyone can delete budget services" ON public.budget_services;
DROP POLICY IF EXISTS "Anyone can update budget services" ON public.budget_services;
DROP POLICY IF EXISTS "Budget services are readable by everyone" ON public.budget_services;

-- New budget_services policies
CREATE POLICY "Users can view own budget services" ON public.budget_services FOR SELECT TO authenticated USING (public.room_belongs_to_user(room_id, auth.uid()));
CREATE POLICY "Users can create own budget services" ON public.budget_services FOR INSERT TO authenticated WITH CHECK (public.room_belongs_to_user(room_id, auth.uid()));
CREATE POLICY "Users can update own budget services" ON public.budget_services FOR UPDATE TO authenticated USING (public.room_belongs_to_user(room_id, auth.uid()));
CREATE POLICY "Users can delete own budget services" ON public.budget_services FOR DELETE TO authenticated USING (public.room_belongs_to_user(room_id, auth.uid()));

-- Drop old permissive policies on budget_service_materials
DROP POLICY IF EXISTS "Anyone can create budget service materials" ON public.budget_service_materials;
DROP POLICY IF EXISTS "Anyone can delete budget service materials" ON public.budget_service_materials;
DROP POLICY IF EXISTS "Anyone can update budget service materials" ON public.budget_service_materials;
DROP POLICY IF EXISTS "Budget service materials are readable by everyone" ON public.budget_service_materials;

-- New budget_service_materials policies
CREATE POLICY "Users can view own budget materials" ON public.budget_service_materials FOR SELECT TO authenticated USING (public.service_belongs_to_user(budget_service_id, auth.uid()));
CREATE POLICY "Users can create own budget materials" ON public.budget_service_materials FOR INSERT TO authenticated WITH CHECK (public.service_belongs_to_user(budget_service_id, auth.uid()));
CREATE POLICY "Users can update own budget materials" ON public.budget_service_materials FOR UPDATE TO authenticated USING (public.service_belongs_to_user(budget_service_id, auth.uid()));
CREATE POLICY "Users can delete own budget materials" ON public.budget_service_materials FOR DELETE TO authenticated USING (public.service_belongs_to_user(budget_service_id, auth.uid()));
