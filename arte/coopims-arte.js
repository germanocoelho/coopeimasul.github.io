/* =====================================================================
   COOPIMS · Módulo de arte, ilustração e movimento
   Todas as ilustrações são desenhadas em código (SVG) neste arquivo:
   são obra original feita para a COOPIMS, sem imagens de terceiros.
   Referências visuais: roças de milho, mandioca, abóbora e feijão;
   cerrado e Pantanal; grafismos inspirados (não copiados) na cerâmica
   Terena, na pintura Kadiwéu e no trançado Guarani Kaiowá.
   ===================================================================== */
(function(){
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- idioma ---------- */
  function lang(){
    try { return (window.COOPIMS_getLang && window.COOPIMS_getLang()) || localStorage.getItem('coopims_lang') || 'pt'; }
    catch(e){ return 'pt'; }
  }
  var TXT = {
    contador: {pt:'{n} sementes plantadas nesta visita', en:'{n} seeds planted on this visit', es:'{n} semillas plantadas en esta visita', fr:'{n} graines semées pendant cette visite'},
    contador1:{pt:'1 semente plantada nesta visita', en:'1 seed planted on this visit', es:'1 semilla plantada en esta visita', fr:'1 graine semée pendant cette visite'},
    principio:{pt:'Princípio', en:'Principle', es:'Principio', fr:'Principe'},
    pratica:  {pt:'Na COOPIMS:', en:'At COOPIMS:', es:'En la COOPIMS:', fr:'À la COOPIMS :'},
    ver:      {pt:'Ver princípio', en:'See principle', es:'Ver principio', fr:'Voir le principe'}
  };
  function t(k, n){
    var e = TXT[k]; var s = e ? (e[lang()] || e.pt) : k;
    return n != null ? s.replace('{n}', n) : s;
  }

  /* ---------- aleatório reprodutível ---------- */
  function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var r = Math.imul(seed ^ seed >>> 15, 1 | seed); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }

  /* =====================================================================
     PLANTAS (base em 0,0; crescem para cima)
     ===================================================================== */
  function milho(r, jovem){
    var h = jovem ? 70 : 140 + r()*30, s = '';
    var verde = ['#4C9A35','#3F8A2E','#5AA83F'][Math.floor(r()*3)];
    s += '<path d="M0 0 C 2 -' + (h*.3) + ' -3 -' + (h*.65) + ' 1 -' + h + '" stroke="#3B7228" stroke-width="' + (jovem?4:5) + '" fill="none" stroke-linecap="round"/>';
    var nf = jovem ? 3 : 5;
    for (var k = 0; k < nf; k++){
      var y = -(h*.16) - k*(h*.16), lado = k % 2 ? 1 : -1, c = 0.75 + r()*.5;
      s += '<path d="M0 ' + y + ' C ' + (lado*30*c) + ' ' + (y-20) + ', ' + (lado*60*c) + ' ' + (y-8) + ', ' + (lado*74*c) + ' ' + (y+18) +
           ' C ' + (lado*50*c) + ' ' + (y-1) + ', ' + (lado*24*c) + ' ' + (y-3) + ', 0 ' + (y+7) + ' Z" fill="' + verde + '"/>';
    }
    if (!jovem){
      s += '<g transform="translate(5,-' + (h*.5) + ') rotate(20)"><ellipse rx="7.5" ry="21" fill="#E8B53A"/>' +
           '<path d="M-8 6 C -10 -10 -6 -22 0 -26 C -2 -14 -2 0 -8 6 Z M8 6 C 10 -10 6 -22 0 -26 C 2 -14 2 0 8 6 Z" fill="#7CAE4A"/>' +
           '<path d="M0 -24 C 3 -32 -2 -36 4 -42" stroke="#C9773A" stroke-width="1.6" fill="none"/></g>';
      s += '<path d="M1 -' + h + ' l-12 -20 M1 -' + h + ' l1 -26 M1 -' + h + ' l12 -19 M1 -' + h + ' l-5 -24" stroke="#D8B24A" stroke-width="2.2" stroke-linecap="round"/>';
    }
    return s;
  }
  function mandioca(r, jovem){
    var s = '', escala = jovem ? .55 : 1;
    var hastes = [[-34,-92],[2,-116],[36,-98],[-14,-70],[20,-74]];
    hastes.forEach(function(p, i){
      if (jovem && i > 2) return;
      var x = p[0]*escala, y = p[1]*escala;
      s += '<path d="M0 0 Q ' + (x*.3) + ' ' + (y*.55) + ' ' + x + ' ' + y + '" stroke="#8E3B2B" stroke-width="3" fill="none" stroke-linecap="round"/>';
      var lobos = 7, base = -90;
      for (var k = 0; k < lobos; k++){
        var a = base - 75 + k*25 + (r()*8-4);
        var cor = k % 2 ? '#3D8A3A' : '#56A845';
        s += '<ellipse cx="' + x + '" cy="' + (y-13*escala) + '" rx="' + (3.6*escala+1) + '" ry="' + (15*escala+3) + '" fill="' + cor + '" transform="rotate(' + (a+90) + ' ' + x + ' ' + y + ')"/>';
      }
    });
    return s;
  }
  function abobora(r, jovem){
    var s = '<path d="M-70 0 C -40 -14 -10 8 20 -4 S 70 -6 90 2" stroke="#4E8A33" stroke-width="3.5" fill="none"/>';
    var folhas = jovem ? [[0,-6]] : [[-48,-10],[8,-14],[62,-10]];
    folhas.forEach(function(f){
      s += '<g transform="translate(' + f[0] + ',' + f[1] + ')"><path d="M0 0 C -26 -6 -30 -34 -12 -40 C -6 -50 8 -50 13 -40 C 30 -36 28 -8 0 0 Z" fill="#4A9A3C"/><path d="M0 0 L0 -36 M0 -18 L-12 -28 M0 -18 L12 -28" stroke="#2F6B2A" stroke-width="1.4"/></g>';
    });
    if (!jovem){
      s += '<g transform="translate(-14,4)"><ellipse rx="28" ry="19" fill="#E07A1F"/><path d="M-14 -16 C -20 -4 -20 6 -14 17 M0 -19 L0 19 M14 -16 C 20 -4 20 6 14 17" stroke="#B85A12" stroke-width="2" fill="none"/><path d="M0 -19 l3 -9" stroke="#5B7A2A" stroke-width="4" stroke-linecap="round"/></g>';
      if (r() > .4) s += '<g transform="translate(48,6)"><ellipse rx="19" ry="13" fill="#E8902C"/><path d="M-9 -11 C -13 0 -13 4 -9 12 M0 -13 L0 13 M9 -11 C 13 0 13 4 9 12" stroke="#B85A12" stroke-width="1.6" fill="none"/></g>';
    }
    return s;
  }
  function feijao(r, jovem){
    var s = '', n = jovem ? 3 : 6;
    for (var k = 0; k < n; k++){
      var x = (r()*2-1)*28, y = -12 - r()*38, a = r()*40-20;
      s += '<path d="M0 0 Q ' + (x*.4) + ' ' + (y*.5) + ' ' + x + ' ' + y + '" stroke="#4E8A33" stroke-width="2" fill="none"/>';
      s += '<g transform="translate(' + x + ',' + y + ') rotate(' + a + ')"><ellipse cx="-7" cy="0" rx="7" ry="4.5" fill="#5AA83F"/><ellipse cx="7" cy="0" rx="7" ry="4.5" fill="#4C9A35"/><ellipse cx="0" cy="-7" rx="4.5" ry="7" fill="#64B046"/></g>';
      if (!jovem && r() > .5) s += '<path d="M' + (x+4) + ' ' + (y+6) + ' q 6 10 2 20" stroke="#8C6D2A" stroke-width="3" fill="none" stroke-linecap="round"/>';
    }
    return s;
  }
  var PLANTAS = [milho, mandioca, abobora, feijao];

  /* =====================================================================
     PESSOAS (ilustração estilizada; não retratam pessoas reais)
     ===================================================================== */
  var PELE = '#8A5636', CABELO = '#1A1412';
  function mulherCesto(){
    // mulher com o cesto (ajaka) às costas preso por alça na testa
    return '' +
    '<g class="pessoa-respira">' +
      '<path d="M-14 0 L-10 -62 L4 -62 L2 0 Z" fill="' + PELE + '"/>' +
      '<path d="M-22 -40 L-28 -118 C -20 -132 18 -132 24 -118 L20 -40 Z" fill="#B3402A"/>' +
      '<path d="M-24 -62 L22 -62" stroke="#EFE4CF" stroke-width="5"/>' +
      '<path d="M-24 -62 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6" stroke="#1E1A17" stroke-width="2" fill="none"/>' +
      '<path d="M-28 -118 C -26 -150 22 -150 24 -118 Z" fill="#EFE4CF"/>' +
      '<path d="M22 -120 C 34 -110 36 -92 30 -78" stroke="' + PELE + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-2" cy="-164" r="17" fill="' + PELE + '"/>' +
      '<path d="M-19 -166 C -20 -190 18 -192 16 -164 C 16 -150 22 -130 26 -112 C 14 -126 8 -142 6 -150 Z" fill="' + CABELO + '"/>' +
      // cesto
      '<g transform="translate(-44,-150)">' +
        '<path d="M-26 0 L26 0 L20 70 C 8 78 -8 78 -20 70 Z" fill="url(#arte-trama)" stroke="#6B4A1F" stroke-width="2"/>' +
        '<ellipse cx="0" cy="0" rx="26" ry="7" fill="#A8772F" stroke="#6B4A1F" stroke-width="2"/>' +
        '<ellipse cx="-8" cy="-5" rx="7" ry="4" fill="#E8B53A"/><ellipse cx="6" cy="-6" rx="8" ry="4" fill="#E07A1F"/><ellipse cx="-1" cy="-9" rx="5" ry="3" fill="#7CAE4A"/>' +
      '</g>' +
      '<path d="M-68 -148 C -40 -190 -6 -186 -14 -172" stroke="#6B4A1F" stroke-width="3" fill="none"/>' +
    '</g>';
  }
  function crianca(){
    return '' +
    '<g class="pessoa-respira">' +
      '<path d="M-9 0 L-7 -34 L5 -34 L4 0 Z" fill="' + PELE + '"/>' +
      '<path d="M-15 -30 L-17 -78 C -10 -88 12 -88 16 -78 L14 -30 Z" fill="#E8B53A"/>' +
      '<path d="M-16 -50 l5 -5 l5 5 l5 -5 l5 5 l5 -5 l5 5" stroke="#B3402A" stroke-width="2.2" fill="none"/>' +
      '<circle cx="0" cy="-96" r="13" fill="' + PELE + '"/>' +
      '<path d="M-13 -98 C -14 -116 14 -116 13 -98 C 10 -106 -8 -108 -13 -98 Z" fill="' + CABELO + '"/>' +
      '<path d="M14 -72 C 26 -80 30 -92 28 -104" stroke="' + PELE + '" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(30,-112) rotate(14)"><ellipse rx="6" ry="15" fill="#E8B53A"/><path d="M-6 6 C -8 -8 -4 -16 0 -19 C -1 -8 -1 0 -6 6 Z M6 6 C 8 -8 4 -16 0 -19 C 1 -8 1 0 6 6 Z" fill="#7CAE4A"/></g>' +
    '</g>';
  }
  function homemEnxada(){
    return '' +
    '<g class="pessoa-respira">' +
      '<path d="M-16 0 L-12 -70 L2 -70 L-2 0 Z M6 0 L4 -70 L16 -70 L20 0 Z" fill="#2E3A44"/>' +
      '<path d="M-20 -66 L-24 -136 C -14 -150 20 -150 26 -136 L22 -66 Z" fill="#EFE4CF"/>' +
      '<path d="M-23 -112 L25 -112" stroke="#B3402A" stroke-width="6"/>' +
      '<path d="M-23 -112 m4 -3 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6" stroke="#1E1A17" stroke-width="1.6" fill="none"/>' +
      '<circle cx="2" cy="-162" r="17" fill="' + PELE + '"/>' +
      '<path d="M-15 -166 C -14 -186 18 -186 19 -166 C 10 -174 -6 -174 -15 -166 Z" fill="' + CABELO + '"/>' +
      '<path d="M-16 -168 L20 -168" stroke="#B3402A" stroke-width="4"/>' +
      '<g class="enxada">' +
        '<path d="M22 -130 C 34 -118 44 -104 52 -92" stroke="' + PELE + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M-18 -128 C -4 -112 22 -100 50 -92" stroke="' + PELE + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M40 -120 L110 -6" stroke="#6B4A1F" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M98 -16 L128 -4 L118 10 L92 -2 Z" fill="#7A8288"/>' +
      '</g>' +
    '</g>';
  }

  /* =====================================================================
     CENA DA ROÇA
     ===================================================================== */
  function cenaRoca(){
    var r = rng(2026), s = '';
    s += '<defs>' +
      '<linearGradient id="arte-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1D36"/><stop offset=".34" stop-color="#253C6E"/><stop offset=".6" stop-color="#C4623A"/><stop offset=".72" stop-color="#F2A93B"/><stop offset="1" stop-color="#F7D27A"/></linearGradient>' +
      '<radialGradient id="arte-solbrilho"><stop offset="0" stop-color="#FFF6CF" stop-opacity=".95"/><stop offset=".35" stop-color="#FFD77A" stop-opacity=".55"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="arte-rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A04A"/><stop offset=".25" stop-color="#3C7DA8"/><stop offset="1" stop-color="#21557A"/></linearGradient>' +
      '<linearGradient id="arte-terra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A33"/><stop offset=".45" stop-color="#6B3F22"/><stop offset="1" stop-color="#4A2A14"/></linearGradient>' +
      '<linearGradient id="arte-sombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>' +
      '<pattern id="arte-trama" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#C9963F"/><rect width="5" height="10" fill="#A8772F"/><rect y="4" width="10" height="2" fill="#E2B862" opacity=".7"/></pattern>' +
      '<filter id="arte-desfoque"><feGaussianBlur stdDeviation="6"/></filter>' +
    '</defs>';
    s += '<rect width="1600" height="900" fill="url(#arte-ceu)"/>';
    // estrelas
    s += '<g class="estrela-ceu">';
    for (var i = 0; i < 46; i++) s += '<circle cx="' + (r()*1600).toFixed(0) + '" cy="' + (r()*300).toFixed(0) + '" r="' + (r()*1.6+.4).toFixed(1) + '" fill="#fff" opacity="' + (r()*.7+.3).toFixed(2) + '"/>';
    s += '</g>';
    // sol
    s += '<g class="arte-camada" data-prof=".08"><g class="sol-nasce">' +
         '<circle cx="1180" cy="575" r="300" fill="url(#arte-solbrilho)"/>' +
         '<g class="sol-raios" opacity=".16">';
    for (i = 0; i < 24; i++) s += '<path d="M1180 575 L' + (1180 + Math.cos(i/24*6.283)*620).toFixed(0) + ' ' + (575 + Math.sin(i/24*6.283)*620).toFixed(0) + ' L' + (1180 + Math.cos((i+.35)/24*6.283)*620).toFixed(0) + ' ' + (575 + Math.sin((i+.35)/24*6.283)*620).toFixed(0) + ' Z" fill="#FFE9A8"/>';
    s += '</g><circle cx="1180" cy="575" r="74" fill="#FFE8A3"/><circle cx="1180" cy="575" r="62" fill="#FFF3C9"/></g></g>';
    // bando de tuiuiús
    s += '<g class="bando">';
    [[0,0,1],[70,26,.8],[-60,34,.75]].forEach(function(b){
      s += '<g transform="translate(' + (200+b[0]) + ',' + (240+b[1]) + ') scale(' + b[2] + ')">' +
           '<path class="asa" d="M-46 -4 C -24 -26 -8 -14 0 -2 C 8 -14 24 -26 46 -4 C 24 -10 10 -2 0 4 C -10 -2 -24 -10 -46 -4 Z" fill="#F5F1E8"/>' +
           '<ellipse cx="0" cy="2" rx="12" ry="5" fill="#fff"/><path d="M10 0 L24 -4" stroke="#1E1A17" stroke-width="3"/><path d="M14 -1 L19 -2" stroke="#C0392B" stroke-width="4"/><path d="M24 -4 L36 -2" stroke="#1E1A17" stroke-width="2"/>' +
           '<path d="M-12 3 L-30 5" stroke="#1E1A17" stroke-width="1.5"/></g>';
    });
    s += '</g>';
    // serras ao fundo
    s += '<g class="arte-camada" data-prof=".12">' +
      '<path d="M0 606 Q 160 520 360 566 T 760 540 T 1180 566 T 1600 528 L1600 900 L0 900 Z" fill="#3A4878" opacity=".92"/>' +
      '<path d="M0 640 Q 280 590 560 622 T 1120 606 T 1600 626 V900 H0 Z" fill="#4E5F6A"/>' +
      '<g class="bruma" opacity=".22"><ellipse cx="400" cy="640" rx="380" ry="26" fill="#fff" filter="url(#arte-desfoque)"/><ellipse cx="1180" cy="630" rx="420" ry="24" fill="#fff" filter="url(#arte-desfoque)"/></g>' +
    '</g>';
    // cerrado, casa e árvores
    s += '<g class="arte-camada" data-prof=".25">';
    s += '<path d="M0 668 Q 400 640 800 660 T 1600 650 V900 H0Z" fill="#3E5A2E"/>';
    function ipe(x, y, k){
      var q = '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')"><path d="M0 0 C 2 -30 -6 -50 4 -74 M2 -46 C 14 -56 22 -60 30 -76 M0 -58 C -12 -66 -18 -74 -26 -84" stroke="#4A3220" stroke-width="5" fill="none" stroke-linecap="round"/>';
      [[4,-90,26],[30,-84,20],[-24,-90,20],[-6,-108,22],[18,-106,18],[-30,-74,14],[40,-70,13]].forEach(function(c){ q += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + (r() > .5 ? '#F2C230' : '#E0A81C') + '"/>'; });
      return q + '</g>';
    }
    function arbusto(x, y, k){
      var q = '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')">';
      for (var j = 0; j < 6; j++) q += '<circle cx="' + (j*9-22) + '" cy="' + (-10 - (j%2)*8) + '" r="' + (12 + (j%3)*3) + '" fill="' + (j%2 ? '#2F5A26' : '#38692C') + '"/>';
      q += '<circle cx="-8" cy="-22" r="3" fill="#C9D85A"/><circle cx="10" cy="-16" r="3" fill="#C9D85A"/></g>';
      return q;
    }
    function buriti(x, y, k){
      var q = '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')"><path d="M0 0 L3 -130" stroke="#5A4630" stroke-width="7"/>';
      for (var j = 0; j < 11; j++){ var a = -160 + j*14; q += '<path d="M3 -130 l' + (Math.cos(a*Math.PI/180)*60).toFixed(0) + ' ' + (Math.sin(a*Math.PI/180)*44).toFixed(0) + '" stroke="#3E6B2E" stroke-width="5" stroke-linecap="round"/>'; }
      return q + '</g>';
    }
    s += ipe(150, 676, 1.05) + ipe(1480, 664, .9) + ipe(760, 660, .6);
    s += buriti(1330, 668, .9) + buriti(1388, 672, .75);
    s += arbusto(560, 668, .8) + arbusto(1040, 664, .7) + arbusto(1560, 668, .8) + arbusto(60, 676, .7);
    // casa de palha com fumaça
    s += '<g transform="translate(300,668)">' +
         '<rect x="-64" y="-46" width="128" height="46" fill="#B58A5A"/><rect x="-12" y="-30" width="22" height="30" fill="#4A3220"/>' +
         '<path d="M-84 -42 L0 -96 L84 -42 Z" fill="#D8B26A"/>' +
         '<path d="M-70 -46 L-8 -88 M-40 -44 L6 -82 M-10 -44 L20 -74 M30 -44 L36 -66 M60 -44 L50 -60" stroke="#B48A44" stroke-width="2"/>' +
         '<g opacity=".7"><circle class="fumaca" cx="20" cy="-100" r="9" fill="#E8E2D6"/><circle class="fumaca" cx="26" cy="-104" r="11" fill="#E8E2D6" style="animation-delay:-2.3s"/><circle class="fumaca" cx="16" cy="-100" r="8" fill="#E8E2D6" style="animation-delay:-4.6s"/></g>' +
         '</g>';
    s += '</g>';
    // rio com canoa
    s += '<g class="arte-camada" data-prof=".35">' +
      '<path d="M0 676 C 400 652, 800 700, 1200 672 S 1600 682 1600 682 L1600 712 C 1200 702, 800 730, 400 704 S0 704 0 704 Z" fill="url(#arte-rio)"/>';
    for (i = 0; i < 16; i++){ var bx = r()*1500+40, by = 682 + r()*22; s += '<path class="brilho-rio" style="animation-delay:-' + (r()*3).toFixed(1) + 's" d="M' + bx.toFixed(0) + ' ' + by.toFixed(0) + ' h' + (20 + r()*40).toFixed(0) + '" stroke="#FFE3A3" stroke-width="2" stroke-linecap="round"/>'; }
    s += '<g class="canoa"><g transform="translate(0,684)">' +
         '<path d="M-48 0 C -30 12 30 12 52 0 Z" fill="#5A3A22"/><path d="M-40 0 L44 0" stroke="#3D2616" stroke-width="2"/>' +
         '<circle cx="0" cy="-30" r="7" fill="' + PELE + '"/><path d="M-7 -33 C -6 -42 8 -42 7 -32 Z" fill="' + CABELO + '"/><path d="M-6 -2 L-8 -22 C -4 -28 6 -28 8 -22 L6 -2 Z" fill="#B3402A"/>' +
         '<g class="remo"><path d="M4 -20 L22 18" stroke="#6B4A1F" stroke-width="2.6"/><ellipse cx="23" cy="22" rx="3" ry="7" fill="#6B4A1F" transform="rotate(-24 23 22)"/></g>' +
         '</g></g>';
    s += '</g>';
    // roça (terra, sulcos e plantas)
    s += '<g class="arte-camada" data-prof=".6">';
    s += '<path d="M0 702 C 400 692 1200 712 1600 700 L1600 900 L0 900 Z" fill="url(#arte-terra)"/>';
    for (i = -14; i <= 14; i++) s += '<path d="M' + (800 + i*38) + ' 704 L' + (800 + i*250) + ' 900" stroke="#4A2A14" stroke-width="2" opacity=".45"/>';
    var fileiras = [[724,.28,0],[752,.38,1],[786,.5,0],[826,.66,3],[868,.84,2]];
    fileiras.forEach(function(f){
      var y = f[0], k = f[1], tipo = f[2], passo = 120*k + 26;
      for (var x = -40; x < 1660; x += passo*(0.85 + r()*.3)){
        var q = r(), t;
        if (tipo === 0) t = q < .8 ? 0 : 3;
        else if (tipo === 1) t = q < .75 ? 1 : 0;
        else if (tipo === 3) t = q < .45 ? 3 : (q < .8 ? 1 : 0);
        else t = q < .3 ? 2 : (q < .65 ? 0 : (q < .85 ? 3 : 1));
        if (k > .6 && x > 780 && x < 1240) continue; // espaço das pessoas
        s += '<g transform="translate(' + x.toFixed(0) + ',' + y + ') scale(' + (k*(.9+r()*.2)).toFixed(2) + ')"><g class="balanco" style="animation-delay:-' + (r()*5).toFixed(2) + 's">' + PLANTAS[t](r) + '</g></g>';
      }
    });
    s += '</g>';
    // pessoas e plantios do visitante
    s += '<g class="arte-camada" data-prof="1">' +
      '<g class="arte-plantios"></g>' +
      '<ellipse cx="900" cy="880" rx="70" ry="10" fill="#000" opacity=".25"/><ellipse cx="985" cy="878" rx="36" ry="7" fill="#000" opacity=".22"/><ellipse cx="1150" cy="884" rx="80" ry="10" fill="#000" opacity=".25"/>' +
      '<g transform="translate(900,880) scale(1.1)">' + mulherCesto() + '</g>' +
      '<g transform="translate(985,878) scale(1.1)">' + crianca() + '</g>' +
      '<g transform="translate(1140,884) scale(1.12)">' + homemEnxada() + '</g>' +
      '<g transform="translate(1560,900) scale(1.25)"><g class="balanco">' + milho(r) + '</g></g>' +
      '<g transform="translate(40,900) scale(1.3)"><g class="balanco" style="animation-delay:-2s">' + mandioca(r) + '</g></g>' +
    '</g>';
    s += '<rect x="0" y="780" width="1600" height="120" fill="url(#arte-sombra)" pointer-events="none"/>';
    return s;
  }

  function montarRoca(){
    var sec = document.getElementById('arte-roca');
    if (!sec) return;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'arte-cena');
    svg.setAttribute('viewBox', '0 0 1600 900');
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Ilustração: amanhecer numa roça indígena de Mato Grosso do Sul, com milho, mandioca, abóbora e feijão, uma casa de palha, um rio com canoa e uma família trabalhando na terra.');
    svg.innerHTML = cenaRoca();
    sec.insertBefore(svg, sec.firstChild);
    // no celular, aproxima o enquadramento da família na roça
    var mq = window.matchMedia('(max-width: 700px)');
    function enquadrar(){ svg.setAttribute('viewBox', mq.matches ? '660 150 640 750' : '0 0 1600 900'); }
    enquadrar();
    if (mq.addEventListener) mq.addEventListener('change', enquadrar); else if (mq.addListener) mq.addListener(enquadrar);

    var camadas = [].slice.call(svg.querySelectorAll('.arte-camada'));
    var plantios = svg.querySelector('.arte-plantios');
    var cont = sec.querySelector('.arte-contador');
    var total = 0, rr = rng(Date.now() % 100000);
    var px = 0, py = 0, alvoX = 0;

    function aplicar(){
      camadas.forEach(function(c){
        var d = parseFloat(c.getAttribute('data-prof')) || 0;
        c.style.transform = 'translate(' + (alvoX*d*18).toFixed(1) + 'px,' + (py*d*-90).toFixed(1) + 'px)';
      });
    }
    function rolar(){
      var b = sec.getBoundingClientRect(), h = window.innerHeight;
      if (b.bottom < 0 || b.top > h) return;
      py = ((h - b.top) / (h + b.height)) - .5;
      aplicar();
    }
    if (!reduz){
      window.addEventListener('scroll', function(){ requestAnimationFrame(rolar); }, {passive:true});
      sec.addEventListener('pointermove', function(e){
        var b = sec.getBoundingClientRect();
        alvoX = ((e.clientX - b.left) / b.width - .5) * -1;
        requestAnimationFrame(aplicar);
      });
      rolar();
    }

    function semear(e){
      var m = plantios.getScreenCTM(); if (!m) return;
      var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      var q = p.matrixTransform(m.inverse());
      if (q.y < 712) return;
      var k = Math.max(.25, Math.min(1, (q.y - 680) / 220));
      var tipo = Math.floor(rr()*4);
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) + ') scale(' + k.toFixed(2) + ')');
      g.innerHTML = '<g class="broto"><g class="balanco" style="animation-delay:-' + (rr()*5).toFixed(2) + 's">' + PLANTAS[tipo](rr, true) + '</g></g>';
      for (var i = 0; i < 7; i++){
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', (2.5 + rr()*2.5).toFixed(1));
        c.setAttribute('fill', ['#E8B53A','#E07A1F','#7CAE4A','#5A2E1E'][i % 4]);
        c.setAttribute('class', 'faisca');
        c.style.setProperty('--dx', ((rr()*2-1)*60).toFixed(0) + 'px');
        c.style.setProperty('--dy', (-20 - rr()*60).toFixed(0) + 'px');
        g.appendChild(c);
      }
      plantios.appendChild(g);
      total++;
      if (plantios.childNodes.length > 60) plantios.removeChild(plantios.firstChild);
      if (cont){ cont.textContent = total === 1 ? t('contador1') : t('contador', total); cont.classList.add('on'); }
    }
    svg.addEventListener('click', semear);
    sec.__rerender = function(){ if (cont && total) cont.textContent = total === 1 ? t('contador1') : t('contador', total); };
  }

  /* =====================================================================
     FAIXAS DE GRAFISMO
     ===================================================================== */
  function svgUrl(s){ return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }
  var FAIXAS = {
    // inspirada na cerâmica Terena: flores e folhas sobre engobo claro
    terena: '<svg xmlns="http://www.w3.org/2000/svg" width="68" height="34" viewBox="0 0 68 34"><rect width="68" height="34" fill="#EFE4CF"/><rect y="0" width="68" height="3" fill="#B3402A"/><rect y="31" width="68" height="3" fill="#B3402A"/><g transform="translate(17,17)"><circle r="4" fill="#1E1A17"/><ellipse cy="-8" rx="4" ry="6" fill="#B3402A"/><ellipse cy="8" rx="4" ry="6" fill="#B3402A"/><ellipse cx="-8" rx="6" ry="4" fill="#B3402A"/><ellipse cx="8" rx="6" ry="4" fill="#B3402A"/></g><path d="M30 17 C 38 8 44 8 51 17 C 44 26 38 26 30 17 Z" fill="#1E1A17"/><path d="M34 17 H48" stroke="#EFE4CF" stroke-width="1.2"/><circle cx="62" cy="10" r="2" fill="#B3402A"/><circle cx="62" cy="24" r="2" fill="#B3402A"/></svg>',
    // inspirada na pintura Kadiwéu: geometria em preto sobre fundo claro (desenho original)
    kadiweu: '<svg xmlns="http://www.w3.org/2000/svg" width="68" height="34" viewBox="0 0 68 34"><rect width="68" height="34" fill="#F7F2E8"/><path d="M0 4 H68 M0 30 H68" stroke="#1E1A17" stroke-width="2"/><path d="M2 26 V18 H10 V10 H18 V18 H26 V26 H34 V18 H42 V10 H50 V18 H58 V26 H66" stroke="#1E1A17" stroke-width="2.6" fill="none"/><path d="M14 22 h0.1 M46 22 h0.1" stroke="#B3402A" stroke-width="4" stroke-linecap="round"/><path d="M30 12 a4 4 0 1 1 8 0" stroke="#1E1A17" stroke-width="1.6" fill="none"/></svg>',
    // inspirada no trançado Guarani Kaiowá: diagonais e losangos de palha
    kaiowa: '<svg xmlns="http://www.w3.org/2000/svg" width="68" height="34" viewBox="0 0 68 34"><rect width="68" height="34" fill="#D9B26A"/><path d="M0 34 L34 0 M-17 17 L0 0 M34 34 L68 0 M51 34 L68 17 M17 34 L51 0" stroke="#8B5A2B" stroke-width="5"/><path d="M17 17 L26 8 L35 17 L26 26 Z M51 17 L60 8 L69 17 L60 26 Z" fill="#5A3A1C"/><path d="M0 1 H68 M0 33 H68" stroke="#5A3A1C" stroke-width="2"/></svg>'
  };
  function montarFaixas(){
    var fs = document.querySelectorAll('.arte-faixa');
    if (!fs.length) return;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
    }, {threshold:.3}) : null;
    [].forEach.call(fs, function(f){
      var p = f.getAttribute('data-povo') || 'terena';
      f.style.backgroundImage = svgUrl(FAIXAS[p] || FAIXAS.terena);
      if (!reduz) f.classList.add('desliza');
      if (io && !reduz) io.observe(f); else f.classList.add('on');
    });
  }

  /* =====================================================================
     ENSAIO FOTOGRÁFICO
     ===================================================================== */
  function montarEnsaio(){
    var sec = document.getElementById('arte-ensaio');
    if (!sec) return;
    var fotos = [].slice.call(sec.querySelectorAll('.arte-foto'));
    if ('IntersectionObserver' in window && !reduz){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
      }, {threshold:.25});
      fotos.forEach(function(f){ io.observe(f); });
    } else fotos.forEach(function(f){ f.classList.add('on'); });

    [].forEach.call(sec.querySelectorAll('.arte-filtros button'), function(b){
      b.addEventListener('click', function(){
        var p = b.getAttribute('data-povo');
        [].forEach.call(sec.querySelectorAll('.arte-filtros button'), function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        fotos.forEach(function(f){
          var ok = p === 'todos' || f.getAttribute('data-povo') === p;
          f.classList.toggle('oculta', !ok);
          if (ok) f.classList.add('on');
        });
      });
    });

    // lightbox
    var luz = document.createElement('div');
    luz.className = 'arte-luz';
    luz.setAttribute('role', 'dialog');
    luz.setAttribute('aria-modal', 'true');
    luz.innerHTML = '<button class="fechar" aria-label="Fechar">×</button><button class="ant" aria-label="Anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="prox" aria-label="Próxima">›</button>';
    document.body.appendChild(luz);
    var atual = 0;
    function visiveis(){ return fotos.filter(function(f){ return !f.classList.contains('oculta'); }); }
    function mostrar(i){
      var v = visiveis(); if (!v.length) return;
      atual = (i + v.length) % v.length;
      var f = v[atual], img = f.querySelector('img'), cap = f.querySelector('figcaption');
      luz.querySelector('img').src = img.getAttribute('data-full') || img.src;
      luz.querySelector('img').alt = img.alt;
      luz.querySelector('figcaption').innerHTML = cap ? cap.innerHTML : '';
    }
    function abrir(i){ mostrar(i); luz.classList.add('on'); document.documentElement.style.overflow = 'hidden'; luz.querySelector('.fechar').focus(); }
    function fechar(){ luz.classList.remove('on'); document.documentElement.style.overflow = ''; }
    fotos.forEach(function(f){
      f.setAttribute('tabindex', '0');
      f.addEventListener('click', function(e){ if (e.target.closest('a')) return; abrir(visiveis().indexOf(f)); });
      f.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); abrir(visiveis().indexOf(f)); } });
    });
    luz.querySelector('.fechar').addEventListener('click', fechar);
    luz.querySelector('.ant').addEventListener('click', function(){ mostrar(atual - 1); });
    luz.querySelector('.prox').addEventListener('click', function(){ mostrar(atual + 1); });
    luz.addEventListener('click', function(e){ if (e.target === luz) fechar(); });
    document.addEventListener('keydown', function(e){
      if (!luz.classList.contains('on')) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }

  /* =====================================================================
     CIRANDA DA COOPERAÇÃO
     ===================================================================== */
  var PRINC = [
    {t:{pt:'Adesão livre e voluntária',en:'Voluntary and open membership',es:'Adhesión voluntaria y abierta',fr:'Adhésion volontaire et ouverte'},
     d:{pt:'Entra quem quer e sai quem quer. Ninguém é obrigado a ser cooperado, e ninguém é barrado por aldeia, gênero, idade ou escolaridade.',en:'Anyone may join and anyone may leave. No one is forced to be a member, and no one is turned away because of village, gender, age or schooling.',es:'Entra quien quiere y sale quien quiere. Nadie está obligado a ser cooperado y nadie es rechazado por su aldea, género, edad o escolaridad.',fr:'Entre qui veut, sort qui veut. Personne n\'est obligé d\'être coopérateur, et personne n\'est refusé en raison de son village, de son genre, de son âge ou de sa scolarité.'},
     p:{pt:'Indígenas de Mato Grosso do Sul podem se associar morando na aldeia ou na cidade, com os mesmos direitos.',en:'Indigenous people of Mato Grosso do Sul may join whether they live in a village or in town, with the same rights.',es:'Los indígenas de Mato Grosso do Sul pueden asociarse viviendo en la aldea o en la ciudad, con los mismos derechos.',fr:'Les Autochtones du Mato Grosso do Sul peuvent adhérer, qu\'ils vivent au village ou en ville, avec les mêmes droits.'}},
    {t:{pt:'Gestão democrática',en:'Democratic member control',es:'Gestión democrática',fr:'Pouvoir démocratique'},
     d:{pt:'Cada pessoa tem um voto, tenha muitas ou poucas quotas. As decisões importantes são tomadas em Assembleia, por quem é dono da cooperativa.',en:'Each person has one vote, whatever their number of shares. Major decisions are taken in the General Assembly by the cooperative\'s own members.',es:'Cada persona tiene un voto, tenga muchas o pocas cuotas. Las decisiones importantes se toman en Asamblea, por los dueños de la cooperativa.',fr:'Chaque personne a une voix, quel que soit le nombre de parts. Les grandes décisions sont prises en Assemblée par les propriétaires de la coopérative.'},
     p:{pt:'Assembleias em linguagem simples, com prestação de contas falada e, quando preciso, na língua do povo.',en:'Assemblies in plain language, with spoken accountability and, when needed, in the people\'s own language.',es:'Asambleas en lenguaje sencillo, con rendición de cuentas oral y, cuando hace falta, en la lengua del pueblo.',fr:'Des assemblées en langage simple, avec des comptes rendus oraux et, si besoin, dans la langue du peuple.'}},
    {t:{pt:'Participação econômica',en:'Member economic participation',es:'Participación económica',fr:'Participation économique'},
     d:{pt:'Todos contribuem para o capital e as sobras são divididas pelo trabalho que cada um fez com a cooperativa, e não pelo dinheiro que cada um tem.',en:'Everyone contributes to the capital, and surpluses are shared according to the work each member did with the cooperative, not according to wealth.',es:'Todos aportan al capital y los excedentes se reparten según el trabajo de cada uno con la cooperativa, no según el dinero que tiene.',fr:'Chacun contribue au capital et les excédents sont répartis selon le travail réalisé avec la coopérative, et non selon la richesse de chacun.'},
     p:{pt:'Quota-parte acessível e sobras divididas conforme a produção entregue por cada família.',en:'Affordable shares and surpluses divided according to what each family delivered.',es:'Cuota accesible y excedentes repartidos según la producción entregada por cada familia.',fr:'Des parts accessibles et des excédents répartis selon la production livrée par chaque famille.'}},
    {t:{pt:'Autonomia e independência',en:'Autonomy and independence',es:'Autonomía e independencia',fr:'Autonomie et indépendance'},
     d:{pt:'A cooperativa pertence aos cooperados. Parcerias com governos e empresas são bem-vindas, desde que ninguém de fora tire o poder de decisão de quem é dono.',en:'The cooperative belongs to its members. Partnerships with governments and companies are welcome, as long as no outsider takes decision-making power from the owners.',es:'La cooperativa pertenece a los cooperados. Las alianzas con gobiernos y empresas son bienvenidas, siempre que nadie de afuera quite el poder de decisión a los dueños.',fr:'La coopérative appartient à ses membres. Les partenariats avec l\'État et les entreprises sont bienvenus, à condition que personne de l\'extérieur ne prive les propriétaires de leur pouvoir de décision.'},
     p:{pt:'A terra indígena nunca entra em contrato, e nenhum parceiro tem voto ou veto sobre os órgãos da cooperativa.',en:'Indigenous land never becomes part of a contract, and no partner has a vote or veto over the cooperative\'s bodies.',es:'La tierra indígena nunca entra en un contrato, y ningún socio externo tiene voto ni veto sobre los órganos de la cooperativa.',fr:'La terre autochtone n\'entre jamais dans un contrat, et aucun partenaire n\'a de voix ni de veto sur les organes de la coopérative.'}},
    {t:{pt:'Educação, formação e informação',en:'Education, training and information',es:'Educación, formación e información',fr:'Éducation, formation et information'},
     d:{pt:'Cooperado bem informado decide melhor. Uma parte das sobras vai obrigatoriamente para formação, assistência técnica e informação.',en:'Well-informed members make better decisions. Part of every surplus must go to training, technical assistance and information.',es:'Un cooperado bien informado decide mejor. Una parte de los excedentes se destina obligatoriamente a formación, asistencia técnica e información.',fr:'Un coopérateur bien informé décide mieux. Une part des excédents est obligatoirement consacrée à la formation, à l\'assistance technique et à l\'information.'},
     p:{pt:'Fundo de Assistência Técnica, Educacional e Social (FATES) e Programa de Formação Cooperativista Indígena.',en:'Technical, Educational and Social Assistance Fund (FATES) and the Indigenous Cooperative Training Program.',es:'Fondo de Asistencia Técnica, Educativa y Social (FATES) y Programa de Formación Cooperativista Indígena.',fr:'Fonds d\'assistance technique, éducative et sociale (FATES) et Programme de formation coopérative autochtone.'}},
    {t:{pt:'Intercooperação',en:'Cooperation among cooperatives',es:'Intercooperación',fr:'Intercoopération'},
     d:{pt:'Cooperativas ficam mais fortes quando trabalham juntas, em rede, na região, no país e no mundo.',en:'Cooperatives grow stronger when they work together, as a network, in the region, the country and the world.',es:'Las cooperativas se fortalecen cuando trabajan juntas, en red, en la región, en el país y en el mundo.',fr:'Les coopératives se renforcent lorsqu\'elles travaillent ensemble, en réseau, dans la région, le pays et le monde.'},
     p:{pt:'Diálogo com outras cooperativas indígenas e com o sistema cooperativista de Mato Grosso do Sul.',en:'Dialogue with other Indigenous cooperatives and with Mato Grosso do Sul\'s cooperative system.',es:'Diálogo con otras cooperativas indígenas y con el sistema cooperativista de Mato Grosso do Sul.',fr:'Dialogue avec d\'autres coopératives autochtones et avec le système coopératif du Mato Grosso do Sul.'}},
    {t:{pt:'Interesse pela comunidade',en:'Concern for community',es:'Interés por la comunidad',fr:'Engagement envers la communauté'},
     d:{pt:'A cooperativa cuida do lugar onde vive: da terra, da água, da cultura e das próximas gerações.',en:'The cooperative cares for the place where it lives: the land, the water, the culture and the generations to come.',es:'La cooperativa cuida el lugar donde vive: la tierra, el agua, la cultura y las próximas generaciones.',fr:'La coopérative prend soin du lieu où elle vit : la terre, l\'eau, la culture et les générations futures.'},
     p:{pt:'Proteção do conhecimento tradicional, dos lugares sagrados e da roça que vai alimentar os netos.',en:'Protection of traditional knowledge, sacred places and the fields that will feed our grandchildren.',es:'Protección del conocimiento tradicional, de los lugares sagrados y de la chacra que alimentará a los nietos.',fr:'Protection des savoirs traditionnels, des lieux sacrés et des cultures qui nourriront nos petits-enfants.'}}
  ];
  function L(o){ return o[lang()] || o.pt; }

  function cenaRoda(){
    var s = '<defs>' +
      '<pattern id="arte-p-trancado" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#D9B26A"/><path d="M0 24 L24 0 M-6 6 L6 -6 M18 30 L30 18" stroke="#8B5A2B" stroke-width="5"/><path d="M12 6 L18 12 L12 18 L6 12 Z" fill="#5A3A1C"/></pattern>' +
      '<pattern id="arte-p-geom" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#F7F2E8"/><path d="M2 24 V16 H10 V8 H18 V16 H26 V24" stroke="#1E1A17" stroke-width="2.4" fill="none"/><circle cx="14" cy="21" r="2" fill="#B3402A"/></pattern>' +
      '<pattern id="arte-p-trama" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#C9963F"/><rect width="5" height="10" fill="#A8772F"/></pattern>' +
      '<path id="arte-trilha" d="M400,150 a250,250 0 1,1 -0.1,0 Z"/>' +
    '</defs>';
    // anéis de grafismo
    s += '<g class="anel anel-1"><circle cx="400" cy="400" r="372" fill="none" stroke="url(#arte-p-trancado)" stroke-width="28"/><circle cx="400" cy="400" r="386" fill="none" stroke="#5A3A1C" stroke-width="2"/><circle cx="400" cy="400" r="358" fill="none" stroke="#5A3A1C" stroke-width="2"/></g>';
    s += '<g class="anel anel-2"><circle cx="400" cy="400" r="340" fill="none" stroke="url(#arte-p-geom)" stroke-width="26"/><circle cx="400" cy="400" r="353" fill="none" stroke="#1E1A17" stroke-width="2"/><circle cx="400" cy="400" r="327" fill="none" stroke="#1E1A17" stroke-width="2"/></g>';
    s += '<g class="anel anel-3"><circle cx="400" cy="400" r="311" fill="none" stroke="#EFE4CF" stroke-width="24"/>';
    for (var i = 0; i < 28; i++){
      var a = i/28*360;
      s += '<g transform="rotate(' + a + ' 400 400) translate(400,89)">' + (i % 2 ?
        '<path d="M-9 0 C -4 -6 4 -6 9 0 C 4 6 -4 6 -9 0 Z" fill="#1E1A17"/>' :
        '<circle r="3" fill="#1E1A17"/><ellipse cy="-6" rx="3" ry="4.5" fill="#B3402A"/><ellipse cy="6" rx="3" ry="4.5" fill="#B3402A"/><ellipse cx="-6" rx="4.5" ry="3" fill="#B3402A"/><ellipse cx="6" rx="4.5" ry="3" fill="#B3402A"/>') + '</g>';
    }
    s += '</g>';
    // trilha das sementes
    s += '<use href="#arte-trilha" class="trilha" fill="none" stroke="#2F6B2A" stroke-width="2.5"/>';
    if (!reduz){
      ['#E8B53A','#E07A1F','#5A2E1E','#7CAE4A'].forEach(function(c, k){
        s += '<ellipse rx="7" ry="5" fill="' + c + '" stroke="#3D2616" stroke-width="1"><animateMotion dur="16s" repeatCount="indefinite" rotate="auto" begin="-' + (k*4) + 's"><mpath href="#arte-trilha"/></animateMotion></ellipse>';
      });
    }
    // ciranda de pessoas
    var cores = ['#B3402A','#1E1A17','#E8B53A','#2F6F9E','#2F6B2A','#C9A27E','#8E3B6B'];
    s += '<g class="roda-gente">';
    var n = 14, R = 172, meia = Math.sin(Math.PI/n)*R;
    for (i = 0; i < n; i++){
      var ang = i/n*360, c = cores[i % cores.length];
      s += '<g transform="rotate(' + ang + ' 400 400) translate(400,' + (400 - R) + ')">' +
        '<path d="M-9 -10 L-' + meia.toFixed(1) + ' 2 M9 -10 L' + meia.toFixed(1) + ' 2" stroke="#8A5636" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M-10 -14 L-13 22 L13 22 L10 -14 Z" fill="' + c + '"/>' +
        '<path d="M-12 6 l4 -4 l4 4 l4 -4 l4 4 l4 -4" stroke="' + (c === '#1E1A17' ? '#F7F2E8' : '#1E1A17') + '" stroke-width="1.6" fill="none"/>' +
        '<circle cy="-25" r="10" fill="#8A5636"/><path d="M-10 -27 C -10 -40 10 -40 10 -27 C 6 -33 -6 -33 -10 -27 Z" fill="#1A1412"/>' +
        '<path d="M-7 22 L-7 34 M7 22 L7 34" stroke="#8A5636" stroke-width="5" stroke-linecap="round"/>' +
      '</g>';
    }
    s += '</g>';
    // cesto central com sementes
    s += '<g transform="translate(400,420)">' +
      '<ellipse cx="0" cy="70" rx="96" ry="14" fill="#000" opacity=".12"/>' +
      '<path d="M-86 -20 L86 -20 L70 62 C 40 76 -40 76 -70 62 Z" fill="url(#arte-p-trama)" stroke="#6B4A1F" stroke-width="3"/>' +
      '<path d="M-80 10 L80 10" stroke="#B3402A" stroke-width="12"/>' +
      '<text x="0" y="15" text-anchor="middle" font-family="Petrona,Georgia,serif" font-weight="800" font-size="15" fill="#FFF3D6" letter-spacing="3">COOPIMS</text>' +
      '<ellipse cx="0" cy="-20" rx="86" ry="18" fill="#A8772F" stroke="#6B4A1F" stroke-width="3"/>';
    var r2 = rng(77);
    for (i = 0; i < 70; i++){
      var sx = (r2()*2-1)*72, sy = -26 - r2()*22 + Math.abs(sx)*.18, cor = ['#E8B53A','#F2D16B','#E07A1F','#5A2E1E','#7A1F1A','#EFE4CF','#7CAE4A'][Math.floor(r2()*7)];
      s += '<ellipse cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" rx="' + (3 + r2()*2.5).toFixed(1) + '" ry="' + (2 + r2()*1.6).toFixed(1) + '" fill="' + cor + '" transform="rotate(' + (r2()*180).toFixed(0) + ' ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')"/>';
    }
    s += '</g>';
    // sementes-botão dos 7 princípios
    for (i = 0; i < 7; i++){
      var aa = -90 + i/7*360, rad = aa*Math.PI/180, x = 400 + Math.cos(rad)*250, y = 400 + Math.sin(rad)*250;
      s += '<g class="no" data-i="' + i + '" tabindex="0" role="button" transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')">' +
        '<circle class="fundo" r="27" fill="#FFFDF7" stroke="#16302B" stroke-width="2"/>' +
        '<path d="M0 -15 C 10 -10 12 6 0 15 C -12 6 -10 -10 0 -15 Z" fill="#E8B53A" opacity=".35"/>' +
        '<text class="num" y="7" text-anchor="middle" font-family="Petrona,Georgia,serif" font-weight="800" font-size="21" fill="#16302B">' + (i+1) + '</text>' +
      '</g>';
    }
    return s;
  }

  function montarCiranda(){
    var sec = document.getElementById('arte-ciranda');
    if (!sec) return;
    var alvo = sec.querySelector('.arte-roda-alvo');
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'arte-roda');
    svg.setAttribute('viewBox', '0 0 800 800');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Ilustração: ciranda de pessoas indígenas de mãos dadas em volta de um cesto de sementes, cercada por anéis de grafismo. Sete sementes numeradas representam os sete princípios do cooperativismo.');
    svg.innerHTML = cenaRoda();
    alvo.appendChild(svg);
    var painel = sec.querySelector('.arte-painel');
    var pontos = sec.querySelector('.arte-pontos');
    var nos = [].slice.call(svg.querySelectorAll('.no'));
    var atual = 0, auto = null, mexeu = false;
    for (var i = 0; i < 7; i++){
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-i', i); pontos.appendChild(b);
    }
    var botoes = [].slice.call(pontos.querySelectorAll('button'));
    function mostrar(i){
      atual = i;
      var p = PRINC[i];
      painel.innerHTML = '<div class="arte-troca"><div class="arte-n">' + t('principio') + ' ' + (i+1) + ' / 7</div><h3>' + L(p.t) + '</h3><p>' + L(p.d) + '</p><div class="arte-pratica"><b>' + t('pratica') + '</b> ' + L(p.p) + '</div></div>';
      nos.forEach(function(n, k){ n.classList.toggle('ativo', k === i); n.setAttribute('aria-pressed', k === i ? 'true' : 'false'); n.setAttribute('aria-label', t('ver') + ' ' + (k+1) + ': ' + L(PRINC[k].t)); });
      botoes.forEach(function(bb, k){ bb.setAttribute('aria-current', k === i ? 'true' : 'false'); bb.setAttribute('aria-label', t('ver') + ' ' + (k+1)); });
    }
    function escolher(i){ mexeu = true; if (auto){ clearInterval(auto); auto = null; } mostrar(i); }
    nos.forEach(function(n){
      n.addEventListener('click', function(){ escolher(+n.getAttribute('data-i')); });
      n.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); escolher(+n.getAttribute('data-i')); } });
    });
    botoes.forEach(function(bb){ bb.addEventListener('click', function(){ escolher(+bb.getAttribute('data-i')); }); });
    mostrar(0);
    if (!reduz && 'IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          if (e.isIntersecting && !mexeu && !auto) auto = setInterval(function(){ mostrar((atual + 1) % 7); }, 7000);
          if (!e.isIntersecting && auto){ clearInterval(auto); auto = null; }
        });
      }, {threshold:.35}).observe(sec);
    }
    sec.__rerender = function(){ mostrar(atual); };
  }

  /* ---------- pausa as animações fora da tela ---------- */
  function pausarForaDaTela(){
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('arte-pausa', !e.isIntersecting); });
    }, {rootMargin:'120px'});
    ['arte-roca','arte-ciranda'].forEach(function(id){ var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- troca de idioma ---------- */
  function aplicarTextos(){
    var D = window.COOPIMS_ARTE_I18N || {}, l = lang();
    [].forEach.call(document.querySelectorAll('[data-i18n^="arte_"]'), function(el){
      var e = D[el.getAttribute('data-i18n')]; if (e) el.textContent = e[l] || e.pt;
    });
    [].forEach.call(document.querySelectorAll('[data-i18n-html^="arte_"]'), function(el){
      var e = D[el.getAttribute('data-i18n-html')]; if (e) el.innerHTML = e[l] || e.pt;
    });
  }
  function observarIdioma(){
    aplicarTextos();
    new MutationObserver(function(){
      aplicarTextos();
      ['arte-roca','arte-ciranda'].forEach(function(id){ var el = document.getElementById(id); if (el && el.__rerender) el.__rerender(); });
    }).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  }

  function iniciar(){
    try { montarRoca(); } catch(e){ console.warn('arte roça', e); }
    try { montarFaixas(); } catch(e){ console.warn('arte faixas', e); }
    try { montarEnsaio(); } catch(e){ console.warn('arte ensaio', e); }
    try { montarCiranda(); } catch(e){ console.warn('arte ciranda', e); }
    pausarForaDaTela();
    observarIdioma();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
