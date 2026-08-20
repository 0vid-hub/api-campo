const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// =============================================================
// CONFIGURAÇÃO
// =============================================================

const LIGA_WEBHOOK_URL = process.env.LIGA_WEBHOOK_URL || "";
const LIGA_API_KEY = process.env.LIGA_API_KEY || "";

const partidasLiga = new Map();
const partidasNormal = new Map();

// =============================================================
// PASTAS
// =============================================================

const PASTAS_CARTAS = path.join(__dirname, "cartas");
const PASTAS_CAMPOS = path.join(__dirname, "campos");

app.use("/cartas", express.static(PASTAS_CARTAS));
app.use("/campos", express.static(PASTAS_CAMPOS));

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
// FUNÇÕES CARTAS
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

    imageCache.set(
      caminhoOuFicheiro,
      img
    );

    return img;
  } catch (error) {
    console.error(
      `❌ Erro ao carregar imagem ${caminhoOuFicheiro}:`,
      error.message
    );

    return null;
  }
}

function inicializarMetadados() {
  jogadoresPreProcessados = [];
  buscaIndexMap.clear();

  for (
    const [chave, dados]
    of Object.entries(BANCO_DE_CARTAS)
  ) {
    const partes = chave.split(" ");

    const overall =
      parseInt(
        partes[partes.length - 1]
      ) || 60;

    const nomeSemOverall =
      partes
        .slice(0, -1)
        .join(" ");

    const nomeFormatado =
      nomeSemOverall
        .split(" ")
        .map(
          w =>
            w.charAt(0).toUpperCase() +
            w.slice(1)
        )
        .join(" ");

    let preco = 1000;

    if (overall >= 95) {
      preco =
        16000 +
        (overall - 90) * 4000;
    } else if (overall >= 90) {
      preco =
        20000 +
        (overall - 90) * 5000;
    } else if (overall >= 80) {
      preco =
        3500 +
        (overall - 80) * 1200;
    } else {
      preco =
        300 +
        (overall - 60) * 150;
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
      posicaoUpper:
        dados.pos
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
      (acc, jogador) =>
        acc + jogador.peso,
      0
    );
}

function encontrarChaveJogador(termoBusca) {
  const buscaLimpa =
    removerAcentos(termoBusca);

  if (!buscaLimpa) {
    return null;
  }

  if (buscaIndexMap.has(buscaLimpa)) {
    return buscaIndexMap.get(
      buscaLimpa
    );
  }

  const buscaSemNumero =
    buscaLimpa
      .replace(/\s+\d+$/, "")
      .trim();

  if (
    buscaIndexMap.has(
      buscaSemNumero
    )
  ) {
    return buscaIndexMap.get(
      buscaSemNumero
    );
  }

  for (
    const [termoIndex, chaveReal]
    of buscaIndexMap.entries()
  ) {
    if (
      termoIndex.includes(
        buscaSemNumero
      ) ||
      buscaSemNumero.includes(
        termoIndex
      )
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

    const url =
      new URL(webhookUrl);

    const partes =
      url.pathname
        .split("/")
        .filter(Boolean);

    const indice =
      partes.indexOf(
        "webhooks"
      );

    if (indice === -1) {
      throw new Error(
        "URL de webhook inválida."
      );
    }

    const webhookID =
      partes[indice + 1];

    const webhookToken =
      partes[indice + 2];

    if (
      !webhookID ||
      !webhookToken
    ) {
      throw new Error(
        "ID/token do webhook ausente."
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

async function discordWebhookRequest(
  method,
  url,
  body = null
) {
  const options = {
    method,
    headers: {
      "Content-Type":
        "application/json"
    }
  };

  if (body !== null) {
    options.body =
      JSON.stringify(body);
  }

  const resposta =
    await fetch(
      url,
      options
    );

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

  resultado =
    resultado.replace(
      /<:dentro:\d+>/g,
      "⚽"
    );

  resultado =
    resultado.replace(
      /<:fora:\d+>/g,
      "⚽"
    );

  resultado =
    resultado.replace(
      /<:placar:\d+>/g,
      "🏟️"
    );

  resultado =
    resultado.replace(
      /<:lances:\d+>/g,
      "📋"
    );

  resultado =
    resultado.replace(
      /<:moedas:\d+>/g,
      "🪙"
    );

  resultado =
    resultado.replace(
      /<:gemas:\d+>/g,
      "💎"
    );

  resultado =
    resultado.replace(
      /<:bronze:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<:silver:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<:gold:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<:diamond:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<:legend:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<:secret:\d+>/g,
      "📦"
    );

  resultado =
    resultado.replace(
      /<a?:[a-zA-Z0-9_~]+:\d+>/g,
      "🔹"
    );

  return resultado.trim();
}

// =============================================================
// LIMITADORES
// =============================================================

function limitarTexto(
  texto,
  limite
) {
  if (
    texto === null ||
    texto === undefined
  ) {
    return "";
  }

  const valor =
    String(texto);

  if (
    valor.length <= limite
  ) {
    return valor;
  }

  return (
    valor.slice(
      0,
      limite - 3
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
          name:
            limitarTexto(
              field.name,
              256
            ),
          value:
            limitarTexto(
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
// LANCES
// =============================================================

function extrairEventosLiga(lances) {
  if (
    !lances ||
    !String(lances).trim()
  ) {
    return [];
  }

  const linhas =
    String(lances)
      .split(/\r?\n/)
      .map(
        linha =>
          linha.trim()
      )
      .filter(Boolean);

  const eventos = [];

  for (const linha of linhas) {
    const match =
      linha.match(
        /`(\d+)'`/
      );

    if (!match) {
      continue;
    }

    const minuto =
      Number(match[1]);

    if (!Number.isFinite(minuto)) {
      continue;
    }

    let equipa =
      "desconhecida";

    if (
      linha.includes(
        "<:dentro:"
      ) ||
      linha.includes(
        ":dentro:"
      )
    ) {
      equipa =
        "casa";
    } else if (
      linha.includes(
        "<:fora:"
      ) ||
      linha.includes(
        ":fora:"
      )
    ) {
      equipa =
        "fora";
    }

    eventos.push({
      minuto,
      equipa,
      texto:
        limparEmojisBot(
          linha
        )
    });
  }

  eventos.sort(
    (a, b) =>
      a.minuto -
      b.minuto
  );

  return eventos;
}

function obterPlacarAteMinuto(
  eventos,
  minuto,
  golsC,
  golsF
) {
  let casa = 0;
  let fora = 0;

  for (const evento of eventos) {
    if (
      evento.minuto >
      minuto
    ) {
      continue;
    }

    if (
      evento.equipa ===
      "casa"
    ) {
      casa++;
    }

    if (
      evento.equipa ===
      "fora"
    ) {
      fora++;
    }
  }

  if (minuto >= 90) {
    casa = golsC;
    fora = golsF;
  }

  return {
    casa,
    fora
  };
}

// =============================================================
// RESULTADO
// =============================================================

function limparResultado(texto) {
  if (!texto) {
    return "";
  }

  let resultado =
    limparEmojisBot(
      texto
    );

  resultado =
    resultado.replace(
      /^###\s*/gm,
      ""
    );

  return resultado.trim();
}

// =============================================================
// EMBED LIGA
// =============================================================

function criarEmbedLiga(
  dados,
  minuto
) {
  const placar =
    obterPlacarAteMinuto(
      dados.eventos,
      minuto,
      dados.golsC,
      dados.golsF
    );

  let tempoTitulo =
    `🕐 **${minuto}'**`;

  if (minuto === 0) {
    tempoTitulo =
      "🟢 **0' — APITO INICIAL**";
  } else if (minuto === 45) {
    tempoTitulo =
      "⏸️ **45' — INTERVALO**";
  } else if (minuto >= 90) {
    tempoTitulo =
      "🏁 **90' — FIM DE JOGO**";
  }

  const eventos =
    dados.eventos.filter(
      evento =>
        evento.minuto <=
        minuto
    );

  let lances = "";

  if (eventos.length === 0) {
    lances =
      minuto === 0
        ? "⚽ A partida acabou de começar.\nNenhum golo ainda."
        : minuto === 45
        ? "⏸️ Nenhum golo na primeira parte."
        : minuto >= 90
        ? "🏁 A partida terminou sem golos."
        : "Nenhum golo até agora.\nO jogo continua equilibrado.";
  } else {
    lances =
      eventos
        .map(
          evento =>
            evento.texto
        )
        .join("\n");
  }

  let resultado =
    "";

  if (minuto === 0) {
    resultado =
      "**⚽ A partida começou!**\nBoa sorte!";
  } else if (minuto === 45) {
    resultado =
      "**⏸️ Intervalo**\nAs equipas vão para o balneário.";
  } else if (minuto >= 90) {
    resultado =
      limparResultado(
        dados.campoResultado
      ) ||
      "**🏁 Partida finalizada.**";
  } else {
    resultado =
      "**🔴 Partida em andamento**\nO resultado ainda pode mudar!";
  }

  let cor = 5793266;

  if (minuto >= 90) {
    if (dados.golsC > dados.golsF) {
      cor = 5763719;
    } else if (dados.golsC < dados.golsF) {
      cor = 15548997;
    } else {
      cor = 16705372;
    }
  }

  const embed = {
    title:
      `🏆 ES League — Divisão ${dados.divisao}`,

    color:
      cor,

    description:
      `${tempoTitulo}\n\n` +
      `🏟️ ⚽ **${dados.nomeClube} ${placar.casa} x ${placar.fora} ${dados.rivalNome}**\n\n` +
      `⚔️ **GER:** Seu Time (\`${dados.gerTime}\`) vs Adversário (\`${dados.gerBot}\`)\n\n` +
      `🌤️ **Clima:** \`${dados.tempo}\`\n` +
      `🏟️ **Estádio:** \`${dados.estadio}\``,

    fields: [
      {
        name:
          "📋 Lances da Partida",
        value:
          limitarTexto(
            lances ||
            "Nenhum lance.",
            1024
          ),
        inline:
          false
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
      name:
        "📊 Resultado",
      value:
        limitarTexto(
          resultado,
          1024
        ),
      inline:
        false
    });
  }

  return validarEmbed(
    embed
  );
}

// =============================================================
// EMBED PARTIDA NORMAL
// =============================================================

function criarEmbedPartida(
  dados,
  minuto
) {
  const placar =
    obterPlacarAteMinuto(
      dados.eventos,
      minuto,
      dados.golsC,
      dados.golsF
    );

  const finalizada =
    minuto >= 90;

  let tempoTitulo =
    `🕐 **${minuto}'**`;

  if (minuto === 0) {
    tempoTitulo =
      "🟢 **0' — APITO INICIAL**";
  } else if (minuto === 45) {
    tempoTitulo =
      "⏸️ **45' — INTERVALO**";
  } else if (finalizada) {
    tempoTitulo =
      "🏁 **90' — FIM DE JOGO**";
  }

  const eventos =
    dados.eventos.filter(
      evento =>
        evento.minuto <=
        minuto
    );

  let lances =
    "";

  if (eventos.length === 0) {
    lances =
      minuto === 0
        ? "⚽ A partida acabou de começar.\nNenhum golo ainda."
        : minuto === 45
        ? "⏸️ Nenhum golo na primeira parte."
        : finalizada
        ? "🏁 A partida terminou sem golos."
        : "Nenhum golo até agora.\nO jogo continua equilibrado.";
  } else {
    lances =
      eventos
        .map(
          evento =>
            evento.texto
        )
        .join("\n");
  }

  let cor = 5793266;

  if (finalizada) {
    if (
      dados.golsC >
      dados.golsF
    ) {
      cor = 5763719;
    } else if (
      dados.golsC <
      dados.golsF
    ) {
      cor = 15548997;
    } else {
      cor = 16705372;
    }
  }

  const embed = {
    title:
      "PARTIDA DE FUTEBOL ⚽",

    color:
      cor,

    description:
      `${tempoTitulo}\n\n` +
      `⚽ **${dados.nomeClubeC} ${placar.casa} x ${placar.fora} ${dados.nomeClubeF}**\n\n` +
      `📊 **GER:** ${dados.nomeClubeC} (\`${dados.gerTimeCasa}\`) vs ${dados.nomeClubeF} (\`${dados.gerTimeFora}\`)\n\n` +
      `🌤️ **Clima:** \`${dados.tempo}\`\n` +
      `🏟️ **Estádio:** \`${dados.estadio}\``,

    fields: [
      {
        name:
          "📋 Lances da Partida",
        value:
          limitarTexto(
            lances ||
            "Nenhum lance registrado nesta partida.",
            1024
          ),
        inline:
          false
      }
    ],

    thumbnail: {
      url:
        dados.imgEstadio
    },

    image: {
      url:
        "https://i.ibb.co/zWhWZVy4/partida2.png"
    },

    footer: {
      text:
        finalizada
          ? `Partida encerrada • ${dados.nomeClubeC} X ${dados.nomeClubeF}`
          : "ES League • Partida de Futebol"
    },

    timestamp:
      new Date().toISOString()
  };

  if (finalizada) {
    let resultado =
      "";

    if (
      dados.golsC >
      dados.golsF
    ) {
      resultado =
        `**🏆 Vitória do ${dados.nomeClubeC}!**\n+${dados.recompensaVitoria} 🪙`;
    } else if (
      dados.golsC <
      dados.golsF
    ) {
      resultado =
        `**🏆 Vitória do ${dados.nomeClubeF}!**\n+${dados.recompensaVitoria} 🪙`;
    } else {
      resultado =
        `**🤝 Empate!**\n+${dados.recompensaEmpate} 🪙 para ambos`;
    }

    const estatisticas =
      `**👤 ${dados.nomeClubeC} (GER: ${dados.gerTimeCasa})**\n` +
      `- 📊 Posse de bola: \`${dados.posse1}%\`\n` +
      `- ⚽ Finalizações: \`${dados.finC}\`\n` +
      `- 🧤 Defesas: \`${dados.defC}\`\n` +
      `- 🟨 Amarelos: \`${dados.amarelosC}\`\n` +
      `- 🟥 Vermelhos: \`${dados.vermelhosC}\`\n\n` +
      `**👤 ${dados.nomeClubeF} (GER: ${dados.gerTimeFora})**\n` +
      `- 📊 Posse de bola: \`${dados.posse2}%\`\n` +
      `- ⚽ Finalizações: \`${dados.finF}\`\n` +
      `- 🧤 Defesas: \`${dados.defF}\`\n` +
      `- 🟨 Amarelos: \`${dados.amarelosF}\`\n` +
      `- 🟥 Vermelhos: \`${dados.vermelhosF}\``;

    embed.fields = [
      {
        name:
          "👑 Man of the Match",
        value:
          `${dados.motm}\n⭐ Nota: ${dados.notaMotm}`,
        inline:
          false
      },
      {
        name:
          "📊 Desempenho das Equipas",
        value:
          limitarTexto(
            estatisticas,
            1024
          ),
        inline:
          false
      },
      {
        name:
          "🎙️ Lances da Partida",
        value:
          limitarTexto(
            lances ||
            "Nenhum lance registrado nesta partida.",
            1024
          ),
        inline:
          false
      },
      {
        name:
          "🏆 Resultado",
        value:
          resultado,
        inline:
          false
      }
    ];
  }

  return validarEmbed(
    embed
  );
}

// =============================================================
// POST WEBHOOK
// =============================================================

async function enviarWebhookInicial(
  embed,
  avatarUrl
) {
  const url =
    new URL(
      LIGA_WEBHOOK_URL
    );

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
          "ES League",

        avatar_url:
          avatarUrl,

        embeds: [
          embed
        ],

        allowed_mentions: {
          parse: []
        }
      }
    );

  if (
    !resposta ||
    !resposta.id
  ) {
    throw new Error(
      "Discord não devolveu o ID da mensagem."
    );
  }

  return resposta.id;
}

async function editarMensagemWebhook(
  webhook,
  messageID,
  embed
) {
  const url =
    `https://discord.com/api/v10/webhooks/` +
    `${webhook.webhookID}/` +
    `${webhook.webhookToken}/` +
    `messages/${messageID}`;

  await discordWebhookRequest(
    "PATCH",
    url,
    {
      embeds: [
        embed
      ],

      allowed_mentions: {
        parse: []
      }
    }
  );
}

// =============================================================
// TIMERS LIGA
// =============================================================

function iniciarTimersLiga(
  dados,
  messageID,
  webhook
) {
  const duracao =
    60000;

  const minutos = [
    10,
    20,
    30,
    40,
    45,
    50,
    60,
    70,
    80,
    90,
    ...dados.eventos.map(
      evento =>
        evento.minuto
    )
  ];

  const unicos =
    [
      ...new Set(
        minutos
          .filter(
            minuto =>
              minuto >= 0 &&
              minuto <= 90
          )
          .sort(
            (a, b) =>
              a - b
          )
      )
    ];

  const timers = [];

  for (
    const minuto
    of unicos
  ) {
    const atraso =
      Math.round(
        (minuto / 90) *
        duracao
      );

    timers.push(
      setTimeout(
        async () => {
          try {
            await editarMensagemWebhook(
              webhook,
              messageID,
              criarEmbedLiga(
                dados,
                minuto
              )
            );
          } catch (error) {
            console.error(
              `❌ Liga ${dados.gameID} ${minuto}':`,
              error.message
            );
          }
        },
        atraso
      )
    );
  }

  timers.push(
    setTimeout(
      () =>
        partidasLiga.delete(
          dados.gameID
        ),
      duracao + 15000
    )
  );

  partidasLiga.set(
    dados.gameID,
    {
      messageID,
      timers
    }
  );
}

// =============================================================
// TIMERS PARTIDA
// =============================================================

function iniciarTimersPartida(
  dados,
  messageID,
  webhook
) {
  const duracao =
    60000;

  const minutos = [
    10,
    20,
    30,
    40,
    45,
    50,
    60,
    70,
    80,
    90,
    ...dados.eventos.map(
      evento =>
        evento.minuto
    )
  ];

  const unicos =
    [
      ...new Set(
        minutos
          .filter(
            minuto =>
              minuto >= 0 &&
              minuto <= 90
          )
          .sort(
            (a, b) =>
              a - b
          )
      )
    ];

  const timers = [];

  for (
    const minuto
    of unicos
  ) {
    const atraso =
      Math.round(
        (minuto / 90) *
        duracao
      );

    timers.push(
      setTimeout(
        async () => {
          try {
            await editarMensagemWebhook(
              webhook,
              messageID,
              criarEmbedPartida(
                dados,
                minuto
              )
            );

            console.log(
              `⚽ Partida ${dados.gameID} → ${minuto}'`
            );
          } catch (error) {
            console.error(
              `❌ Partida ${dados.gameID} ${minuto}':`,
              error.message
            );
          }
        },
        atraso
      )
    );
  }

  timers.push(
    setTimeout(
      () => {
        partidasNormal.delete(
          dados.gameID
        );

        console.log(
          `🧹 Partida ${dados.gameID} removida da memória`
        );
      },
      duracao + 15000
    )
  );

  partidasNormal.set(
    dados.gameID,
    {
      messageID,
      timers,
      criadoEm:
        Date.now()
    }
  );
}

// =============================================================
// ROTA LIGA
// =============================================================

app.post(
  "/liga-live",
  async (req, res) => {
    try {
      const body =
        req.body;

      if (
        LIGA_API_KEY &&
        body.apiKey !==
          LIGA_API_KEY
      ) {
        return res
          .status(401)
          .json({
            sucesso: false,
            erro:
              "api_key_invalida"
          });
      }

      if (!body.gameID) {
        return res
          .status(400)
          .json({
            sucesso: false,
            erro:
              "gameID_obrigatorio"
          });
      }

      if (
        partidasLiga.has(
          String(
            body.gameID
          )
        )
      ) {
        return res
          .status(409)
          .json({
            sucesso: false,
            erro:
              "partida_ja_iniciada"
          });
      }

      const webhook =
        obterWebhookPartes(
          LIGA_WEBHOOK_URL
        );

      if (!webhook) {
        return res
          .status(500)
          .json({
            sucesso: false,
            erro:
              "webhook_invalido"
          });
      }

      const dados = {
        gameID:
          String(
            body.gameID
          ),

        nomeClube:
          limparEmojisBot(
            body.nomeClube ||
            "Seu Time"
          ).slice(
            0,
            200
          ),

        rivalNome:
          limparEmojisBot(
            body.rivalNome ||
            "Rival"
          ).slice(
            0,
            200
          ),

        gerTime:
          Number(body.gerTime) ||
          60,

        gerBot:
          Number(body.gerBot) ||
          60,

        golsC:
          Math.max(
            0,
            Number(body.golsC) || 0
          ),

        golsF:
          Math.max(
            0,
            Number(body.golsF) || 0
          ),

        divisao:
          Number(body.divisao) ||
          10,

        tempo:
          limparEmojisBot(
            body.tempo ||
            "☀️ Ensolarado"
          ),

        estadio:
          limparEmojisBot(
            body.estadio ||
            "Estádio Padrão"
          ),

        campoResultado:
          String(
            body.campoResultado ||
            ""
          ),

        eventos:
          extrairEventosLiga(
            body.lances ||
            ""
          )
      };

      const messageID =
        await enviarWebhookInicial(
          criarEmbedLiga(
            dados,
            0
          ),
          "https://i.ibb.co/993xTqVb/ligaa.png"
        );

      iniciarTimersLiga(
        dados,
        messageID,
        webhook
      );

      return res
        .status(200)
        .json({
          sucesso: true,
          gameID:
            dados.gameID,
          messageID,
          eventos:
            dados.eventos.length,
          duracaoSegundos:
            60
        });
    } catch (error) {
      console.error(
        "❌ /liga-live:",
        error
      );

      return res
        .status(500)
        .json({
          sucesso: false,
          erro:
            "erro_interno",
          mensagem:
            error.message
        });
    }
  }
);

// =============================================================
// ROTA PARTIDA LIVE
// =============================================================

app.post(
  "/partida-live",
  async (req, res) => {
    try {
      const body =
        req.body;

      if (
        LIGA_API_KEY &&
        body.apiKey !==
          LIGA_API_KEY
      ) {
        return res
          .status(401)
          .json({
            sucesso: false,
            erro:
              "api_key_invalida"
          });
      }

      if (!body.gameID) {
        return res
          .status(400)
          .json({
            sucesso: false,
            erro:
              "gameID_obrigatorio"
          });
      }

      const gameID =
        String(
          body.gameID
        );

      if (
        partidasNormal.has(
          gameID
        )
      ) {
        return res
          .status(409)
          .json({
            sucesso: false,
            erro:
              "partida_ja_iniciada"
          });
      }

      const webhook =
        obterWebhookPartes(
          LIGA_WEBHOOK_URL
        );

      if (!webhook) {
        return res
          .status(500)
          .json({
            sucesso: false,
            erro:
              "webhook_invalido"
          });
      }

      const dados = {
        gameID,

        nomeClubeC:
          limparEmojisBot(
            body.nomeClubeC ||
            "Time da Casa"
          ).slice(
            0,
            200
          ),

        nomeClubeF:
          limparEmojisBot(
            body.nomeClubeF ||
            "Time Visitante"
          ).slice(
            0,
            200
          ),

        gerTimeCasa:
          Number(
            body.gerTimeCasa
          ) || 60,

        gerTimeFora:
          Number(
            body.gerTimeFora
          ) || 60,

        golsC:
          Math.max(
            0,
            Number(body.golsC) || 0
          ),

        golsF:
          Math.max(
            0,
            Number(body.golsF) || 0
          ),

        tempo:
          limparEmojisBot(
            body.tempo ||
            "☀️ Ensolarado"
          ),

        estadio:
          limparEmojisBot(
            body.estadio ||
            "Estádio Padrão"
          ),

        imgEstadio:
          String(
            body.imgEstadio ||
            "https://i.ibb.co/PzF15kjd/estadiopadrao.png"
          ),

        motm:
          limparEmojisBot(
            body.motm ||
            "Ninguém"
          ),

        notaMotm:
          String(
            body.notaMotm ||
            "8.0"
          ),

        posse1:
          Number(
            body.posse1
          ) || 50,

        posse2:
          Number(
            body.posse2
          ) || 50,

        finC:
          Number(
            body.finC
          ) || 0,

        finF:
          Number(
            body.finF
          ) || 0,

        defC:
          Number(
            body.defC
          ) || 0,

        defF:
          Number(
            body.defF
          ) || 0,

        amarelosC:
          Number(
            body.amarelosC
          ) || 0,

        amarelosF:
          Number(
            body.amarelosF
          ) || 0,

        vermelhosC:
          Number(
            body.vermelhosC
          ) || 0,

        vermelhosF:
          Number(
            body.vermelhosF
          ) || 0,

        recompensaVitoria:
          Number(
            body.recompensaVitoria
          ) || 300,

        recompensaEmpate:
          Number(
            body.recompensaEmpate
          ) || 100,

        eventos:
          extrairEventosLiga(
            body.lances ||
            ""
          )
      };

      const messageID =
        await enviarWebhookInicial(
          criarEmbedPartida(
            dados,
            0
          ),
          "https://i.ibb.co/zWhWZVy4/partida2.png"
        );

      iniciarTimersPartida(
        dados,
        messageID,
        webhook
      );

      return res
        .status(200)
        .json({
          sucesso: true,
          gameID,
          messageID,
          eventos:
            dados.eventos.length,
          duracaoSegundos:
            60
        });
    } catch (error) {
      console.error(
        "❌ /partida-live:",
        error
      );

      return res
        .status(500)
        .json({
          sucesso: false,
          erro:
            "erro_interno",
          mensagem:
            error.message
        });
    }
  }
);

// =============================================================
// GERAR CAMPO
// =============================================================

app.get(
  "/gerar-campo",
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

      const ficheiro =
        MAPA_CAMPOS[
          tipoFundo
        ] ||
        MAPA_CAMPOS.padrao;

      const bg =
        await obterImagemOuCarregar(
          ficheiro,
          PASTAS_CAMPOS
        );

      if (bg) {
        ctx.drawImage(
          bg,
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

      for (
        const [pos, coord]
        of Object.entries(
          POSICOES
        )
      ) {
        const termo =
          req.query[pos];

        if (
          termo &&
          termo !== "vazio"
        ) {
          const chave =
            encontrarChaveJogador(
              termo
            );

          if (
            chave &&
            BANCO_DE_CARTAS[chave]
          ) {
            promessas.push(
              obterImagemOuCarregar(
                BANCO_DE_CARTAS[chave].img,
                PASTAS_CARTAS
              ).then(
                cardImg => ({
                  cardImg,
                  coord
                })
              )
            );
          }
        }
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
        if (cardImg) {
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
  "/render-carta",
  async (req, res) => {
    try {
      const chave =
        encontrarChaveJogador(
          req.query.q || ""
        );

      if (
        !chave ||
        !BANCO_DE_CARTAS[chave]
      ) {
        return res
          .status(404)
          .send(
            "Carta não encontrada"
          );
      }

      if (
        cardBufferCache.has(
          chave
        )
      ) {
        res.setHeader(
          "Content-Type",
          "image/png"
        );

        return res.send(
          cardBufferCache.get(
            chave
          )
        );
      }

      const img =
        await obterImagemOuCarregar(
          BANCO_DE_CARTAS[chave].img,
          PASTAS_CARTAS
        );

      if (!img) {
        return res
          .status(500)
          .send(
            "Erro ao carregar imagem"
          );
      }

      const canvas =
        createCanvas(
          img.width,
          img.height
        );

      const ctx =
        canvas.getContext(
          "2d"
        );

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
        chave,
        buffer
      );

      res.setHeader(
        "Content-Type",
        "image/png"
      );

      return res.send(
        buffer
      );
    } catch (error) {
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
  "/buscar-jogador",
  (req, res) => {
    try {
      const chave =
        encontrarChaveJogador(
          req.query.q || ""
        );

      const host =
        req.get("host");

      const protocol =
        req.protocol;

      if (!chave) {
        return res.json({
          sucesso: false,
          erro:
            "nao_encontrado",
          imagem:
            `${protocol}://${host}/cartas/desconhecido.png`,
          posicao:
            "desconhecida",
          overall:
            60
        });
      }

      const jogador =
        jogadoresPreProcessados.find(
          j =>
            j.chave ===
            chave
        );

      if (!jogador) {
        return res.json({
          sucesso: false,
          erro:
            "erro_interno"
        });
      }

      return res.json({
        sucesso: true,
        nome:
          jogador.chave,
        overall:
          jogador.overall,
        imagem:
          `${protocol}://${host}/render-carta?q=${encodeURIComponent(chave)}`,
        imagemOriginal:
          `${protocol}://${host}/cartas/${encodeURIComponent(jogador.imgOriginal)}`,
        posicao:
          jogador.posicao,
        preco:
          jogador.preco
      });
    } catch {
      return res.json({
        sucesso: false,
        erro:
          "erro_interno"
      });
    }
  }
);

// =============================================================
// ALEATÓRIO
// =============================================================

app.get(
  "/obter-aleatorio",
  (req, res) => {
    try {
      let numero =
        Math.random() *
        pesoTotalSorteio;

      let carta =
        jogadoresPreProcessados[0];

      for (
        const jogador
        of jogadoresPreProcessados
      ) {
        if (
          numero <
          jogador.peso
        ) {
          carta =
            jogador;
          break;
        }

        numero -=
          jogador.peso;
      }

      const host =
        req.get("host");

      const protocol =
        req.protocol;

      return res.json({
        sucesso: true,
        nome:
          carta.chave,
        overall:
          carta.overall,
        imagem:
          `${protocol}://${host}/render-carta?q=${encodeURIComponent(carta.chave)}`,
        imagemOriginal:
          `${protocol}://${host}/cartas/${encodeURIComponent(carta.imgOriginal)}`,
        posicao:
          carta.posicao
      });
    } catch {
      return res.json({
        sucesso: false,
        erro:
          "erro_interno"
      });
    }
  }
);

// =============================================================
// MERCADO
// =============================================================

app.get(
  "/listar-mercado",
  (req, res) => {
    try {
      const faixa =
        req.query.faixa;

      let min = 0;
      let max = 99;

      if (faixa === "9999") {
        min = 99;
        max = 99;
      } else if (faixa === "9598") {
        min = 95;
        max = 98;
      } else if (faixa === "9094") {
        min = 90;
        max = 94;
      } else if (faixa === "8589") {
        min = 85;
        max = 89;
      } else if (faixa === "8084") {
        min = 80;
        max = 84;
      } else if (faixa === "7579") {
        min = 75;
        max = 79;
      } else if (faixa === "7074") {
        min = 70;
        max = 74;
      } else if (faixa === "6569") {
        min = 65;
        max = 69;
      } else if (faixa === "6064") {
        min = 60;
        max = 64;
      }

      const filtrados =
        jogadoresPreProcessados
          .filter(
            jogador =>
              jogador.overall >= min &&
              jogador.overall <= max
          )
          .sort(
            (a, b) =>
              b.overall -
              a.overall
          );

      if (
        filtrados.length === 0
      ) {
        return res.json({
          total:
            jogadoresPreProcessados.length,
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
            ? j1.nomeFormatado.slice(
                0,
                11
              ) + ".."
            : j1.nomeFormatado;

        const col1 =
          `[${j1.overall} ${j1.posicaoUpper}] ${nome1}`
            .padEnd(
              24,
              " "
            );

        if (j2) {
          const nome2 =
            j2.nomeFormatado.length > 13
              ? j2.nomeFormatado.slice(
                  0,
                  11
                ) + ".."
              : j2.nomeFormatado;

          linhas.push(
            `${col1}[${j2.overall} ${j2.posicaoUpper}] ${nome2}`
          );
        } else {
          linhas.push(
            col1
          );
        }
      }

      return res.json({
        total:
          jogadoresPreProcessados.length,
        texto:
          "```ansi\n" +
          linhas.join("\n") +
          "\n```"
      });
    } catch {
      return res.json({
        total: 0,
        texto:
          "Erro ao carregar a lista de jogadores."
      });
    }
  }
);

// =============================================================
// START
// =============================================================

inicializarMetadados();

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Servidor rodando na porta ${PORT}`
    );

    console.log(
      LIGA_WEBHOOK_URL
        ? "🏆 ES League Live: ATIVO"
        : "⚠️ ES League Live: WEBHOOK NÃO CONFIGURADO"
    );

    console.log(
      LIGA_API_KEY
        ? "🔐 ES League Live: API KEY CONFIGURADA"
        : "⚠️ ES League Live: API KEY NÃO CONFIGURADA"
    );

    console.log(
      "⚽ /partida-live: ATIVO"
    );
  }
);
