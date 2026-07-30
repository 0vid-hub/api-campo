const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

// URL direta da sua imagem de fundo no ImgBB
const URL_FUNDO = "https://i.ibb.co/rRCdDwc2/time.png";

// Dicionário de cartas (Mapeia o nome/termo para a imagem da carta)
const BANCO_DE_CARTAS = {
  // 85 OVERALL
  "unai simón 85": "https://i.ibb.co/1tP6SR0K/unaisimon85.png",
  "rodri 85": "https://i.ibb.co/XrH16CKR/rodri85.png",
  "pedro porro 85": "https://i.ibb.co/sJCBTG0L/pedroporro85.png",
  "pedri 85": "https://i.ibb.co/Kx1WRGvw/pedri85.png",
  "pau cubarsí 85": "https://i.ibb.co/PsrSRLgh/paucubarsi85.png",
  "pablo gavi 85": "https://i.ibb.co/4g2mTJm8/pablogavi85.png",
  "nico williams 85": "https://i.ibb.co/DgMnV7WG/nicowilliams85.png",
  "merino 85": "https://i.ibb.co/DHLYFjSH/merino85.png",
  "laporte 85": "https://i.ibb.co/NdHPPp1s/laporte85.png",
  "joan garcía 85": "https://i.ibb.co/cq0JrjR/joangarcia85.png",
  "grimaldo 85": "https://i.ibb.co/qYP8jdbk/grimaldo85.png",
  "ferran torres 85": "https://i.ibb.co/tpY91PsB/ferrantorres85.png",
  "david raya 85": "https://i.ibb.co/nqb1MhDL/davidraya85.png",
  "cucurella 85": "https://i.ibb.co/xtC2sYfv/cucurella85.png",
  "dani olmo 85": "https://i.ibb.co/xqR2zjwq/daniolmo85.png",
  "lamine yamal 85": "https://i.ibb.co/DDn5tdCN/yamal85.png",

  // 80 - 83 OVERALL
  "ronaldo 83": "https://i.ibb.co/B2vyBJj1/ronaldo83.png",
  "marcus rashford 83": "https://i.ibb.co/N6hSpRm7/rashford.png",
  "diogo costa 83": "https://i.ibb.co/gLkfnyvc/diogocosta83.png",
  "vitinha 82": "https://i.ibb.co/Kj7B9f57/vitinha82.png",
  "joão neves 81": "https://i.ibb.co/mCvgB2hj/joaoneves81.png",
  "rafael leão 81": "https://i.ibb.co/CKjMSjtJ/rafaleao81.png",
  "bruno fernandes 80": "https://i.ibb.co/HpBJgxrb/brunofernandes80.png",
  "ruben dias 80": "https://i.ibb.co/SLNg0bV/rubendias80.png",
  "gonçalo ramos 80": "https://i.ibb.co/sJXr8Yd1/gon-aloramos80.png",
  "neymar jr 80": "https://i.ibb.co/WNX88Xj1/neymar80.png",

  // 75 - 79 OVERALL
  "rodri 79": "https://i.ibb.co/NntbtcYh/rodri79r.png",
  "vinicius júnior 78": "https://i.ibb.co/k6r70yqc/vini78r.png",
  "kevin de bruyne 78": "https://i.ibb.co/PsFCVnHg/DEBRUYNE78r.png",
  "lamine yamal 78": "https://i.ibb.co/rRR5jFSz/yamal78r.png",
  "mbappé 78": "https://i.ibb.co/gMy5ZqkZ/mbappe78r.png",
  "lionel messi 77": "https://i.ibb.co/RTTnXHHB/messi77r.png",
  "harry kane 77": "https://i.ibb.co/7tbgyhq5/kane77r.png",
  "bellingham 76": "https://i.ibb.co/21kPP49k/bellingham76r.png",
  "haaland 76": "https://i.ibb.co/p66HPZYS/haaland76r.png",
  "ricardo mangas 76": "https://i.ibb.co/fzPnT6BL/ricardomangas76.png",
  "alisson 76": "https://i.ibb.co/WbRgQKQ/alisson76.png",
  "neymar jr 75": "https://i.ibb.co/W49BM0m4/neymar75r.png",
  "mohamed salah 75": "https://i.ibb.co/QF0RV1qn/salah75r.png",
  "ronaldo 75": "https://i.ibb.co/CpsxPhQc/ronaldo75r.png",
  "ederson 75": "https://i.ibb.co/dRMZpsv/ederson75.png",

  // 70 - 74 OVERALL
  "cucurella 74": "https://i.ibb.co/M52XXn3H/cucurella74.png",
  "endrick 74": "https://i.ibb.co/jvzs7j4q/endrick74.png",
  "estevão 74": "https://i.ibb.co/LdyFYYnK/estevao74.png",
  "gyokeres 74": "https://i.ibb.co/TM2f0Mgg/gyokeres74.png",
  "joão cancelo 74": "https://i.ibb.co/KcvmXmKR/joaocancelo75.png",
  "vitor roque 74": "https://i.ibb.co/yMPG18g/vitorroque74.png",
  "wendell 74": "https://i.ibb.co/fV2QtJSy/wendell74.png",
  "evanilson 74": "https://i.ibb.co/nN2cMbWF/evanilson74.png",
  "hwand din beom 74": "https://i.ibb.co/k2yKSdX0/hwandinbeom74.png",
  "kaio césar 74": "https://i.ibb.co/Szqt9VW/kaioc-sar74.png",
  "orkun kokçu 74": "https://i.ibb.co/k2CB7Jyc/kok-u74.png",
  "richard ríos 74": "https://i.ibb.co/Dfm9pqf1/richardrios74.png",
  "virgil van dijk 74": "https://i.ibb.co/B5TJ9ZP7/vandik74.png",
  "igor thiago 73": "https://i.ibb.co/qY9k3vDK/igorthiago73.png",
  "weston mckennie 73": "https://i.ibb.co/8DvLvMMZ/westonmckennie73.png",
  "alejandro garnacho 73": "https://i.ibb.co/ksYjsC4f/garnacho73.png",
  "facundo torres 73": "https://i.ibb.co/rf2LCz8t/facundotorres73.png",
  "tiago santos 72": "https://i.ibb.co/dJ3j3ThW/tiago-santos72.png",
  "gonçalo borges 71": "https://i.ibb.co/gbgtnk79/gon-aloborges71.png",
  "pavlidis 71": "https://i.ibb.co/nNwYZXhW/pavlidis71.png",
  "samuel portugal 70": "https://i.ibb.co/0y7cHN8d/samuelportugal74.png",
  "trubin 70": "https://i.ibb.co/q3nBxygp/trubin70.png",
  "ribamar 70": "https://i.ibb.co/XZ2FjFLp/ribamar70.png",
  "igor jesus 70": "https://i.ibb.co/C3ByxRBk/igorjesus70.png",
  "yuri alberto 70": "https://i.ibb.co/DPLcTQKY/yurialberto70.png",

  // 65 - 69 OVERALL
  "carlinhos 69": "https://i.ibb.co/6cXqTrRP/carlinhos69r.png",
  "francisco moura 69": "https://i.ibb.co/1YtgK2QV/franciscomoura69r.png",
  "gonçalo sá 69": "https://i.ibb.co/2Yd1XYnz/gon-alosa69r.png",
  "joão ferreira 69": "https://i.ibb.co/WW78PcRq/joaoferreira69r.png",
  "marcos leonardo 69": "https://i.ibb.co/sJWTH9s1/marcosleonardo69r.png",
  "matheusinho 69": "https://i.ibb.co/yBF1cnvD/matheusinho69r.png",
  "nathan silva 69": "https://i.ibb.co/s95s7B2z/nathansilva69r.png",
  "paulo bernardo 69": "https://i.ibb.co/mF0tHxDv/paulobernardo69r.png",
  "rodrigo riquelme 69": "https://i.ibb.co/LX1Y5XSt/rodrigoriqualme69r.png",
  "tomás ribeiro 69": "https://i.ibb.co/Zpyg3Bnb/tomasribeiro68r.png",
  "tiquinho soares 69": "https://i.ibb.co/bRF6S1Jq/tiquinhosoares69r.png",
  "josé sá 69": "https://i.ibb.co/JWB6tzmd/josesa69r.png",
  "gonçalo tabuaço 68": "https://i.ibb.co/390G8ZGT/gon-alotuabua-o68r.png",
  "henrique araújo 68": "https://i.ibb.co/fYQNHLkw/henriquearaujo69r.png",
  "rodrigo pinho 67": "https://i.ibb.co/hR1Cvs0f/rodrigopinho67r.png",
  "tomas araújo 67": "https://i.ibb.co/LXTybjKP/tomasaraujo67r.png",
  "fábio vieira 66": "https://i.ibb.co/JFWGB85y/fabiovieira66r.png",
  "nuno tavares 65": "https://i.ibb.co/84Lqjh54/nunotacares65r.png",
  "joão mário 65": "https://i.ibb.co/6jwS6H8/joaomario65r.png",
  "toti gomes 65": "https://i.ibb.co/WWZ1hRSR/totigomes65r.png",

  // 60 - 64 OVERALL
  "marcano 64": "https://i.ibb.co/ymTyPkY1/marcano64.png",
  "lukas ullrich 64": "https://i.ibb.co/Kj7B9f57/lukasullrish64.png",
  "andré almeida 63": "https://i.ibb.co/Y7PGCHR3/andrealmeida63.png",
  "nico schlotterbeck 63": "https://i.ibb.co/MkSDdfLz/nico63.png",
  "de la cruz 62": "https://i.ibb.co/SwjyzpmJ/delacruz62.png",
  "alexander bah 62": "https://i.ibb.co/fVB5JCPR/bah62.png",
  "charles 60": "https://i.ibb.co/gMTdxy9D/charles60.png",
  "joaquin lavega 60": "https://i.ibb.co/wZHHhNkR/joaquinlavega60.png",
  "caio césar 60": "https://i.ibb.co/67n1Lhkb/caiocesar60.png",
  "caça rato 60": "https://i.ibb.co/hRNn6wPv/ca-a-rato60.png",
  "zé ricardo 60": "https://i.ibb.co/G3C6JhmD/zericardo60.png"
};

const NOMES_POSICOES = {
  ee: "EE",
  pl: "PL",
  ed: "ED",
  mo1: "MO",
  mo2: "MO",
  mc: "MC",
  le: "LE",
  dc1: "DC",
  dc2: "DC",
  ld: "LD",
  gr: "GR"
};

app.get('/gerar-campo', async (req, res) => {
  try {
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. CARREGAR IMAGEM DE FUNDO
    try {
      const bgImg = await loadImage(URL_FUNDO);
      ctx.drawImage(bgImg, 0, 0, width, height);
    } catch (bgErr) {
      console.error("Erro ao carregar fundo:", bgErr.message);
      ctx.fillStyle = '#12141d';
      ctx.fillRect(0, 0, width, height);
    }

    const cardWidth = 145;
    const cardHeight = 195;

    // Coordenadas milimetricamente centralizadas
    const POSICOES = {
      gr:  { x: 400, y: 650 },
      le:  { x: 105, y: 495 },
      dc1: { x: 300, y: 495 },
      dc2: { x: 500, y: 495 },
      ld:  { x: 695, y: 495 },
      mc:  { x: 400, y: 345 },
      mo1: { x: 235, y: 215 },
      mo2: { x: 565, y: 215 },
      ee:  { x: 105, y: 85 },
      pl:  { x: 400, y: 80 },
      ed:  { x: 695, y: 85 }
    };

    for (const [pos, coord] of Object.entries(POSICOES)) {
      const nomeJogador = (req.query[pos] || 'vazio').toLowerCase().trim();
      const labelPosicao = NOMES_POSICOES[pos] || pos.toUpperCase();

      let desenhou = false;
      if (nomeJogador !== 'vazio' && BANCO_DE_CARTAS[nomeJogador]) {
        try {
          const cardImg = await loadImage(BANCO_DE_CARTAS[nomeJogador]);
          ctx.drawImage(
            cardImg, 
            coord.x - cardWidth / 2, 
            coord.y - cardHeight / 2, 
            cardWidth, 
            cardHeight
          );
          desenhou = true;
        } catch (err) {
          console.error(`Erro ao carregar ${nomeJogador}:`, err.message);
        }
      }

      // Define a posição vertical do texto
      let labelYPos;
      if (!desenhou) {
        // Se a posição estiver vazia, coloca o texto exatamente no centro das coordenadas da posição
        labelYPos = coord.y;
      } else {
        // Se houver jogador, coloca a sigla logo abaixo da carta
        labelYPos = coord.y + (cardHeight / 2) + 15;
      }

      // Desenha o texto da posição em BRANCO com contorno preto
      desenharEtiquetaPosicao(ctx, coord.x, labelYPos, labelPosicao);
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao gerar imagem.');
  }
});

function desenharEtiquetaPosicao(ctx, x, y, texto) {
  ctx.save();

  // Configuração da fonte (Branca, em negrito e com contorno escuro)
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Contorno preto fino/médio para dar contraste em qualquer fundo
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.strokeText(texto, x, y);

  // Preenchimento Branco Puro
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(texto, x, y);

  ctx.restore();
}

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
