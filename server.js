const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir a pasta 'cartas' estaticamente caso precises de aceder via URL (ex: http://localhost:3000/cartas/nome.png)
const PASTAS_CARTAS = path.join(__dirname, 'cartas');
app.use('/cartas', express.static(PASTAS_CARTAS));

// Imagem de fundo local (coloca 'time.png' na raiz ou dentro da pasta cartas)
// Se o fundo também estiver dentro de 'cartas', podes mudar para path.join(PASTAS_CARTAS, 'time.png')
const CAMINHO_FUNDO = fs.existsSync(path.join(__dirname, 'time.png'))
  ? path.join(__dirname, 'time.png')
  : path.join(PASTAS_CARTAS, 'time.png');

// Mapeamento apontando diretamente para os ficheiros locais na pasta 'cartas'
const BANCO_DE_CARTAS = {
  "karim benzema 87": { img: "benzema87.png", pos: "pl" },
  "kevin de bruyne 87": { img: "kevindebruyne87.png", pos: "mc" },
  "mbappé 87": { img: "mbappe87.png", pos: "pl" },
  "lionel messi 87": { img: "messi87.png", pos: "ed" },
  "cristiano ronaldo 87": { img: "ronaldo87.png", pos: "pl" },
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
  "e. haaland 81": { img: "haaland81.png", pos: "pl" },
  "benjamin šeško 80": { img: "BENJAMIN ŠEŠKO80.png", pos: "pl" },
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
  "rafael leão 77": { img: "rafaelleao77.png", pos: "ee" },
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

// Função otimizada para carregar imagens diretamente do disco
async function obterImagemOuCarregar(nomeFicheiroOuCaminho) {
  if (imageCache.has(nomeFicheiroOuCaminho)) {
    return imageCache.get(nomeFicheiroOuCaminho);
  }

  try {
    let caminhoAbsoluto = nomeFicheiroOuCaminho;
    
    // Se não for um caminho absoluto completo, assume que está dentro de 'cartas'
    if (!path.isAbsolute(nomeFicheiroOuCaminho)) {
      caminhoAbsoluto = path.join(PASTAS_CARTAS, nomeFicheiroOuCaminho);
    }

    if (!fs.existsSync(caminhoAbsoluto)) {
      console.error(`❌ Ficheiro não existe no disco: ${caminhoAbsoluto}`);
      return null;
    }

    const img = await loadImage(caminhoAbsoluto);
    imageCache.set(nomeFicheiroOuCaminho, img);
    return img;
  } catch (e) {
    console.error(`❌ Erro ao carregar imagem local (${e.message}): ${nomeFicheiroOuCaminho}`);
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
    if (overall >= 90) preco = 16000 + (overall - 90) * 4000;
    else if (overall >= 80) preco = 2500 + (overall - 80) * 1000;
    else preco = 150 + (overall - 60) * 100;

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

app.get('/gerar-campo', async (req, res) => {
  try {
    const width = 800;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const bgImg = await obterImagemOuCarregar(CAMINHO_FUNDO);
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
            obterImagemOuCarregar(nomeFicheiroCarta).then(cardImg => ({ cardImg, coord }))
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
    const img = await obterImagemOuCarregar(nomeFicheiro);

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

app.get('/listar-mercado', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const faixa = req.query.faixa;
    const totalGeral = jogadoresPreProcessados.length;

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
      return res.status(200).json({
        total: totalGeral,
        texto: "*(Ainda não há jogadores disponíveis nesta faixa.)*"
      });
    }

    let linhas = [];
    for (let i = 0; i < filtrados.length; i += 2) {
      const j1 = filtrados[i];
      const j2 = filtrados[i + 1];

      const nome1 = j1.nomeFormatado.length > 13 ? j1.nomeFormatado.slice(0, 11) + ".." : j1.nomeFormatado;
      const item1 = `[${j1.overall} ${j1.posicaoUpper}] ${nome1}`;
      const col1 = item1.padEnd(24, ' ');

      if (j2) {
        const nome2 = j2.nomeFormatado.length > 13 ? j2.nomeFormatado.slice(0, 11) + ".." : j2.nomeFormatado;
        const col2 = `[${j2.overall} ${j2.posicaoUpper}] ${nome2}`;
        linhas.push(`${col1}${col2}`);
      } else {
        linhas.push(col1);
      }
    }

    return res.status(200).json({
      total: totalGeral,
      texto: "```ansi\n" + linhas.join('\n') + "\n```"
    });
  } catch (error) {
    return res.status(200).json({ total: 0, texto: "Erro ao carregar a lista de jogadores." });
  }
});

// Prepara os índices e metadados
inicializarMetadados();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando localmente na porta ${PORT}`);
  // Pré-carrega a imagem de fundo na memória ao iniciar
  obterImagemOuCarregar(CAMINHO_FUNDO);
});
