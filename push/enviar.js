/* Envia a notificação push do dia (rodado pelo GitHub Actions, 1x/dia).
   Lê o conteúdo dos próprios arquivos do app e dispara via web-push. */
const fs = require("fs");
const path = require("path");
const webpush = require("web-push");

const RAIZ = path.join(__dirname, "..");
const URL_APP = "https://igorarm-ops.github.io/devocional-sao-jose/";

// Extrai o array JSON de um arquivo "window.X = [ ... ];"
function lerArray(arquivo) {
  const txt = fs.readFileSync(path.join(RAIZ, arquivo), "utf8");
  const ini = txt.indexOf("[");
  const fim = txt.lastIndexOf("]");
  return JSON.parse(txt.slice(ini, fim + 1));
}

const ANO = lerArray("reflexoes-ano.js");
const ENS = lerArray("ensinamentos.js");
const porId = {};
ENS.forEach((e) => { porId[e.id] = e; });

// Dia do ano em horário de Brasília (UTC-3)
const agora = new Date();
const brt = new Date(agora.getTime() - 3 * 3600 * 1000);
const inicioAno = Date.UTC(brt.getUTCFullYear(), 0, 0);
const hojeUTC = Date.UTC(brt.getUTCFullYear(), brt.getUTCMonth(), brt.getUTCDate());
const diaDoAno = Math.floor((hojeUTC - inicioAno) / 86400000); // 1..365/366
const idx = Math.min(ANO.length - 1, Math.max(0, diaDoAno - 1));
const dia = ANO[idx];
const ens = porId[dia.e] || {};

const semMarcador = (s) => (s || "").replace(/\{ESPOSA\}/g, "sua esposa");
function cortar(s, n) {
  s = semMarcador(s).trim();
  if (s.length <= n) return s;
  return s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
}

const tema = ens.tema || "Reflexão de hoje";
const fonte = ens.fonte || "";
const title = "São José · " + tema;
const body = cortar(dia.reflexao, 120) + "  ✦ Toque para a reflexão de hoje" + (fonte ? " (" + fonte + ")." : ".");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:igorarm@gmail.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

let sub;
try {
  sub = JSON.parse(process.env.PUSH_SUBSCRIPTION);
} catch (e) {
  console.error("PUSH_SUBSCRIPTION ausente ou inválido. Configure o segredo do repositório.");
  process.exit(1);
}

const payload = JSON.stringify({ title, body, url: URL_APP });

webpush
  .sendNotification(sub, payload, { TTL: 6 * 3600 })
  .then(() => console.log("OK — push enviado (dia " + dia.dia + "): " + title))
  .catch((err) => {
    console.error("Falha no envio:", err.statusCode, err.body || err.message);
    // 404/410 = inscrição expirada: o usuário precisa reativar no app
    process.exit(1);
  });
