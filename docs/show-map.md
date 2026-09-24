# Mapa de conexões do `/show`

Na branch `main`, o mapa é renderizado pelo próprio site. Não usa iframe,
World Monitor, chave de API, tiles remotos ou biblioteca cartográfica no runtime.
As cotações permanecem independentes, alimentadas por `/api/commodities`.

## Arquivos

- `components/trade-routes-map.tsx`: mapa SVG e marcadores, com título e descrição acessíveis.
- `lib/trade-map.ts`: polos, conexões, projeção e rótulos em português, inglês e mandarim.
- `public/maps/world-countries.svg`: base geográfica local com Brasil e China destacados.
- `app/globals.css`: estilos e animações com prefixo `trade-map`.
- `components/showcase-screen.tsx`: alternância dos modos e painel de cotações.

O modo Mapa mantém as faixas de cotações. A partir de 1280 px, mostra também
o painel lateral de commodities, sem sobrepor a geografia. Os modos Original,
Mapa e Mercado conservam seus tempos de alternância: 30 s, 5 min e 5 min.

A área do mapa não exibe cabeçalho, subtítulo ou logo próprios. O SVG ocupa
todo o espaço disponível, com margens menores e enquadramento aproximado
nos seis polos (`viewBox="160 20 1200 560"`), mantendo os marcadores e as
conexões dentro da tela. Esse enquadramento não altera a projeção geográfica.

## Significado das linhas

As conexões são **ilustrativas**. Não representam rastreamento de navios,
embarques em andamento, itinerários de navegação ou instalações da ATC nos
polos indicados. O eixo Brasil–China continua destacado.

Os seis marcadores e os corredores seguem aproximadamente a fotografia do
mapa físico fornecida pelo usuário: costa oeste dos EUA, América Central,
sul do Brasil, norte da Europa, China e Japão. A perspectiva e os objetos
sobre a foto impedem identificar cidades e trajetos exatos. As linhas passam
pelo Caribe, pelo Atlântico e pelo sul da África,
seguindo pelo Índico até a Ásia. São uma adaptação visual da referência,
não uma reconstrução de rotas marítimas verificadas. Não adicione marcadores
nos pontos intermediários dos trajetos sem solicitação.

Edite `tradeHubs` e `connections` em `lib/trade-map.ts` para alterar os polos e
os pontos de passagem. As curvas são calculadas uma vez; CSS movimenta os
traços, sem polling ou JavaScript a cada quadro. As animações pausam quando
outro modo está ativo e são desativadas com `prefers-reduced-motion: reduce`.

## Rótulos geográficos

Os textos visíveis seguem a segunda referência do usuário, um mapa azul:
América do Norte, América Central, América do Sul, Europa, África, China,
Japão, Sudeste Asiático, Austrália, oceanos Pacífico, Atlântico e Índico,
Canal de Suez, Estreito de Ormuz, Bab el-Mandeb e Cabo da Boa Esperança.
Os rótulos antigos dos polos e o nome Brasil foram substituídos.

`tradeMapLabels` mantém os textos e suas posições separados de `tradeHubs`
e `connections`. Os nomes de passagens são apenas anotações geográficas:
não adicionam marcadores nem indicam que as linhas passam nesses locais.
Em áreas de até 560 px de largura, essas quatro anotações menores são
ocultadas para preservar a leitura das regiões e oceanos.

## Origem da base geográfica

- Natural Earth, países em escala 1:110m, versão **5.1.2**.
- [GeoJSON de origem](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson).
- [Termos de uso: domínio público](https://www.naturalearthdata.com/about/terms-of-use/).
- Projeção equirretangular: `x = (longitude + 180) × 4`, `y = (85 − latitude) × 4`.
- SVG com `viewBox="0 0 1440 600"`, precisão de 0,1 px e sem a Antártida.

Para regenerar o arquivo, baixe o GeoJSON acima e execute:

```sh
python3 scripts/generate-trade-map.py /caminho/ne_110m_admin_0_countries.geojson
```

O arquivo gerado é versionado; build e deploy não precisam baixar os dados.
Mantenha a projeção do script e a função `projectTradeCoordinates` coerentes.

## Validação

Confira `/show?lang=pt`, `/show?lang=en` e `/show?lang=zh`, selecionando Mapa
no controle inferior esquerdo. Verifique desktop, notebook e celular, troca
manual e automática de modos, ausência de sobreposição do painel e preferência
por movimento reduzido. O mapa deve continuar renderizando quando serviços
externos estão indisponíveis.
