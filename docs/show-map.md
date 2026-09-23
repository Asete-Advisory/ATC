# Mapa de conexões do `/show`

Na branch `main`, o mapa é renderizado pelo próprio site. Não usa iframe,
World Monitor, chave de API, tiles remotos ou biblioteca cartográfica no runtime.
As cotações permanecem independentes, alimentadas por `/api/commodities`.

## Arquivos

- `components/trade-routes-map.tsx`: mapa SVG, marcadores, título, subtítulo e logo.
- `lib/trade-map.ts`: polos, conexões, projeção e textos em português, inglês e mandarim.
- `public/maps/world-countries.svg`: base geográfica local com Brasil e China destacados.
- `app/globals.css`: estilos e animações com prefixo `trade-map`.
- `components/showcase-screen.tsx`: alternância dos modos e painel de cotações.

O modo Mapa mantém as faixas de cotações. A partir de 1280 px, mostra também
o painel lateral de commodities, sem sobrepor a geografia. Os modos Original,
Mapa e Mercado conservam seus tempos de alternância: 30 s, 5 min e 5 min.

## Significado das linhas

As conexões são **ilustrativas**. Não representam rastreamento de navios,
embarques em andamento, itinerários de navegação ou instalações da ATC nos
polos indicados. Santos–Xangai é destacado como eixo Brasil–China; os demais
polos contextualizam conexões internacionais. As coordenadas são aproximadas.

Edite `tradeHubs` e `connections` em `lib/trade-map.ts` para alterar os polos e
os pontos de passagem. As curvas são calculadas uma vez; CSS movimenta os
traços, sem polling ou JavaScript a cada quadro. As animações pausam quando
outro modo está ativo e são desativadas com `prefers-reduced-motion: reduce`.

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
