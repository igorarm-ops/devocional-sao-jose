/* ============================================================
   O AMOR JAMAIS ACABA — Devocional do Esposo (ano inteiro)
   Dados: window.ENSINAMENTOS (acervo) + window.REFLEXOES_ANO (366 dias)
   ============================================================ */

(function () {
  "use strict";

  var KEY_NOME = "oracao_esposa";
  var KEY_DIAS = "oracao_dias_vividos";
  var KEY_LONGA = "oracao_pref_longa";   // "1" = abrir reflexão profunda por padrão
  var KEY_ESCALA = "oracao_escala";       // escala de fonte (0.9–1.4)

  var TIPO_SELO = {
    santo: "Ensinamento de um Santo",
    papa: "Carta de um Papa",
    escritura: "Palavra de Deus",
    veneravel: "Ensinamento de um Venerável"
  };
  var MESES = ["janeiro","fevereiro","março","abril","maio","junho",
               "julho","agosto","setembro","outubro","novembro","dezembro"];
  var DIAS_SEMANA = ["domingo","segunda-feira","terça-feira","quarta-feira",
                     "quinta-feira","sexta-feira","sábado"];
  var DIAS_NO_MES = [31,29,31,30,31,30,31,31,30,31,30,31]; // ano bissexto (366)

  var ANO = (window.REFLEXOES_ANO || []).slice().sort(function (a, b) { return a.dia - b.dia; });
  var ENS_POR_ID = {};
  (window.ENSINAMENTOS || []).forEach(function (e) { ENS_POR_ID[e.id] = e; });

  var estado = { indice: 0, hoje: 0, expandida: false };

  /* ---------- utilidades ---------- */
  function el(id) { return document.getElementById(id); }
  function nomeEsposa() { return localStorage.getItem(KEY_NOME) || "minha esposa"; }
  function aplicarNome(txt) { return (txt || "").replace(/\{ESPOSA\}/g, nomeEsposa()); }
  function prefLonga() { return localStorage.getItem(KEY_LONGA) === "1"; }

  function isoLocal(d) {
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var dia = ("0" + d.getDate()).slice(-2);
    return d.getFullYear() + "-" + m + "-" + dia;
  }
  function diaDoAno(d) {
    var inicio = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - inicio) / 86400000); // 1..365/366
  }
  function mesDoDia(n) { // dia 1..366 -> mês 1..12 (referência bissexta)
    var acc = 0;
    for (var m = 0; m < 12; m++) {
      acc += DIAS_NO_MES[m];
      if (n <= acc) return m + 1;
    }
    return 12;
  }
  function lerDias() {
    try { return JSON.parse(localStorage.getItem(KEY_DIAS)) || []; }
    catch (e) { return []; }
  }
  function salvarDias(arr) { localStorage.setItem(KEY_DIAS, JSON.stringify(arr)); }

  /* ---------- sequência (streak) ---------- */
  function calcularSequencia() {
    var dias = lerDias();
    if (!dias.length) return 0;
    var conjunto = {};
    dias.forEach(function (d) { conjunto[d] = true; });
    var seq = 0, cursor = new Date();
    if (!conjunto[isoLocal(cursor)]) cursor.setDate(cursor.getDate() - 1);
    while (conjunto[isoLocal(cursor)]) { seq++; cursor.setDate(cursor.getDate() - 1); }
    return seq;
  }

  /* ---------- renderização ---------- */
  function entradaAtual() { return ANO[estado.indice]; }
  function ensinamentoAtual() { return ENS_POR_ID[entradaAtual().e] || {}; }

  function render() {
    var d = entradaAtual();
    var ens = ensinamentoAtual();

    el("selo").textContent = TIPO_SELO[ens.tipo] || "Ensinamento";
    el("selo").className = "selo" + (estado.indice === estado.hoje ? " hoje" : "");

    el("fonteNome").textContent = ens.fonte || "";
    el("fontePeriodo").textContent = ens.periodo || "";
    el("tema").textContent = ens.tema || "";
    el("ensinamento").textContent = aplicarNome(ens.ensinamento);
    el("referencia").textContent = ens.referencia || "";
    el("reflexao").textContent = aplicarNome(d.reflexao);
    el("reflexaoLonga").innerHTML = "";
    aplicarNome(d.reflexaoLonga).split(/\n\n+/).forEach(function (par) {
      var p = document.createElement("p");
      p.textContent = par.trim();
      el("reflexaoLonga").appendChild(p);
    });
    el("gesto").textContent = aplicarNome(d.gesto);
    el("oracao").textContent = aplicarNome(d.oracao);
    el("versiculo").textContent = ens.versiculo || "";

    el("contadorDia").textContent = "Dia " + d.dia + " de 366";

    estado.expandida = prefLonga();
    aplicarExpansao();

    var pag = el("pagina");
    pag.classList.remove("troca"); void pag.offsetWidth; pag.classList.add("troca");

    atualizarBotaoVivido();
  }

  function aplicarExpansao() {
    var bloco = el("blocoLonga");
    var btn = el("btnAprofundar");
    if (estado.expandida) {
      bloco.hidden = false;
      btn.textContent = "▴ Recolher a reflexão";
      btn.setAttribute("aria-expanded", "true");
    } else {
      bloco.hidden = true;
      btn.textContent = "▾ Aprofundar a reflexão";
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function atualizarBotaoVivido() {
    var btn = el("btnVivido");
    var marcado = lerDias().indexOf(isoLocal(new Date())) !== -1;
    btn.textContent = marcado ? "✓ Vivido hoje, graças a Deus" : "♥ Marcar como vivido hoje";
    btn.classList.toggle("vivido", marcado);
  }

  function renderRodape() {
    var seq = calcularSequencia(), total = lerDias().length, txt;
    if (seq > 0) {
      txt = '<span class="chama">✦</span> <strong>' + seq + '</strong> ' +
            (seq === 1 ? "dia seguido" : "dias seguidos") + " amando com intenção";
    } else {
      txt = '<span class="chama">✦</span> Comece hoje a sua sequência de amor';
    }
    if (total > 0) txt += ' &nbsp;·&nbsp; ' + total + " " + (total === 1 ? "dia vivido" : "dias vividos") + " ao todo";
    el("rodapeSeq").innerHTML = txt;
  }

  function renderData() {
    var d = new Date();
    el("data").textContent = DIAS_SEMANA[d.getDay()] + " · " + d.getDate() + " de " +
      MESES[d.getMonth()] + " de " + d.getFullYear();
  }
  function renderParaQuem() {
    var nome = localStorage.getItem(KEY_NOME);
    el("paraQuem").textContent = nome ? "Para " + nome + ", com amor  ✎" : "✎ Para quem você ama?";
  }

  /* ---------- ações ---------- */
  function marcarVivido() {
    var hoje = isoLocal(new Date()), dias = lerDias(), i = dias.indexOf(hoje);
    if (i === -1) dias.push(hoje); else dias.splice(i, 1);
    salvarDias(dias);
    atualizarBotaoVivido();
    renderRodape();
  }
  function navegar(passo) {
    estado.indice = (estado.indice + passo + ANO.length) % ANO.length;
    render();
  }
  function irHoje() { estado.indice = estado.hoje; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function alternarAprofundar() {
    estado.expandida = !estado.expandida;
    aplicarExpansao();
  }
  function alternarPrefLonga() {
    var novo = !prefLonga();
    localStorage.setItem(KEY_LONGA, novo ? "1" : "0");
    el("prefLonga").classList.toggle("ativo", novo);
    el("prefLonga").setAttribute("aria-pressed", String(novo));
    el("prefLonga").textContent = novo ? "📖 Reflexão profunda: sempre aberta" : "📖 Reflexão profunda: ao tocar";
    estado.expandida = novo;
    aplicarExpansao();
  }

  function definirNome() {
    var atual = localStorage.getItem(KEY_NOME) || "";
    var nome = window.prompt("Como se chama a mulher que você ama?\n(O nome dela aparece nos gestos e nas orações)", atual);
    if (nome === null) return;
    nome = nome.trim();
    if (nome) localStorage.setItem(KEY_NOME, nome); else localStorage.removeItem(KEY_NOME);
    renderParaQuem();
    render();
  }

  /* ---------- tamanho da fonte ---------- */
  function escalaAtual() { return parseFloat(localStorage.getItem(KEY_ESCALA)) || 1; }
  function aplicarEscala() { document.documentElement.style.setProperty("--escala", escalaAtual()); }
  function mudarEscala(delta) {
    var nova = Math.min(1.4, Math.max(0.9, Math.round((escalaAtual() + delta) * 100) / 100));
    localStorage.setItem(KEY_ESCALA, nova);
    aplicarEscala();
  }


  /* ---------- compartilhar ---------- */
  function compartilhar(texto) {
    if (navigator.share) {
      navigator.share({ text: texto }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank");
    }
  }
  function compartilharGesto() {
    var d = entradaAtual();
    compartilhar("💛 Gesto de amor de hoje: " + aplicarNome(d.gesto));
  }

  /* ---------- painel "ver todos" (dias + acervo) ---------- */
  function abrirPainel() {
    montarAbaDias();
    montarAbaAcervo();
    selecionarAba("dias");
    el("overlay").classList.add("aberto");
  }
  function fecharPainel() { el("overlay").classList.remove("aberto"); }
  function selecionarAba(qual) {
    el("abaDias").hidden = qual !== "dias";
    el("abaAcervo").hidden = qual !== "acervo";
    el("tabDias").classList.toggle("ativo", qual === "dias");
    el("tabAcervo").classList.toggle("ativo", qual === "acervo");
  }
  function montarAbaDias() {
    var cont = el("abaDias");
    if (cont.dataset.pronto) return;
    var mesAtual = 0, html = "";
    ANO.forEach(function (d, idx) {
      var m = mesDoDia(d.dia);
      if (m !== mesAtual) {
        mesAtual = m;
        html += '<h3 class="grupo-mes">' + MESES[m - 1].toUpperCase() + "</h3>";
      }
      var ens = ENS_POR_ID[d.e] || {};
      html += '<button class="lista-item" data-idx="' + idx + '">' +
                '<span class="num">' + d.dia + '</span>' +
                '<span class="info"><span class="li-tema">' + (ens.tema || "") + '</span>' +
                '<span class="li-fonte">' + (ens.fonte || "") + '</span></span></button>';
    });
    cont.innerHTML = html;
    cont.dataset.pronto = "1";
    cont.addEventListener("click", function (e) {
      var b = e.target.closest(".lista-item"); if (!b) return;
      estado.indice = parseInt(b.dataset.idx, 10);
      fecharPainel(); render(); window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function montarAbaAcervo() {
    var cont = el("abaAcervo");
    if (cont.dataset.pronto) return;
    var html = "";
    (window.ENSINAMENTOS || []).forEach(function (ens) {
      var idx = -1;
      for (var i = 0; i < ANO.length; i++) { if (ANO[i].e === ens.id) { idx = i; break; } }
      html += '<button class="lista-item" data-idx="' + idx + '">' +
                '<span class="num selo-tipo ' + ens.tipo + '">' + (ens.tipo === "papa" ? "✠" : ens.tipo === "escritura" ? "✝" : ens.tipo === "veneravel" ? "✦" : "★") + '</span>' +
                '<span class="info"><span class="li-tema">' + ens.tema + '</span>' +
                '<span class="li-fonte">' + ens.fonte + '</span></span></button>';
    });
    cont.innerHTML = html;
    cont.dataset.pronto = "1";
    cont.addEventListener("click", function (e) {
      var b = e.target.closest(".lista-item"); if (!b) return;
      var idx = parseInt(b.dataset.idx, 10);
      if (idx >= 0) { estado.indice = idx; fecharPainel(); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  /* ---------- bilhete de amor ---------- */
  var ultimoBilhete = -1;
  function sortearBilhete() {
    var lista = window.BILHETES || [], i;
    do { i = Math.floor(Math.random() * lista.length); }
    while (i === ultimoBilhete && lista.length > 1);
    ultimoBilhete = i;
    return aplicarNome(lista[i]);
  }
  function mostrarBilhete() {
    var t = sortearBilhete();
    el("bilheteTxt").textContent = "“" + t + "”";
    el("bilhete").dataset.texto = t;
    el("bilhete").classList.add("mostra");
  }
  function fecharBilhete() { el("bilhete").classList.remove("mostra"); }
  function copiarBilhete() {
    var t = el("bilhete").dataset.texto || "", btn = el("btnCopiar");
    function ok() { btn.textContent = "Copiado! ✓"; setTimeout(function () { btn.textContent = "Copiar"; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {} document.body.removeChild(ta);
    }
  }
  function enviarBilhete() { compartilhar(el("bilhete").dataset.texto || ""); }

  /* ---------- lembrete diário (notificação push) ---------- */
  var VAPID_PUBLIC = "BLED5GBXuJRjGk8h8vbWlTBSVC2nv0lfMK7EwgBukD96lAaaoa7k3vkA6hl1wP_ZNxyDl_tXx8_w9KRyLBz_46A";

  function pushSuportado() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }
  function ehInstalado() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function b64ToUint8(base64) {
    var pad = "=".repeat((4 - base64.length % 4) % 4);
    var b = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(b), arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }
  function msgLembrete(texto, sub) {
    el("lembreteMsg").textContent = texto;
    var ta = el("lembreteSub");
    if (sub) { ta.value = sub; ta.hidden = false; el("btnCopiarSub").hidden = false; }
    else { ta.value = ""; ta.hidden = true; el("btnCopiarSub").hidden = true; }
    el("lembreteBox").hidden = false;
    el("lembreteBox").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function setBotaoLembrete(ativo) {
    var b = el("btnLembrete");
    if (!b) return;
    b.textContent = ativo ? "🔔 Lembrete ativo" : "🔔 Lembrete diário";
    b.classList.toggle("vivido", !!ativo);
  }
  function initLembrete() {
    if (!pushSuportado()) { setBotaoLembrete(false); return; }
    navigator.serviceWorker.ready
      .then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (sub) { setBotaoLembrete(!!sub); })
      .catch(function () {});
  }
  function ativarLembrete() {
    if (!pushSuportado()) {
      msgLembrete("Para receber o lembrete no iPhone, abra este app pela Tela de Início (instalado), e não pelo Safari. Toque em Compartilhar (↑) › Adicionar à Tela de Início, e abra por aquele ícone.");
      return;
    }
    if (!ehInstalado()) {
      msgLembrete("Quase lá! No iPhone, o lembrete só funciona com o app instalado. Toque em Compartilhar (↑) › Adicionar à Tela de Início, abra o app por esse ícone e toque de novo em “Lembrete diário”.");
      return;
    }
    Notification.requestPermission().then(function (perm) {
      if (perm !== "granted") {
        msgLembrete("As notificações estão bloqueadas. Você pode liberar em Ajustes › Notificações › São José, e tentar de novo.");
        return;
      }
      navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (sub) {
          return sub || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(VAPID_PUBLIC) });
        });
      }).then(function (sub) {
        setBotaoLembrete(true);
        msgLembrete("Quase pronto! Copie o código abaixo e cole na conversa com o Claude — é ele que finaliza o envio diário das 10h.", JSON.stringify(sub));
      }).catch(function (e) {
        msgLembrete("Não consegui ativar agora (" + (e && e.message ? e.message : "erro") + "). Tente novamente daqui a pouco.");
      });
    });
  }
  function copiarSub() {
    var ta = el("lembreteSub"), btn = el("btnCopiarSub");
    function ok() { btn.textContent = "Copiado! ✓"; setTimeout(function () { btn.textContent = "Copiar código"; }, 1600); }
    function fb() { ta.hidden = false; ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(ok, fb);
    else fb();
  }

  /* ---------- inicialização ---------- */
  function init() {
    if (!ANO.length || !window.ENSINAMENTOS) {
      document.body.innerHTML = '<p style="color:#fff;font-family:serif;padding:40px;text-align:center">' +
        "Conteúdo do devocional não carregou. Verifique ensinamentos.js e reflexoes-ano.js.</p>";
      return;
    }
    estado.hoje = Math.min(ANO.length - 1, diaDoAno(new Date()) - 1);
    estado.indice = estado.hoje;

    aplicarEscala();
    if (prefLonga()) {
      el("prefLonga").classList.add("ativo");
      el("prefLonga").setAttribute("aria-pressed", "true");
      el("prefLonga").textContent = "📖 Reflexão profunda: sempre aberta";
    }

    renderData(); renderParaQuem(); render(); renderRodape();

    el("btnVivido").addEventListener("click", marcarVivido);
    el("btnAnterior").addEventListener("click", function () { navegar(-1); });
    el("btnProximo").addEventListener("click", function () { navegar(1); });
    el("btnHoje").addEventListener("click", irHoje);
    el("btnTodos").addEventListener("click", abrirPainel);
    el("btnBilhete").addEventListener("click", mostrarBilhete);
    el("paraQuem").addEventListener("click", definirNome);

    el("btnAprofundar").addEventListener("click", alternarAprofundar);
    el("prefLonga").addEventListener("click", alternarPrefLonga);
    el("btnCompartilharGesto").addEventListener("click", compartilharGesto);
    el("btnFonteMais").addEventListener("click", function () { mudarEscala(0.1); });
    el("btnFonteMenos").addEventListener("click", function () { mudarEscala(-0.1); });

    el("tabDias").addEventListener("click", function () { selecionarAba("dias"); });
    el("tabAcervo").addEventListener("click", function () { selecionarAba("acervo"); });
    el("fecharTodos").addEventListener("click", fecharPainel);
    el("overlay").addEventListener("click", function (e) { if (e.target === el("overlay")) fecharPainel(); });

    el("btnCopiar").addEventListener("click", copiarBilhete);
    el("btnEnviarBilhete").addEventListener("click", enviarBilhete);
    el("btnFecharBilhete").addEventListener("click", fecharBilhete);
    el("btnOutroBilhete").addEventListener("click", mostrarBilhete);

    el("btnLembrete").addEventListener("click", ativarLembrete);
    el("btnCopiarSub").addEventListener("click", copiarSub);
    el("btnFecharLembrete").addEventListener("click", function () { el("lembreteBox").hidden = true; });
    initLembrete();

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { fecharPainel(); fecharBilhete(); }
      if (el("overlay").classList.contains("aberto")) return;
      if (e.key === "ArrowLeft") navegar(-1);
      if (e.key === "ArrowRight") navegar(1);
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
