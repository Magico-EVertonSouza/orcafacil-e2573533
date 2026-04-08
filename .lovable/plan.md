

## Plano: Corrigir erro de build — dependência ausente

### Problema
O arquivo `src/integrations/supabase/client.ts` importa `@supabase/supabase-js`, mas esse pacote não existe no `package.json`.

### Solução
Adicionar a dependência ao `package.json`:

| Arquivo | Alteração |
|---------|-----------|
| `package.json` | Adicionar `"@supabase/supabase-js": "^2.49.4"` na seção `dependencies` (linha 69, antes de `"zod"`) |

### Nenhuma outra alteração necessária
O código em `client.ts` já está correto — apenas a dependência está faltando.

