# Rodrigues Tur

Landing page responsiva em Next.js 16.4.3, React 19 e TypeScript. O redesign foi integrado ao repositório existente usando a versão fornecida como referência visual.

## Executar localmente

Requisitos: Node.js 20.9 ou superior e npm. Use uma versão LTS compatível. A instalação requer internet; algumas fotografias e fontes são carregadas do Unsplash e Google Fonts.

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

## Funcionalidades

- Navegação por seções e menu mobile com Escape, retorno de foco e rolagem em telas de pouca altura.
- Ao mudar para desktop, o menu mobile fecha e o foco é transferido para a navegação visível quando necessário.
- Hero com três destinos e seleção por clique ou setas do teclado.
- Galeria de inspirações, apresentação da marca, passos do planejamento e FAQ expansível.
- Planejador com estilo, período e companhia; a prévia acompanha as seleções.
- Destinos e planejador copiam uma mensagem e abrem o Instagram em outra aba. O visitante precisa colar a mensagem na conversa; não há envio automático, reserva ou backend de formulário.
- Cópias concorrentes são ordenadas; o retorno de uma operação antiga não substitui a última solicitação. Se a cópia for bloqueada, a mensagem permanece disponível para seleção manual.
- Layout responsivo e respeito à preferência de movimento reduzido.

Contato configurado: <https://www.instagram.com/rodriguesturpb/>. Os destinos são inspirações; disponibilidade deve ser consultada com a equipe.

## Arquivos e diferenças relevantes

| Arquivos | Alteração |
| --- | --- |
| `app/page.tsx`, `app/layout.tsx` | Entrada da nova landing page, idioma, metadados e viewport. |
| `app/globals.css` | Identidade visual, tipografia, estilos responsivos e correções de recortes e sobreposições. |
| `components/LandingPage.tsx`, `components/Icons.tsx` | Página interativa e ícones SVG locais, sem biblioteca adicional de interface. |
| `app/favicon.ico`, `app/icon.svg`, `public/scenes/*.svg` | Ícones da aplicação e paisagens de reserva. |
| `public/gramado.jpg` | Removidos metadados de câmera e edição; pixels, dimensões e orientação preservados. |
| `package.json`, `package-lock.json` | Next e ESLint Config Next alinhados em 16.4.3; correções transitivas compatíveis; removidos Tailwind e seu plugin PostCSS sem uso. React mantido em 19.2.4. |
| `.gitignore` | Proteção ampliada para credenciais, estado local, logs, arquivos compactados e saídas de testes. |
| `scripts/check-repo.mjs`, `scripts/check-repo.test.mjs` | Verificação de candidatos ao Git e testes com recursos nativos do Node.js, sem instalar pacotes. |
| `README.md` | Instruções portáveis, relatório e preparação para envio. |

Removidos após confirmar ausência de uso:

- `components/Hero.tsx`, `components/Navbar.tsx` e `components/SidebarIcons.tsx`.
- `public/icons-hero/` e os SVGs iniciais `file`, `globe`, `next`, `vercel` e `window`.
- `tailwind.config.ts` e `postcss.config.mjs`: o redesign usa CSS padrão e não depende desses plugins.

Logo original, histórico Git, ambiente, configurações Next.js, TypeScript e ESLint foram preservados. A revisão de segurança atualizou somente as dependências necessárias e removeu a ferramenta de estilos comprovadamente sem uso.

## Preparação para o GitHub

`npm run check:repo` examina arquivos rastreados e novos não ignorados, incluindo arquivos sensíveis que tenham sido adicionados à força. Bloqueia padrões conhecidos de credenciais, caminhos pessoais, dependências locais, metadados privados em JPEG e arquivos gerados entre os candidatos. Não imprime valores encontrados. É uma verificação por padrões, não uma garantia absoluta de ausência de segredos; não examina o histórico Git.

`node_modules`, `.next`, ambientes, credenciais, estado local, logs e saídas de testes devem ficar fora do commit. O lockfile deve ser enviado: contém versões e integridade das dependências, inclusive variantes opcionais de plataformas necessárias a instalações reproduzíveis. Não edite essas entradas manualmente.

Antes de criar seu commit, confira:

```bash
npm run check:repo
npm run test:repo
npm run lint
npm run build
npm audit

git status --short
git diff --stat
git diff --check
git add --dry-run .
```

Revise também arquivos novos, que não aparecem no `git diff` comum. Os comandos acima não criam commits ou fazem push. O servidor de testes é encerrado após a validação; use `npm run dev` para reabri-lo.

### Limite da limpeza do histórico

A fotografia original já continha metadados de câmera e edição em commits antigos. A cópia atual foi sanitizada, mas enviar o histórico existente também envia essas versões antigas. A revisão não reescreveu commits, preservando a instrução de manter o histórico. Os commits existentes também têm dados normais de autoria Git. Remover informações dos commits antigos exigiria uma operação separada e explicitamente autorizada antes do envio.

## Créditos das imagens

- Logo e fotografia de Gramado: fornecidos no projeto original.
- Porto de Galinhas: Bruno Muniz, Unsplash — [hero](https://unsplash.com/photos/tropical-coastline-with-palm-trees-and-turquoise-ocean-waves-qmDpG5zSMHQ) e [galeria](https://unsplash.com/photos/aerial-view-of-a-tropical-coastline-with-resorts-and-ocean-XxMyfUIlcLg).
- João Pessoa: Hugo Fabricio, Unsplash — [litoral](https://unsplash.com/photos/an-aerial-view-of-a-beach-and-ocean-KrN8za0E0h0).
- Seção sobre a marca: Pedro Menezes, Unsplash — [Natal](https://unsplash.com/photos/aerial-photography-of-seashore-kstDtBiS3Bo).
- Paisagens SVG de reserva: fornecidas no redesign.

## Relatório da revisão

Revisão concluída em 31/10/2026, na branch `feature/landing-redesign`, com foco nos problemas críticos antes do envio ao GitHub. A integração anterior passou em 45 verificações funcionais e 20 visuais. A revisão atual acrescenta testes de concorrência, mudança de orientação/tamanho, higiene do Git e limpeza de dependências.

- `npm ci`: aprovado com o lockfile atualizado; nenhuma dependência extra na árvore instalada.
- `npm audit`: zero vulnerabilidades reportadas após atualização compatível, sem `--force` ou overrides arbitrários. Isso descreve o resultado da auditoria na data da revisão.
- Sanitização JPEG: pixels decodificados e payload de imagem idênticos antes e depois da remoção de EXIF, XMP e IPTC/editoriais.
- Nenhuma credencial detectada nos candidatos ou nos blobs históricos examinados na revisão por padrões.
- `npm run lint` e `npm run build`: aprovados com Next 16.4.3, incluindo TypeScript e geração estática.
- `npm run check:repo`: zero ocorrências entre os arquivos atuais candidatos ao envio. `npm run test:repo`: seis testes aprovados, incluindo arquivo sensível adicionado à força e saída sem valores de credenciais.
- Dez regressões aprovadas: cópias concorrentes e cruzadas, falha da última cópia, três solicitações rápidas, retorno da prévia, menu landscape, mudança de breakpoint, movimento reduzido e teclado/ARIA do carrossel.
- Smoke de produção aprovado em 1440×1000, 768×1024, 390×844 e 320×740, sem overflow, erros de console, exceções JavaScript ou falhas de rede/recursos.

Limitações dos testes: o contato Instagram é interceptado para conferir endereço e abertura sem enviar mensagens reais. Login/direct e dispositivos físicos não são exercitados. Os testes responsivos usam Chromium com viewports; isso não substitui validar Safari/iOS. Imagens externas possuem reservas SVG e fontes possuem alternativas do sistema.

Artefatos de QA, capturas, relatórios de audit e backups ficam apenas na pasta temporária local, fora dos arquivos destinados ao GitHub. Não há caminhos pessoais na documentação.

Nenhum commit, push, merge, alteração na branch principal ou publicação foi realizado.
