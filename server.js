const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================
// CONFIG
// =============================================================

const LIGA_WEBHOOK_URL = process.env.LIGA_WEBHOOK_URL || "";
const LIGA_API_KEY = process.env.LIGA_API_KEY || "";

// Todas as partidas ativas ficam aqui.
// gameID -> dados da partida
const partidasLiga = new Map();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// =============================================================
// PASTAS
// =============================================================

const PASTAS_CARTAS = path.join(__dirname, 'cartas');
const PASTAS_CAMPOS = path.join(__dirname, 'campos');

app.use('/cartas', express.static(PASTAS_CARTAS, {
  maxAge: '1d'
}));

app.use('/campos', express.static(PASTAS_CAMPOS, {
  maxAge: '1d'
}));

// =============================================================
// CAMPOS
// =============================================================

const MAPA_CAMPOS = {
  padrao: "campopadrao.png",
  dia: "camporealista.png",
  realista: "camporealista.png",
  noite: "camporealistanoturno.png",
  noturno: "camporealistanoturno.png",
  galaxia: "campogalaxia.png",
  neon: "camponeon.png",
  alien: "campoalienmistico.png",
  sistemasolar: "camposistemasolar.png",
  dourado: "campodourado.png",
  halloween: "campohalloween.png",
  anime: "campoanime.png",
  rua: "camporua.png",
  lava: "campolava.png",
  retro: "camporetro.png",
  matrix: "campomatrix.png",
  champions: "campochampions.png",
  inverno: "campoinverno.png",
  praia: "campopraia.png",
  vangogh: "campovangogh.png",
  deserto: "campodeserto.png",
  portugal: "campoportugal.png",
  brasil: "campobrasil.png",
  argentina: "campargentina.png"
};

// =============================================================
// BANCO DE CARTAS
// =============================================================

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

// =============================================================
// CACHE
// =============================================================

const imageCache = new Map();
const cardBufferCache = new Map();
const buscaIndexMap = new Map();

let jogadoresPreProcessados = [];
let pesoTotalSorteio = 0;

// =============================================================
// HELPERS
// =============================================================

function removerAcentos(texto) {
  if (!texto) return "";

  try {
    texto = decodeURIComponent(texto);
  } catch {}

  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function obterImagemOuCarregar(
  caminhoOuFicheiro,
  pastaPadrao = PASTAS_CARTAS
) {
  if (imageCache.has(caminhoOuFicheiro)) {
    return imageCache.get(caminhoOuFicheiro);
  }

  try {
    let caminhoAbsoluto = caminhoOuFicheiro;

    if (!path.isAbsolute(caminhoOuFicheiro)) {
      caminhoAbsoluto = path.join(
        pastaPadrao,
        caminhoOuFicheiro
      );
    }

    if (!fs.existsSync(caminhoAbsoluto)) {
      console.error(
        `❌ Ficheiro não existe: ${caminhoAbsoluto}`
      );
      return null;
    }

    const img = await loadImage(caminhoAbsoluto);

    imageCache.set(caminhoOuFicheiro, img);

    return img;

  } catch (error) {
    console.error(
      `❌ Erro imagem: ${caminhoOuFicheiro}`,
      error.message
    );

    return null;
  }
}

// =============================================================
// METADADOS
// =============================================================

function inicializarMetadados() {
  jogadoresPreProcessados = [];
  buscaIndexMap.clear();

  for (const [chave, dados] of Object.entries(BANCO_DE_CARTAS)) {

    const partes = chave.split(" ");

    const overall =
      parseInt(partes[partes.length - 1], 10) || 60;

    const nomeSemOverall =
      partes.slice(0, -1).join(" ");

    const nomeFormatado = nomeSemOverall
      .split(" ")
      .map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(" ");

    let preco;

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

    const jogador = {
      chave,
      nomeFormatado,
      overall,
      posicao: dados.pos,
      posicaoUpper: dados.pos
        ? dados.pos.toUpperCase()
        : "??",
      preco,
      peso,
      imgOriginal: dados.img
    };

    jogadoresPreProcessados.push(jogador);

    const chaveLimpa =
      removerAcentos(chave);

    const nomeLimpo =
      removerAcentos(nomeSemOverall);

    buscaIndexMap.set(
      chaveLimpa,
      chave
    );

    if (!buscaIndexMap.has(nomeLimpo)) {
      buscaIndexMap.set(
        nomeLimpo,
        chave
      );
    }
  }

  pesoTotalSorteio =
    jogadoresPreProcessados.reduce(
      (total, jogador) =>
        total + jogador.peso,
      0
    );
}

// =============================================================
// PESQUISA JOGADOR
// =============================================================

function encontrarChaveJogador(termoBusca) {

  const buscaLimpa =
    removerAcentos(termoBusca);

  if (!buscaLimpa) {
    return null;
  }

  if (buscaIndexMap.has(buscaLimpa)) {
    return buscaIndexMap.get(buscaLimpa);
  }

  const buscaSemNumero =
    buscaLimpa
      .replace(/\s+\d+$/, "")
      .trim();

  if (buscaIndexMap.has(buscaSemNumero)) {
    return buscaIndexMap.get(buscaSemNumero);
  }

  for (const [
    termoIndex,
    chaveReal
  ] of buscaIndexMap.entries()) {

    if (
      termoIndex.includes(buscaSemNumero) ||
      buscaSemNumero.includes(termoIndex)
    ) {
      return chaveReal;
    }
  }

  return null;
}

// =============================================================
// WEBHOOK
// =============================================================

function obterWebhookPartes(webhookUrl) {

  try {

    if (!webhookUrl) {
      throw new Error(
        "LIGA_WEBHOOK_URL vazia."
      );
    }

    const url = new URL(webhookUrl);

    const partes =
      url.pathname
        .split("/")
        .filter(Boolean);

    const indice =
      partes.indexOf("webhooks");

    if (indice === -1) {
      throw new Error(
        "URL de webhook inválida."
      );
    }

    const webhookID =
      partes[indice + 1];

    const webhookToken =
      partes[indice + 2];

    if (!webhookID || !webhookToken) {
      throw new Error(
        "ID/token do webhook não encontrados."
      );
    }

    return {
      webhookID,
      webhookToken
    };

  } catch (error) {

    console.error(
      "❌ Webhook inválido:",
      error.message
    );

    return null;
  }
}

// =============================================================
// DISCORD REQUEST
// =============================================================

async function discordWebhookRequest(
  method,
  url,
  body = null
) {

  const opcoes = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (body !== null) {
    opcoes.body =
      JSON.stringify(body);
  }

  const resposta =
    await fetch(url, opcoes);

  const texto =
    await resposta.text();

  let dados = null;

  try {
    dados =
      texto
        ? JSON.parse(texto)
        : null;
  } catch {
    dados = texto;
  }

  if (!resposta.ok) {

    throw new Error(
      `Discord ${resposta.status}: ${
        typeof dados === "string"
          ? dados
          : JSON.stringify(dados)
      }`
    );
  }

  return dados;
}

// =============================================================
// EMOJIS
// =============================================================

function limparEmojisBot(texto) {

  if (!texto) return "";

  let resultado =
    String(texto);

  const substituicoes = {

    /<:dentro:1528835700890538154>/g: "⚽",
    /<:fora:1528835701934653531>/g: "⚽",
    /<:placar:1528835698151522354>/g: "🏟️",
    /<:lances:1528835699225395272>/g: "📋",

    /<:moedas:1533225569414676490>/g: "🪙",
    /<:gemas:1533225568353386578>/g: "💎",

    /<:bronze:1533266991601815757>/g: "📦",
    /<:silver:1533266998643920926>/g: "📦",
    /<:gold:1533266993711550544>/g: "📦",
    /<:diamond:1533266992604119140>/g: "📦",
    /<:legend:1533266994952933447>/g: "📦",
    /<:secret:1533266997507264542>/g: "📦",

    /<:dentro:\d+>/g: "⚽",
    /<:fora:\d+>/g: "⚽",
    /<:placar:\d+>/g: "🏟️",
    /<:lances:\d+>/g: "📋",
    /<:moedas:\d+>/g: "🪙",
    /<:gemas:\d+>/g: "💎",

    /<:(bronze|silver|gold|diamond|legend|secret):\d+>/g: "📦",

    /<:es:\d+>/gi: "⚽",
    /<:trophy:\d+>/gi: "🏆",
    /<:taca:\d+>/gi: "🏆"
  };

  for (const [regex, substituicao] of Object.entries(substituicoes)) {
    resultado =
      resultado.replace(
        new RegExp(
          regex.source,
          regex.flags
        ),
        substituicao
      );
  }

  resultado =
    resultado.replace(
      /\$if\[.*?\]/g,
      ""
    );

  return resultado.trim();
}

// =============================================================
// EVENTOS
// =============================================================

function extrairEventosLiga(lances) {

  if (!lances || !String(lances).trim()) {
    return [];
  }

  const linhas =
    String(lances)
      .split(/\r?\n/)
      .map(linha => linha.trim())
      .filter(Boolean);

  const eventos = [];

  for (const linha of linhas) {

    const match =
      linha.match(/`(\d+)'`/);

    if (!match) continue;

    const minuto =
      Number(match[1]);

    if (!Number.isFinite(minuto)) {
      continue;
    }

    let equipa = "desconhecida";

    if (
      linha.includes("<:dentro:") ||
      linha.includes(":dentro:")
    ) {
      equipa = "casa";

    } else if (
      linha.includes("<:fora:") ||
      linha.includes(":fora:")
    ) {
      equipa = "fora";
    }

    eventos.push({
      minuto,
      equipa,
      texto: limparEmojisBot(linha)
    });
  }

  eventos.sort(
    (a, b) => a.minuto - b.minuto
  );

  return eventos;
}

// =============================================================
// PLACAR
// =============================================================

function obterPlacarAteMinuto(
  eventos,
  minuto,
  golsC,
  golsF
) {

  if (minuto >= 90) {
    return {
      casa: golsC,
      fora: golsF
    };
  }

  let casa = 0;
  let fora = 0;

  for (const evento of eventos) {

    if (evento.minuto > minuto) {
      continue;
    }

    if (evento.equipa === "casa") {
      casa++;
    }

    if (evento.equipa === "fora") {
      fora++;
    }
  }

  return {
    casa,
    fora
  };
}

// =============================================================
// LIMITADORES
// =============================================================

function limitarTexto(texto, limite) {

  if (
    texto === null ||
    texto === undefined
  ) {
    return "";
  }

  const valor =
    String(texto);

  if (valor.length <= limite) {
    return valor;
  }

  return (
    valor.slice(
      0,
      Math.max(0, limite - 3)
    ) + "..."
  );
}

function validarEmbed(embed) {

  embed.title =
    limitarTexto(
      embed.title,
      256
    );

  embed.description =
    limitarTexto(
      embed.description,
      4096
    );

  if (embed.footer) {
    embed.footer.text =
      limitarTexto(
        embed.footer.text,
        2048
      );
  }

  if (Array.isArray(embed.fields)) {

    embed.fields =
      embed.fields
        .slice(0, 25)
        .map(field => ({
          name: limitarTexto(
            field.name,
            256
          ),

          value: limitarTexto(
            field.value,
            1024
          ),

          inline:
            Boolean(field.inline)
        }));
  }

  return embed;
}

// =============================================================
// RESULTADO
// =============================================================

function limparResultado(
  campoResultado
) {

  if (!campoResultado) {
    return "";
  }

  let resultado =
    limparEmojisBot(
      campoResultado
    );

  resultado =
    resultado.replace(
      /^###\s*/gm,
      "**"
    );

  const linhas =
    resultado.split("\n");

  resultado =
    linhas
      .map(linha => {

        if (
          linha.startsWith("**") &&
          !linha.endsWith("**")
        ) {
          return linha + "**";
        }

        return linha;
      })
      .join("\n");

  return resultado.trim();
}

// =============================================================
// TEXTO DOS LANCES
// =============================================================

function criarTextoLances(
  eventos,
  minuto
) {

  const eventosAteAgora =
    eventos.filter(
      evento =>
        evento.minuto <= minuto
    );

  if (!eventosAteAgora.length) {

    if (minuto === 0) {
      return "⚽ A partida acabou de começar.\nNenhum golo ainda.";
    }

    if (minuto === 45) {
      return "⏸️ Nenhum golo na primeira parte.";
    }

    if (minuto >= 90) {
      return "🏁 A partida terminou sem golos.";
    }

    return "Nenhum golo até agora.\nO jogo continua equilibrado.";
  }

  return limitarTexto(
    eventosAteAgora
      .map(evento => evento.texto)
      .join("\n"),
    1024
  );
}

// =============================================================
// EMBED LIGA
// =============================================================

function criarEmbedLiga(
  dados,
  minuto
) {

  const {
    nomeClube,
    rivalNome,
    gerTime,
    gerBot,
    golsC,
    golsF,
    divisao,
    tempo,
    estadio,
    campoResultado,
    eventos
  } = dados;

  const placar =
    obterPlacarAteMinuto(
      eventos,
      minuto,
      golsC,
      golsF
    );

  let tituloTempo =
    `🕐 **${minuto}'**`;

  if (minuto === 0) {
    tituloTempo =
      "🟢 **0' — APITO INICIAL**";
  }

  if (minuto === 45) {
    tituloTempo =
      "⏸️ **45' — INTERVALO**";
  }

  if (minuto >= 90) {
    tituloTempo =
      "🏁 **90' — FIM DE JOGO**";
  }

  let resultadoTexto = "";

  if (minuto === 0) {

    resultadoTexto =
      "**⚽ A partida começou!**\nBoa sorte!";

  } else if (minuto === 45) {

    resultadoTexto =
      "**⏸️ Intervalo**\nAs equipas vão para o balneário.";

  } else if (minuto >= 90) {

    resultadoTexto =
      limparResultado(
        campoResultado
      ) ||
      "**🏁 Partida finalizada.**";

  } else {

    resultadoTexto =
      "**🔴 Partida em andamento**\nO resultado ainda pode mudar!";
  }

  let cor = 5793266;

  if (minuto >= 90) {

    if (golsC > golsF) {
      cor = 5763719;
    } else if (golsC < golsF) {
      cor = 15548997;
    } else {
      cor = 16705372;
    }
  }

  const embed = {

    title:
      `🏆 ES League — Divisão ${divisao}`,

    color: cor,

    description:
      `${tituloTempo}\n\n` +
      `🏟️ ⚽ **${nomeClube} ${placar.casa} x ${placar.fora} ${rivalNome}**\n\n` +
      `⚔️ **GER:** Seu Time (\`${gerTime}\`) vs Adversário (\`${gerBot}\`)\n\n` +
      `🌤️ **Clima:** \`${tempo}\`\n` +
      `🏟️ **Estádio:** \`${estadio}\``,

    fields: [
      {
        name: "📋 Lances da Partida",
        value:
          criarTextoLances(
            eventos,
            minuto
          ),
        inline: false
      }
    ],

    footer: {
      text:
        minuto >= 90
          ? "ES League • Partida finalizada"
          : "ES League • Partida ao vivo"
    },

    image: {
      url:
        "https://i.ibb.co/993xTqVb/ligaa.png"
    },

    timestamp:
      new Date().toISOString()
  };

  if (minuto >= 90) {

    embed.fields.push({
      name: "📊 Resultado",
      value:
        limitarTexto(
          resultadoTexto,
          1024
        ),
      inline: false
    });
  }

  return validarEmbed(embed);
}

// =============================================================
// EMBED PARTIDA
// =============================================================

function criarEmbedPartida(
  dados,
  minuto
) {

  const {
    nomeClubeC,
    nomeClubeF,
    gerC,
    gerF,
    golsC,
    golsF,
    tempo,
    estadio,
    campoResultado,
    eventos
  } = dados;

  const placar =
    obterPlacarAteMinuto(
      eventos,
      minuto,
      golsC,
      golsF
    );

  let tituloTempo =
    `🕐 **${minuto}'**`;

  if (minuto === 0) {
    tituloTempo =
      "🟢 **0' — APITO INICIAL**";
  }

  if (minuto === 45) {
    tituloTempo =
      "⏸️ **45' — INTERVALO**";
  }

  if (minuto >= 90) {
    tituloTempo =
      "🏁 **90' — FIM DE JOGO**";
  }

  let resultadoTexto = "";

  if (minuto === 0) {

    resultadoTexto =
      "**⚽ A partida começou!**\nBoa sorte a ambos!";

  } else if (minuto === 45) {

    resultadoTexto =
      "**⏸️ Intervalo**\nAs equipas vão para o balneário.";

  } else if (minuto >= 90) {

    resultadoTexto =
      limparResultado(
        campoResultado
      ) ||
      "**🏁 Partida finalizada.**";

  } else {

    resultadoTexto =
      "**🔴 Partida em andamento**\nO resultado ainda pode mudar!";
  }

  let cor = 5793266;

  if (minuto >= 90) {

    if (golsC > golsF) {
      cor = 5763719;
    } else if (golsC < golsF) {
      cor = 15548997;
    } else {
      cor = 16705372;
    }
  }

  const embed = {

    title:
      `⚔️ Partida — ${nomeClubeC} x ${nomeClubeF}`,

    color: cor,

    description:
      `${tituloTempo}\n\n` +
      `🏟️ ⚽ **${nomeClubeC} ${placar.casa} x ${placar.fora} ${nomeClubeF}**\n\n` +
      `⚔️ **GER:** ${nomeClubeC} (\`${gerC}\`) vs ${nomeClubeF} (\`${gerF}\`)\n\n` +
      `🌤️ **Clima:** \`${tempo}\`\n` +
      `🏟️ **Estádio:** \`${estadio}\``,

    fields: [
      {
        name: "📋 Lances da Partida",
        value:
          criarTextoLances(
            eventos,
            minuto
          ),
        inline: false
      }
    ],

    footer: {
      text:
        minuto >= 90
          ? "Partida • Finalizada"
          : "Partida • Ao vivo"
    },

    image: {
      url:
        "https://i.ibb.co/zWhWZVy4/partida2.png"
    },

    timestamp:
      new Date().toISOString()
  };

  if (minuto >= 90) {

    embed.fields.push({
      name: "📊 Resultado",
      value:
        limitarTexto(
          resultadoTexto,
          1024
        ),
      inline: false
    });
  }

  return validarEmbed(embed);
}

// =============================================================
// CRIAR MENSAGEM
// =============================================================

async function enviarLigaInicial(
  dados
) {

  if (!LIGA_WEBHOOK_URL) {
    throw new Error(
      "LIGA_WEBHOOK_URL não configurada."
    );
  }

  const url =
    new URL(LIGA_WEBHOOK_URL);

  url.searchParams.set(
    "wait",
    "true"
  );

  const resposta =
    await discordWebhookRequest(
      "POST",
      url.toString(),
      {
        username: "ES League",

        avatar_url:
          "https://i.ibb.co/jv90cK31/ESLeague.png",

        embeds: [
          criarEmbedLiga(
            dados,
            0
          )
        ],

        allowed_mentions: {
          parse: []
        }
      }
    );

  if (!resposta || !resposta.id) {
    throw new Error(
      "Discord não devolveu o ID da mensagem."
    );
  }

  return resposta.id;
}

async function enviarPartidaInicial(
  dados
) {

  if (!LIGA_WEBHOOK_URL) {
    throw new Error(
      "LIGA_WEBHOOK_URL não configurada."
    );
  }

  const url =
    new URL(LIGA_WEBHOOK_URL);

  url.searchParams.set(
    "wait",
    "true"
  );

  const resposta =
    await discordWebhookRequest(
      "POST",
      url.toString(),
      {
        username:
          "Eleven Squad - Motor",

        avatar_url:
          "https://i.ibb.co/Qjq9d3mZ/ESMotor-Partida.png",

        content:
          dados.mencoes || "",

        embeds: [
          criarEmbedPartida(
            dados,
            0
          )
        ],

        allowed_mentions: {
          parse: [],
          users:
            dados.mencaoIDs || []
        }
      }
    );

  if (!resposta || !resposta.id) {
    throw new Error(
      "Discord não devolveu o ID da mensagem."
    );
  }

  return resposta.id;
}

// =============================================================
// EDIÇÃO DISCORD
// =============================================================

async function editarLiga(
  webhook,
  messageID,
  dados,
  minuto
) {

  const url =
    `https://discord.com/api/v10/webhooks/` +
    `${webhook.webhookID}/` +
    `${webhook.webhookToken}/` +
    `messages/${messageID}`;

  return discordWebhookRequest(
    "PATCH",
    url,
    {
      embeds: [
        criarEmbedLiga(
          dados,
          minuto
        )
      ],

      allowed_mentions: {
        parse: []
      }
    }
  );
}

async function editarPartida(
  webhook,
  messageID,
  dados,
  minuto
) {

  const url =
    `https://discord.com/api/v10/webhooks/` +
    `${webhook.webhookID}/` +
    `${webhook.webhookToken}/` +
    `messages/${messageID}`;

  return discordWebhookRequest(
    "PATCH",
    url,
    {
      embeds: [
        criarEmbedPartida(
          dados,
          minuto
        )
      ],

      allowed_mentions: {
        parse: []
      }
    }
  );
}

// =============================================================
// TIMERS OTIMIZADOS
// =============================================================
//
// ANTES:
// 0 + 10 + 20 + 30 + 40 + 45 + 50 + 60...
// + TODOS OS MINUTOS DOS LANCES
//
// AGORA:
// 15 + 30 + 45 + 60 + 75 + 90
//
// Resultado:
// máximo de 6 PATCHs por partida.
//
// =============================================================

const MINUTOS_LIVE = [
  15,
  30,
  45,
  60,
  75,
  90
];

const DURACAO_PARTIDA = 60000;

function iniciarTimers(
  tipo,
  dados,
  messageID,
  webhook
) {

  const gameID =
    dados.gameID;

  const estado = {
    messageID,
    criadoEm: Date.now(),
    ultimoMinuto: 0,
    timers: [],
    atualizando: false,
    finalizada: false
  };

  partidasLiga.set(
    gameID,
    estado
  );

  for (const minuto of MINUTOS_LIVE) {

    const atraso =
      Math.round(
        (minuto / 90) *
        DURACAO_PARTIDA
      );

    const timer =
      setTimeout(
        async () => {

          const partida =
            partidasLiga.get(gameID);

          if (!partida) {
            return;
          }

          // Evita PATCH duplicado
          if (
            partida.atualizando ||
            minuto <= partida.ultimoMinuto
          ) {
            return;
          }

          partida.atualizando = true;

          try {

            if (tipo === "liga") {

              await editarLiga(
                webhook,
                messageID,
                dados,
                minuto
              );

            } else {

              await editarPartida(
                webhook,
                messageID,
                dados,
                minuto
              );
            }

            partida.ultimoMinuto =
              minuto;

            console.log(
              `${tipo === "liga" ? "🏆" : "⚔️"} ` +
              `${gameID} → ${minuto}'`
            );

            if (minuto >= 90) {
              partida.finalizada = true;
            }

          } catch (error) {

            console.error(
              `❌ ${gameID} ${minuto}':`,
              error.message
            );

          } finally {

            partida.atualizando =
              false;
          }

        },
        atraso
      );

    estado.timers.push(
      timer
    );
  }

  // Limpeza
  const limpeza =
    setTimeout(() => {

      const partida =
        partidasLiga.get(gameID);

      if (!partida) {
        return;
      }

      for (const timer of partida.timers) {
        clearTimeout(timer);
      }

      partidasLiga.delete(
        gameID
      );

      console.log(
        `🧹 ${gameID} → removida da memória`
      );

    }, DURACAO_PARTIDA + 15000);

  estado.timers.push(
    limpeza
  );
}

// =============================================================
// ROTA ES LEAGUE LIVE
// =============================================================

app.post(
  '/liga-live',
  async (req, res) => {

    try {

      const {
        apiKey,
        gameID,
        nomeClube,
        rivalNome,
        gerTime,
        gerBot,
        golsC,
        golsF,
        divisao,
        tempo,
        estadio,
        lances,
        campoResultado
      } = req.body;

      if (
        LIGA_API_KEY &&
        apiKey !== LIGA_API_KEY
      ) {

        return res.status(401).json({
          sucesso: false,
          erro: "api_key_invalida"
        });
      }

      if (!gameID) {

        return res.status(400).json({
          sucesso: false,
          erro: "gameID_obrigatorio"
        });
      }

      if (
        partidasLiga.has(
          gameID
        )
      ) {

        return res.status(409).json({
          sucesso: false,
          erro: "partida_ja_iniciada"
        });
      }

      const webhook =
        obterWebhookPartes(
          LIGA_WEBHOOK_URL
        );

      if (!webhook) {

        return res.status(500).json({
          sucesso: false,
          erro: "webhook_invalido"
        });
      }

      const dados = {

        gameID,

        nomeClube:
          String(
            nomeClube ||
            "Seu Time"
          ).slice(0, 200),

        rivalNome:
          String(
            rivalNome ||
            "Rival"
          ).slice(0, 200),

        gerTime:
          Number.isFinite(
            Number(gerTime)
          )
            ? Number(gerTime)
            : 60,

        gerBot:
          Number.isFinite(
            Number(gerBot)
          )
            ? Number(gerBot)
            : 60,

        golsC:
          Number.isFinite(
            Number(golsC)
          )
            ? Math.max(
                0,
                Number(golsC)
              )
            : 0,

        golsF:
          Number.isFinite(
            Number(golsF)
          )
            ? Math.max(
                0,
                Number(golsF)
              )
            : 0,

        divisao:
          Number.isFinite(
            Number(divisao)
          )
            ? Number(divisao)
            : 10,

        tempo:
          limparEmojisBot(
            String(
              tempo ||
              "☀️ Ensolarado"
            )
          ).slice(0, 100),

        estadio:
          limparEmojisBot(
            String(
              estadio ||
              "Estádio Padrão"
            )
          ).slice(0, 150),

        lances:
          String(
            lances || ""
          ),

        campoResultado:
          String(
            campoResultado || ""
          )
      };

      dados.eventos =
        extrairEventosLiga(
          dados.lances
        );

      const messageID =
        await enviarLigaInicial(
          dados
        );

      iniciarTimers(
        "liga",
        dados,
        messageID,
        webhook
      );

      console.log(
        `🏆 ES League → ${gameID} iniciada`
      );

      return res.status(200).json({

        sucesso: true,
        gameID,
        messageID,

        eventos:
          dados.eventos.length,

        duracaoSegundos: 60,

        atualizacoes: MINUTOS_LIVE.length,

        requestsMaximos:
          MINUTOS_LIVE.length + 1
      });

    } catch (error) {

      console.error(
        "❌ /liga-live:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        erro: "erro_interno",
        mensagem: error.message
      });
    }
  }
);

// =============================================================
// ROTA PARTIDA LIVE
// =============================================================

app.post(
  '/partida-live',
  async (req, res) => {

    try {

      const {
        apiKey,
        gameID,
        nomeClubeC,
        nomeClubeF,
        idC,
        idF,
        gerC,
        gerF,
        golsC,
        golsF,
        tempo,
        estadio,
        lances,
        campoResultado
      } = req.body;

      if (
        LIGA_API_KEY &&
        apiKey !== LIGA_API_KEY
      ) {

        return res.status(401).json({
          sucesso: false,
          erro: "api_key_invalida"
        });
      }

      if (!gameID) {

        return res.status(400).json({
          sucesso: false,
          erro: "gameID_obrigatorio"
        });
      }

      if (
        partidasLiga.has(
          gameID
        )
      ) {

        return res.status(409).json({
          sucesso: false,
          erro: "partida_ja_iniciada"
        });
      }

      const webhook =
        obterWebhookPartes(
          LIGA_WEBHOOK_URL
        );

      if (!webhook) {

        return res.status(500).json({
          sucesso: false,
          erro: "webhook_invalido"
        });
      }

      const mencaoIDs =
        [idC, idF]
          .filter(Boolean)
          .map(String);

      const dados = {

        gameID,

        nomeClubeC:
          String(
            nomeClubeC ||
            "Time Casa"
          ).slice(0, 200),

        nomeClubeF:
          String(
            nomeClubeF ||
            "Time Fora"
          ).slice(0, 200),

        gerC:
          Number.isFinite(
            Number(gerC)
          )
            ? Number(gerC)
            : 60,

        gerF:
          Number.isFinite(
            Number(gerF)
          )
            ? Number(gerF)
            : 60,

        golsC:
          Number.isFinite(
            Number(golsC)
          )
            ? Math.max(
                0,
                Number(golsC)
              )
            : 0,

        golsF:
          Number.isFinite(
            Number(golsF)
          )
            ? Math.max(
                0,
                Number(golsF)
              )
            : 0,

        tempo:
          limparEmojisBot(
            String(
              tempo ||
              "☀️ Ensolarado"
            )
          ).slice(0, 100),

        estadio:
          limparEmojisBot(
            String(
              estadio ||
              "Estádio Padrão"
            )
          ).slice(0, 150),

        lances:
          String(
            lances || ""
          ),

        campoResultado:
          String(
            campoResultado || ""
          ),

        mencaoIDs,

        mencoes:
          mencaoIDs.length
            ? mencaoIDs
                .map(
                  id =>
                    `<@${id}>`
                )
                .join(" ")
            : ""
      };

      dados.eventos =
        extrairEventosLiga(
          dados.lances
        );

      const messageID =
        await enviarPartidaInicial(
          dados
        );

      iniciarTimers(
        "partida",
        dados,
        messageID,
        webhook
      );

      console.log(
        `⚔️ Partida → ${gameID} iniciada`
      );

      return res.status(200).json({

        sucesso: true,
        gameID,
        messageID,

        eventos:
          dados.eventos.length,

        duracaoSegundos: 60,

        atualizacoes:
          MINUTOS_LIVE.length,

        requestsMaximos:
          MINUTOS_LIVE.length + 1
      });

    } catch (error) {

      console.error(
        "❌ /partida-live:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        erro: "erro_interno",
        mensagem: error.message
      });
    }
  }
);

// =============================================================
// GERAR CAMPO
// =============================================================

app.get(
  '/gerar-campo',
  async (req, res) => {

    try {

      const width = 800;
      const height = 800;

      const canvas =
        createCanvas(
          width,
          height
        );

      const ctx =
        canvas.getContext("2d");

      ctx.imageSmoothingEnabled =
        false;

      const tipoFundo =
        (
          req.query.bg ||
          req.query.fundo ||
          "padrao"
        )
          .toLowerCase()
          .trim();

      const nomeFicheiroFundo =
        MAPA_CAMPOS[tipoFundo] ||
        MAPA_CAMPOS.padrao;

      const bgImg =
        await obterImagemOuCarregar(
          nomeFicheiroFundo,
          PASTAS_CAMPOS
        );

      if (bgImg) {

        ctx.drawImage(
          bgImg,
          0,
          0,
          width,
          height
        );

      } else {

        ctx.fillStyle =
          "#12141d";

        ctx.fillRect(
          0,
          0,
          width,
          height
        );
      }

      const cardWidth = 120;
      const cardHeight = 165;

      const POSICOES = {

        gr: {
          x: 400,
          y: 705
        },

        le: {
          x: 100,
          y: 580
        },

        dc1: {
          x: 270,
          y: 565
        },

        dc2: {
          x: 530,
          y: 565
        },

        ld: {
          x: 700,
          y: 580
        },

        mc: {
          x: 400,
          y: 395
        },

        mo1: {
          x: 220,
          y: 280
        },

        mo2: {
          x: 580,
          y: 280
        },

        ee: {
          x: 110,
          y: 100
        },

        pl: {
          x: 400,
          y: 95
        },

        ed: {
          x: 690,
          y: 100
        }
      };

      const promessas = [];

      for (
        const [pos, coord]
        of Object.entries(POSICOES)
      ) {

        const termo =
          req.query[pos];

        if (
          !termo ||
          termo === "vazio"
        ) {
          continue;
        }

        const chaveEncontrada =
          encontrarChaveJogador(
            termo
          );

        if (
          !chaveEncontrada ||
          !BANCO_DE_CARTAS[
            chaveEncontrada
          ]
        ) {
          continue;
        }

        const nomeFicheiroCarta =
          BANCO_DE_CARTAS[
            chaveEncontrada
          ].img;

        promessas.push(
          obterImagemOuCarregar(
            nomeFicheiroCarta,
            PASTAS_CARTAS
          ).then(cardImg => ({
            cardImg,
            coord
          }))
        );
      }

      const resultados =
        await Promise.all(
          promessas
        );

      for (
        const {
          cardImg,
          coord
        } of resultados
      ) {

        if (!cardImg) {
          continue;
        }

        ctx.drawImage(
          cardImg,
          coord.x -
            cardWidth / 2,
          coord.y -
            cardHeight / 2,
          cardWidth,
          cardHeight
        );
      }

      const buffer =
        canvas.toBuffer(
          "image/png"
        );

      res.setHeader(
        "Content-Type",
        "image/png"
      );

      res.setHeader(
        "Cache-Control",
        "public, max-age=86400"
      );

      return res.send(
        buffer
      );

    } catch (error) {

      console.error(
        "❌ /gerar-campo:",
        error
      );

      return res
        .status(500)
        .send(
          "Erro ao gerar imagem."
        );
    }
  }
);

// =============================================================
// RENDER CARTA
// =============================================================

app.get(
  '/render-carta',
  async (req, res) => {

    try {

      const termo =
        req.query.q || "";

      const chaveEncontrada =
        encontrarChaveJogador(
          termo
        );

      if (
        !chaveEncontrada ||
        !BANCO_DE_CARTAS[
          chaveEncontrada
        ]
      ) {

        return res
          .status(404)
          .send(
            "Carta não encontrada"
          );
      }

      if (
        cardBufferCache.has(
          chaveEncontrada
        )
      ) {

        res.setHeader(
          "Content-Type",
          "image/png"
        );

        res.setHeader(
          "Cache-Control",
          "public, max-age=86400"
        );

        return res.send(
          cardBufferCache.get(
            chaveEncontrada
          )
        );
      }

      const nomeFicheiro =
        BANCO_DE_CARTAS[
          chaveEncontrada
        ].img;

      const img =
        await obterImagemOuCarregar(
          nomeFicheiro,
          PASTAS_CARTAS
        );

      if (!img) {

        return res
          .status(500)
          .send(
            "Erro ao carregar imagem local"
          );
      }

      const canvas =
        createCanvas(
          img.width,
          img.height
        );

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0
      );

      const buffer =
        canvas.toBuffer(
          "image/png"
        );

      cardBufferCache.set(
        chaveEncontrada,
        buffer
      );

      res.setHeader(
        "Content-Type",
        "image/png"
      );

      res.setHeader(
        "Cache-Control",
        "public, max-age=86400"
      );

      return res.send(
        buffer
      );

    } catch (error) {

      console.error(
        "❌ /render-carta:",
        error
      );

      return res
        .status(500)
        .send(
          "Erro ao renderizar carta"
        );
    }
  }
);

// =============================================================
// BUSCAR JOGADOR
// =============================================================

app.get(
  '/buscar-jogador',
  (req, res) => {

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    try {

      const queryBruta =
        req.query.q || "";

      const chaveEncontrada =
        encontrarChaveJogador(
          queryBruta
        );

      const host =
        req.get("host");

      const protocol =
        req.protocol;

      if (!chaveEncontrada) {

        return res.status(200).json({

          sucesso: false,

          erro:
            "nao_encontrado",

          imagem:
            `${protocol}://${host}/cartas/desconhecido.png`,

          posicao:
            "desconhecida",

          overall: 60
        });
      }

      const jogador =
        jogadoresPreProcessados.find(
          j =>
            j.chave ===
            chaveEncontrada
        );

      if (!jogador) {

        return res.status(200).json({
          sucesso: false,
          erro: "erro_interno"
        });
      }

      const urlRenderAPI =
        `${protocol}://${host}/render-carta?q=` +
        encodeURIComponent(
          chaveEncontrada
        );

      const urlImagemDirectaLocal =
        `${protocol}://${host}/cartas/` +
        encodeURIComponent(
          jogador.imgOriginal
        );

      return res.status(200).json({

        sucesso: true,

        nome:
          jogador.chave,

        overall:
          jogador.overall,

        imagem:
          urlRenderAPI,

        imagemOriginal:
          urlImagemDirectaLocal,

        posicao:
          jogador.posicao,

        preco:
          jogador.preco
      });

    } catch {

      return res.status(200).json({
        sucesso: false,
        erro: "erro_interno"
      });
    }
  }
);

// =============================================================
// OBTEM ALEATÓRIO
// =============================================================

app.get(
  '/obter-aleatorio',
  (req, res) => {

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    try {

      let numeroSorteado =
        Math.random() *
        pesoTotalSorteio;

      let cartaSorteada =
        jogadoresPreProcessados[0];

      for (
        const jogador
        of jogadoresPreProcessados
      ) {

        if (
          numeroSorteado <
          jogador.peso
        ) {

          cartaSorteada =
            jogador;

          break;
        }

        numeroSorteado -=
          jogador.peso;
      }

      const host =
        req.get("host");

      const protocol =
        req.protocol;

      const urlRenderAPI =
        `${protocol}://${host}/render-carta?q=` +
        encodeURIComponent(
          cartaSorteada.chave
        );

      const urlImagemDirectaLocal =
        `${protocol}://${host}/cartas/` +
        encodeURIComponent(
          cartaSorteada.imgOriginal
        );

      return res.status(200).json({

        sucesso: true,

        nome:
          cartaSorteada.chave,

        overall:
          cartaSorteada.overall,

        imagem:
          urlRenderAPI,

        imagemOriginal:
          urlImagemDirectaLocal,

        posicao:
          cartaSorteada.posicao
      });

    } catch {

      return res.status(200).json({
        sucesso: false,
        erro: "erro_interno"
      });
    }
  }
);

// =============================================================
// LISTAR MERCADO
// =============================================================

app.get(
  '/listar-mercado',
  (req, res) => {

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8"
    );

    try {

      const faixa =
        req.query.faixa;

      const totalGeral =
        jogadoresPreProcessados.length;

      let min = 0;
      let max = 99;

      const FAIXAS = {

        "9999": [99, 99],
        "9598": [95, 98],
        "9094": [90, 94],
        "8589": [85, 89],
        "8084": [80, 84],
        "7579": [75, 79],
        "7074": [70, 74],
        "6569": [65, 69],
        "6064": [60, 64]
      };

      if (FAIXAS[faixa]) {

        [
          min,
          max
        ] = FAIXAS[faixa];
      }

      const filtrados =
        jogadoresPreProcessados
          .filter(
            j =>
              j.overall >= min &&
              j.overall <= max
          )
          .sort(
            (a, b) =>
              b.overall -
              a.overall
          );

      if (!filtrados.length) {

        return res.status(200).json({

          total:
            totalGeral,

          texto:
            "*(Ainda não há jogadores disponíveis nesta faixa.)*"
        });
      }

      const linhas = [];

      for (
        let i = 0;
        i < filtrados.length;
        i += 2
      ) {

        const j1 =
          filtrados[i];

        const j2 =
          filtrados[i + 1];

        const nome1 =
          j1.nomeFormatado.length > 13
            ? j1.nomeFormatado.slice(0, 11) + ".."
            : j1.nomeFormatado;

        const item1 =
          `[${j1.overall} ${j1.posicaoUpper}] ${nome1}`;

        const col1 =
          item1.padEnd(
            24,
            " "
          );

        if (j2) {

          const nome2 =
            j2.nomeFormatado.length > 13
              ? j2.nomeFormatado.slice(0, 11) + ".."
              : j2.nomeFormatado;

          const col2 =
            `[${j2.overall} ${j2.posicaoUpper}] ${nome2}`;

          linhas.push(
            `${col1}${col2}`
          );

        } else {

          linhas.push(
            col1
          );
        }
      }

      return res.status(200).json({

        total:
          totalGeral,

        texto:
          "```ansi\n" +
          linhas.join("\n") +
          "\n```"
      });

    } catch {

      return res.status(200).json({

        total: 0,

        texto:
          "Erro ao carregar a lista de jogadores."
      });
    }
  }
);

// =============================================================
// HEALTH CHECK
// =============================================================

app.get(
  '/',
  (req, res) => {

    res.json({
      online: true,
      servidor: "ES Motor",
      partidasAtivas:
        partidasLiga.size
    });
  }
);

// =============================================================
// INICIALIZAÇÃO
// =============================================================

inicializarMetadados();

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Servidor rodando na porta ${PORT}`
    );

    console.log(
      `👥 ${jogadoresPreProcessados.length} cartas carregadas`
    );

    console.log(
      `⚡ Live: ${MINUTOS_LIVE.length} atualizações por partida`
    );

    if (LIGA_WEBHOOK_URL) {

      console.log(
        "🏆 ES League / Partida Live: ATIVO"
      );

    } else {

      console.log(
        "⚠️ ES League / Partida Live: WEBHOOK NÃO CONFIGURADO"
      );
    }

    if (LIGA_API_KEY) {

      console.log(
        "🔐 API KEY: CONFIGURADA"
      );

    } else {

      console.log(
        "⚠️ API KEY: NÃO CONFIGURADA"
      );
    }
  }
);
