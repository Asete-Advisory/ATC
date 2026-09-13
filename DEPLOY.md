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

## Validação local

Com o Docker ativo, valide e construa a imagem:

```sh
docker compose config --quiet
docker build -t atcchinabrasil:local .
docker run --rm --init -p 127.0.0.1:3000:3000 atcchinabrasil:local
```

Acesse `http://localhost:3000`. Esse teste usa a imagem diretamente; a rede externa do Dokploy é necessária apenas para executar o Compose de produção.

Referências: [Docker Compose no Dokploy](https://docs.dokploy.com/docs/core/docker-compose/example), [domínios no Dokploy](https://docs.dokploy.com/docs/core/docker-compose/domains) e [build standalone do Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
