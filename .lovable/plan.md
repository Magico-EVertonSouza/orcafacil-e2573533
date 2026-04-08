

## Plan: Corrigir erro de build — adicionar dependência @supabase/supabase-js

### Problema
O arquivo `src/integrations/supabase/client.ts` importa `@supabase/supabase-js`, mas esse pacote não está listado no `package.json`.

### Solução
Adicionar `@supabase/supabase-js` às dependências do `package.json`:

```
"@supabase/supabase-js": "^2.49.4"
```

### Arquivo alterado
| Arquivo | Ação |
|---------|------|
| `package.json` | Adicionar `@supabase/supabase-js` nas dependencies |

### Nenhuma outra alteração necessária

