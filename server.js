const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL_FUNDO = "https://i.ibb.co/1J4MZTKw/time.png";

const BANCO_DE_CARTAS = {
  
  "endrick 74": { img: "https://i.ibb.co/Ldsfvv6r/endrick74.png", pos: "pl" },
  "estevão 74": { img: "https://i.ibb.co/fdMBc33z/estev-o74.png", pos: "ed" },
  "joão mário 74": { img: "https://i.ibb.co/8nZzGgd7/jo-omario74.png", pos: "ld" },
  "nuno tavares 74": { img: "https://i.ibb.co/fd17kJfK/nunotavares74.png", pos: "le" },
  "josé sá 73": { img: "https://i.ibb.co/cc3csNK4/jos-s-73.png", pos: "gr" },
  "vozinha 73": { img: "https://i.ibb.co/WpyM2yZ7/vozinha73.png", pos: "gr" },
  "raphael veiga 72": { img: "https://i.ibb.co/tTFK6S13/raphaelveiga72.png", pos: "mo" },
  "trubin 72": { img: "https://i.ibb.co/twJ4H3wz/trubin72.png", pos: "gr" },
  "pavlidis 71": { img: "https://i.ibb.co/pFp2Y4w/pavlidis71.png", pos: "pl" },
  "trincão 71": { img: "https://i.ibb.co/JRTpHKS9/trinc-o71.png", pos: "mo" },
  "igor jesus 70": { img: "https://i.ibb.co/jkWgX7Tm/igorjesus71.png", pos: "pl" },
  "yuri alberto 70": { img: "https://i.ibb.co/FLbSY09x/yurialberto70.png", pos: "pl" },
  
  "martim martins 69": { img: "https://i.ibb.co/3xGRbf6/martimmartins68.png", pos: "mc" },
  "tomás ribeiro 69": { img: "https://i.ibb.co/Qjpf21xG/tomasribeiro69.png", pos: "dc" },
  "fábio vieira 68": { img: "https://i.ibb.co/JRWMMz7z/fabiovieira68.png", pos: "mo" },
  "matheusinho 68": { img: "https://i.ibb.co/5xGKQNHF/matheusinho68.png", pos: "mo" },
  "rodrigo pinho 67": { img: "https://i.ibb.co/CK3kfZ9k/rodrigopinho67.png", pos: "pl" },
  "toti gomes 67": { img: "https://i.ibb.co/tyX8bnw/totigomes67.png", pos: "dc" },
  "marcos leonardo 66": { img: "https://i.ibb.co/HTwcfpbQ/marcosleonardo66.png", pos: "pl" },
  "nathan silva 66": { img: "https://i.ibb.co/fYm7Lqdy/nathansilva66.png", pos: "dc" },
  "carlinhos 65": { img: "https://i.ibb.co/fVR6b5wx/carlinhos65.png", pos: "ee" },
  "gonçalo sá 65": { img: "https://i.ibb.co/gLvjtSjj/gon-alos-65.png", pos: "mo" },
    
  "joaquin lavega 64": { img: "https://i.ibb.co/jkJBjvYv/joaquinlavega64.png", pos: "ee" },
  "nico schlotterbeck 64": { img: "https://i.ibb.co/mFJcHvQg/nicoschlotterbeck64.png", pos: "dc" },
  "andré almeida 63": { img: "https://i.ibb.co/WppPRkhV/andrealmeida63.png", pos: "mo" },
  "de la cruz 63": { img: "https://i.ibb.co/kVyTc0xz/delacruz63.png", pos: "mo" },
  "caça rato 62": { img: "https://i.ibb.co/wb1PLJ8/cacarato62.png", pos: "pl" },
  "tiquinho soares 62": { img: "https://i.ibb.co/xQJwrjB/tiquinho62.png", pos: "pl" },
  "luan silva 61": { img: "https://i.ibb.co/5hbcfFcw/luansilva61.png", pos: "pl" },
  "mikael 61": { img: "https://i.ibb.co/6cNWrn4Y/mikael61.png", pos: "pl" },
  "charles 60": { img: "https://i.ibb.co/Kxn9y0yY/charles60.png", pos: "gr" },
  "chrystian barletta 60": { img: "https://i.ibb.co/gMmYRhmy/Chrystian-Barletta60.png", pos: "ee" }
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

// FUNÇÃO DE BUSCA UNIFICADA (Encontra jogadoes exatos, parciais e sem overall)
function encontrarChaveJogador(termoBusca) {
  const buscaLimpa = removerAcentos(termoBusca);
  if (!buscaLimpa) return null;

  const chaves = Object.keys(BANCO_DE_CARTAS);

  // 1. Match Exato (ex: "diogo costa 83")
  let achado = chaves.find(chave => removerAcentos(chave) === buscaLimpa);
  if (achado) return achado;

  // Isola nome sem números de overall ao final
  const buscaSemNumero = buscaLimpa.replace(/\s+\d+$/, '').trim();

  // 2. Match sem considerar números (ex: "diogo costa" bate com "diogo costa 83")
  achado = chaves.find(chave => {
    const nomeBancoLimpo = removerAcentos(chave);
    const nomeBancoSemNumero = nomeBancoLimpo.replace(/\s+\d+$/, '').trim();
    return nomeBancoSemNumero === buscaSemNumero;
  });
  if (achado) return achado;

  // 3. Match Parcial Inteligente (ex: digitar "diogo" ou "costa" acha "diogo costa 83")
  achado = chaves.find(chave => {
    const nomeBancoLimpo = removerAcentos(chave);
    const nomeBancoSemNumero = nomeBancoLimpo.replace(/\s+\d+$/, '').trim();
    return nomeBancoSemNumero.includes(buscaSemNumero) || buscaSemNumero.includes(nomeBancoSemNumero);
  });

  return achado || null;
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
      const termo = req.query[pos];

      if (termo && termo !== 'vazio') {
        const chaveEncontrada = encontrarChaveJogador(termo);

        if (chaveEncontrada && BANCO_DE_CARTAS[chaveEncontrada]) {
          try {
            const cardImg = await loadImage(BANCO_DE_CARTAS[chaveEncontrada].img);
            ctx.drawImage(
              cardImg, 
              coord.x - cardWidth / 2, 
              coord.y - cardHeight / 2, 
              cardWidth, 
              cardHeight
            );
          } catch (err) {
            console.error(`Erro ao carregar imagem para ${termo}:`, err.message);
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
// ROTA 2: BUSCAR JOGADORES (CORRIGIDA DEFINITIVAMENTE)
// -------------------------------------------------------------
app.get('/buscar-jogador', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const queryBruta = req.query.q || "";
    const chaveEncontrada = encontrarChaveJogador(queryBruta);

    if (!chaveEncontrada) {
      return res.status(200).json({ 
        sucesso: false, 
        erro: "nao_encontrado",
        imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png",
        posicao: "desconhecida",
        overall: 60 
      });
    }

    const partes = chaveEncontrada.split(' ');
    const overall = parseInt(partes[partes.length - 1]) || 60;
    const dadosCarta = BANCO_DE_CARTAS[chaveEncontrada];

    let preco = 1000;
    if (overall >= 90) preco = 16000 + (overall - 90) * 4000;
    else if (overall >= 80) preco = 2500 + (overall - 80) * 1000;
    else preco = 150 + (overall - 60) * 100;

    return res.status(200).json({
      sucesso: true,
      nome: chaveEncontrada,
      overall: overall,
      imagem: dadosCarta.img,
      posicao: dadosCarta.pos,
      preco: preco
    });
  } catch (error) {
    console.error("Erro interno no /buscar-jogador:", error);
    return res.status(200).json({ 
      sucesso: false, 
      erro: "erro_interno",
      imagem: "https://i.ibb.co/sd3x55sR/desconhecido.png",
      posicao: "desconhecida",
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

    return res.status(200).json({
      sucesso: true,
      nome: cartaSorteada.chave,
      overall: cartaSorteada.overall,
      imagem: dadosCarta.img,
      posicao: dadosCarta.pos
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

      const dadosCarta = BANCO_DE_CARTAS[chave];
      const posicao = (dadosCarta && dadosCarta.pos) ? dadosCarta.pos.toUpperCase() : "??";

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

      const nome1 = j1.nome.length > 13 ? j1.nome.slice(0, 11) + ".." : j1.nome;
      const item1 = `[${j1.overall} ${j1.posicao}] ${nome1}`;
      const col1 = item1.padEnd(24, ' ');
      
      if (j2) {
        const nome2 = j2.nome.length > 13 ? j2.nome.slice(0, 11) + ".." : j2.nome;
        const col2 = `[${j2.overall} ${j2.posicao}] ${nome2}`;
        linhas.push(`${col1}${col2}`);
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
