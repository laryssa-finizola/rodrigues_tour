# Rodrigues Tur

Landing page responsiva em Next.js 16.4.6, React 19 e TypeScript. O redesign foi integrado ao repositório existente usando a versão fornecida como referência visual.

## Executar localmente

Requisitos: Node.js 20.9 ou superior e npm. Use uma versão LTS compatível. A instalação requer internet; as fontes do Google são baixadas no build e algumas fotografias são carregadas do Unsplash.

```bash
npm ci
npm run dev
```

Abra <http://localhost:3000>. No PowerShell, se `npm.ps1` estiver bloqueado, use `npm.cmd` nos mesmos comandos, sem alterar a política do Windows.

Para verificar o projeto e executar a versão de produção:

```bash
npm run check:repo
npm run test:repo
npm run lint
npm run build
npm run start
```


## SEO e publicação

- Defina `NEXT_PUBLIC_SITE_URL` com o domínio final (ex.: `https://www.seudominio.com.br`) antes do build. Ele é usado no canonical, no sitemap, no robots e nos dados estruturados. Na Vercel, sem essa variável, o build usa a URL de produção do projeto; fora dela, cai em `http://localhost:3000`.
- Opcional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` com o código de verificação do Google Search Console (método de meta tag).
- Nome, cidade, WhatsApp e Instagram ficam em `lib/site.ts`. Mantenha esses dados iguais aos do Perfil da Empresa no Google e do Instagram.
- `app/opengraph-image.jpg` é a imagem de compartilhamento (1200x630). Se os dados em `lib/site.ts` mudarem, rode `npm run og:image` (Node.js 23.6 ou superior) para gerar a imagem de novo.
