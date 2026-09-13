# Logo ACS

A marca ACS representa a união entre ATC e CS Group. Esta etapa substitui as aplicações gráficas do logo na branch `acs-group`; os textos comerciais e contatos herdados da ATC serão tratados em alterações posteriores. O domínio de publicação está documentado em `DEPLOY.md`, na raiz do projeto.

## Arquivos finais

| Arquivo em `public/global/` | Dimensões | Uso |
| --- | --- | --- |
| `acs-logo-black.png` | 4800 × 1500 px | Logo preto com transparência, para fundos claros |
| `acs-logo-white.png` | 4800 × 1500 px | Logo branco com transparência, para fundos escuros |
| `acs-logo.svg` | viewBox `-12 -12 1296 405` | Fonte vetorial editável dos exports |
| `acs-icon-black.png` | 512 × 512 px | Ícone transparente para tema claro |
| `acs-icon-white.png` | 512 × 512 px | Ícone transparente para tema escuro e marca do mapa |
| `acs-apple-icon.png` | 180 × 180 px | Ícone branco sobre fundo azul-marinho |
| `acs-social.png` | 1200 × 630 px | Compartilhamento, com logo branco sobre fundo azul-marinho |

Os dois PNGs principais compartilham a mesma geometria, margens e canal alfa. Foram renderizados a partir do vetor em alta resolução, com metadados de 300 dpi. As dimensões em pixels determinam a resolução efetiva.

A prévia `acs-logo-preview.png`, nesta pasta, mostra as duas versões sobre fundos de contraste. Ela é uma imagem de apresentação; os PNGs principais não contêm esses fundos.

## Construção e origem

- As referências visuais foram fornecidas pelo usuário e correspondem aos logos ATC já existentes no projeto.
- Foi criada uma prévia conceitual com a ferramenta nativa `image_gen`. Essa prévia trouxe um fundo quadriculado embutido e não foi usada como arquivo final.
- A finalização usa os três traçados originais do A e o traçado original do C de `public/global/atc-icon-black.svg`. O C foi reposicionado e o T removido. O S foi desenhado em curvas vetoriais com altura, peso e terminais compatíveis com o C.
- Os PNGs finais foram exportados do SVG usando Sharp, sem ampliar a prévia raster da geração. A versão branca deriva da mesma arte, alterando apenas o preenchimento.
- `lib/brand.ts` centraliza os caminhos e dimensões. `components/brand-logo.tsx` aplica o logo nos componentes com `next/image`.
- No portfólio, o logo carrega o PNG original em alta resolução para preservar nitidez na captura que gera o PDF; nas demais aplicações, o Next.js serve imagens dimensionadas para a interface.

## Prompt da prévia gerada

```text
Use case: logo-brand / precise-object-edit. Create the new ACS corporate wordmark by carefully editing the supplied ATC logo, for the merger of ATC with CS Group. Image 1 is the edit target and visual reference; image 2 is the higher-resolution original artwork on transparency. OUTPUT: one single horizontal logo reading exactly "ACS" (A, C, S), pure solid BLACK #000000 lettering, genuinely TRANSPARENT background with an alpha channel, high-resolution PNG ideally 3840 x 1280 pixels. No background rectangle or simulated transparency. PRESERVE the original highly distinctive stylized A: the long rising diagonal left stroke with its detached parallelogram foot, short flat cap, vertical right stroke, and oblique negative-space cut across BOTH legs; no ordinary crossbar. Keep that A shape and proportions as faithfully as possible. Preserve the original C's wide smooth elliptical geometry, thin uniform stroke weight, open right side and vertical-cut terminals, moving the C into the middle position. Remove the T entirely and add a capital S in the last position, in the SAME wide geometric sans-serif lettering system, same cap height, optical weight, smooth curvature, flat clean terminals, and understated corporate character as the original C. Balanced tight optical spacing, common baseline and cap line, no glyph overlaps. Original cap height to stroke ratio is approximately 8:1. The three letters must look like a cohesive direct evolution of the supplied mark, not a new unrelated font. Pure flat solid black ink, precise crisp smooth antialiased vector-like edges; no outline, shadows, 3D, texture, gradients, mockups, decorative marks, captions, slogan, or word GROUP. Crop closely around the complete wordmark with only a small consistent transparent safety margin; use nearly the entire width of the canvas. Deliver only this one finished logo asset.
```
