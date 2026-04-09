

## Plano: Corrigir erro de build e adicionar download PDF na secção de orçamentos

### Problema
1. **Erro de build**: `@supabase/supabase-js` não está no `package.json` — precisa ser adicionado como dependência.
2. **Download PDF**: O botão PDF na página de orçamentos navega para outra página com um viewer. O utilizador quer poder fazer download direto do PDF.

### Alterações

| Arquivo | Alteração |
|---------|-----------|
| `package.json` | Adicionar `"@supabase/supabase-js": "^2.49.4"` nas dependencies |
| `src/pages/OrcamentosPage.tsx` | Substituir navegação para `/pdf` por download direto usando `@react-pdf/renderer`'s `pdf()` function — ao clicar no botão PDF, gera o blob e faz download automático do ficheiro `.pdf` |

### Detalhes técnicos

Na `OrcamentosPage`, em vez de navegar para a página PDF:
- Importar `pdf` de `@react-pdf/renderer` e o componente `OrcamentoPDF`
- Criar função `handleDownloadPDF` que:
  1. Carrega os dados do orçamento
  2. Gera o blob com `pdf(<OrcamentoPDF ... />).toBlob()`
  3. Cria link temporário e dispara o download
  4. Mostra toast de sucesso
- O botão PDF existente passa a chamar esta função diretamente

