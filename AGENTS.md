# Orientações do projeto

- Confira `git status --short --branch` antes de editar e preserve alterações locais.
- `main` mantém o site ATC em `atcchinabrasil.com`.
- `acs-group` é a linha permanente da joint venture com a CS Group em
  `acs.atcchinabrasil.com`; não é uma feature para merge na `main`.
- Não faça merges, rebases ou cherry-picks entre essas branches por iniciativa própria.
- Use pnpm e mantenha `pnpm-lock.yaml` como lockfile do deploy.
- Valide TypeScript separadamente do build, pois `next.config.mjs` permite
  ignorar erros de tipos no build. O ESLint ainda não está configurado.
- Use `app/globals.css`, importado pelo layout, para estilos globais.

## Build Docker na `main`

- O pnpm usa cache BuildKit próprio da ATC, 8 requisições simultâneas, timeout
  de 120 segundos e até 3 retries. Preserve o lockfile congelado e as políticas
  de instalação; o ajuste está restrito ao Dockerfile.
- A imagem final não depende do cache de pacotes. Valide o build e o container
  quando alterar a instalação ou a cópia dos arquivos standalone.
- Consulte `DEPLOY.md` para investigar cancelamentos no Dokploy; um log cortado
  sem erro final não confirma falha de compilação nem falta de memória.
- Preserve a porta 3000 interna: sem `EXPOSE`, `ports` ou `expose` em produção.

## Mapa próprio do `/show` na `main`

- O mapa usa `components/trade-routes-map.tsx`, `lib/trade-map.ts` e a base
  local `public/maps/world-countries.svg`. O iframe World Monitor foi removido.
- Não reintroduza a dependência do serviço externo sem solicitação.
- Brasil–China é o eixo visual principal. As linhas são conexões ilustrativas,
  não rastreamento em tempo real nem confirmação de operações ou bases da ATC.
- Os seis marcadores seguem a foto de referência do usuário: costa oeste dos
  EUA, América Central, sul do Brasil, norte da Europa, China e Japão.
- Os rótulos visíveis são independentes dos marcadores e seguem a segunda
  referência (mapa azul): continentes, regiões, países, oceanos e quatro
  passagens geográficas. Edite `tradeMapLabels`; não crie novos pontos ou
  altere linhas ao mudar apenas esses textos.
- Mantenha os textos do mapa coerentes em português, inglês e mandarim.
- Preserve a tipografia e as cores dos rótulos diretamente no SVG. Valide
  também com CSS antigo/sem regras dos rótulos, para evitar textos pretos
  após deploys, e confira alinhamento e sobreposição nos três idiomas.
- A área do mapa ocupa o espaço disponível sem título, subtítulo ou logo
  próprios. Preserve os seis pontos e suas linhas no enquadramento ampliado.
- Preserve a pausa das animações quando o mapa estiver oculto e o suporte a
  `prefers-reduced-motion`. Verifique os modos manual e automático do `/show`.
- A base Natural Earth é de domínio público e está versionada no repositório;
  o runtime não precisa de APIs, chaves ou tiles para exibir o mapa.
- As cotações continuam usando suas APIs existentes. A mudança do mapa não
  transforma esses dados em conteúdo offline.
- Consulte `docs/show-map.md` para fonte, projeção e regeneração da base.
- Esta decisão foi implementada apenas na `main`; não a aplique à `acs-group`
  sem solicitação do usuário.
