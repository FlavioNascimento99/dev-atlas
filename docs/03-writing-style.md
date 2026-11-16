# DOCUMENTO 03 — GUIA DE ESTILO EDITORIAL

**Projeto:** DevAtlas  
**Status:** Piloto (aplicado em DNS e Teorema CAP)  
**Referência:** Documento 01 — Visão e Concepção do Produto

---

## 1. Para quem escrevemos

Estudantes e curiosos sem base profunda, sem deixar de servir quem já trabalha na área. O texto é despojado e fácil, mas a correção técnica é inegociável.

## 2. Regras

1. **Abrir pela vida real, não pela definição.** O primeiro parágrafo descreve uma situação cotidiana; a definição formal vem logo depois.
2. **Uma analogia central por tópico**, retomada ao longo das seções. Não trocar de analogia a cada parágrafo. Dizer explicitamente onde a analogia falha quando isso importar.
3. **Termo técnico depois da ideia**, sempre explicado na primeira vez em que aparece. Os termos ficam: o leitor vai encontrá-los na faculdade e no trabalho.
4. **Frases curtas, voz ativa, falando com o leitor** ("you" / "você"). Parágrafos de duas a quatro linhas.
5. **Profundidade em camadas.** overview, how-it-works, when-to-use e when-not-to-use são bem acessíveis. trade-offs, implementation-examples e common-misconceptions podem ser técnicos, mas cada tabela ou bloco de código é precedido de uma frase de contexto.
6. **Idiomas.** O inglês é canônico. O pt-BR é uma tradução adaptada, não literal: natural, coloquial na medida, com acentuação correta, sem gíria datada ou forçada. Analogias podem ser ajustadas à cultura.
7. **Marcações com `Mark`.** highlight para a ideia mais importante; underline para um termo ou conceito a reter. No máximo cerca de uma por parágrafo, só onde ajuda a escanear. Tons (brand, teal, amber) variados com parcimônia. Nunca dentro de títulos, tabelas ou código.
8. **Correção técnica.** Não inventar fatos. Manter tudo o que já está correto, as dez ArticleSection na ordem, o lab da seção visual-demonstration e o código existente. Simplificar a explicação nunca autoriza simplificar o fato.

## 3. Referências no repositório

- `content/networking/dns/` — analogia da agenda de contatos.
- `content/distributed-systems/cap-theorem/` — analogia do restaurante com duas recepções.
- Textos de lab seguem as mesmas regras; os rótulos dentro do SVG continuam curtos (ver README, "Adding a visualization").
