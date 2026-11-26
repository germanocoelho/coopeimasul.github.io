/* =====================================================================
   COOPIMS · Iconografia própria
   Desenho original da COOPIMS: traço fino, cantos em degrau e o losango
   como assinatura, num diálogo (sem cópia) com a geometria das pinturas
   Kadiwéu, a cerâmica Terena e o trançado Guarani Kaiowá.
   Os ícones entram sozinhos no menu e nos botões; nada é baixado de fora.
   ===================================================================== */
(function(){
  'use strict';
  var P = {
    // losango com núcleo: semente, a marca-mãe do conjunto
    semente: '<path d="M12 2.5 21.5 12 12 21.5 2.5 12Z"/><path d="M12 7.5 16.5 12 12 16.5 7.5 12Z"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    roda: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="3.5" r="1.6" fill="currentColor" stroke="none"/><circle cx="19.4" cy="7.8" r="1.6" fill="currentColor" stroke="none"/><circle cx="19.4" cy="16.2" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="20.5" r="1.6" fill="currentColor" stroke="none"/><circle cx="4.6" cy="16.2" r="1.6" fill="currentColor" stroke="none"/><circle cx="4.6" cy="7.8" r="1.6" fill="currentColor" stroke="none"/><path d="M12 9.5 14.5 12 12 14.5 9.5 12Z"/>',
    historia: '<path d="M12 12h3v-3h-6v6h9v-9h-12v12h15"/>',
    roca: '<path d="M3 20h18M5 17h14"/><path d="M12 17V8"/><path d="M12 11c-3.5 0-5-2-5.5-5 3 0 5 1.5 5.5 5Z"/><path d="M12 9c3.5 0 5-2 5.5-5-3 0-5 1.5-5.5 5Z"/>',
    organograma: '<path d="M10 3h4v4h-4zM3 17h4v4H3zM10 17h4v4h-4zM17 17h4v4h-4z"/><path d="M12 7v4M5 17v-3h14v3M12 11v6"/>',
    cronograma: '<path d="M4 6h16v14H4z"/><path d="M4 10h16"/><path d="M8 3v4M16 3v4"/><path d="M7 13h3v3H7zM13 13h4M13 16h2"/>',
    diretoria: '<path d="M4 15c0-4.5 3.6-8 8-8s8 3.5 8 8"/><path d="M12 7V2.8M8 8 6.3 4.3M16 8l1.7-3.7M5.2 11 2.6 8.6M18.8 11l2.6-2.4"/><path d="M4 15h16v3H4z"/><path d="M8 15v3M12 15v3M16 15v3"/>',
    galeria: '<path d="M3 5h18v14H3z"/><path d="M3 16l5-5 4 4 3-3 6 6"/><path d="M16 6.8 17.6 8.4 16 10 14.4 8.4Z" fill="currentColor"/>',
    transparencia: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><path d="M12 8.8 15.2 12 12 15.2 8.8 12Z"/>',
    esg: '<path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15Z"/><path d="M5 19 14 10M9 15h3v-3M12 12h2.5V9.5"/>',
    lei: '<path d="M12 3v17M7 20h10"/><path d="M4 7h16"/><path d="M6 7 3 13h6L6 7ZM18 7l-3 6h6l-3-6Z"/>',
    acervo: '<path d="M4 4h6c1.1 0 2 .9 2 2v14c0-1.1-.9-2-2-2H4Z"/><path d="M20 4h-6c-1.1 0-2 .9-2 2v14c0-1.1.9-2 2-2h6Z"/><path d="M6 8h3M6 11h3M15 8h3M15 11h3"/>',
    mapa: '<path d="M12 21.5 5.5 12.5A7 7 0 1 1 18.5 12.5Z"/><path d="M12 6.3 14.7 9 12 11.7 9.3 9Z"/>',
    apoio: '<path d="M9 4.5 15.5 11 9 17.5 2.5 11Z"/><path d="M15 6.5 21.5 13 15 19.5 8.5 13Z"/>',
    noticia: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 12h8M8 15h5"/><path d="M16 4v3h3"/>',
    midia: '<path d="M3 10v4h3l6 5V5L6 10Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    contato: '<path d="M3 6h18v12H3z"/><path d="m3 6 4.5 4.5h3L12 12l1.5-1.5h3L21 6"/>',
    baixar: '<path d="M12 3v10M8 9.5l4 4 4-4"/><path d="M4 15l2 6h12l2-6"/><path d="M7.5 18h9"/>',
    whats: '<path d="M4 19.5 5.3 15.6A8 8 0 1 1 8.4 18.7Z"/><path d="M9 9.5c.3 2.4 2.1 4.2 4.5 4.5l1.2-1.2 1.8.9"/>',
    salvar: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><path d="M12 13.5 14.5 16 12 18.5 9.5 16Z"/>',
    seta: '<path d="M4 12h12"/><path d="M12 6h3v3h3v6h-3v3h-3"/>',
    imprimir: '<path d="M7 9V4h10v5"/><path d="M5 9h14v8h-2v3H7v-3H5z"/><path d="M9 14h6M9 17h6"/>',
    cadeado: '<path d="M5 11h14v10H5z"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 14l2 2-2 2-2-2Z"/>',
    nuvem: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z"/><path d="M12 16v-5M9.5 13.5 12 11l2.5 2.5"/>',
    email: '<path d="M3 6h18v12H3z"/><path d="m3 6 9 7 9-7"/>',
    copiar: '<path d="M8 8h12v12H8z"/><path d="M16 8V4H4v12h4"/>',
    lixeira: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    pessoa: '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c.6-4 3.3-6.5 7-6.5s6.4 2.5 7 6.5"/><path d="M9.5 17h5"/>',
    estrela: '<path d="M12 2.8l2.6 6 6.4.7-4.8 4.4 1.3 6.4L12 17l-5.5 3.3 1.3-6.4L3 9.5l6.4-.7Z"/>',
    recarregar: '<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>',
    lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M10.5 8 13 10.5 10.5 13 8 10.5Z"/>',
    planilha: '<path d="M4 4h16v16H4z"/><path d="M4 9h16M4 14h16M10 4v16"/>',
    agenda: '<path d="M4 6h16v14H4z"/><path d="M4 10h16M8 3v4M16 3v4"/><path d="M12 13l2 2-2 2-2-2Z"/>'
  };

  // sprite único no topo do documento
  function instalarSprite(){
    if (document.getElementById('coopims-icones')) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" id="coopims-icones" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
    for (var k in P) s += '<symbol id="ci-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + P[k] + '</symbol>';
    s += '</svg>';
    var d = document.createElement('div'); d.innerHTML = s;
    document.body.insertBefore(d.firstChild, document.body.firstChild);
  }
  function icone(nome, cls){
    return '<svg class="ci ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#ci-' + nome + '"/></svg>';
  }
  window.COOPIMS_icone = icone;

  // menu principal
  var MENU = {quemsomos:'roda', historia:'historia', atividades:'roca', governanca:'semente', organograma:'organograma',
    cronograma:'cronograma', diretoria:'diretoria', galeria:'galeria', transparencia:'transparencia', esg:'esg',
    legislacao:'lei', acervo:'acervo', mapa:'mapa', apoiadores:'apoio', noticias:'noticia', midia:'midia', contato:'contato', admArea:'estrela'};
  function menu(){
    [].forEach.call(document.querySelectorAll('nav.main a[href^="#"]'), function(a){
      if (a.querySelector('.ci')) return;
      var n = MENU[a.getAttribute('href').slice(1)]; if (!n) return;
      // o texto do link é trocado pelo sistema de idiomas: o ícone vai num span à parte
      a.insertAdjacentHTML('afterbegin', icone(n, 'ci-menu'));
      a.classList.add('com-ci');
      if (a.classList.contains('adm')){ a.innerHTML = a.innerHTML.replace('⭐', ''); }
    });
  }

  // botões: tira o emoji do texto e põe o ícone desenhado
  var REGRAS = [
    [/whats/i, 'whats'], [/mail|e-mail/i, 'email'], [/pdf|baixar|⭳|download/i, 'baixar'],
    [/csv|planilha|export/i, 'planilha'], [/imprimir|print/i, 'imprimir'], [/publicar no github|💾/i, 'nuvem'],
    [/privad|🔒/i, 'cadeado'], [/recarregar|reload/i, 'recarregar'], [/copiar|copy/i, 'copiar'],
    [/excluir|remover|apagar|delete/i, 'lixeira'], [/agendar/i, 'agenda'], [/salvar|adicionar|publicar|registrar|save|add/i, 'salvar'],
    [/conhe|saiba|ver mais|learn|discover|conoce|découvr/i, 'seta'], [/entrar|login/i, 'pessoa'], [/ficha|cooperad/i, 'pessoa']
  ];
  var EMOJI = /^[\s☀-➿⬀-⯿️‍]*(?:[\uD83C-\uDBFF][\uDC00-\uDFFF][️‍]*)*\s*/;
  function botoes(raiz){
    [].forEach.call((raiz || document).querySelectorAll('.btn, .si-btn'), function(b){
      if (b.querySelector('svg')) return;
      var txt = (b.textContent || '') + ' ' + (b.id || '');
      for (var i = 0; i < REGRAS.length; i++){
        if (REGRAS[i][0].test(txt)){
          // remove emoji/sinal inicial apenas de nós de texto
          var no = b.firstChild;
          while (no && no.nodeType === 3 && !no.nodeValue.trim()) no = no.nextSibling;
          if (no && no.nodeType === 3) no.nodeValue = no.nodeValue.replace(EMOJI, '').replace(/^⭳\s*/, '');
          b.insertAdjacentHTML('afterbegin', icone(REGRAS[i][1], 'ci-btn'));
          b.classList.add('com-ci');
          return;
        }
      }
    });
  }
  // links para PDF ganham o cesto de baixar
  function documentos(){
    [].forEach.call(document.querySelectorAll('a[href$=".pdf"]'), function(a){
      if (a.querySelector('svg') || a.closest('nav')) return;
      a.insertAdjacentHTML('afterbegin', icone('baixar', 'ci-doc'));
      a.classList.add('com-ci');
    });
  }

  function iniciar(){
    instalarSprite(); menu(); botoes(); documentos();
    // conteúdo que o site monta depois (painel, listas) também recebe ícones
    var pend = 0;
    new MutationObserver(function(){
      if (pend) return;
      pend = setTimeout(function(){ pend = 0; menu(); botoes(); documentos(); }, 300);
    }).observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
