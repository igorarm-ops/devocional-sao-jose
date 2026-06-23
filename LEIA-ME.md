# À Sombra de São José — Devocional do Esposo

> *Dedicado a São José, esposo de Maria e modelo dos esposos.*

Um app diário para te inspirar a ser um marido melhor e a amar tua esposa com o
amor de Cristo, **à escola de São José, o varão justo**. **Uma reflexão diferente
para cada dia do ano** (366 dias, com o dia bissexto), cada uma a partir de um
**santo**, de uma **carta de um papa** (encíclica / exortação) ou da **Palavra de
Deus**. Cada dia traz:

- **Ensinamento** — a palavra do santo, do papa ou da Escritura, com a fonte.
- **Reflexão** — uma meditação curta, aplicada à vida de casado.
- **📖 Reflexão profunda** — o texto longo (4–6 parágrafos), que abre ao toque ou sempre.
- **♥ Gesto de amor de hoje** — uma atitude concreta para viver hoje com ela.
- **✠ Oração** — uma oração breve pela tua esposa e pelo teu casamento.
- **Versículo** — uma Palavra de Deus para guardar no coração.

Identidade visual josefina: **verde** (o manto / a esperança), **ouro** (santidade),
**madeira** (o carpinteiro) e o creme do **lírio**. Ícone: o lírio de São José sobre
o esquadro do carpinteiro.

## Como abrir no computador

- **Mais simples:** dê dois cliques em `index.html`.
- **Como app (PWA, com modo offline):** sirva a pasta e abra `http://localhost:porta`.
  Ex., dentro da pasta: `python -m http.server 7459` → abrir <http://localhost:7459>.

## Instalar no iPhone (tela inicial, como um app)

O iPhone instala apps web pelo Safari. Para isso, o app precisa estar num endereço
**https** que o celular alcance. Dois caminhos:

**A) Publicar grátis (recomendado — vira app de verdade, com ícone e offline):**
1. Use o arquivo `devocional-sao-jose.zip` (já pronto nesta pasta).
2. Num site de hospedagem grátis de arrastar-e-soltar (ex.: **tiiny.host** ou
   **Netlify Drop**), envie o zip. Você recebe um link `https://...`.
3. No **iPhone**, abra esse link no **Safari**.
4. Toque em **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início**.
5. Pronto: o ícone do lírio aparece na tela inicial e abre em tela cheia, com o
   conteúdo guardado para uso offline.

**B) Testar na mesma rede Wi-Fi (rápido, sem publicar — mas sem offline):**
1. No PC, dentro da pasta: `python -m http.server 7459`.
2. Descubra o IP do PC (no PC: `ipconfig` → "Endereço IPv4", algo como 192.168.x.x).
3. No iPhone (mesmo Wi-Fi), no Safari, abra `http://SEU-IP:7459`.
4. Compartilhar → Adicionar à Tela de Início.
   *(Por ser http, o modo offline não fica ativo; o PC precisa estar ligado.)*

> Dica: o nome que aparece embaixo do ícone é “São José”.

## O que dá pra fazer

| Recurso | O que faz |
|---|---|
| **📖 Reflexão profunda** | Abre o texto longo do dia. O botão fixa sua preferência (sempre aberta / ao tocar). |
| **A− / A+** | Ajusta o tamanho da fonte para leitura confortável. |
| **♥ Marcar como vivido hoje** | Registra o dia e mantém uma *sequência* (streak). |
| **✉ Bilhete de amor** | Sorteia uma frase carinhosa para **enviar** (WhatsApp/compartilhar) ou copiar. |
| **⇪ Enviar (no gesto)** | Compartilha o gesto do dia. |
| **‹ Anterior / Próximo ›** | Folheia os 366 dias (ou setas ← → no teclado). |
| **Hoje** | Volta ao dia atual. |
| **☰ Ver todos** | **366 dias** (por mês) e **Acervo de fontes** (os 46 ensinamentos). |
| **✎ Para quem você ama?** | Põe o nome dela — aparece nos gestos e nas orações. |

Tudo fica salvo só no teu dispositivo. Nada sai daqui.
*(O recurso de áudio “Ouvir” foi removido: a voz era do sistema e soava robótica.)*

## Conteúdo, revisão e regeneração

- **Acervo:** 46 ensinamentos vetados (`dados/ensinamentos.json`).
- **366 reflexões** sobre o acervo (`dados/reflexoes/` → `reflexoes-ano.js`).
- **Revisão** sob 3 lentes (Pe. Paulo Ricardo, Frei Gilson, Pe. Gabriel Villaverde) —
  pareceres em `dados/revisao/`.
- Regenerar: em `dados/`, `python gerar_briefs.py` e `python mesclar_validar.py`.
  Ao mudar conteúdo, **suba a versão do cache em `sw.js`** (`sao-jose-vN`) e gere o zip de novo.

## Arquivos do app

```
devocional-do-esposo/
├── index.html, styles.css, app.js          → app
├── ensinamentos.js, reflexoes-ano.js, bilhetes.js  → conteúdo (gerado)
├── manifest.webmanifest, sw.js             → PWA (instalável + offline)
├── icone.svg, icone-192.png, icone-512.png, apple-touch-icon.png  → ícone (lírio)
├── devocional-sao-jose.zip                 → pronto para publicar
└── dados/                                  → fonte do conteúdo + scripts + revisões
```

*“José, seu marido, que era justo, agiu segundo a vontade de Deus.” (cf. Mt 1,19)*
