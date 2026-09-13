# Contexto e orientações do projeto

## Separação entre ATC e a joint venture

Este repositório mantém dois sites com evolução independente, conforme decisão do usuário:

| Branch | Finalidade | Domínio |
| --- | --- | --- |
| `main` | Site institucional original da ATC China Brasil | `atcchinabrasil.com` |
| `acs-group` | Site da união entre a ATC e a CS Group | Ainda não informado |

- `acs-group` foi criada a partir da `main`, após o commit `4ba979d`, que adicionou o deploy Docker/Dokploy. Deve ser tratada como uma linha de desenvolvimento permanente, próxima de um projeto separado, e não como uma feature destinada a merge na `main`.
- As próximas alterações de identidade, conteúdo e funcionalidades da joint venture pertencem à `acs-group`. Preserve o site original da ATC na `main`.
- Antes de editar, confira a branch e as alterações existentes com `git status --short --branch`.
- Não faça merges, rebases ou cherry-picks entre essas duas linhas por iniciativa própria. Uma correção compartilhada deve ter seu destino definido pela solicitação do usuário.
- Não crie PR de `acs-group` para `main` como etapa padrão de conclusão de uma tarefa.
- A empresa parceira é a **CS Group**, conforme informado pelo usuário. A primeira mudança de identidade solicitada é o logo **ACS**, preservando o A estilizado da ATC e o padrão tipográfico das letras. Contatos, domínio e as demais mudanças de identidade ainda serão definidos.
- A `acs-group` usa o logo ACS, mas ainda contém textos, contatos e configurações da ATC. Isso é conteúdo herdado, não confirmação de que será usado pela joint venture.

## Produto e arquitetura

Site institucional voltado a comércio internacional, importação, exportação, sourcing e prospecção comercial. O contato principal é direcionado ao WhatsApp. Atualmente não há banco de dados, autenticação, CMS, carrinho ou checkout.

- Next.js 16.2.0 com App Router e saída `standalone`.
- React 19, TypeScript em modo estrito e alias `@/` para a raiz.
- Tailwind CSS 4, shadcn/ui com Radix, ícones Lucide e utilitário `cn()`.
- Páginas e seções predominantemente renderizadas no servidor; componentes com estado, efeitos e APIs do navegador usam `"use client"`.
- Português, inglês e chinês, selecionados por `?lang=pt`, `?lang=en` e `?lang=zh`. O idioma padrão é português.
- Conteúdo institucional e catálogo mantidos diretamente em arquivos TypeScript.

## Mapa do código

| Arquivo ou diretório | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Composição da página inicial |
| `app/layout.tsx` | Layout raiz, metadados, domínio, ícones e analytics |
| `app/catalogo/page.tsx` | Catálogo com quatro categorias de produtos de referência |
| `app/news/page.tsx` | Notícias por tema, carregadas no servidor |
| `app/portfolio/page.tsx` | Apresentação institucional de oito páginas e textos próprios |
| `app/show/page.tsx` | Tela para monitores, com indexação desativada |
| `components/` | Seções visuais, navegação e interações |
| `components/ui/` | Componentes locais do shadcn/ui |
| `components/brand-logo.tsx` | Aplicação compartilhada do logo ACS em PNG, nas versões preta e branca |
| `lib/brand.ts` | Caminhos e dimensões dos logos, ícones e imagem de compartilhamento |
| `components/showcase-screen.tsx` | Alternância entre apresentação, mapa financeiro e mercado |
| `components/market-board.tsx` | Painel de cotações e paginação automática |
| `components/portfolio-download-button.tsx` | PDF gerado no navegador com `html-to-image` e `pdf-lib`, carregados sob demanda |
| `lib/i18n.ts` | Textos principais, idiomas e helpers de URLs localizadas |
| `lib/product-catalog.ts` | Categorias e produtos nos três idiomas |
| `lib/contact.ts` | Construção dos links de WhatsApp |
| `lib/infomoney-news.ts` | Consulta e interpretação dos feeds RSS |
| `lib/market.ts` | Tipos compartilhados dos dados de mercado |
| `app/globals.css` | Estilos globais ativos, tokens, animações e impressão do portfólio |
| `public/` | Logos, imagens e vídeos, organizados por seção |

Na adaptação de marca, revise também textos locais nos componentes, metadados das páginas, portfólio, rodapé, nomes dos PDFs e imagens. Nem todo o conteúdo está centralizado em `lib/i18n.ts`. Mantenha os três idiomas coerentes quando uma mudança afetar conteúdo compartilhado, salvo orientação diferente do usuário.

Os logos principais são `public/global/acs-logo-black.png` e `public/global/acs-logo-white.png`, com 4800 × 1500 px e transparência real. O arquivo `public/global/acs-logo.svg` preserva os traçados editáveis usados nos exports; a interface utiliza os PNGs. Consulte `docs/branding/README.md` para os derivados e a origem da arte. Os arquivos ATC antigos permanecem como referência, sem uso nos componentes atuais desta branch.

Use `app/globals.css` como referência de estilos; há outro arquivo em `styles/globals.css`, mas ele não é importado pelo layout atual.

## Integrações

- `/api/commodities`: Yahoo Finance via `yahoo-finance2`, usado nas faixas de cotações. A interface consulta a cada 60 segundos; a resposta atual usa `no-store`.
- `/api/market-overview`: ações, índices, moedas e commodities para o painel de mercado. Mantém referências históricas em memória por 30 minutos e declara cache HTTP compartilhado de 60 segundos.
- `/api/news`: feeds do InfoMoney para últimas notícias, importações, exportações e commodities. O carregamento de notícias usa revalidação de 15 minutos; `/news` chama a função de consulta diretamente.
- A tela `/show` incorpora um iframe do Finance World Monitor.
- Vercel Analytics é incluído pelo layout quando `NODE_ENV` é `production`.
- As integrações externas dependem de acesso de saída à internet. Os caches em memória não são persistentes nem compartilhados entre containers.

## Deploy e isolamento dos sites

- O destino é Dokploy com serviço do tipo Docker Compose e o Traefik já existente no servidor.
- `Dockerfile`: Node.js 24, pnpm 11.23.0, build em etapas, usuário `node` sem root e healthcheck HTTP da página inicial. O runtime executa `node server.js` a partir do standalone.
- `docker-compose.yml`: serviço `web` conectado à rede externa `dokploy-network`; Traefik usa os entrypoints `web`/`websecure` e o certificate resolver `letsencrypt`.
- Por preferência explícita do usuário, não adicione `ports` ou `expose` ao Compose de produção nem `EXPOSE` ao Dockerfile. A porta 3000 deve permanecer interna, acessada pelo Traefik pela rede Docker e pela label `loadbalancer.server.port`.
- O roteamento é definido nas labels. O procedimento atual mantém a aba Domains do serviço vazia e Isolated Deployments desativado. Veja `DEPLOY.md`.
- **A configuração de deploy herdada na `acs-group` ainda aponta para `atcchinabrasil.com` e usa identificadores Traefik `atcchinabrasil-*`. Não a publique como um segundo site com esses mesmos valores.**
- Ao preparar o deploy da joint venture, use um serviço Dokploy separado, vinculado à branch `acs-group`, e configure seu domínio e identificadores próprios para routers, middlewares e serviço Traefik. Atualize também os metadados e `DEPLOY.md`. Preserve o domínio e o serviço da ATC vinculados à `main`.
- `.dockerignore` exclui dependências locais, caches, arquivos de ambiente e outras entradas desnecessárias do contexto de build. Não inclua segredos na imagem ou no Git.

## Dependências e validação

Use pnpm e `pnpm-lock.yaml`, como no Dockerfile. Existe também `package-lock.json`, herdado e divergente; ele não é usado no deploy. Evite alternar gerenciadores durante uma alteração.

Comandos úteis, conforme o escopo da tarefa:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit --incremental false
pnpm build
docker compose config --quiet
git diff --check
```

- `next.config.mjs` atualmente contém `typescript.ignoreBuildErrors: true`. Um build bem-sucedido não substitui a checagem independente do TypeScript.
- O script `pnpm lint` existe, mas o projeto ainda não instala nem configura o ESLint. Não reporte esse check como aprovado enquanto isso não for resolvido.
- Não há suíte de testes automatizados ou CI configurada na base atual. Faça verificações proporcionais à mudança; alterações apenas documentais não exigem build.
- Para alterações de deploy, valide o Compose e, quando houver daemon Docker disponível, a imagem e seu funcionamento. Informe quando só o build local/standalone tiver sido testado.
- O build pode alterar automaticamente `next-env.d.ts`. Confira o diff e não inclua mudanças incidentais geradas por uma validação.
- Ao concluir, informe o que mudou, as verificações realizadas e qualquer limitação relevante. Mantenha este arquivo atualizado quando decisões de marca, domínio, arquitetura ou deploy forem efetivamente definidas.

## Pendências conhecidas da base

- A busca do cabeçalho envia o parâmetro `q`, mas o catálogo ainda não filtra por ele.
- O HTML raiz mantém `lang="pt-BR"` nas três versões; o seletor de idioma do cabeçalho retorna à página inicial.
- Textos institucionais, WhatsApp, e-mail e URLs de produção ainda pertencem à ATC; a primeira etapa da adaptação alterou os logos e suas descrições acessíveis.

Essas pendências são contexto para o trabalho futuro; não ampliam automaticamente o escopo de cada solicitação.
