

## Plan: Adicionar seção de boas-vindas e tutorial na tela inicial

### O que sera feito
Criar um componente `WelcomeSection` que aparece acima do formulario de criacao de orcamento, explicando ao usuario de forma clara e visual os passos para criar um orcamento.

### Componente: `src/components/WelcomeSection.tsx`
- Hero section com titulo acolhedor e subtitulo explicativo
- 4 passos visuais em cards com icones e numeracao:
  1. **Crie seu orcamento** — De um nome e comece
  2. **Escolha os servicos** — Selecione reboco, pintura, piso, etc.
  3. **Informe as medidas** — Adicione comodos e paredes com dimensoes reais
  4. **Receba o resultado** — Veja materiais, custos e exporte por PDF ou WhatsApp
- Design limpo com icones do Lucide (ClipboardList, Hammer, Ruler, FileCheck)
- Responsivo: 1 coluna no mobile, 4 colunas no desktop

### Alteracao: `src/pages/Index.tsx`
- Importar e renderizar `<WelcomeSection />` antes do `<BudgetHeader mode="create" />` (apenas quando `!budgetId`)
- Nenhuma outra alteracao no fluxo existente

### Nenhuma alteracao no banco de dados

