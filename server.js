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
  "luka modric 94": { imagem: "https://i.ibb.co/5WvWtzPq/modric94.png", posicao: "MC", atributos: [78, 84, 95, 92, 75, 72] },
  "joão costa 60": { imagem: "https://image.png/", posicao: "PL", atributos: [65, 58, 62, 61, 48, 64] },
  "charles 60": { imagem: "https://i.ibb.co/QFSyBFRv/charles60.png", posicao: "GR", atributos: [62, 63, 55, 60, 35, 60] },
  "joaquin lavega 60": { imagem: "https://i.ibb.co/wZHHhNkR/joaquinlavega60.png", posicao: "EE", atributos: [68, 57, 58, 62, 30, 55] },
  "Zé Ricardo 60": { imagem: "https://i.ibb.co/G3C6JhmD/zericardo60.png", posicao: "MC", atributos: [55, 50, 60, 56, 62, 65] },
  "thibaut courtois 90": { imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png", posicao: "GR", atributos: [85, 89, 76, 93, 90, 88] }
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
// ROTA 4: LISTAR JOGADORES NO MERCADO (COM POSIÇÃO INCLUÍDA)
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

      // Exemplo de saída: [94] Luka Modric (MC)
      const col1 = `[${j1.overall}] ${j1.nome} (${j1.posicao})`.padEnd(23, ' ');
      
      if (j2) {
        const col2 = `[${j2.overall}] ${j2.nome} (${j2.posicao})`;
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
