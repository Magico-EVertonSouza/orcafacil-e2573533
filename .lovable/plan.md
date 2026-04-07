

## Plan: Evolução do OrçaFácil para Sistema Profissional com Persistência e PDF

### Situacao Atual

- **Frontend**: Calculadora funcional com multi-comodos, multi-paredes, regiao/pais, 7 tipos de servico
- **Banco**: Tabelas `budgets`, `budget_rooms`, `budget_services`, `budget_service_materials` ja existem com FKs corretas
- **Problema**: Frontend nao salva nada no banco. OrcamentosPage esta vazia. PDF existe mas esta desconectado do fluxo principal
- **DB gap**: `budget_services` nao tem campos de regiao; `budgets` nao tem campo de regiao

### Alteracoes no Banco (SQL Migration)

Add columns to `budget_services` for region tracking and support multi-wall data:

```sql
ALTER TABLE budget_services 
  ADD COLUMN IF NOT EXISTS region_country TEXT,
  ADD COLUMN IF NOT EXISTS region_name TEXT,
  ADD COLUMN IF NOT EXISTS region_currency TEXT DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS region_locale TEXT DEFAULT 'pt-PT',
  ADD COLUMN IF NOT EXISTS region_multiplier NUMERIC DEFAULT 1,
  ADD COLUMN IF NOT EXISTS walls_data JSONB DEFAULT '[]';
```

`walls_data` stores wall dimensions as JSON array (avoids a new table for walls which would overcomplicate without clear benefit).

### Etapas de Implementacao

#### 1. Criar hook `useBudget` para persistencia
- **Arquivo**: `src/hooks/useBudget.ts`
- Funcoes: `createBudget`, `addRoomToBudget`, `addServiceToRoom`, `saveMaterials`, `loadBudget`, `listBudgets`, `deleteBudget`
- Usa Supabase client para todas as operacoes CRUD
- Retorna estado reativo com React Query

#### 2. Refatorar Index.tsx — Fluxo com nome do orcamento
- Adicionar campo "Nome do Orcamento" e "Nome do Cliente" (opcional) no topo
- Ao preencher e clicar "Criar Orcamento", salva na tabela `budgets` e entra no modo edicao
- Servicos adicionados sao persistidos automaticamente no banco
- Botao "Gerar PDF" aparece quando ha servicos adicionados
- Botao "Salvar" atualiza total_price e status

#### 3. Criar componente `BudgetHeader`
- **Arquivo**: `src/components/BudgetHeader.tsx`
- Inputs para titulo e nome do cliente
- Exibe status do orcamento (rascunho/finalizado)

#### 4. Adaptar ServiceCalculator para persistir
- Apos "Adicionar ao Orcamento", salvar:
  1. `budget_rooms` (nome do comodo)
  2. `budget_services` (tipo, area, preco, dados de regiao, walls_data como JSON)
  3. `budget_service_materials` (cada material)
- Atualizar `budgets.total_price` com soma

#### 5. Implementar OrcamentosPage
- Listar orcamentos salvos (titulo, cliente, data, total, status)
- Clicar abre o orcamento para visualizacao/edicao
- Botao deletar com confirmacao
- Botao "Gerar PDF" por orcamento

#### 6. Integrar geracao de PDF no fluxo principal
- Botao "Gerar PDF" na pagina Index (ja existe rota /pdf)
- PDF inclui: nome do orcamento, cliente, lista de comodos, servicos, materiais, total
- Reutiliza componentes PDF existentes (PDFHeader, PDFServiceSection, PDFSummary, PDFFooter)
- Adicionar nome do orcamento e cliente ao PDFHeader

#### 7. Atualizar PDFHeader para receber dados do orcamento
- Props: `budgetTitle`, `clientName`, `date`
- Exibir no cabecalho do PDF

### Arquivos Modificados/Criados

| Arquivo | Acao |
|---------|------|
| `src/hooks/useBudget.ts` | Criar — hook de persistencia |
| `src/components/BudgetHeader.tsx` | Criar — cabecalho do orcamento |
| `src/pages/Index.tsx` | Editar — fluxo com nome, persistencia, botao PDF |
| `src/pages/OrcamentosPage.tsx` | Editar — listagem de orcamentos salvos |
| `src/components/ServiceCalculator.tsx` | Editar — salvar no banco apos adicionar |
| `src/components/pdf/PDFHeader.tsx` | Editar — nome do orcamento e cliente |
| `src/components/pdf/PDFDocument.tsx` | Editar — receber props do orcamento |
| Migration SQL | `budget_services` — add region + walls_data columns |

### O que NAO muda
- Tipos existentes em `src/types/index.ts`
- Logica de calculo em `calculationUtils.ts`
- Dados de regiao em `regionData.ts`
- Componentes UI base (Shadcn)
- Design visual atual
- Fluxo de 3 etapas do ServiceCalculator (regiao → comodos → resumo)

