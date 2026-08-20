const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pastas de recursos estáticos
const PASTAS_CARTAS = path.join(__dirname, 'cartas');
const PASTAS_CAMPOS = path.join(__dirname, 'campos');

app.use('/cartas', express.static(PASTAS_CARTAS));
app.use('/campos', express.static(PASTAS_CAMPOS));

// Mapeamento das imagens de fundo na pasta 'campos'
const MAPA_CAMPOS = {
  "padrao": "campopadrao.png",
  "dia": "camporealista.png",
  "realista": "camporealista.png",
  "noite": "camporealistanoturno.png",
  "noturno": "camporealistanoturno.png",
  "galaxia": "campogalaxia.png",
  "neon": "camponeon.png",
  "alien": "campoalienmistico.png",
  "sistemasolar": "camposistemasolar.png",
  "dourado": "campodourado.png",
  "halloween": "campohalloween.png",
  "anime": "campoanime.png",
  "rua": "camporua.png",
  "lava": "campolava.png",
  "retro": "camporetro.png",
  "matrix": "campomatrix.png",
  "champions": "campochampions.png",
  "inverno": "campoinverno.png",
  "praia": "campopraia.png",
  "vangogh": "campovangogh.png",
  "deserto": "campodeserto.png",
  "portugal": "campoportugal.png",
  "brasil": "campobrasil.png",
  "argentina": "campargentina.png"
};

// BANCO DE CARTAS
const BANCO_DE_CARTAS = {
  "karim benzema 87": { img: "benzema87.png", pos: "pl" },
  "kevin de bruyne 87": { img: "kevindebruyne87.png", pos: "mc" },
  "mbappé 87": { img: "mbappe87.png", pos: "pl" },
  "lionel messi 87": { img: "messi87.png", pos: "ed" },
  "cristiano ronaldo 87": { img: "cristianoRonaldo87.png", pos: "pl" },
  "nuno mendes 87": { img: "nunomendes87.png", pos: "le" },
  "trent alexander-arnold 87": { img: "TRENT ALEXANDER-ARNOLD87.png", pos: "ld" },
  "alessandro bastoni 86": { img: "ALESSANDRO BASTONI86.png", pos: "dc" },
  "bukayo saka 86": { img: "bukayosaka86.png", pos: "ed" },
  "cole palmer 86": { img: "colepalmer.png", pos: "mo" },
  "dani carvajal 86": { img: "carjaval86.png", pos: "ld" },
  "declan rice 86": { img: "declanrice86.png", pos: "mo" },
  "diogo costa 86": { img: "diogocosta86.png", pos: "gr" },
  "federico dimarco 86": { img: "federicoDinarco86.png", pos: "le" },
  "antoine griezmann 86": { img: "GRIEZMANN86.png", pos: "pl" },
  "achraf hakimi 86": { img: "hakimi86.png", pos: "ld" },
  "heung min son 86": { img: "HEUNG MIN SON86.png", pos: "ee" },
  "joshua kimmich 86": { img: "JOSHUA KIMMICH86.png", pos: "mc" },
  "kvaratskhelia 86": { img: "KVARATSKHELIA86.png", pos: "ee" },
  "robert lewandowski 86": { img: "Lewandowski86.png", pos: "pl" },
  "neymar jr. 86": { img: "neymar86.png", pos: "mo" },
  "pedri 86": { img: "pedri86.png", pos: "mc" },
  "federico valverde 86": { img: "valverde86.png", pos: "mc" },
  "vinicius júnior 86": { img: "vinijr86.png", pos: "ee" },
  "william saliba 86": { img: "williamsaliba86.png", pos: "dc" },
  "lamine yamal 86": { img: "yamal86.png", pos: "ed" },
  "alexander isak 85": { img: "alexanderisak85.png", pos: "pl" },
  "courtois 85": { img: "COURTOIS85.png", pos: "gr" },
  "gabriel magalhães 85": { img: "GABRIELmAGALHÃES85.png", pos: "pl" },
  "jan oblak 85": { img: "janoblak85.png", pos: "gr" },
  "jamal musiala 85": { img: "musiala85.png", pos: "mo" },
  "pavlidis 85": { img: "pavlidis85.png", pos: "pl" },
  "rafa silva 85": { img: "rafasilva85.png", pos: "pl" },
  "raphinha 85": { img: "raphinha85.png", pos: "pl" },
  "luka modric 84": { img: "modric84.png", pos: "mc" },
  "rúben dias 84": { img: "rubendias84.png", pos: "dc" },
  "mohamed salah 84": { img: "salah84.png", pos: "pl" },
  "vitinha 84": { img: "vitinha84.png", pos: "mc" },
  "álex baena 83": { img: "ÁLEX BAENA83.png", pos: "mc" },
  "nico williams 83": { img: "nicowilliams83.png", pos: "ee" },
  "rodri 83": { img: "rodri83.png", pos: "mc" },
  "samu omorodion 83": { img: "SAMU OMORODION83.png", pos: "pl" },
  "bellingham 82": { img: "bellingham82.png", pos: "mo" },
  "giorgi mamardashvili 82": { img: "GIORGI MAMARDASHVILI82.png", pos: "gr" },
  "kobbie mainoo 82": { img: "KOBBIE MAINOO82.png", pos: "mc" },
  "marquinhos 82": { img: "marquinhos82.png", pos: "dc" },
  "martinez 82": { img: "martinez82.png", pos: "gr" },
  "morten hjulmand 82": { img: "MORTEN HJULMAND82.png", pos: "mc" },
  "guglielmo vicario 81": { img: "GUGLIELMO VICARIO81.png", pos: "gr" },
  "erling haaland 81": { img: "haaland81.png", pos: "pl" },
  "benjamin sesko 80": { img: "BENJAMIN ŠEŠKO80.png", pos: "pl" },
  "joshua zirkzee 80": { img: "JOSHUA ZIRKZEE80.png", pos: "pl" },
  "pepe 80": { img: "pepe80.png", pos: "dc" },
  "savinho 80": { img: "SAVINHO80.png", pos: "le" },
  "yangel herrera 80": { img: "YANGEL HERRERA80.png", pos: "mc" },
  "alisson 79": { img: "alisson79.png", pos: "gr" },
  "cucurella 79": { img: "cucurella79.png", pos: "le" },
  "prestianni 79": { img: "PRESTIANNI79.png", pos: "pl" },
  "diogo costa 79": { img: "diogocosta79.png", pos: "gr" },
  "harry kane 79": { img: "harrykane79.png", pos: "pl" },
  "richard ríos 79": { img: "richardrios79.png", pos: "mc" },
  "bruno fernandes 78": { img: "brunofernandes78.png", pos: "mo" },
  "joão cancelo 78": { img: "joaocancelo78.png", pos: "ld" },
  "joão neves 77": { img: "joaoneves77.png", pos: "mc" },
  "otamendi 77": { img: "otamendi77.png", pos: "dc" },
  "pedro porro 77": { img: "pedroporro77.png", pos: "ld" },
  "rafael leão 77": { img: "rafaleao77.png", pos: "ee" },
  "orkun kokçu 76": { img: "kokcu76.png", pos: "mc" },
  "alexander bah 75": { img: "bah75.png", pos: "ld" },
  "ben chilwell 75": { img: "BEN-CHILWELL75.png", pos: "le" },
  "alejandro garnacho 75": { img: "garnacho75.png", pos: "ee" },
  "gonçalo ramos 75": { img: "goncaloramos75.png", pos: "pl" },
  "gyokeres 75": { img: "gyokeres75.png", pos: "pl" },
  "harry amass 75": { img: "harryamass.png", pos: "le" },
  "hugo souza 75": { img: "hugosouza75.png", pos: "gr" },
  "kenan yildiz 75": { img: "kenanyildiz75.png", pos: "ee" },
  "leny yoro 75": { img: "LENYYORO75.png", pos: "dc" },
  "lorenzo pirola 75": { img: "LORENZO-PIROLA75.png", pos: "le" },
  "malo gusto 75": { img: "malo gusto75.png", pos: "ld" },
  "milos kerkez 75": { img: "MILOS KERKEZ75.png", pos: "le" },
  "rodrigo garro 75": { img: "rodrigogarro75.png", pos: "mo" },
  "sudakov 75": { img: "sudakov75.png", pos: "mo" },
  "tomás araújo 75": { img: "tomasaraujo75.png", pos: "dc" },
  "vitor roque 75": { img: "vitorroque75.png", pos: "pl" },
  "wilfried singo 75": { img: "WILFRIED-SINGO75.png", pos: "ld" },
  "endrick 74": { img: "endrick74.png", pos: "pl" },
  "ricardo mangas 74": { img: "ricardomangas74.png", pos: "ed" },
  "estevão 74": { img: "estevao74.png", pos: "le" },
  "joão mário 74": { img: "joaomario74.png", pos: "ld" },
  "nuno tavares 74": { img: "nunotavares74.png", pos: "le" },
  "josé sá 73": { img: "joseja73.png", pos: "gr" },
  "vozinha 73": { img: "vozinha73.png", pos: "gr" },
  "raphael veiga 72": { img: "RAPHAEL VEIGA72.png", pos: "mo" },
  "trubin 72": { img: "trubin72.png", pos: "gr" },
  "pavlidis 71": { img: "pavlidis71.png", pos: "pl" },
  "trincão 71": { img: "trincao71.png", pos: "mo" },
  "igor jesus 70": { img: "igorjesus70.png", pos: "pl" },
  "yuri alberto 70": { img: "yurialberto70.png", pos: "pl" },
  "martim martins 69": { img: "martimmartins69.png", pos: "mc" },
  "tomás ribeiro 69": { img: "tomasribeiro69.png", pos: "dc" },
  "fábio vieira 68": { img: "fabiovieira68.png", pos: "mo" },
  "matheusinho 68": { img: "MATHEUSINHO68.png", pos: "mo" },
  "rodrigo pinho 67": { img: "RODRIGO PINHO67.png", pos: "pl" },
  "toti gomes 67": { img: "totigomes67.png", pos: "dc" },
  "marcos leonardo 66": { img: "marcosleonardo66.png", pos: "pl" },
  "nathan silva 66": { img: "nathansilva66.png", pos: "dc" },
  "carlinhos 65": { img: "carlinhos65.png", pos: "ee" },
  "gonçalo sá 65": { img: "goncalosa65.png", pos: "mo" },
  "joaquin lavega 64": { img: "joaquinlavega64.png", pos: "ee" },
  "nico schlotterbeck 64": { img: "NICO SCHLOTTERBECK64.png", pos: "dc" },
  "andré almeida 63": { img: "andrealmeida63.png", pos: "mo" },
  "de la cruz 63": { img: "delacruz63.png", pos: "mo" },
  "caça rato 62": { img: "cacarato62.png", pos: "pl" },
  "tiquinho soares 62": { img: "tiquinhosoares62.png", pos: "pl" },
  "luan silva 61": { img: "luansilva61.png", pos: "pl" },
  "mikael 61": { img: "mikael61.png", pos: "pl" },
  "charles 60": { img: "charles60.png", pos: "gr" },
  "chrystian barletta 60": { img: "CHRYSTIANBARLETTA60.png", pos: "ee" }
};

const imageCache = new Map();
const cardBufferCache = new Map();
const buscaIndexMap = new Map();
let jogadoresPreProcessados = [];
let pesoTotalSorteio = 0;

function removerAcentos(texto) {
  if (!texto) return "";
  try { texto = decodeURIComponent(texto); } catch (e) {}
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function obterImagemOuCarregar(caminhoOuFicheiro, pastaPadrao = PASTAS_CARTAS) {
  if (imageCache.has(caminhoOuFicheiro)) {
    return imageCache.get(caminhoOuFicheiro);
  }

  try {
    let caminhoAbsoluto = caminhoOuFicheiro;
    if (!path.isAbsolute(caminhoOuFicheiro)) {
      caminhoAbsoluto = path.join(pastaPadrao, caminhoOuFicheiro);
    }

    if (!fs.existsSync(caminhoAbsoluto)) {
      console.error(`❌ Ficheiro não existe no disco: ${caminhoAbsoluto}`);
      return null;
    }

    const img = await loadImage(caminhoAbsoluto);
    imageCache.set(caminhoOuFicheiro, img);
    return img;
  } catch (e) {
    console.error(`❌ Erro ao carregar imagem local (${e.message}): ${caminhoOuFicheiro}`);
    return null;
  }
}

function inicializarMetadados() {
  jogadoresPreProcessados = [];
  buscaIndexMap.clear();

  for (const [chave, dados] of Object.entries(BANCO_DE_CARTAS)) {
    const partes = chave.split(' ');
    const overall = parseInt(partes[partes.length - 1]) || 60;
    const nomeSemOverall = partes.slice(0, -1).join(' ');
    const nomeFormatado = nomeSemOverall
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    let preco = 1000;
    if (overall >= 95) {
      preco = 16000 + (overall - 90) * 4000; 
    } else if (overall >= 90) {
      preco = 20000 + (overall - 90) * 5000; 
    } else if (overall >= 80) {
      preco = 3500 + (overall - 80) * 1200; 
    } else {
      preco = 300 + (overall - 60) * 150; 
    }

    let peso = 100;
    if (overall >= 90) peso = 1;
    else if (overall >= 88) peso = 3;
    else if (overall >= 85) peso = 8;
    else if (overall >= 80) peso = 25;
    else if (overall >= 75) peso = 60;

    const objetoJogador = {
      chave,
      nomeFormatado,
      overall,
      posicao: dados.pos,
      posicaoUpper: dados.pos ? dados.pos.toUpperCase() : "??",
      preco,
      peso,
      imgOriginal: dados.img
    };

    jogadoresPreProcessados.push(objetoJogador);

    const chaveLimpa = removerAcentos(chave);
    const nomeSemNumeroLimpo = removerAcentos(nomeSemOverall);

    buscaIndexMap.set(chaveLimpa, chave);
    if (!buscaIndexMap.has(nomeSemNumeroLimpo)) {
      buscaIndexMap.set(nomeSemNumeroLimpo, chave);
    }
  }

  pesoTotalSorteio = jogadoresPreProcessados.reduce((acc, j) => acc + j.peso, 0);
}

function encontrarChaveJogador(termoBusca) {
  const buscaLimpa = removerAcentos(termoBusca);
  if (!buscaLimpa) return null;

  if (buscaIndexMap.has(buscaLimpa)) return buscaIndexMap.get(buscaLimpa);

  const buscaSemNumero = buscaLimpa.replace(/\s+\d+$/, '').trim();
  if (buscaIndexMap.has(buscaSemNumero)) return buscaIndexMap.get(buscaSemNumero);

  for (const [termoIndex, chaveReal] of buscaIndexMap.entries()) {
    if (termoIndex.includes(buscaSemNumero) || buscaSemNumero.includes(termoIndex)) {
      return chaveReal;
    }
  }
  return null;
}

// -------------------------------------------------------------
// ROTAS DA API
// -------------------------------------------------------------

// ROTA NOVO MERCADO EM IMAGEM
app.get('/gerar-mercado', async (req, res) => {
  try {
    const faixa = req.query.faixa || '8084';
    let min = 0, max = 99;
    if (faixa === '9999') { min = 99; max = 99; }
    else if (faixa === '9598') { min = 95; max = 98; }
    else if (faixa === '9094') { min = 90; max = 94; }
    else if (faixa === '8589') { min = 85; max = 89; }
    else if (faixa === '8084') { min = 80; max = 84; }
    else if (faixa === '7579') { min = 75; max = 79; }
    else if (faixa === '7074') { min = 70; max = 74; }
    else if (faixa === '6569') { min = 65; max = 69; }
    else if (faixa === '6064') { min = 60; max = 64; }

    const filtrados = jogadoresPreProcessados
      .filter(j => j.overall >= min && j.overall <= max)
      .sort((a, b) => b.overall - a.overall);

    if (filtrados.length === 0) {
      return res.status(404).send('Nenhum jogador nesta faixa.');
    }

    const colunas = 4;
    const cardWidth = 140;
    const cardHeight = 195;
    const paddingX = 20;
    const paddingY = 35;
    const headerHeight = 70;

    const totalLinhas = Math.ceil(filtrados.length / colunas);
    const canvasWidth = (cardWidth * colunas) + (paddingX * (colunas + 1));
    const canvasHeight = headerHeight + (cardHeight * totalLinhas) + (paddingY * (totalLinhas + 1));

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Fundo Gradiente Escuro Pro
    const gradiente = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradiente.addColorStop(0, '#0f1118');
    gradiente.addColorStop(1, '#161925');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Título Superior
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Sans-Serif';
    ctx.textAlign = 'center';
    ctx.fillText(`MERCADO DE TRANSFERÊNCIAS (${min} - ${max})`, canvasWidth / 2, 45);

    // Renderizar Grade de Cartas
    for (let i = 0; i < filtrados.length; i++) {
      const j = filtrados[i];
      const col = i % colunas;
      const row = Math.floor(i / colunas);

      const x = paddingX + col * (cardWidth + paddingX);
      const y = headerHeight + paddingY + row * (cardHeight + paddingY);

      const cardImg = await obterImagemOuCarregar(j.imgOriginal, PASTAS_CARTAS);

      if (cardImg) {
        ctx.drawImage(cardImg, x, y, cardWidth, cardHeight);
      } else {
        ctx.fillStyle = '#222736';
        ctx.fillRect(x, y, cardWidth, cardHeight);
      }

      // Caixinha com Preço
      const priceBoxY = y + cardHeight + 5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(x, priceBoxY, cardWidth, 22);

      ctx.fillStyle = '#ffcc00';
      ctx.font = 'bold 12px Sans-Serif';
      ctx.textAlign = 'center';
      ctx.fillText(`💰 $${j.preco.toLocaleString('pt-PT')}`, x + (cardWidth / 2), priceBoxY + 15);
    }

    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(buffer);

  } catch (error) {
    console.error("Erro ao gerar imagem do mercado:", error);
    res.status(500).send('Erro interno.');
  }
});

app.get('/gerar-campo', async (req, res) => {
  try {
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const tipoFundo = (req.query.bg || req.query.fundo || 'padrao').toLowerCase().trim();
    const nomeFicheiroFundo = MAPA_CAMPOS[tipoFundo] || MAPA_CAMPOS["padrao"];
    
    const bgImg = await obterImagemOuCarregar(nomeFicheiroFundo, PASTAS_CAMPOS);
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#12141d';
      ctx.fillRect(0, 0, width, height);
    }

    const cardWidth = 120;
    const cardHeight = 165;

    const POSICOES = {
      gr:  { x: 400, y: 705 },
      le:  { x: 100, y: 580 },
      dc1: { x: 270, y: 565 },
      dc2: { x: 530, y: 565 },
      ld:  { x: 700, y: 580 },
      mc:  { x: 400, y: 395 },
      mo1: { x: 220, y: 280 },
      mo2: { x: 580, y: 280 },
      ee:  { x: 110, y: 100 },
      pl:  { x: 400, y: 95 },
      ed:  { x: 690, y: 100 }
    };

    const promessas = [];
    for (const [pos, coord] of Object.entries(POSICOES)) {
      const termo = req.query[pos];
      if (termo && termo !== 'vazio') {
        const chaveEncontrada = encontrarChaveJogador(termo);
        if (chaveEncontrada && BANCO_DE_CARTAS[chaveEncontrada]) {
          const nomeFicheiroCarta = BANCO_DE_CARTAS[chaveEncontrada].img;
          promessas.push(
            obterImagemOuCarregar(nomeFicheiroCarta, PASTAS_CARTAS).then(cardImg => ({ cardImg, coord }))
          );
        }
      }
    }

    const resultados = await Promise.all(promessas);
    for (const { cardImg, coord } of resultados) {
      if (cardImg) {
        ctx.drawImage(cardImg, coord.x - cardWidth / 2, coord.y - cardHeight / 2, cardWidth, cardHeight);
      }
    }

    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar campo:", error);
    res.status(500).send('Erro ao gerar imagem.');
  }
});

app.get('/render-carta', async (req, res) => {
  try {
    const termo = req.query.q || "";
    const chaveEncontrada = encontrarChaveJogador(termo);

    if (!chaveEncontrada || !BANCO_DE_CARTAS[chaveEncontrada]) {
      return res.status(404).send('Carta não encontrada');
    }

    if (cardBufferCache.has(chaveEncontrada)) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cardBufferCache.get(chaveEncontrada));
    }

    const nomeFicheiro = BANCO_DE_CARTAS[chaveEncontrada].img;
    const img = await obterImagemOuCarregar(nomeFicheiro, PASTAS_CARTAS);

    if (!img) {
      return res.status(500).send('Erro ao carregar imagem local');
    }

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const buffer = canvas.toBuffer('image/png');
    cardBufferCache.set(chaveEncontrada, buffer);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);

  } catch (error) {
    console.error("Erro no /render-carta:", error);
    res.status(500).send('Erro ao renderizar carta');
  }
});

app.get('/buscar-jogador', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const queryBruta = req.query.q || "";
    const chaveEncontrada = encontrarChaveJogador(queryBruta);

    const host = req.get('host');
    const protocol = req.protocol;

    if (!chaveEncontrada) {
      return res.status(200).json({ 
        sucesso: false, 
        erro: "nao_encontrado",
        imagem: `${protocol}://${host}/cartas/desconhecido.png`,
        posicao: "desconhecida",
        overall: 60 
      });
    }

    const jogador = jogadoresPreProcessados.find(j => j.chave === chaveEncontrada);
    const urlRenderAPI = `${protocol}://${host}/render-carta?q=${encodeURIComponent(chaveEncontrada)}`;
    const urlImagemDirectaLocal = `${protocol}://${host}/cartas/${encodeURIComponent(jogador.imgOriginal)}`;

    return res.status(200).json({
      sucesso: true,
      nome: jogador.chave,
      overall: jogador.overall,
      imagem: urlRenderAPI,
      imagemOriginal: urlImagemDirectaLocal,
      posicao: jogador.posicao,
      preco: jogador.preco
    });
  } catch (error) {
    return res.status(200).json({ sucesso: false, erro: "erro_interno" });
  }
});

app.get('/obter-aleatorio', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    let numeroSorteado = Math.random() * pesoTotalSorteio;
    let cartaSorteada = jogadoresPreProcessados[0];

    for (const jogador of jogadoresPreProcessados) {
      if (numeroSorteado < jogador.peso) {
        cartaSorteada = jogador;
        break;
      }
      numeroSorteado -= jogador.peso;
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const urlRenderAPI = `${protocol}://${host}/render-carta?q=${encodeURIComponent(cartaSorteada.chave)}`;
    const urlImagemDirectaLocal = `${protocol}://${host}/cartas/${encodeURIComponent(cartaSorteada.imgOriginal)}`;

    return res.status(200).json({
      sucesso: true,
      nome: cartaSorteada.chave,
      overall: cartaSorteada.overall,
      imagem: urlRenderAPI,
      imagemOriginal: urlImagemDirectaLocal,
      posicao: cartaSorteada.posicao
    });
  } catch (error) {
    return res.status(200).json({ sucesso: false, erro: "erro_interno" });
  }
});

// Inicialização
inicializarMetadados();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
