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
     TERRITÓRIO VIVO · arte generativa em canvas
     Milhares de fios seguem um campo de fluxo e desenham, ao vivo, algo
     entre a vista aérea das roças, o curso dos rios e o fio do trançado.
     O cursor desvia os fios; cada toque planta uma semente que abre um
     losango escalonado (inspirado, sem copiar, na geometria Kadiwéu) e
     espalha novos fios pelo território.
     ===================================================================== */
  // ruído de gradiente 2D (Perlin clássico, compacto)
  var PERM = (function(){
    var p = [], r = rng(2026), i;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--){ var j = Math.floor(r()*(i+1)), t0 = p[i]; p[i] = p[j]; p[j] = t0; }
    return p.concat(p);
  })();
  function fade(t){ return t*t*t*(t*(t*6-15)+10); }
  function grad(h, x, y){ switch(h & 7){ case 0:return x+y; case 1:return -x+y; case 2:return x-y; case 3:return -x-y; case 4:return x; case 5:return -x; case 6:return y; default:return -y; } }
  function ruido(x, y){
    var X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
    var u = fade(x), v = fade(y), a = PERM[X]+Y, b = PERM[X+1]+Y;
    var l1 = grad(PERM[a], x, y) + u*(grad(PERM[b], x-1, y) - grad(PERM[a], x, y));
    var l2 = grad(PERM[a+1], x, y-1) + u*(grad(PERM[b+1], x-1, y-1) - grad(PERM[a+1], x, y-1));
    return l1 + v*(l2 - l1);
  }

  var PALETA = [
    [232,181,58],  // milho
    [179,64,42],   // urucum
    [217,178,106], // palha
    [124,174,74],  // rama
    [239,228,207], // argila clara
    [224,122,31]   // abóbora
  ];

  function montarRoca(){
    var sec = document.getElementById('arte-roca');
    if (!sec) return;
    var cv = document.createElement('canvas');
    cv.className = 'arte-tela';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'Arte generativa: milhares de fios coloridos em tons de milho, urucum, palha e rama correm como rios e sulcos de roça sobre fundo escuro; cada toque abre um losango escalonado e espalha novos fios.');
    sec.insertBefore(cv, sec.firstChild);
    var cx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, fios = [], sementes = [], tempo = 0, rolagem = 0;
    var mouse = {x:-9999, y:-9999, on:false};
    var rr = rng(Date.now() % 100000), total = 0;
    var cont = sec.querySelector('.arte-contador');

    function novoFio(x, y, cor){
      return {x:x == null ? rr()*W : x, y:y == null ? rr()*H : y, px:0, py:0,
        vida: 80 + rr()*260, idade:0, cor: cor || PALETA[Math.floor(rr()*PALETA.length)],
        larg: .5 + rr()*1.3, vel: .9 + rr()*1.6};
    }
    function medir(){
      var b = sec.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(320, b.width); H = Math.max(420, b.height);
      cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr);
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.fillStyle = '#14110F'; cx.fillRect(0, 0, W, H);
      var n = Math.round(Math.min(1800, W*H/700));
      fios = []; for (var i = 0; i < n; i++) fios.push(novoFio());
      // pré-aquecimento: o território já nasce desenhado
      for (var k = 0; k < (reduz ? 260 : 90); k++) passo(true);
    }
    function angulo(x, y){
      var e = .0019, t = tempo*.00012 + rolagem*.0009;
      var a = ruido(x*e + t, y*e - t*.6)*Math.PI*2.4 + ruido(x*e*3.1, y*e*3.1 + t)*.7;
      // faixa de rio que atravessa o quadro em diagonal suave
      var rio = y - (H*.62 + Math.sin(x*.004 + t*3)*H*.08);
      a += Math.exp(-rio*rio/(2*70*70))*1.3;
      if (mouse.on){
        var dx = x - mouse.x, dy = y - mouse.y, d2 = dx*dx + dy*dy, R = 150;
        if (d2 < R*R*4){ var f = Math.exp(-d2/(2*R*R)); a += f*2.2; }
      }
      return a;
    }
    function passo(semRastro){
      if (!semRastro){
        cx.globalCompositeOperation = 'source-over';
        cx.fillStyle = 'rgba(20,17,15,0.03)'; cx.fillRect(0, 0, W, H);
      }
      cx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < fios.length; i++){
        var f = fios[i];
        f.px = f.x; f.py = f.y;
        var a = angulo(f.x, f.y);
        f.x += Math.cos(a)*f.vel; f.y += Math.sin(a)*f.vel;
        f.idade++;
        var vida = f.idade/f.vida, alfa = Math.sin(Math.min(1, vida)*Math.PI)*.42;
        cx.strokeStyle = 'rgba(' + f.cor[0] + ',' + f.cor[1] + ',' + f.cor[2] + ',' + alfa.toFixed(3) + ')';
        cx.lineWidth = f.larg;
        cx.beginPath(); cx.moveTo(f.px, f.py); cx.lineTo(f.x, f.y); cx.stroke();
        if (f.idade > f.vida || f.x < -20 || f.x > W+20 || f.y < -20 || f.y > H+20){
          fios[i] = novoFio();
        }
      }
      // sementes plantadas: losangos escalonados que se abrem
      cx.globalCompositeOperation = 'source-over';
      for (var s = sementes.length - 1; s >= 0; s--){
        var sm = sementes[s]; sm.t++;
        var p = Math.min(1, sm.t/70), ease = 1 - Math.pow(1-p, 3);
        if (sm.t % 3 === 0) desenharLosango(sm.x, sm.y, 14 + ease*sm.r, sm.cor, ((1-p)*.8 + .1)*.5);
        if (sm.t > 140) sementes.splice(s, 1);
      }
      tempo += 16;
    }
    function desenharLosango(x, y, r, cor, alfa){
      cx.save(); cx.translate(x, y);
      cx.strokeStyle = 'rgba(' + cor.join(',') + ',' + alfa.toFixed(3) + ')';
      for (var anel = 0; anel < 3; anel++){
        var rr2 = r*(1 - anel*.28);
        cx.lineWidth = anel === 0 ? 2 : 1.2;
        // losango de contorno escalonado, em degraus iguais nos quatro lados
        cx.beginPath();
        var st = 6, i;
        cx.moveTo(0, -rr2);
        for (i = 1; i <= st; i++){ cx.lineTo((i)*rr2/st, -rr2 + (i-1)*rr2/st); cx.lineTo(i*rr2/st, -rr2 + i*rr2/st); }
        for (i = 1; i <= st; i++){ cx.lineTo(rr2 - (i-1)*rr2/st, i*rr2/st); cx.lineTo(rr2 - i*rr2/st, i*rr2/st); }
        for (i = 1; i <= st; i++){ cx.lineTo(-(i-1)*rr2/st, rr2 - i*rr2/st); cx.lineTo(-i*rr2/st, rr2 - i*rr2/st); }
        for (i = 1; i <= st; i++){ cx.lineTo(-rr2 + (i-1)*rr2/st, -i*rr2/st); cx.lineTo(-rr2 + i*rr2/st, -i*rr2/st); }
        cx.stroke();
      }
      cx.fillStyle = 'rgba(' + cor.join(',') + ',' + Math.min(1, alfa + .2).toFixed(3) + ')';
      cx.beginPath(); cx.arc(0, 0, 3.2, 0, Math.PI*2); cx.fill();
      cx.restore();
    }
    var vivo = true, raf = 0;
    function laco(){ if (vivo) passo(false); raf = requestAnimationFrame(laco); }

    function semear(e){
      var b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      var cor = PALETA[Math.floor(rr()*PALETA.length)];
      sementes.push({x:x, y:y, r:60 + rr()*70, cor:cor, t:0});
      for (var i = 0; i < 160; i++){
        var a = i/160*Math.PI*2, d = rr()*18;
        var f = novoFio(x + Math.cos(a)*d, y + Math.sin(a)*d, rr() < .6 ? cor : null);
        f.vida = 120 + rr()*200; f.larg = .8 + rr()*1.4;
        fios[Math.floor(rr()*fios.length)] = f;
      }
      if (reduz) for (var k = 0; k < 90; k++) passo(false);
      total++;
      if (cont){ cont.textContent = total === 1 ? t('contador1') : t('contador', total); cont.classList.add('on'); }
    }

    medir();
    var tm = 0;
    window.addEventListener('resize', function(){ clearTimeout(tm); tm = setTimeout(medir, 220); });
    cv.addEventListener('pointermove', function(e){ var b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; mouse.on = true; });
    cv.addEventListener('pointerleave', function(){ mouse.on = false; });
    cv.addEventListener('click', semear);
    window.addEventListener('scroll', function(){
      var b = sec.getBoundingClientRect(); rolagem = -b.top;
    }, {passive:true});
    if (!reduz){
      raf = requestAnimationFrame(laco);
      if ('IntersectionObserver' in window){
        new IntersectionObserver(function(es){ vivo = es[0].isIntersecting; }, {rootMargin:'80px'}).observe(sec);
      }
      document.addEventListener('visibilitychange', function(){ vivo = !document.hidden; });
    }
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
    // ciranda: 14 presenças abstratas (estelas com faixa de grafismo) ligadas por arcos de mãos dadas
    var cores = ['#B3402A','#E8B53A','#EFE4CF','#7CAE4A','#D9B26A','#E07A1F','#C9A27E'];
    s += '<g class="roda-gente">';
    var n = 14, R = 172;
    s += '<circle cx="400" cy="400" r="' + R + '" fill="none" stroke="#EFE4CF" stroke-opacity=".28" stroke-width="1"/>';
    for (i = 0; i < n; i++){
      var a1 = (i + .5)/n*Math.PI*2 - Math.PI/2, a2 = (i + 1.5)/n*Math.PI*2 - Math.PI/2;
      var x1 = 400 + Math.cos(a1)*(R-6), y1 = 400 + Math.sin(a1)*(R-6), x2 = 400 + Math.cos(a2)*(R-6), y2 = 400 + Math.sin(a2)*(R-6);
      s += '<path class="maos" d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Q 400 400 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" fill="none" stroke="' + cores[i % cores.length] + '" stroke-opacity=".35" stroke-width="1.2"/>';
    }
    for (i = 0; i < n; i++){
      var ang = i/n*360, c = cores[i % cores.length];
      s += '<g transform="rotate(' + ang + ' 400 400) translate(400,' + (400 - R) + ')"><g class="estela" style="animation-delay:-' + (i*.35).toFixed(2) + 's">' +
        '<rect x="-9" y="-34" width="18" height="58" rx="9" fill="' + c + '"/>' +
        '<path d="M-9 -6 h4 v-4 h4 v4 h2 v-4 h4 v4 h4" stroke="#14110F" stroke-width="1.6" fill="none"/>' +
        '<path d="M-9 4 h18" stroke="#14110F" stroke-width="1.2"/>' +
        '<circle cy="-44" r="7" fill="none" stroke="' + c + '" stroke-width="2"/>' +
      '</g></g>';
    }
    s += '</g>';
    // centro: emblema de sete pétalas escalonadas (uma por princípio)
    s += '<g class="emblema" transform="translate(400,400)">' +
      '<circle r="118" fill="#14110F"/><circle r="118" fill="none" stroke="#E8B53A" stroke-opacity=".5" stroke-width="1"/>' +
      '<circle r="104" fill="none" stroke="#EFE4CF" stroke-opacity=".18" stroke-width="1" stroke-dasharray="2 6"/>';
    for (i = 0; i < 7; i++){
      s += '<g transform="rotate(' + (i/7*360) + ')"><path class="petala" d="M0 -22 h6 v-12 h6 v-14 h6 v-16 h-6 v-10 h-6 v-8 h-12 v8 h-6 v10 h-6 v16 h6 v14 h6 v12 Z" fill="' + ['#B3402A','#E8B53A','#7CAE4A','#E07A1F','#D9B26A','#EFE4CF','#C9A27E'][i] + '" opacity=".92"/></g>';
    }
    s += '<circle r="20" fill="#14110F" stroke="#E8B53A" stroke-width="1.5"/>' +
      '<circle r="5" fill="#E8B53A"/>' +
      '<text y="104" text-anchor="middle" font-family="Petrona,Georgia,serif" font-weight="700" font-size="13" fill="#EFE4CF" letter-spacing="6">COOPIMS</text>' +
    '</g>';
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
    svg.setAttribute('aria-label', 'Ilustração: catorze presenças abstratas de mãos dadas em roda, em volta de um emblema de sete pétalas escalonadas, cercadas por anéis de grafismo. Sete sementes numeradas representam os sete princípios do cooperativismo.');
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
