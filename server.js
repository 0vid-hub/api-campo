const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;
const os = require('os');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const URL_FUNDO = "https://i.ibb.co/1J4MZTKw/time.png";

const BANCO_DE_CARTAS = {
  "endrick 74": { img: "https://i.ibb.co/Ld5CyX6n/endrick72.png", pos: "pl" },
  "estevão 74": { img: "https://i.ibb.co/SXLGjWgZ/estevao74.png", pos: "ed" },
  "joão mário 74": { img: "https://i.ibb.co/5h2v9q6h/joaomario74.png", pos: "ld" },
  "nuno tavares 74": { img: "https://i.ibb.co/RTtF9KLJ/nunotavares74.png", pos: "le" },
  "josé sá 73": { img: "https://i.ibb.co/hR3CyMZc/joseja73.png", pos: "gr" },
  "vozinha 73": { img: "https://i.ibb.co/1G5zQXWB/vozinha73.png", pos: "gr" },
  "raphael veiga 72": { img: "https://i.ibb.co/gFH4WCwY/RAPHAEL-VEIGA72.png", pos: "mo" },
  "trubin 72": { img: "https://i.ibb.co/FbRtb41T/trubin72.png", pos: "gr" },
  "pavlidis 71": { img: "https://i.ibb.co/kVvbXxC0/pavlidis71.png", pos: "pl" },
  "trincão 71": { img: "https://i.ibb.co/JjXTft5p/trincao71.png", pos: "mo" },
  "igor jesus 70": { img: "https://i.ibb.co/C33xqWvb/igorjesus70.png", pos: "pl" },
  "yuri alberto 70": { img: "https://i.ibb.co/HTxK0kg8/yurialberto70.png", pos: "pl" },
  "martim martins 69": { img: "https://i.ibb.co/1G0ryHzM/martimmartins69.png", pos: "mc" },
  "tomás ribeiro 69": { img: "https://i.ibb.co/v4NKCnhb/tomasribeiro69.png", pos: "dc" },
  "fábio vieira 68": { img: "https://i.ibb.co/TMV1qDwq/fabiovieira68.png", pos: "mo" },
  "matheusinho 68": { img: "https://i.ibb.co/zT98cV5F/MATHEUSINHO68.png", pos: "mo" },
  "rodrigo pinho 67": { img: "https://i.ibb.co/ynC3qk1f/RODRIGO-PINHO67.png", pos: "pl" },
  "toti gomes 67": { img: "https://i.ibb.co/hR5zvkRR/totigomes67.png", pos: "dc" },
  "marcos leonardo 66": { img: "https://i.ibb.co/FLpqKXVD/marcosleonardo66.png", pos: "pl" },
  "nathan silva 66": { img: "https://i.ibb.co/V0BFyhKk/nathansilva66.png", pos: "dc" },
  "carlinhos 65": { img: "https://i.ibb.co/HLb7ZCw4/carlinhos65.png", pos: "ee" },
  "gonçalo sá 65": { img: "https://i.ibb.co/15xrqCq/goncalosa65.png", pos: "mo" },
  "joaquin lavega 64": { img: "https://i.ibb.co/cSpm4G86/joaquinlavega64.png", pos: "ee" },
  "nico schlotterbeck 64": { img: "https://i.ibb.co/rGz7JbhZ/NICO-SCHLOTTERBECK64.png", pos: "dc" },
  "andré almeida 63": { img: "https://i.ibb.co/MDNsBFSz/andrealmeida63.png", pos: "mo" },
  "de la cruz 63": { img: "https://i.ibb.co/S4y4fG3k/delacruz63.png", pos: "mo" },
  "caça rato 62": { img: "https://i.ibb.co/GQW9wXGb/cacarato62.png", pos: "pl" },
  "tiquinho soares 62": { img: "https://i.ibb.co/bRXv4xYB/tiquinhosoares62.png", pos: "pl" },
  "luan silva 61": { img: "https://i.ibb.co/5NgjYtt/luansilva61.png", pos: "pl" },
  "mikael 61": { img: "https://i.ibb.co/4RyT75Rb/mikael61.png", pos: "pl" },
  "charles 60": { img: "https://i.ibb.co/q3z1R6pd/charles60.png", pos: "gr" },
  "chrystian barletta 60": { img: "https://i.ibb.co/fYdw1Wgr/CHRYSTIANBARLETTA60.png", pos: "ee" }
};

// CACHE EM MEMÓRIA DE IMAGENS
const imageCache = new Map();

// FUNÇÃO PARA CARREGAR IMAGENS COM TIMEOUT E CACHE
async function carregarImagemComTimeout(url, timeoutMs = 4000) {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const img = await loadImage(url, { signal: controller.signal });
    imageCache.set(url, img);
    return img;
  } finally {
    clearTimeout(timer);
  }
}

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

function encontrarChaveJogador(termoBusca) {
  const buscaLimpa = removerAcentos(termoBusca);
  if (!buscaLimpa) return null;

  const chaves = Object.keys(BANCO_DE_CARTAS);

  let achado = chaves.find(chave => removerAcentos(chave) === buscaLimpa);
  if (achado) return achado;

  const buscaSemNumero = buscaLimpa.replace(/\s+\d+$/, '').trim();

  achado = chaves.find(chave => {
    const nomeBancoLimpo = removerAcentos(chave);
    const nomeBancoSemNumero = nomeBancoLimpo.replace(/\s+\d+$/, '').trim();
    return nomeBancoSemNumero === buscaSemNumero;
  });
  if (achado) return achado;

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

    // Carregar imagem de fundo com fallback em caso de erro/timeout
    try {
      const bgImg = await carregarImagemComTimeout(URL_FUNDO);
      ctx.drawImage(bgImg, 0, 0, width, height);
    } catch (bgErr) {
      console.error("Erro/Timeout ao carregar fundo:", bgErr.message);
      ctx.fillStyle = '#12141d';
      ctx.fillRect(0, 0, width, height);
    }

// Tamanho levemente maior e proporcional
    const cardWidth = 120;
    const cardHeight = 165;

    // Coordenadas ajustadas com MC no centro perfeito (400, 400)
const POSICOES = {
      gr:  { x: 400, y: 705 },
      le:  { x: 100, y: 580 }, // Desceu para ficar ligeiramente abaixo dos DCs (y: 580)
      dc1: { x: 270, y: 565 },
      dc2: { x: 530, y: 565 },
      ld:  { x: 700, y: 580 }, // Desceu para ficar ligeiramente abaixo dos DCs (y: 580)
      mc:  { x: 400, y: 395 }, // Ajustado para dar espaço perfeito aos MOs acima
      mo1: { x: 220, y: 280 }, // Desceu para y: 280 (espaço total de sobra do EE)
      mo2: { x: 580, y: 280 }, // Desceu para y: 280 (espaço total de sobra do ED)
      ee:  { x: 110, y: 100 },
      pl:  { x: 400, y: 85 },
      ed:  { x: 690, y: 100 }
    };

    // Montar tarefas de renderização em paralelo
    const tarefasRender = Object.entries(POSICOES).map(async ([pos, coord]) => {
      const termo = req.query[pos];

      if (termo && termo !== 'vazio') {
        const chaveEncontrada = encontrarChaveJogador(termo);

        if (chaveEncontrada && BANCO_DE_CARTAS[chaveEncontrada]) {
          try {
            const cardImg = await carregarImagemComTimeout(BANCO_DE_CARTAS[chaveEncontrada].img);
            ctx.drawImage(
              cardImg, 
              coord.x - cardWidth / 2, 
              coord.y - cardHeight / 2, 
              cardWidth, 
              cardHeight
            );
          } catch (err) {
            console.error(`Erro/Timeout ao carregar imagem para ${termo}:`, err.message);
          }
        }
      }
    });

    await Promise.all(tarefasRender);

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

// ROTA DE STATUS DA RAM
app.get('/status', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const usedMemBytes = totalMemBytes - freeMemBytes;

    const totalRAM = (totalMemBytes / (1024 * 1024)).toFixed(0);
    const usedRAM = (usedMemBytes / (1024 * 1024)).toFixed(0);
    const freeRAM = (freeMemBytes / (1024 * 1024)).toFixed(0);
    const usagePercent = ((usedMemBytes / totalMemBytes) * 100).toFixed(1);

    return res.status(200).json({
      sucesso: true,
      ram_total: `${totalRAM} MB`,
      ram_usada: `${usedRAM} MB`,
      ram_livre: `${freeRAM} MB`,
      uso_porcentagem: `${usagePercent}%`
    });
  } catch (error) {
    return res.status(200).json({ sucesso: false, erro: "erro_interno" });
  }
});


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
