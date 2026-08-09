const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL_FUNDO = "https://i.ibb.co/1J4MZTKw/time.png";

const BANCO_DE_CARTAS = {
  // 90-94 OVERALL
  "luka modric 94": "https://i.ibb.co/5WvWtzPq/modric94.png",
  "ronaldo 93": "https://i.ibb.co/wN7PFP96/c-ronaldo.png",
  "mbappé 92": "https://i.ibb.co/K3sDyFd/mbappe92.png",
  "courtois 90": "https://i.ibb.co/7JkNk4nW/courtois.png",
  "pelé 91": "https://i.ibb.co/HDd67r7w/pele.png",
  "buffon 90": "https://i.ibb.co/KxxLnfWd/buffon.png",
  "eusébio 90": "https://i.ibb.co/cSY6C7vP/eusebio.png",
  "lev yashin 90": "https://i.ibb.co/WWxHcr1m/yashin.png",
  
  // 88-89 OVERALL
  "marcelo 89": "https://i.ibb.co/WW2Ddt99/marcelo.png",
  "pavard 89": "https://i.ibb.co/CpVYWS51/pavard.png",
  "varane 89": "https://i.ibb.co/gZxkBWMp/rapvarane.png",
  "thiago silva 89": "https://i.ibb.co/Wpv27xRF/thiagosilva.png",
  "luis figo 89": "https://i.ibb.co/Vc7HpNjF/luisfigo.png",
  "ronaldo nazário 89": "https://i.ibb.co/gLqzcW1C/r9.png",
  "cafu 88": "https://i.ibb.co/wZhHw1Wq/cafu.png",
  "griezmann 88": "https://i.ibb.co/nsM51rXC/griesmann.png",
  "hazard 88": "https://i.ibb.co/Gf8pLcHz/hazard.png",
  "carlos alberto 88": "https://i.ibb.co/WjN7z9r/carlosalberto.png",
  "diogo jota 88": "https://i.ibb.co/HDwr4hNV/diogojota.png",
  "garrincha 88": "https://i.ibb.co/HT8Mxhww/garrincha.png",
  "gullit 88": "https://i.ibb.co/7NLWk27K/gullit.png",
  "pepe 88": "https://i.ibb.co/bMYppmWJ/pepe.png",
  "roberto carlos 88": "https://i.ibb.co/Ps3KFZ5h/robertocarlos.png",
  "zidane 88": "https://i.ibb.co/wr45wSpS/zidane.png",

  "lionel messi 88": "https://i.ibb.co/SD9XC7KK/messi86.png",
  "martinez 87": "https://i.ibb.co/PsTNhDxT/martinez86.png",
  "mbappé 87": "https://i.ibb.co/wTzfxNN/mbappe86.png",
  "luka modric 87": "https://i.ibb.co/cXh7dVZ1/modric87.png",
  "beckenbauer 87": "https://i.ibb.co/ZzzWHWk8/beckenbauer.png",
  "george best 87": "https://i.ibb.co/Gf5nDHyc/best.png",
  "iniesta 87": "https://i.ibb.co/JFBg47m5/iniest.png",
  "kaká 87": "https://i.ibb.co/Y7BZskxC/kaka.png",
  "paolo maldini 87": "https://i.ibb.co/GvXpVHYS/maldini.png",
  "ronaldinho 87": "https://i.ibb.co/1G1Tqxhh/ronaldinho.png",
  "xavi 87": "https://i.ibb.co/w8XTqG3/xavi.png",
  "thierry henry 86": "https://i.ibb.co/kgQV7K0F/henry.png",
  "maradona 86": "https://i.ibb.co/YFPPdqSb/maradona.png",
  "ricardo quaresma 86": "https://i.ibb.co/k2HvS9V7/quaresma.png",
  "ibrahimovic 86": "https://i.ibb.co/Mks18Nm9/zlatan.png",

  "amrabat 86": "https://i.ibb.co/VP0s2cc/amrabat86.png",
  "bruno fernandes 86": "https://i.ibb.co/QjHQkGFn/brunofernandes86.png",
  "griezmann 86": "https://i.ibb.co/V0KY5RzN/griezmann86.png",
  "gvardiol 86": "https://i.ibb.co/3mt22NRP/gvardiol86.png",
  "livakovic 86": "https://i.ibb.co/WvyKDQpK/livakovic86.png",
  "pepe 86": "https://i.ibb.co/Rp9xf308/pepe86.png",

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

  // 84 OVERALL
  "ronaldo 84": "https://i.ibb.co/20gVWMFT/ronaldo84.png",
  "lionel messi 84": "https://i.ibb.co/5XK1RhWz/messi84.png",
  "bellingham 84": "https://i.ibb.co/f31P2Vq/bellingham.png",
  "haaland 84": "https://i.ibb.co/yBS6Z4s0/haaland84.png",
  "harry kane 84": "https://i.ibb.co/mF5fFLHR/harrykane.png",
  "mbappé 84": "https://i.ibb.co/m5PjypFT/mbappe84.png",
  "neymar jr 84": "https://i.ibb.co/ZpdBqzxF/neymar84.png",
  "nuno mendes 84": "https://i.ibb.co/67yHcGp3/nunomendes84.png",
  "vozinha 84": "https://i.ibb.co/PZyC4rDs/vozinha84.png",

  // 80 - 83 OVERALL
  "vinicius júnior 83": "https://i.ibb.co/KMnsD2j/vini83.png",
  "luka modric 83": "https://i.ibb.co/zWpt7p4w/modric83.png",
  "michael olise 83": "https://i.ibb.co/9HVsPRfg/olise.png",
  "ronaldo 83": "https://i.ibb.co/B2vyBJj1/ronaldo83.png",
  "marcus rashford 83": "https://i.ibb.co/N6hSpRm7/rashford.png",
  "diogo costa 83": "https://i.ibb.co/gLkfnyvc/diogocosta83.png",
  "khvicha kvaratskhelia 82": "https://i.ibb.co/1GqXhm5N/kvara82.png",
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
  "martim martins": "https://i.ibb.co/Hp3yrG8N/martimmartins.png",
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
  "andré pimenta 60": "https://i.ibb.co/gZFf9C7G/andrepimenta60.png",
  "zé ricardo 60": "https://i.ibb.co/G3C6JhmD/zericardo60.png"
};

function removerAcentos(texto) {
  if (!texto) return "";
  try {
    texto = decodeURIComponent(texto);
  } catch (e) {}

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// -------------------------------------------------------------
// ROTA 1: GERAR IMAGEM DO CAMPO
// -------------------------------------------------------------
app.get('/gerar-campo', async (req, res) => {
  try {
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

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

    const POSICOES = {
      gr:  { x: 400, y: 710 },
      le:  { x: 105, y: 560 },
      dc1: { x: 300, y: 535 },
      dc2: { x: 500, y: 535 },
      ld:  { x: 695, y: 560 },
      mc:  { x: 400, y: 375 },
      mo1: { x: 235, y: 235 },
      mo2: { x: 565, y: 235 },
      ee:  { x: 105, y: 100 },
      pl:  { x: 400, y: 90 },
      ed:  { x: 695, y: 100 }
    };

    for (const [pos, coord] of Object.entries(POSICOES)) {
      const busca = removerAcentos(req.query[pos]);

      if (busca && busca !== 'vazio') {
        const chaveEncontrada = Object.keys(BANCO_DE_CARTAS).find(nome => removerAcentos(nome).includes(busca));

        if (chaveEncontrada && BANCO_DE_CARTAS[chaveEncontrada]) {
          try {
            const cardImg = await loadImage(BANCO_DE_CARTAS[chaveEncontrada]);
            ctx.drawImage(
              cardImg, 
              coord.x - cardWidth / 2, 
              coord.y - cardHeight / 2, 
              cardWidth, 
              cardHeight
            );
          } catch (err) {
            console.error(`Erro ao carregar imagem para ${busca}:`, err.message);
          }
        }
      }
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);

  } catch (error) {
    console.error("Erro ao gerar campo:", error);
    res.status(500).send('Erro ao gerar imagem.');
  }
});

// -------------------------------------------------------------
// ROTA 2: BUSCAR JOGADORES
// -------------------------------------------------------------
app.get('/buscar-jogador', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const queryBruta = req.query.q || "";
    const buscaLimpa = removerAcentos(queryBruta);

    if (!buscaLimpa) {
      return res.status(200).json({ 
        sucesso: false, 
        erro: "busca_vazia",
        imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png",
        overall: 60 
      });
    }

    const chaveEncontrada = Object.keys(BANCO_DE_CARTAS).find(nomeNoBanco => {
      const nomeLimpo = removerAcentos(nomeNoBanco);
      return nomeLimpo.includes(buscaLimpa);
    });

    if (!chaveEncontrada) {
      return res.status(200).json({ 
        sucesso: false, 
        erro: "nao_encontrado",
        imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png",
        overall: 60 
      });
    }

    const partes = chaveEncontrada.split(' ');
    const overall = parseInt(partes[partes.length - 1]) || 60;
    const imagem = BANCO_DE_CARTAS[chaveEncontrada];

    let preco = 1000;
    if (overall === 99) preco = 100000;
    else if (overall === 98) preco = 80000;
    else if (overall === 97) preco = 65000;
    else if (overall === 96) preco = 52000;
    else if (overall === 95) preco = 42000;
    else if (overall === 94) preco = 34000;
    else if (overall === 93) preco = 28000;
    else if (overall === 92) preco = 23000;
    else if (overall === 91) preco = 19000;
    else if (overall === 90) preco = 16000;
    else if (overall === 89) preco = 13500;
    else if (overall === 88) preco = 11500;
    else if (overall === 87) preco = 9800;
    else if (overall === 86) preco = 8300;
    else if (overall === 85) preco = 7000;
    else if (overall === 84) preco = 5800;
    else if (overall === 83) preco = 4800;
    else if (overall === 82) preco = 3900;
    else if (overall === 81) preco = 3100;
    else if (overall === 80) preco = 2500;
    else if (overall === 79) preco = 2100;
    else if (overall === 78) preco = 1800;
    else if (overall === 77) preco = 1550;
    else if (overall === 76) preco = 1350;
    else if (overall === 75) preco = 1200;
    else if (overall === 74) preco = 1050;
    else if (overall === 73) preco = 920;
    else if (overall === 72) preco = 810;
    else if (overall === 71) preco = 710;
    else if (overall === 70) preco = 620;
    else if (overall === 69) preco = 540;
    else if (overall === 68) preco = 470;
    else if (overall === 67) preco = 410;
    else if (overall === 66) preco = 360;
    else if (overall === 65) preco = 310;
    else if (overall === 64) preco = 270;
    else if (overall === 63) preco = 240;
    else if (overall === 62) preco = 210;
    else if (overall === 61) preco = 180;
    else if (overall <= 60) preco = 150;
    
    return res.status(200).json({
      sucesso: true,
      nome: chaveEncontrada,
      overall: overall,
      imagem: imagem,
      preco: preco
    });
  } catch (error) {
    console.error("Erro interno no /buscar-jogador:", error);
    return res.status(200).json({ 
      sucesso: false, 
      erro: "erro_interno",
      imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png",
      overall: 60 
    });
  }
});

// -------------------------------------------------------------
// ROTA 3: OBTER JOGADOR ALEATÓRIO
// -------------------------------------------------------------
app.get('/obter-aleatorio', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const chaves = Object.keys(BANCO_DE_CARTAS);
    if (chaves.length === 0) {
      return res.status(200).json({ sucesso: false, erro: "banco_vazio" });
    }

    const jogadoresComPeso = chaves.map(chave => {
      const partes = chave.split(' ');
      const overall = parseInt(partes[partes.length - 1]) || 60;

      let peso = 100;

      if (overall >= 90) peso = 1;
      else if (overall >= 88) peso = 3;
      else if (overall >= 85) peso = 8;
      else if (overall >= 80) peso = 25;
      else if (overall >= 75) peso = 60;

      return { chave, overall, peso };
    });

    const pesoTotal = jogadoresComPeso.reduce((soma, j) => soma + j.peso, 0);

    let numeroSorteado = Math.random() * pesoTotal;
    let cartaSorteada = jogadoresComPeso[0];

    for (const jogador of jogadoresComPeso) {
      if (numeroSorteado < jogador.peso) {
        cartaSorteada = jogador;
        break;
      }
      numeroSorteado -= jogador.peso;
    }

    const imagem = BANCO_DE_CARTAS[cartaSorteada.chave];

    return res.status(200).json({
      sucesso: true,
      nome: cartaSorteada.chave,
      overall: cartaSorteada.overall,
      imagem: imagem
    });
  } catch (error) {
    console.error("Erro interno no /obter-aleatorio:", error);
    return res.status(200).json({ sucesso: false, erro: "erro_interno" });
  }
});

// -------------------------------------------------------------
// ROTA 4: LISTAR JOGADORES NO MERCADO
// -------------------------------------------------------------
app.get('/listar-mercado', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const faixa = req.query.faixa;
    const chaves = Object.keys(BANCO_DE_CARTAS);

    let min = 0;
    let max = 99;

    if (faixa === '9999') { min = 99; max = 99; }
    else if (faixa === '9598') { min = 95; max = 98; }
    else if (faixa === '9094') { min = 90; max = 94; }
    else if (faixa === '8589') { min = 85; max = 89; }
    else if (faixa === '8084') { min = 80; max = 84; }
    else if (faixa === '7579') { min = 75; max = 79; }
    else if (faixa === '7074') { min = 70; max = 74; }
    else if (faixa === '6569') { min = 65; max = 69; }
    else if (faixa === '6064') { min = 60; max = 64; }

    const filtrados = chaves.map(chave => {
      const partes = chave.split(' ');
      const overall = parseInt(partes[partes.length - 1]) || 60;
      
      const nomeSemOverall = partes.slice(0, -1).join(' ');
      const nomeFormatado = nomeSemOverall
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      return { nome: nomeFormatado, overall };
    })
    .filter(j => j.overall >= min && j.overall <= max)
    .sort((a, b) => b.overall - a.overall);

    if (filtrados.length === 0) {
      return res.status(200).json({
        texto: "*(Ainda não há jogadores disponíveis nesta faixa.)*"
      });
    }

    let linhas = [];
    for (let i = 0; i < filtrados.length; i += 2) {
      const j1 = filtrados[i];
      const j2 = filtrados[i + 1];

      const col1 = `[${j1.overall}] ${j1.nome.padEnd(16, ' ')}`;
      
      if (j2) {
        const col2 = `[${j2.overall}] ${j2.nome}`;
        linhas.push(`${col1}  ${col2}`);
      } else {
        linhas.push(col1);
      }
    }

    const resultadoFinal = "```ansi\n" + linhas.join('\n') + "\n```";

    return res.status(200).json({
      texto: resultadoFinal
    });

  } catch (error) {
    console.error("Erro no /listar-mercado:", error);
    return res.status(200).json({ texto: "Erro ao carregar a lista de jogadores." });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
