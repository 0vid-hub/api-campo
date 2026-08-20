const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ============================================================
// PASTAS
// ============================================================

const CARTAS = path.join(__dirname, "cartas");
const CAMPOS = path.join(__dirname, "campos");

app.use("/cartas", express.static(CARTAS));
app.use("/campos", express.static(CAMPOS));

// ============================================================
// CAMPOS
// ============================================================

const CAMPOS_MAP = {
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

// ============================================================
// BANCO DE CARTAS
// ============================================================

const BANCO = {
  "karim benzema 87": ["benzema87.png", "pl"],
  "kevin de bruyne 87": ["kevindebruyne87.png", "mc"],
  "mbappé 87": ["mbappe87.png", "pl"],
  "lionel messi 87": ["messi87.png", "ed"],
  "cristiano ronaldo 87": ["cristianoRonaldo87.png", "pl"],
  "nuno mendes 87": ["nunomendes87.png", "le"],
  "trent alexander-arnold 87": ["TRENT ALEXANDER-ARNOLD87.png", "ld"],
  "alessandro bastoni 86": ["ALESSANDRO BASTONI86.png", "dc"],
  "bukayo saka 86": ["bukayosaka86.png", "ed"],
  "cole palmer 86": ["colepalmer.png", "mo"],
  "dani carvajal 86": ["carjaval86.png", "ld"],
  "declan rice 86": ["declanrice86.png", "mo"],
  "diogo costa 86": ["diogocosta86.png", "gr"],
  "federico dimarco 86": ["federicoDinarco86.png", "le"],
  "antoine griezmann 86": ["GRIEZMANN86.png", "pl"],
  "achraf hakimi 86": ["hakimi86.png", "ld"],
  "heung min son 86": ["HEUNG MIN SON86.png", "ee"],
  "joshua kimmich 86": ["JOSHUA KIMMICH86.png", "mc"],
  "kvaratskhelia 86": ["KVARATSKHELIA86.png", "ee"],
  "robert lewandowski 86": ["Lewandowski86.png", "pl"],
  "neymar jr. 86": ["neymar86.png", "mo"],
  "pedri 86": ["pedri86.png", "mc"],
  "federico valverde 86": ["valverde86.png", "mc"],
  "vinicius júnior 86": ["vinijr86.png", "ee"],
  "william saliba 86": ["williamsaliba86.png", "dc"],
  "lamine yamal 86": ["yamal86.png", "ed"],

  "alexander isak 85": ["alexanderisak85.png", "pl"],
  "courtois 85": ["COURTOIS85.png", "gr"],
  "gabriel magalhães 85": ["GABRIELmAGALHÃES85.png", "pl"],
  "jan oblak 85": ["janoblak85.png", "gr"],
  "jamal musiala 85": ["musiala85.png", "mo"],
  "pavlidis 85": ["pavlidis85.png", "pl"],
  "rafa silva 85": ["rafasilva85.png", "pl"],
  "raphinha 85": ["raphinha85.png", "pl"],

  "luka modric 84": ["modric84.png", "mc"],
  "rúben dias 84": ["rubendias84.png", "dc"],
  "mohamed salah 84": ["salah84.png", "pl"],
  "vitinha 84": ["vitinha84.png", "mc"],

  "álex baena 83": ["ÁLEX BAENA83.png", "mc"],
  "nico williams 83": ["nicowilliams83.png", "ee"],
  "rodri 83": ["rodri83.png", "mc"],
  "samu omorodion 83": ["SAMU OMORODION83.png", "pl"],

  "bellingham 82": ["bellingham82.png", "mo"],
  "giorgi mamardashvili 82": ["GIORGI MAMARDASHVILI82.png", "gr"],
  "kobbie mainoo 82": ["KOBBIE MAINOO82.png", "mc"],
  "marquinhos 82": ["marquinhos82.png", "dc"],
  "martinez 82": ["martinez82.png", "gr"],
  "morten hjulmand 82": ["MORTEN HJULMAND82.png", "mc"],

  "guglielmo vicario 81": ["GUGLIELMO VICARIO81.png", "gr"],
  "erling haaland 81": ["haaland81.png", "pl"],

  "benjamin sesko 80": ["BENJAMIN ŠEŠKO80.png", "pl"],
  "joshua zirkzee 80": ["JOSHUA ZIRKZEE80.png", "pl"],
  "pepe 80": ["pepe80.png", "dc"],
  "savinho 80": ["SAVINHO80.png", "le"],
  "yangel herrera 80": ["YANGEL HERRERA80.png", "mc"],

  "alisson 79": ["alisson79.png", "gr"],
  "cucurella 79": ["cucurella79.png", "le"],
  "prestianni 79": ["PRESTIANNI79.png", "pl"],
  "diogo costa 79": ["diogocosta79.png", "gr"],
  "harry kane 79": ["harrykane79.png", "pl"],
  "richard ríos 79": ["richardrios79.png", "mc"],

  "bruno fernandes 78": ["brunofernandes78.png", "mo"],
  "joão cancelo 78": ["joaocancelo78.png", "ld"],

  "joão neves 77": ["joaoneves77.png", "mc"],
  "otamendi 77": ["otamendi77.png", "dc"],
  "pedro porro 77": ["pedroporro77.png", "ld"],
  "rafael leão 77": ["rafaleao77.png", "ee"],

  "orkun kokçu 76": ["kokcu76.png", "mc"],

  "alexander bah 75": ["bah75.png", "ld"],
  "ben chilwell 75": ["BEN-CHILWELL75.png", "le"],
  "alejandro garnacho 75": ["garnacho75.png", "ee"],
  "gonçalo ramos 75": ["goncaloramos75.png", "pl"],
  "gyokeres 75": ["gyokeres75.png", "pl"],
  "harry amass 75": ["harryamass.png", "le"],
  "hugo souza 75": ["hugosouza75.png", "gr"],
  "kenan yildiz 75": ["kenanyildiz75.png", "ee"],
  "leny yoro 75": ["LENYYORO75.png", "dc"],
  "lorenzo pirola 75": ["LORENZO-PIROLA75.png", "le"],
  "malo gusto 75": ["malo gusto75.png", "ld"],
  "milos kerkez 75": ["MILOS KERKEZ75.png", "le"],
  "rodrigo garro 75": ["rodrigogarro75.png", "mo"],
  "sudakov 75": ["sudakov75.png", "mo"],
  "tomás araújo 75": ["tomasaraujo75.png", "dc"],
  "vitor roque 75": ["vitorroque75.png", "pl"],
  "wilfried singo 75": ["WILFRIED-SINGO75.png", "ld"],

  "endrick 74": ["endrick74.png", "pl"],
  "ricardo mangas 74": ["ricardomangas74.png", "ed"],
  "estevão 74": ["estevao74.png", "le"],
  "joão mário 74": ["joaomario74.png", "ld"],
  "nuno tavares 74": ["nunotavares74.png", "le"],

  "josé sá 73": ["joseja73.png", "gr"],
  "vozinha 73": ["vozinha73.png", "gr"],

  "raphael veiga 72": ["RAPHAEL VEIGA72.png", "mo"],
  "trubin 72": ["trubin72.png", "gr"],

  "pavlidis 71": ["pavlidis71.png", "pl"],
  "trincão 71": ["trincao71.png", "mo"],

  "igor jesus 70": ["igorjesus70.png", "pl"],
  "yuri alberto 70": ["yurialberto70.png", "pl"],

  "martim martins 69": ["martimmartins69.png", "mc"],
  "tomás ribeiro 69": ["tomasribeiro69.png", "dc"],

  "fábio vieira 68": ["fabiovieira68.png", "mo"],
  "matheusinho 68": ["MATHEUSINHO68.png", "mo"],

  "rodrigo pinho 67": ["RODRIGO PINHO67.png", "pl"],
  "toti gomes 67": ["totigomes67.png", "dc"],

  "marcos leonardo 66": ["marcosleonardo66.png", "pl"],
  "nathan silva 66": ["nathansilva66.png", "dc"],

  "carlinhos 65": ["carlinhos65.png", "ee"],
  "gonçalo sá 65": ["goncalosa65.png", "mo"],

  "joaquin lavega 64": ["joaquinlavega64.png", "ee"],
  "nico schlotterbeck 64": ["NICO SCHLOTTERBECK64.png", "dc"],

  "andré almeida 63": ["andrealmeida63.png", "mo"],
  "de la cruz 63": ["delacruz63.png", "mo"],

  "caça rato 62": ["cacarato62.png", "pl"],
  "tiquinho soares 62": ["tiquinhosoares62.png", "pl"],

  "luan silva 61": ["luansilva61.png", "pl"],
  "mikael 61": ["mikael61.png", "pl"],

  "charles 60": ["charles60.png", "gr"],
  "chrystian barletta 60": ["CHRYSTIANBARLETTA60.png", "ee"]
};

// ============================================================
// CACHE / ÍNDICES
// ============================================================

const imageCache = new Map();
const cardCache = new Map();
const jogadores = [];
const busca = new Map();

let pesoTotal = 0;

// ============================================================
// FUNÇÕES
// ============================================================

function limpar(txt = "") {
  try {
    txt = decodeURIComponent(txt);
  } catch {}

  return String(txt)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function dadosPreco(overall) {
  if (overall >= 95) return 16000 + (overall - 90) * 4000;
  if (overall >= 90) return 20000 + (overall - 90) * 5000;
  if (overall >= 80) return 3500 + (overall - 80) * 1200;
  return 300 + (overall - 60) * 150;
}

function dadosPeso(overall) {
  if (overall >= 90) return 1;
  if (overall >= 88) return 3;
  if (overall >= 85) return 8;
  if (overall >= 80) return 25;
  if (overall >= 75) return 60;
  return 100;
}

function iniciarBanco() {
  for (const [chave, [img, pos]] of Object.entries(BANCO)) {
    const partes = chave.split(" ");
    const overall = Number(partes.pop());
    const nome = partes.join(" ");

    const jogador = {
      chave,
      nome,
      nomeFormatado: nome.replace(/\b\w/g, x => x.toUpperCase()),
      overall,
      posicao: pos,
      posicaoUpper: pos.toUpperCase(),
      preco: dadosPreco(overall),
      peso: dadosPeso(overall),
      imgOriginal: img
    };

    jogadores.push(jogador);

    const chaveLimpa = limpar(chave);
    const nomeLimpo = limpar(nome);

    busca.set(chaveLimpa, chave);

    if (!busca.has(nomeLimpo)) {
      busca.set(nomeLimpo, chave);
    }

    pesoTotal += jogador.peso;
  }
}

function encontrarJogador(termo = "") {
  const q = limpar(termo);

  if (!q) return null;

  if (busca.has(q)) {
    return busca.get(q);
  }

  const semOverall = q.replace(/\s+\d+$/, "").trim();

  if (busca.has(semOverall)) {
    return busca.get(semOverall);
  }

  for (const [index, chave] of busca) {
    if (
      index.includes(semOverall) ||
      semOverall.includes(index)
    ) {
      return chave;
    }
  }

  return null;
}

async function imagem(file, pasta) {
  const key = `${pasta}:${file}`;

  if (imageCache.has(key)) {
    return imageCache.get(key);
  }

  const full = path.isAbsolute(file)
    ? file
    : path.join(pasta, file);

  if (!fs.existsSync(full)) {
    console.error("Imagem inexistente:", full);
    return null;
  }

  try {
    const img = await loadImage(full);
    imageCache.set(key, img);
    return img;
  } catch (e) {
    console.error("Erro imagem:", e.message);
    return null;
  }
}

function urls(req, jogador) {
  const base = `${req.protocol}://${req.get("host")}`;

  return {
    imagem: `${base}/render-carta?q=${encodeURIComponent(jogador.chave)}`,
    imagemOriginal:
      `${base}/cartas/${encodeURIComponent(jogador.imgOriginal)}`
  };
}

function jogadorJSON(req, jogador, original = true) {
  const u = urls(req, jogador);

  return {
    sucesso: true,
    nome: jogador.chave,
    overall: jogador.overall,
    imagem: u.imagem,
    ...(original ? { imagemOriginal: u.imagemOriginal } : {}),
    posicao: jogador.posicao,
    preco: jogador.preco
  };
}

// ============================================================
// GERADOR DO CAMPO
// ============================================================

async function gerarCampo(req, res) {
  try {
    const canvas = createCanvas(800, 800);
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    const fundo = String(
      req.query.bg ||
      req.query.fundo ||
      "padrao"
    ).toLowerCase().trim();

    const nomeFundo =
      CAMPOS_MAP[fundo] ||
      CAMPOS_MAP.padrao;

    const bg = await imagem(nomeFundo, CAMPOS);

    if (bg) {
      ctx.drawImage(bg, 0, 0, 800, 800);
    } else {
      ctx.fillStyle = "#12141d";
      ctx.fillRect(0, 0, 800, 800);
    }

    const W = 120;
    const H = 165;

    const POS = {
      gr: [400, 705],
      le: [100, 580],
      dc1: [270, 565],
      dc2: [530, 565],
      ld: [700, 580],
      mc: [400, 395],
      mo1: [220, 280],
      mo2: [580, 280],
      ee: [110, 100],
      pl: [400, 95],
      ed: [690, 100]
    };

    const tarefas = [];

    for (const [pos, [x, y]] of Object.entries(POS)) {
      const termo = req.query[pos];

      if (!termo || termo === "vazio") continue;

      const chave = encontrarJogador(termo);

      if (!chave || !BANCO[chave]) continue;

      const img = BANCO[chave][0];

      tarefas.push(
        imagem(img, CARTAS).then(card => ({
          card,
          x,
          y
        }))
      );
    }

    const cartas = await Promise.all(tarefas);

    for (const { card, x, y } of cartas) {
      if (!card) continue;

      ctx.drawImage(
        card,
        x - W / 2,
        y - H / 2,
        W,
        H
      );
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400"
    );

    return res.send(canvas.toBuffer("image/png"));

  } catch (e) {
    console.error("Erro campo:", e);

    return res
      .status(500)
      .send("Erro ao gerar campo.");
  }
}

// ============================================================
// /GERAR-CAMPO
// ============================================================

app.get("/gerar-campo", gerarCampo);

// ============================================================
// /PARTIDA
// Mesmo gerador, para o sistema de partidas
// ============================================================

app.get("/partida", gerarCampo);

// ============================================================
// /RENDER-CARTA
// ============================================================

app.get("/render-carta", async (req, res) => {
  try {
    const chave = encontrarJogador(req.query.q);

    if (!chave || !BANCO[chave]) {
      return res
        .status(404)
        .send("Carta não encontrada");
    }

    if (cardCache.has(chave)) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Cache-Control",
        "public, max-age=86400"
      );

      return res.send(cardCache.get(chave));
    }

    const img = await imagem(
      BANCO[chave][0],
      CARTAS
    );

    if (!img) {
      return res
        .status(500)
        .send("Erro ao carregar carta.");
    }

    const canvas = createCanvas(
      img.width,
      img.height
    );

    canvas
      .getContext("2d")
      .drawImage(img, 0, 0);

    const buffer = canvas.toBuffer("image/png");

    cardCache.set(chave, buffer);

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400"
    );

    return res.send(buffer);

  } catch (e) {
    console.error("Erro render-carta:", e);

    return res
      .status(500)
      .send("Erro ao renderizar carta.");
  }
});

// ============================================================
// /BUSCAR-JOGADOR
// ============================================================

app.get("/buscar-jogador", (req, res) => {
  try {
    const chave = encontrarJogador(req.query.q);

    const base =
      `${req.protocol}://${req.get("host")}`;

    if (!chave) {
      return res.json({
        sucesso: false,
        erro: "nao_encontrado",
        imagem: `${base}/cartas/desconhecido.png`,
        posicao: "desconhecida",
        overall: 60
      });
    }

    const jogador =
      jogadores.find(j => j.chave === chave);

    if (!jogador) {
      return res.json({
        sucesso: false,
        erro: "nao_encontrado"
      });
    }

    return res.json(
      jogadorJSON(req, jogador)
    );

  } catch (e) {
    console.error("buscar-jogador:", e);

    return res.json({
      sucesso: false,
      erro: "erro_interno"
    });
  }
});

// ============================================================
// /OBTER-ALEATORIO
// ============================================================

app.get("/obter-aleatorio", (req, res) => {
  try {
    let n = Math.random() * pesoTotal;
    let escolhido = jogadores[0];

    for (const jogador of jogadores) {
      if (n < jogador.peso) {
        escolhido = jogador;
        break;
      }

      n -= jogador.peso;
    }

    return res.json(
      jogadorJSON(req, escolhido, false)
    );

  } catch (e) {
    console.error("aleatorio:", e);

    return res.json({
      sucesso: false,
      erro: "erro_interno"
    });
  }
});

// ============================================================
// /LISTAR-MERCADO
// ============================================================

app.get("/listar-mercado", (req, res) => {
  try {
    const faixas = {
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

    const [min, max] =
      faixas[req.query.faixa] || [0, 99];

    const lista = jogadores
      .filter(j =>
        j.overall >= min &&
        j.overall <= max
      )
      .sort((a, b) =>
        b.overall - a.overall
      );

    if (!lista.length) {
      return res.json({
        total: jogadores.length,
        texto:
          "*(Ainda não há jogadores disponíveis nesta faixa.)*"
      });
    }

    const linhas = [];

    for (let i = 0; i < lista.length; i += 2) {
      const a = lista[i];
      const b = lista[i + 1];

      const formatar = j => {
        let nome = j.nomeFormatado;

        if (nome.length > 13) {
          nome = nome.slice(0, 11) + "..";
        }

        return `[${j.overall} ${j.posicaoUpper}] ${nome}`;
      };

      const c1 =
        formatar(a).padEnd(24, " ");

      linhas.push(
        b
          ? c1 + formatar(b)
          : c1
      );
    }

    return res.json({
      total: jogadores.length,
      texto:
        "```ansi\n" +
        linhas.join("\n") +
        "\n```"
    });

  } catch (e) {
    console.error("listar-mercado:", e);

    return res.json({
      total: 0,
      texto:
        "Erro ao carregar a lista de jogadores."
    });
  }
});

// ============================================================
// API INFO
// ============================================================

app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    nome: "Eleven Squad API",
    status: "online",
    jogadores: jogadores.length,
    endpoints: [
      "/gerar-campo",
      "/partida",
      "/render-carta",
      "/buscar-jogador",
      "/obter-aleatorio",
      "/listar-mercado"
    ]
  });
});

app.get("/api", (req, res) => {
  res.json({
    sucesso: true,
    status: "online",
    jogadores: jogadores.length
  });
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

iniciarBanco();

app.listen(PORT, () => {
  console.log(
    `🚀 Eleven Squad API online na porta ${PORT}`
  );

  console.log(
    `⚽ ${jogadores.length} jogadores carregados`
  );

  console.log(
    `🎲 Peso total: ${pesoTotal}`
  );
});
