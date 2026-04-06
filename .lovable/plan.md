

## Plan: Criar ícones PWA e tornar o app instalável

### O que será feito
Gerar ícones PNG (192x192 e 512x512) com o logo/marca do OrçaFácil e configurar o HTML para que o app seja instalável em celulares — sem service worker.

### Etapas

1. **Gerar os ícones** via script Python (Pillow) — ícone simples com fundo na cor tema (#33C3F0) e texto "OF" centralizado. Salvos em `public/icons/icon-192.png` e `public/icons/icon-512.png`.

2. **Gerar apple-touch-icon** (180x180) em `public/apple-touch-icon.png`.

3. **Atualizar `index.html`** — adicionar:
   - `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
   - `<link rel="icon" type="image/png" href="/icons/icon-192.png">`

4. **Manter `manifest.json` como está** — já referencia os ícones corretos e tem `display: "standalone"`.

### Sem service worker
Apenas manifest + ícones é suficiente para instalabilidade (Add to Home Screen). Não será adicionado `vite-plugin-pwa` nem service worker.

