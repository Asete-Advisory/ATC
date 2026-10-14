# Proposta de ajustes do `/show`

Status: proposta aprovada e implementada no `/show`. O HTML permanece como referência visual.
Data: 14/10/2026. Branch: `main`, site ATC (`atcchinabrasil.com`).

## Avaliar a proposta

Abra [index.html](./index.html) diretamente no navegador. O HTML
usa imagens locais do repositório e não exige instalação, servidor ou APIs.
Mantenha esta pasta em `docs/mocks/show-adjustments` para os caminhos das imagens funcionarem.

Experimente:

1. Alternar **PT / EN**, inclusive depois de entrar nas outras telas.
2. Navegar entre **Início / Mapa / Mercado**.
3. No mapa, observar as linhas, barcos e passagens; usar **Pausar animação**.
4. No mercado, alternar **Tabela / Setores** e navegar pelas páginas.
   Os cartões mostram até três ativos por vez; suas setas menores revelam
   os demais ativos do grupo sem esconder a segunda linha de cartões.

As cotações são fictícias e identificadas como dados ilustrativos. O mockup
não consulta as APIs, não representa tráfego marítimo real e não executa o
carrossel automático de produção. A tabela reproduz a densidade e as colunas
existentes para comparação; o componente atual será preservado na implementação.

## 1. Escopo e direção visual

Base: referência visual “ASETE | SHOWCASE” enviada pelo usuário. A identidade
continua sendo ATC. O pedido escrito orienta o comportamento; a imagem orienta
cores, composição e hierarquia.

| Área | Proposta |
| --- | --- |
| Idiomas | Seletor PT/EN sempre acessível; traduzir também controles, mapa e mercado. |
| Início | Tipografia grande, estatísticas à direita e fundo portuário com mais cor. |
| Mapa | Continentes coloridos, mais conexões ilustrativas, canais e estreitos destacados. |
| Mercado | Abrir por setores e manter a tabela atual como opção de visualização. |

O cabeçalho com navegação visível é uma sugestão do mockup, inspirada na
referência. A posição final dos controles pode ser ajustada na avaliação.
Não incluir busca ou menu sem função apenas porque aparecem na referência.

A fotografia do mockup é `public/global/porto.webp`, já disponível no projeto.
Ela demonstra o tratamento de cor; não é a fotografia de navio da referência.
A escolha de uma nova foto/vídeo de abertura fica para a implementação após
validar a direção visual e a disponibilidade do arquivo/licença.

## 2. Situação atual verificada

- `app/show/page.tsx` lê `?lang=`; sem parâmetro, o idioma atual é português.
- `components/showcase-screen.tsx` controla as telas e o modo automático:
  início por 30 segundos, mapa por 5 minutos e mercado por 5 minutos.
- O mapa é SVG local, sem serviço externo, com seis pontos e nove conexões.
  A fonte, projeção e regras atuais estão em [show-map.md](../../show-map.md).
- `components/market-board.tsx` usa `/api/market-overview`, atualiza os dados
  a cada 60 segundos e alterna páginas da tabela a cada 30 segundos.
- Há 40 ativos: 29 ações, três índices, duas moedas e seis commodities.
  `MarketCategory` distingue tipos de ativo, mas ainda não define setores.

## 3. Idiomas e página inicial

- Exibir PT e EN no mesmo estilo de seleção usado no site, com estado ativo,
  rótulos acessíveis, foco visível e operação pelo teclado.
- **Padrão adotado: português**, preservando o comportamento atual e o
  padrão utilizado na proposta aprovada.
- A escolha deve atualizar `?lang=pt` / `?lang=en` e sobreviver ao F5.
  Preservar outros parâmetros e o histórico de navegação do navegador.
- Trocar o idioma sem voltar à primeira tela, perder Tabela/Setores,
  reiniciar indevidamente o temporizador ou esconder elementos animados.
- Traduzir título, descrição, estatísticas, navegação, Auto, status, nomes
  de passagens, setores e cabeçalhos; formatar números conforme o idioma.
- Manter a compatibilidade existente com `?lang=zh` e suas traduções.
  O novo seletor terá apenas PT/EN; não remover mandarim nem mudar o padrão
  global do site como efeito colateral deste trabalho.
- Manter título e estatísticas atuais. Usar contraste localizado atrás dos
  textos, permitindo que a cor da foto/vídeo apareça no restante da tela.

## 4. Mapa: cor, passagens e rotas

### Composição

- Preservar a base Natural Earth local e a projeção existente. Aplicar cores
  por continente, com fronteiras discretas e oceano azul-escuro.
- Paleta inicial: América do Norte verde, América do Sul turquesa, Europa
  azul, África ocre, Ásia coral e Oceania lilás. Cor não será a única
  identificação: manter nomes e marcadores legíveis.
- Seguir a nova referência com textos de **continentes e passagens**;
  retirar os rótulos de países e oceanos nessa nova versão, após aprovação.
  Isso substitui a escolha visual anterior documentada em `show-map.md`.
- Preservar os seis pontos atuais: oeste dos EUA, América Central, sul do
  Brasil, norte da Europa, China e Japão. Passagens terão marcação própria,
  sem serem apresentadas como novos polos ou bases da ATC.
- O mapa continua ocupando o espaço disponível, sem título ou logo próprios.
  Preservar as faixas de cotação e a área de commodities em telas grandes.

### Passagens e corredores propostos

| Passagem | Papel na proposta |
| --- | --- |
| Canal do Panamá | Travessia ilustrativa entre Pacífico e Atlântico. |
| Estreito de Gibraltar | Entrada do corredor pelo Mediterrâneo. |
| Canal de Suez | Continuidade do corredor pelo Mar Vermelho. |
| Bab el-Mandeb | Continuidade entre Mar Vermelho e oceano Índico. |
| Estreito de Ormuz | Ramal próprio em direção ao Golfo; não forçar sua inclusão no corredor Europa–China. |
| Estreito de Malaca | Passagem do corredor do Índico em direção ao leste asiático. |
| Cabo da Boa Esperança | Manter como alternativa pelo sul da África; identificar como cabo, não como estreito/canal. |

- Manter Brasil–China como conexão principal, com espessura e luminosidade
  maiores. Preservar os pares de conexão já existentes e acrescentar os
  corredores pelas passagens, sem transformar o mapa em uma rede ilegível.
- Modelar passagens com coordenadas reutilizáveis; as linhas devem passar
  pelos mesmos pontos exibidos pelos marcadores. Revisar a geometria para
  evitar trajetos por terra, exceto as travessias dos canais representados.
- Animar barcos discretos e o fluxo das linhas. São rotas esquemáticas,
  sem posição real, ETA, atividade comercial confirmada ou monitoramento.
- Para Suez/Bab el-Mandeb/Ormuz, usar rótulos deslocados com linhas-guia.
  Um detalhe ampliado, como na referência, é opcional se necessário para
  legibilidade; não é obrigatório para a primeira implementação.
- Pausar animações quando o mapa ou a aba estiverem ocultos e respeitar
  `prefers-reduced-motion`. Preservar tipografia e cores essenciais no SVG,
  inclusive sem as regras de CSS recém-publicadas.

O mockup mostra corredores e posicionamentos aproximados para avaliação
visual. Não é a geometria marítima final. A base colorida em
`docs/mocks/show-adjustments/assets/show-map-preview.svg` é uma derivação de demonstração; não
substitui `public/maps/world-countries.svg`.

## 5. Mercado: tabela e setores

- Adicionar um seletor **Tabela / Setores** dentro da tela Mercado.
  Setores é a opção inicial, conforme ajuste solicitado durante a implementação;
  não criar uma quarta tela no carrossel.
- Preservar o componente atual, suas 13 colunas, paginação, estados de
  carregamento/erro e formatação. Os dois formatos compartilham os mesmos
  dados e atualização; alternar o formato não faz uma segunda consulta.
- Manter a escolha ao sair e voltar à tela Mercado durante a sessão,
  inclusive no modo automático e ao trocar idioma.
- Cartões com cabeçalho colorido, nome e ícone do grupo; linhas com ativo,
  preço, moeda e variação diária. Manter sinais +/− além de verde/vermelho.
- Mostrar até seis grupos por página em telas amplas. Grupos maiores
  também precisam de paginação de linhas se a altura não comportar todos
  os ativos. Nenhum ativo será descartado para caber em um cartão.
- Índices e moedas ficam em uma faixa própria; não são setores de empresas.
- Não adicionar milho/café apenas porque aparecem na referência: esses
  ativos não estão no endpoint atual da tabela.

Agrupamento inicial para avaliação (editorial, não classificação oficial da B3):

| Grupo | Ativos atuais |
| --- | --- |
| Energia e petróleo | PETR3, PETR4, PRIO3 |
| Mineração e siderurgia | VALE3, GGBR4, CSNA3, GOAU4, USIM5, BRAP4 |
| Bancos e serviços financeiros | ITUB4, BBDC4, BBAS3, BPAC11, B3SA3, ITSA4 |
| Consumo e varejo | ABEV3, LREN3, MGLU3 |
| Infraestrutura e serviços | CMIG4, EQTL3, ECOR3, RENT3, WEGE3 |
| Commodities | Ouro, prata, cobre, WTI, Brent e soja |
| Construção e imóveis | CYRE3, GFSA3, MRVE3 |
| Saúde | RADL3, RDOR3 |
| Papel e celulose | SUZB3 |
| Faixa de índices e moedas | IBOV, S&P 500, NASDAQ, USD/BRL e RMB/BRL |

Os seis grupos da referência ocupam a primeira página. Os três grupos
adicionais ocupam a segunda. A implementação terá um grupo de fallback
para novos ativos ainda não classificados, com cobertura verificada.
Dados ausentes usam “—”; falhas preservam a distinção entre última cotação
disponível, dados desatualizados e indisponibilidade. Não fabricar valores.

## 6. Sequência de implementação após avaliação

1. Validar idioma inicial, paleta/densidade do mapa, agrupamento e direção
   da foto/vídeo. Registrar ajustes neste plano.
2. Idiomas e cabeçalho: `app/show/page.tsx`, `components/showcase-screen.tsx`,
   `lib/i18n.ts` e `app/globals.css`. Tratar estado de tela e temporizadores
   antes de ligar a troca de idioma à URL.
3. Mapa: `lib/trade-map.ts`, `components/trade-routes-map.tsx`, estilos e
   geração da base SVG local. Acrescentar metadados de cor por continente
   de forma reproduzível em `scripts/generate-trade-map.py`.
4. Mercado: manter `components/market-board.tsx` e extrair/aproveitar sua
   fonte de dados compartilhada; criar a visualização de cartões e um
   mapeamento de setores separado de `MarketCategory`, em `lib`.
5. Validar os cenários abaixo; atualizar `docs/show-map.md` e as orientações
   do projeto quando o comportamento novo estiver implementado.

## 7. Critérios de aceite para a implementação

- PT/EN funciona nas três telas sem recarregar, esconder cartões, trocar a
  tela selecionada ou perder Tabela/Setores; URL/F5/voltar são coerentes.
- Mandarim existente permanece funcional por URL, inclusive no mapa.
- Os seis polos e Brasil–China permanecem visíveis. Passagens, cores e
  trajetos podem ser reconhecidos sem sobreposição de textos nos idiomas.
- Testar mapa com CSS antigo/sem estilos de rótulos, sem rede, em aba oculta
  e com movimento reduzido. Cotações continuam dependentes das APIs atuais.
- Conferir tabela e setores com a mesma resposta: todos os 40 ativos,
  moeda correta, valores ausentes, zero, alta/baixa, erro e atualização.
- Paginação continua legível, sem linhas cortadas. Nenhuma consulta duplicada
  ao alternar formato; escolha de formato preservada ao voltar à tela.
- Modo manual e automático mantêm a sequência e os tempos 30s/5min/5min.
- Revisar em 1920×1080, 1366×768 e largura móvel; testar teclado, foco,
  contraste e controles acessíveis. Em telas pequenas, permitir rolagem
  localizada na tabela/mapa quando necessária para preservar legibilidade.
- Executar `pnpm exec tsc --noEmit` e `pnpm build` separadamente. Não usar
  sucesso do build como prova de tipos; ESLint ainda não está configurado.

O mockup nesta pasta é documental. A implementação foi feita nos componentes
do `/show` na `main`, mantendo Docker, APIs e a branch `acs-group`.

## 8. Conferência do mockup

Validado no Chrome em 1440×900, 1366×768 e largura móvel de 390 px:
troca PT/EN, navegação pelas três telas, manutenção do formato escolhido,
paginação dos 40 ativos, seis cartões simultâneos em 1366×768 e navegação
interna dos grupos. Também conferidos pausa do mapa oculto, movimento
reduzido e ausência de erros de JavaScript. SVG e sintaxe do script validados.
Esta conferência se refere ao HTML de referência; a implementação tem validação separada abaixo.


## 9. Registro da implementação

- Cabeçalho com Auto/Início/Mapa/Mercado e PT/EN; estado preservado durante
  a troca de idioma. Mandarim permanece acessível por URL.
- Abertura usa a fotografia local `porto.webp`, com o tratamento de cor da proposta.
- Mapa com seis polos, sete passagens, 12 conexões e barcos animados. Fonte
  e geração documentadas em [show-map.md](../../show-map.md).
- Setores é o formato padrão ao abrir Mercado. A tabela original foi
  preservada, com controles de página adicionais. Os dois formatos
  compartilham a consulta de `/api/market-overview`, sem novo endpoint.
- Grade com seis/quatro/dois grupos por página conforme a largura (uma linha
  de cartões em telas com pouca altura); quantidade
  de linhas calculada pela altura. Ativos dos cartões alternam a cada 8 s;
  páginas de grupos alternam após pelo menos 30 s, com tempo suficiente para
  exibir todas as linhas. A tabela mantém seus 30 s por página.
- Paginações pausam quando sua visualização ou aba está oculta. Novos ativos
  sem classificação têm o grupo “Outros setores”; índices/moedas ficam na faixa.
- Unidades nas linhas: BRL para ativos brasileiros/câmbio, USD para os metais
  e petróleo atuais, pontos para índices. Soja mantém US¢/bu, sem converter
  seu preço bruto: [convenção do contrato na CME](https://www.cmegroup.com/markets/agriculture/oilseeds/soybean).
- Respostas sem dados não geram preços fictícios; erro após uma consulta bem
  sucedida mantém os últimos valores e apresenta aviso de atualização.
- `pnpm test:show` cobre agrupamento/fallback, unidades, passagens nas rotas
  e tempos do carrossel. TypeScript é validado separadamente do build.
- Conferência no Chrome: PT/EN/ZH, histórico e F5, ciclo automático, mapa
  oculto/pausado/movimento reduzido, tabela/setores, acesso aos 40 ativos,
  falha/recuperação de atualização e larguras 1920, 1366 e 390 px. Cenários
  de falha e cobertura completa usam respostas controladas das APIs.
