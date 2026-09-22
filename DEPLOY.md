# Deploy no Dokploy

O serviço `web` publica o site em **https://atcchinabrasil.com**. A imagem usa Node.js 24, pnpm 11.23.0 e o build `standalone` do Next.js, executado com usuário sem privilégios de root. O Dockerfile inclui uma verificação de saúde HTTP.

## Configuração

1. No DNS, crie um registro **A** para `@` apontando para o IPv4 público do servidor Dokploy. As portas **80 e 443** devem estar acessíveis para o Traefik e a emissão do certificado.
2. Envie estes arquivos para o repositório usado no deploy.
3. No projeto do Dokploy, crie um serviço **Compose** e selecione o tipo **Docker Compose**.
4. Conecte o repositório e selecione a branch de produção.
5. Defina **Compose Path** como `./docker-compose.yml` e mantenha **Isolated Deployments** desativado para usar a rede compartilhada configurada neste arquivo.
6. Salve e clique em **Deploy**.

O Compose configura o domínio pelas labels do Traefik. Deixe a aba **Domains** desse serviço vazia para manter uma única configuração de roteamento.

A configuração pressupõe os nomes padrão do Dokploy: rede externa `dokploy-network`, entrypoints `web` e `websecure` e certificate resolver `letsencrypt`. Se sua instalação usa nomes personalizados, ajuste-os no Compose.

O Traefik existente recebe as conexões nas portas 80/443, redireciona HTTP para HTTPS e encaminha o tráfego pela rede Docker para a porta interna 3000, definida na label `traefik.http.services.atcchinabrasil.loadbalancer.server.port`. O Compose não usa `ports` ou `expose`, e o Dockerfile não declara `EXPOSE`; a porta 3000 não é publicada no host.

O build usa `pnpm-lock.yaml` com `--frozen-lockfile`. Não são necessárias variáveis de ambiente adicionais para a implementação atual. Notícias e cotações precisam de acesso de saída à internet. Os caches do Next.js ficam no container e são recriados em novos deploys.

## Instalação de dependências e cancelamentos

O Dockerfile limita o pnpm a 8 requisições simultâneas ao registry, com timeout de 120 segundos por requisição e até 3 novas tentativas. Essas opções se aplicam apenas à instalação no build Docker; a versão do pnpm, o lockfile e as políticas de instalação permanecem iguais.

O store `/pnpm/store` usa um cache do BuildKit identificado por `atcchinabrasil-main-pnpm-v11`, com acesso exclusivo durante a instalação. Os pacotes já baixados podem ser reaproveitados em novas tentativas no mesmo builder, inclusive quando a camada de instalação precisa ser refeita. O cache pode ser removido pela limpeza do Docker e não é compartilhado automaticamente com outro servidor. `node_modules` recebe cópias dos pacotes; a imagem final não depende desse cache.

Isso reduz downloads repetidos e a concorrência de rede, mas não corrige um processo encerrado ou um reinício do servidor. Um log interrompido em `pnpm install`, sem erro final, não demonstra falha no código do site. O Dokploy possui uma rotina de inicialização que marca deploys em andamento como `Cancelled` após um reinício; por isso, confira o histórico do serviço antes de atribuir o cancelamento aos avisos do pnpm.

No terminal do **servidor Dokploy**, estas consultas ajudam a identificar reinícios, pressão de memória e falta de espaço:

```sh
docker service ps dokploy --no-trunc
free -h
df -h /var/lib/docker /etc/dokploy
df -i /var/lib/docker
sudo journalctl -k --since "30 minutes ago" --no-pager | grep -Ei 'oom|out of memory|killed process'
```

Compare os horários com o deployment. Ajuste o nome `dokploy`, os caminhos e o intervalo se a instalação usar outros valores. Ausência de mensagens no journal não descarta uma interrupção; o histórico e os logs do serviço precisam ser conferidos.

Referências: [cache de build do Docker](https://docs.docker.com/build/cache/optimize/#use-cache-mounts), [opções de rede do pnpm](https://pnpm.io/settings/network) e [tratamento de deploys interrompidos no Dokploy](https://github.com/Dokploy/dokploy/pull/2705).

## Validação local

Com o Docker ativo, valide e construa a imagem:

```sh
docker compose config --quiet
docker build -t atcchinabrasil:local .
docker run --rm --init -p 127.0.0.1:3000:3000 atcchinabrasil:local
```

Acesse `http://localhost:3000`. Esse teste usa a imagem diretamente; a rede externa do Dokploy é necessária apenas para executar o Compose de produção.

Referências: [Docker Compose no Dokploy](https://docs.dokploy.com/docs/core/docker-compose/example), [domínios no Dokploy](https://docs.dokploy.com/docs/core/docker-compose/domains) e [build standalone do Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
