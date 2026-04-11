
Corrigir o erro de build adicionando a dependência que está faltando no projeto.

1. Atualizar `package.json`
- Adicionar `@supabase/supabase-js` em `dependencies`.
- O erro atual acontece porque `src/integrations/supabase/client.ts` importa esse pacote, mas ele não existe na lista de dependências.

2. Sincronizar a instalação
- Rodar a instalação do gerenciador de pacotes para atualizar os arquivos de lock e garantir que o módulo fique disponível no build.

3. Validar
- Executar o build novamente para confirmar que o erro `TS2307: Cannot find module '@supabase/supabase-js'` foi resolvido.

Detalhe técnico
- Arquivo impactado: `package.json`
- Import já existente e correto: `src/integrations/supabase/client.ts`
- Não é necessário alterar a lógica do cliente, apenas garantir que a biblioteca esteja instalada.
