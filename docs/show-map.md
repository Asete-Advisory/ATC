# Mapa de conexões do `/show`

Na branch `main`, o mapa é renderizado pelo próprio site. Não usa iframe,
World Monitor, chave de API, tiles remotos ou biblioteca cartográfica no runtime.
As cotações permanecem independentes, alimentadas por `/api/commodities`.

A versão colorida segue a proposta aprovada em
[docs/mocks/show-adjustments](./mocks/show-adjustments/README.md). Ela substitui
os rótulos de países e oceanos da referência azul anterior por continentes e
passagens. A implementação permanece exclusiva da `main`.

## Arquivos

- `components/trade-routes-map.tsx`: SVG, marcadores, faixas e barcos.
- `components/showcase-header.tsx`: logo central, menu oculto, idiomas e pausa.
- `lib/trade-map.ts`: polos, passagens, conexões, projeção e textos PT/EN/ZH.
- `public/maps/world-countries.svg`: base geográfica local colorida por continente.
- `scripts/generate-trade-map.py`: geração reproduzível da base e paleta.
- `app/globals.css`: estilos e animações `trade-map` e apresentação `showcase`.
- `hooks/use-page-visible.ts`: pausa quando a aba do navegador está oculta.
- `hooks/use-reduced-motion.ts`: preferência de movimento reduzido compartilhada.
- `components/showcase-screen.tsx` e `lib/showcase.ts`: modos, idiomas e tempos.
- `components/hero-video-background.tsx`: sequência contínua dos vídeos locais,
  retomada na Home e pausa quando oculta.

## Apresentação e idiomas

O logo ATC fica centralizado no cabeçalho, com status à esquerda e relógio
à direita. Auto, Início, Mapa, Mercado e PT/EN ficam em uma faixa oculta,
revelada ao passar o mouse no topo e escondida ao sair da região. A faixa é
sobreposta; abrir o menu não desloca o logo, o mapa nem as cotações.

No celular, tocar no logo abre/fecha os controles; tocar fora fecha. Pelo
teclado, focar o logo revela o menu e Escape o fecha. Os controles ocultos
usam `inert` para não receber foco ou cliques. O modo escolhido conserva o
fundo verde-claro e o texto “Auto ativo” durante o ciclo automático.
Português é o padrão; `?lang=zh` continua disponível. Alterar o idioma atualiza
somente o parâmetro `lang`, preservando outros parâmetros, fragmento, tela,
formato do mercado e temporizador. F5 e voltar/avançar respeitam o idioma da URL.
A integração usa o [histórico nativo do Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api).

O modo automático mantém Início por 30 segundos, Mapa por 5 minutos e Mercado
por 5 minutos. Escolher uma tela interrompe esse ciclo; selecionar Auto inicia
novamente na apresentação. Mercado abre em Tabela; a escolha posterior entre
Tabela/Setores permanece selecionada ao mudar de tela ou idioma.

A Home reproduz os quatro MP4 de `public/hero-section/videos` em sequência
contínua, sem áudio. Ao sair da Home ou ocultar a aba, a reprodução pausa;
ao retornar, retoma automaticamente, inclusive no ciclo Auto. `porto.webp`
é apenas o poster de carregamento. As tentativas de reprodução seguem os
[eventos e a promessa de `play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play),
com cancelamento ao trocar de tela e nova tentativa após interação quando
o navegador bloquear autoplay.

O mapa conserva as faixas de cotações e, a partir de 1280 px, o painel lateral
de commodities. Não tem título ou logo próprios. O SVG mantém
`viewBox="160 20 1200 560"`. Em telas pequenas, sua área permite rolagem
horizontal para preservar a leitura das passagens, sem esconder os rótulos.
Não há controle visível dentro do mapa. Pausar/retomar fica junto de idiomas
e navegação no menu oculto, disponível quando a tela Mapa está ativa.
A legenda Brasil–China / Rotas ilustrativas foi removida da interface; a descrição
acessível do SVG e esta documentação mantêm a natureza ilustrativa das linhas.

## Polos, passagens e linhas

As conexões são **ilustrativas**. Não representam rastreamento de navios,
embarques em andamento, itinerários de navegação ou instalações da ATC.
Brasil–China continua sendo o eixo visual principal.

Os seis polos originais permanecem: costa oeste dos EUA, América Central,
sul do Brasil, norte da Europa, China e Japão. As posições são regionais,
baseadas na fotografia original; não identificam cidades ou portos exatos.

Sete passagens recebem círculos dourados e rótulos com linhas-guia:
Panamá, Gibraltar, Suez, Bab el-Mandeb, Ormuz, Malaca e Cabo da Boa Esperança.
O cabo é uma referência ao corredor pelo sul da África, não um canal/estreito.
Seu ponto fica ao largo da costa. Há 12 conexões: os nove pares originais,
duas alternativas por Suez e um ramal China–Ormuz separado.

O fluxo ampliado mantém os traçados originais e acrescenta oito faixas de
retorno próximas: 20 faixas com 43 navios simultâneos. Brasil–China recebe mais
navios; as demais faixas têm dois. Cada navio usa duração, posição inicial e
escala determinísticas, evitando partidas sincronizadas ou saltos ao traduzir.
Os navios de retorno seguem a curva invertida, incluindo sua orientação.

`parallelOffsets` seleciona os corredores duplicados. O deslocamento máximo
é de quatro unidades SVG, reduzido perto dos extremos e das passagens.
As faixas convergem nos mesmos pontos dos canais/estreitos; nenhum novo polo
é criado. Linhas de retorno mais finas preservam a legibilidade dos rótulos.

`tradeHubs` contém somente os seis polos; `tradePassages` contém passagens e
suas posições de rótulo. `passageCoordinates` é compartilhado com os pontos
intermediários das conexões, garantindo que as linhas atravessem os círculos.
Os trechos estreitos usam mais pontos intermediários para acompanhar a costa;
a escala continua esquemática, sem precisão náutica.

As curvas são calculadas uma vez, sem polling ou JavaScript a cada quadro.
CSS anima o fluxo e os pulsos; SVG `animateMotion` move os barcos. Ambos
pausam quando outra tela está ativa, a aba fica oculta, o usuário pausa ou
`prefers-reduced-motion` está habilitado. A troca de idioma mantém essa escolha.

## Rótulos e cores

`tradeMapLabels` contém os seis continentes visíveis, com textos PT/EN/ZH.
`tradePassages` mantém os nomes das passagens e os rótulos deslocados, evitando
sobreposição perto do Mar Vermelho e do Golfo.

Fonte, tamanho e cor dos textos estão diretamente no SVG. Círculos, linhas-guia
e fundos dos rótulos também usam atributos SVG. Uma folha de estilos antiga
não deve deixar os textos pretos ou com a tipografia padrão do navegador.

A paleta usa verde na América do Norte, turquesa na América do Sul, azul na
Europa, ocre na África, coral na Ásia e lilás na Oceania. A Rússia usa coral
como na proposta visual. As cores são editoriais, sem pretensão de representar
classificações territoriais oficiais. Brasil–China é destacado pelas linhas e
pelos marcadores, não por uma cor de país diferente.

## Origem e regeneração da base

- Natural Earth, países em escala 1:110m, versão **5.1.2**.
- [GeoJSON de origem](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson).
- [Termos de uso: domínio público](https://www.naturalearthdata.com/about/terms-of-use/).
- Projeção equirretangular: `x = (longitude + 180) × 4`, `y = (85 − latitude) × 4`.
- SVG com `viewBox="0 0 1440 600"`, precisão de 0,1 px, 176 países e sem Antártida.
- Cores derivadas de `CONTINENT`, com ajuste editorial da Rússia no gerador.

```sh
python3 scripts/generate-trade-map.py /caminho/ne_110m_admin_0_countries.geojson
```

O arquivo gerado é versionado; build e deploy não precisam baixar os dados.
Mantenha a projeção do script e `projectTradeCoordinates` coerentes.

## Validação

Execute `pnpm test:show` (Node 22.6+ com suporte à remoção de tipos),
`pnpm exec tsc --noEmit` e `pnpm build`, separadamente.

Confira `/show?lang=pt`, `/show?lang=en` e `/show?lang=zh`. Teste:

- Troca de idioma nas três telas, F5, voltar/avançar e parâmetros extras.
- Vídeo avançando sem interação, fim dos quatro clipes, retorno manual/Auto
  à Home e retorno à aba. Conferir também a Home `/`, que compartilha o player.
- Manual/Auto, pausa do mapa, aba oculta e movimento reduzido.
- Menu oculto ao carregar, hover e saída, toque no logo/fora, Tab e Escape;
  logo central e posição das cotações invariáveis com o menu aberto.
- Movimento simultâneo em sentidos/velocidades diferentes, pausa de todos
  os navios e continuidade ao mudar o idioma ou fechar os controles.
- Tabela como formato inicial, Setores como alternativa e fundo azul contínuo
  durante carregamento, exibição de dados e erro.
- Seis polos, sete passagens, Brasil–China e ausência de sobreposição.
- SVG sem regras de rótulo do CSS e com serviços externos indisponíveis.
- Desktop, notebook e celular; rolagem localizada e navegação pelo teclado.
- Tabela e setores usando a mesma resposta, valores nulos/zero, paginação,
  erro de atualização com dados anteriores e indisponibilidade inicial.

O teste de geometria verifica passagens ancoradas, extremos das faixas de
retorno, limites de deslocamento e distribuição de velocidades/posições.
A renderização do mapa é local; as cotações continuam dependentes das APIs.
