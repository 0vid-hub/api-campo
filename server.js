const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL_FUNDO = "https://i.ibb.co/1J4MZTKw/time.png";

// -------------------------------------------------------------
// BANCO DE CARTAS (AGORA COM APENAS OS 6 NÚMEROS DE ATRIBUTOS EM ORDEM)
// Ordem para LINHA: [VEL, REM, PAS, DRI, DEF, FIS]
// Ordem para GR:    [ALC, CON, REP, REF, POS, FIS]
// -------------------------------------------------------------
const BANCO_DE_CARTAS = {
"Ricardo Horta 79": { imagem: "https://image.png/", posicao: "EE", atributos: [78, 79, 76, 82, 38, 65] },
"Riccardo Orsolini 79": { imagem: "https://image.png/", posicao: "ED", atributos: [82, 81, 73, 84, 35, 61] },
"Vincenzo Grifo 79": { imagem: "https://image.png/", posicao: "EE", atributos: [76, 82, 79, 81, 32, 57] },

"Rodrigo Zalazar 78": { imagem: "https://image.png/", posicao: "MC", atributos: [72, 76, 82, 77, 48, 72] },
"Samuele Ricci 78": { imagem: "https://image.png/", posicao: "MC", atributos: [70, 48, 84, 69, 76, 74] },
"Arambarri 78": { imagem: "https://image.png/", posicao: "MC", atributos: [68, 51, 78, 63, 82, 78] },
"Antonee Robinson 78": { imagem: "https://image.png/", posicao: "LE", atributos: [91, 42, 71, 77, 70, 73] },
"Folarin Balogun 78": { imagem: "https://image.png/", posicao: "PL", atributos: [88, 81, 52, 72, 29, 77] },

"Moses Simon 77": { imagem: "https://image.png/", posicao: "EE", atributos: [92, 72, 65, 87, 29, 61] },
"Bradley Barcola 77": { imagem: "https://image.png/", posicao: "ED", atributos: [94, 75, 68, 90, 27, 59] },
"Florian Thauvin 77": { imagem: "https://image.png/", posicao: "ED", atributos: [75, 78, 81, 84, 31, 57] },
"Václav Černý 77": { imagem: "https://image.png/", posicao: "ED", atributos: [87, 73, 70, 81, 35, 59] },
"Ismaïla Sarr 77": { imagem: "https://image.png/", posicao: "ED", atributos: [93, 73, 61, 81, 30, 65] },
"Isi Palazón 77": { imagem: "https://image.png/", posicao: "MO", atributos: [72, 68, 82, 84, 34, 57] },
"Vedat Muriqi 77": { imagem: "https://image.png/", posicao: "PL", atributos: [57, 83, 56, 54, 38, 88] },
"Ricardo Rodríguez 77": { imagem: "https://image.png/", posicao: "LE", atributos: [68, 39, 79, 66, 76, 75] },

"João Moutinho 76": { imagem: "https://image.png/", posicao: "MC", atributos: [57, 44, 89, 64, 69, 62] },
"Tiago Silva 76": { imagem: "https://image.png/", posicao: "MC", atributos: [61, 56, 83, 75, 58, 64] },
"Félix Correia 76": { imagem: "https://image.png/", posicao: "ED", atributos: [86, 67, 70, 84, 29, 57] },
"Kanya Fujimoto 76": { imagem: "https://image.png/", posicao: "MO", atributos: [74, 63, 84, 82, 31, 55] },
"Zaydou Youssouf 76": { imagem: "https://image.png/", posicao: "MC", atributos: [68, 48, 77, 67, 78, 77] },
"Thomas Mangani 76": { imagem: "https://image.png/", posicao: "MC", atributos: [55, 45, 82, 61, 74, 64] },
"Thomas Lemar 76": { imagem: "https://image.png/", posicao: "MO", atributos: [67, 61, 86, 79, 39, 57] },
"James Maddison 76": { imagem: "https://image.png/", posicao: "MO", atributos: [70, 76, 88, 84, 32, 59] },
"Alex Iwobi 76": { imagem: "https://image.png/", posicao: "MC", atributos: [83, 55, 80, 82, 38, 65] },

"Vincent Sierro 75": { imagem: "https://image.png/", posicao: "MC", atributos: [62, 54, 85, 63, 68, 68] },
"Yann Gboho 75": { imagem: "https://image.png/", posicao: "ED", atributos: [86, 66, 73, 84, 32, 58] },
"Zakaria Aboukhlal 75": { imagem: "https://image.png/", posicao: "ED", atributos: [89, 72, 58, 76, 34, 68] },
"Jean-Philippe Krasso 75": { imagem: "https://image.png/", posicao: "PL", atributos: [73, 78, 59, 70, 30, 76] },
"Benjamin Bourigeaud 75": { imagem: "https://image.png/", posicao: "MC", atributos: [68, 75, 83, 76, 42, 63] },
"Antonin Barak 75": { imagem: "https://image.png/", posicao: "MO", atributos: [61, 72, 78, 71, 39, 69] },
"Nikola Vlašić 75": { imagem: "https://image.png/", posicao: "MO", atributos: [66, 72, 78, 76, 43, 68] },
"Malinovskyi 75": { imagem: "https://image.png/", posicao: "MO", atributos: [63, 79, 82, 73, 38, 63] },
"Man 75": { imagem: "https://image.png/", posicao: "ED", atributos: [91, 73, 64, 79, 31, 63] },
"Abel Ruiz 75": { imagem: "https://image.png/", posicao: "PL", atributos: [74, 76, 63, 74, 33, 65] },

"Pedro Gonçalves 74": { imagem: "https://image.png/", posicao: "MO", atributos: [78, 72, 82, 84, 34, 58] },
"Ricardo Horta 74": { imagem: "https://image.png/", posicao: "EE", atributos: [79, 75, 76, 81, 37, 63] },
"Clayton 74": { imagem: "https://image.png/", posicao: "PL", atributos: [78, 80, 47, 65, 32, 75] },
"Adrián Marín 74": { imagem: "https://image.png/", posicao: "LE", atributos: [78, 35, 72, 70, 68, 64] },
"Fran Navarro 74": { imagem: "https://image.png/", posicao: "PL", atributos: [70, 78, 51, 61, 31, 72] },
"Jorge de Frutos 74": { imagem: "https://image.png/", posicao: "ED", atributos: [90, 68, 56, 78, 34, 62] },
"Dani Rodríguez 74": { imagem: "https://image.png/", posicao: "MC", atributos: [67, 65, 77, 74, 42, 61] },
"Ademola Lookman 74": { imagem: "https://image.png/", posicao: "EE", atributos: [94, 79, 65, 87, 28, 62] },
"Andrea Colpani 74": { imagem: "https://image.png/", posicao: "MO", atributos: [72, 63, 81, 79, 35, 58] },
"Matías Soulé 74": { imagem: "https://image.png/", posicao: "ED", atributos: [78, 75, 82, 87, 30, 57] },

"Vitor Carvalho 73": { imagem: "https://image.png/", posicao: "MC", atributos: [64, 42, 76, 61, 76, 78] },
"Gabri Martínez 73": { imagem: "https://image.png/", posicao: "ED", atributos: [87, 66, 60, 78, 30, 63] },
"João Marques 73": { imagem: "https://image.png/", posicao: "MO", atributos: [76, 58, 78, 75, 34, 55] },
"Jérémy Boga 73": { imagem: "https://image.png/", posicao: "EE", atributos: [88, 67, 69, 86, 28, 54] },
"Adrien Truffert 73": { imagem: "https://image.png/", posicao: "LE", atributos: [83, 38, 73, 76, 62, 65] },
"Arnaut Danjuma 73": { imagem: "https://image.png/", posicao: "EE", atributos: [91, 71, 58, 78, 29, 60] },
"Josh Dasilva 73": { imagem: "https://image.png/", posicao: "MC", atributos: [70, 52, 75, 72, 54, 65] },

"Ricardo Mangas 72": { imagem: "https://image.png/", posicao: "LE", atributos: [86, 41, 63, 70, 64, 69] },
"Fran Navarro 72": { imagem: "https://image.png/", posicao: "PL", atributos: [72, 77, 49, 62, 30, 71] },
"Abde Ezzalzouli 72": { imagem: "https://image.png/", posicao: "EE", atributos: [93, 64, 60, 84, 27, 52] },
"Jesús Areso 72": { imagem: "https://image.png/", posicao: "LD", atributos: [85, 36, 62, 72, 65, 67] },
"Emmanuel Dennis 72": { imagem: "https://image.png/", posicao: "PL", atributos: [87, 70, 55, 75, 31, 64] },

"João Mário 71": { imagem: "https://image.png/", posicao: "MC", atributos: [66, 52, 80, 74, 42, 65] },
"Róber 71": { imagem: "https://image.png/", posicao: "DC", atributos: [58, 32, 57, 43, 82, 80] },
"Lucas Mineiro 70": { imagem: "https://image.png/", posicao: "MC", atributos: [61, 39, 69, 56, 79, 81] },

"André Clóvis 69": { imagem: "https://image.png/", posicao: "PL", atributos: [58, 69, 58, 64, 32, 76] },
"Zé Lucas 69": { imagem: "https://image.png/", posicao: "MC", atributos: [70, 51, 78, 70, 72, 75] },

"Rafael Luís 68": { imagem: "https://image.png/", posicao: "MC", atributos: [65, 55, 72, 67, 68, 70] },
"Tony Strata 68": { imagem: "https://image.png/", posicao: "LD", atributos: [82, 39, 62, 72, 67, 65] },
"Tomás Pochettino 68": { imagem: "https://image.png/", posicao: "MO", atributos: [63, 70, 82, 79, 39, 58] },
"João Pedro 68": { imagem: "https://image.png/", posicao: "ED", atributos: [67, 66, 58, 79, 30, 57] },

"Daniel Banjaqui 67": { imagem: "https://image.png/", posicao: "LD", atributos: [68, 42, 62, 70, 65, 67] },
"Ejike Opara 67": { imagem: "https://image.png/", posicao: "PL", atributos: [66, 78, 43, 66, 50, 70] },
"Miguel Nogueira 67": { imagem: "https://image.png/", posicao: "ED", atributos: [85, 62, 65, 70, 34, 57] },
"Ryan 67": { imagem: "https://image.png/", posicao: "MC", atributos: [73, 44, 75, 68, 70, 73] },
"Gustavo Santos 67": { imagem: "https://image.png/", posicao: "PL", atributos: [70, 76, 46, 61, 29, 71] },

"Gonçalo Oliveira 66": { imagem: "https://image.png/", posicao: "DC", atributos: [54, 48, 55, 48, 76, 74] },
"Nuno Félix 66": { imagem: "https://image.png/", posicao: "MC", atributos: [62, 48, 70, 61, 69, 68] },
"Thiago Balieiro 66": { imagem: "https://image.png/", posicao: "DC", atributos: [59, 34, 54, 45, 78, 75] },
"Rômulo 66": { imagem: "https://image.png/", posicao: "MO", atributos: [67, 65, 77, 75, 42, 61] },
"Lourenço 66": { imagem: "https://image.png/", posicao: "MC", atributos: [62, 58, 81, 68, 55, 67] },
"Gustavo Prado 66": { imagem: "https://image.png/", posicao: "ED", atributos: [76, 64, 65, 80, 34, 55] },
"Lucas Kallyel 66": { imagem: "https://image.png/", posicao: "MC", atributos: [69, 46, 73, 65, 67, 71] },

"Gonçalo Moreira 65": { imagem: "https://image.png/", posicao: "MO", atributos: [74, 61, 69, 78, 38, 56] },
"Pozo 65": { imagem: "https://image.png/", posicao: "MO", atributos: [63, 67, 73, 77, 32, 58] },
"Juan Muñoz 65": { imagem: "https://image.png/", posicao: "PL", atributos: [61, 76, 57, 62, 31, 68] },
"Vasco Santos 65": { imagem: "https://image.png/", posicao: "DC", atributos: [62, 36, 57, 48, 79, 72] },
"Chrystian Barletta 65": { imagem: "https://image.png/", posicao: "ED", atributos: [87, 73, 56, 81, 30, 59] },
"Ronald 65": { imagem: "https://image.png/", posicao: "MC", atributos: [76, 48, 73, 67, 68, 72] },
"Darlisson 65": { imagem: "https://image.png/", posicao: "DC", atributos: [58, 55, 52, 44, 77, 76] },

"Carter 64": { imagem: "https://image.png/", posicao: "PL", atributos: [79, 72, 48, 68, 49, 61] },
"Messeguem 64": { imagem: "https://image.png/", posicao: "MO", atributos: [67, 54, 75, 72, 42, 58] },
"Bernardo 64": { imagem: "https://image.png/", posicao: "GR", atributos: [70, 68, 72, 69, 74, 72] },
"Vlad 64": { imagem: "https://image.png/", posicao: "EE", atributos: [88, 58, 61, 62, 49, 52] },
"Ronaldo Lumungo 64": { imagem: "https://image.png/", posicao: "ED", atributos: [69, 61, 53, 79, 32, 59] },
"Luiz Fernando 64": { imagem: "https://image.png/", posicao: "EE", atributos: [82, 67, 61, 76, 35, 60] },
"Gabriel Boschilia 64": { imagem: "https://image.png/", posicao: "MO", atributos: [61, 69, 79, 76, 31, 54] },
"Cipriano 64": { imagem: "https://image.png/", posicao: "DC", atributos: [61, 34, 55, 46, 75, 74] },
"Fabrício Daniel 64": { imagem: "https://image.png/", posicao: "ED", atributos: [68, 69, 56, 63, 43, 63] },

"Rafael Nel 63": { imagem: "https://image.png/", posicao: "PL", atributos: [76, 70, 49, 63, 28, 62] },
"Frederico Namora 63": { imagem: "https://image.png/", posicao: "DC", atributos: [55, 31, 52, 43, 80, 77] },
"Armando Lopes 63": { imagem: "https://image.png/", posicao: "LE", atributos: [76, 38, 60, 68, 70, 65] },
"João Silva 63": { imagem: "https://image.png/", posicao: "ED", atributos: [70, 59, 58, 76, 35, 57] },
"Gustavo Coutinho 63": { imagem: "https://image.png/", posicao: "PL", atributos: [64, 77, 47, 58, 28, 69] },
"Matheus Araújo 63": { imagem: "https://image.png/", posicao: "MO", atributos: [68, 57, 75, 72, 35, 55] },
"Matheus Sales 63": { imagem: "https://image.png/", posicao: "MC", atributos: [61, 43, 69, 59, 73, 74] },
"Clayson 63": { imagem: "https://image.png/", posicao: "EE", atributos: [70, 67, 63, 75, 36, 58] },

"Pedro Martelo 62": { imagem: "https://image.png/", posicao: "PL", atributos: [68, 72, 45, 60, 27, 63] },
"Rafa 62": { imagem: "https://image.png/", posicao: "GR", atributos: [68, 65, 70, 72, 76, 69] },
"Daniel Penha 62": { imagem: "https://image.png/", posicao: "MO", atributos: [65, 62, 76, 73, 33, 55] },
"Kevyson 62": { imagem: "https://image.png/", posicao: "LE", atributos: [79, 36, 62, 67, 61, 63] },

"Andre Sousa 61": { imagem: "https://image.png/", posicao: "LE", atributos: [69, 36, 59, 64, 68, 62] },
"Hereda 61": { imagem: "https://image.png/", posicao: "LD", atributos: [66, 54, 60, 64, 65, 66] },
"Thiaguinho 61": { imagem: "https://image.png/", posicao: "ED", atributos: [64, 60, 52, 74, 39, 55] }
};

function removerAcentos(texto) {
  if (!texto) return "";
  try { texto = decodeURIComponent(texto); } catch (e) {}
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// -------------------------------------------------------------
// ROTA 1: GERAR IMAGEM DO CAMPO (CORRIGIDA)
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
      let busca = removerAcentos(req.query[pos]);

      if (busca && busca !== 'vazio') {
        // REMOVE NÚMEROS DO FINAL DA BUSCA (Ex: "lavega 30" vira "lavega")
        busca = busca.replace(/\s+\d+$/, '').trim();

        // Encontra a carta mesmo que o nome no banco tenha o overall original
        const chaveEncontrada = Object.keys(BANCO_DE_CARTAS).find(nomeNoBanco => {
          const nomeLimpo = removerAcentos(nomeNoBanco).replace(/\s+\d+$/, '').trim();
          return nomeLimpo.includes(busca) || busca.includes(nomeLimpo);
        });

        if (chaveEncontrada && BANCO_DE_CARTAS[chaveEncontrada]) {
          try {
            const cardData = BANCO_DE_CARTAS[chaveEncontrada];
            const imgUrl = typeof cardData === 'string' ? cardData : cardData.imagem;
            const cardImg = await loadImage(imgUrl);

            // Desenha a carta na posição que foi requisitada no parâmetro do campo
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
// ROTA 2: BUSCAR JOGADOR (AUTOMÁTICO PARA GR OU LINHA)
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
    const dadosCarta = BANCO_DE_CARTAS[chaveEncontrada];

    const imagem = typeof dadosCarta === 'string' ? dadosCarta : dadosCarta.imagem;
    const posicao = (dadosCarta.posicao || "PL").toUpperCase().trim();
    
    // VERIFICA AUTOMATICAMENTE SE É GOLEIRO APENAS CONFERINDO A POSIÇÃO
    const ehGoleiro = posicao === "GR";

    // Extrai a lista de 6 números (ou preenche com o overall se não houver)
    let listaAtributos = Array.isArray(dadosCarta.atributos) ? dadosCarta.atributos : [];
    
    const att1 = listaAtributos[0] !== undefined ? listaAtributos[0] : overall;
    const att2 = listaAtributos[1] !== undefined ? listaAtributos[1] : overall;
    const att3 = listaAtributos[2] !== undefined ? listaAtributos[2] : overall;
    const att4 = listaAtributos[3] !== undefined ? listaAtributos[3] : overall;
    const att5 = listaAtributos[4] !== undefined ? listaAtributos[4] : overall;
    const att6 = listaAtributos[5] !== undefined ? listaAtributos[5] : overall;

    // CÁLCULO DA FORÇA TOTAL (SOMA DOS 6 STATS)
    const forcaTotal = att1 + att2 + att3 + att4 + att5 + att6;

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
      posicao: posicao,
      ehGoleiro: ehGoleiro,
      imagem: imagem,
      preco: preco,
      att1: att1,
      att2: att2,
      att3: att3,
      att4: att4,
      att5: att5,
      att6: att6,
      forcaTotal: forcaTotal
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

    const dadosCarta = BANCO_DE_CARTAS[cartaSorteada.chave];
    const imagem = typeof dadosCarta === 'string' ? dadosCarta : dadosCarta.imagem;

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
// ROTA 4: LISTAR JOGADORES NO MERCADO (FORMATAÇÃO INTELIGENTE)
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
      // 1. Extrai o overall do final
      const partes = chave.trim().split(/\s+/);
      const overall = parseInt(partes[partes.length - 1]) || 60;

      // 2. Isola as palavras do nome
      let palavrasNome = partes.slice(0, -1);
      if (palavrasNome.length === 0) palavrasNome = [chave];

      // 3. Abrevia apenas o primeiro nome se houver mais de uma palavra
      let nomeFormatado = "";
      if (palavrasNome.length > 1) {
        const primeiraInicial = palavrasNome[0].charAt(0).toUpperCase() + ".";
        const restoDoNome = palavrasNome.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        nomeFormatado = `${primeiraInicial} ${restoDoNome}`;
      } else {
        nomeFormatado = palavrasNome[0].charAt(0).toUpperCase() + palavrasNome[0].slice(1).toLowerCase();
      }

      // 4. Limite de segurança: só corta se o nome isolado passar de 20 caracteres!
      if (nomeFormatado.length > 20) {
        nomeFormatado = nomeFormatado.substring(0, 19) + ".";
      }

      const dadosCarta = BANCO_DE_CARTAS[chave];
      const posicao = (dadosCarta.posicao || "PL").toUpperCase().trim();

      return { nome: nomeFormatado, overall, posicao };
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

      // Monta a string completa do jogador 1
      const item1 = `[${j1.overall}] ${j1.nome} (${j1.posicao})`;
      
      // Expande a coluna 1 para 32 caracteres (dá espaço de sobra para nomes longos como "G. Boschilia")
      const col1 = item1.padEnd(32, ' '); 

      if (j2) {
        const item2 = `[${j2.overall}] ${j2.nome} (${j2.posicao})`;
        linhas.push(`${col1}  ${item2}`);
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
