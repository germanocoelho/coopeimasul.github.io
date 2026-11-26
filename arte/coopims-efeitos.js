/* =====================================================================
   COOPIMS · Efeitos de movimento do site
   - barra de leitura em degraus no topo da página
   - títulos que se revelam como cortina, com sublinhado escalonado
   - cursor-losango que reage a links e botões (só em mouse)
   - botões magnéticos e explosão de sementes ao clicar
   - textura de grão e fotos que entram por máscara
   Tudo respeita prefers-reduced-motion e não usa bibliotecas externas.
   ===================================================================== */
(function(){
  'use strict';
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fino = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var CORES = ['#B3402A','#E8B53A','#7CAE4A','#EFE4CF','#E07A1F'];

  function barra(){
    var b = document.createElement('div');
    b.className = 'ce-barra'; b.setAttribute('aria-hidden', 'true');
    document.body.appendChild(b);
    var pend = false;
    function atualizar(){
      pend = false;
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      b.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0).toFixed(4) + ')';
    }
    window.addEventListener('scroll', function(){ if (!pend){ pend = true; requestAnimationFrame(atualizar); } }, {passive:true});
    atualizar();
  }

  function titulos(){
    var els = document.querySelectorAll('h2.titulo, .arte-roca h2');
    if (reduz || !('IntersectionObserver' in window)){ [].forEach.call(els, function(e){ e.classList.add('ce-visto'); }); return; }
    // o título recortado não "aparece" para o observador: observa-se o pai
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return;
        (e.target.__ceTitulos || []).forEach(function(h){ h.classList.add('ce-visto'); });
        io.unobserve(e.target);
      });
    }, {threshold:0, rootMargin:'0px 0px -12% 0px'});
    [].forEach.call(els, function(e){
      e.classList.add('ce-titulo');
      var pai = e.parentElement; (pai.__ceTitulos = pai.__ceTitulos || []).push(e); io.observe(pai);
    });
  }

  function fotos(){
    if (reduz || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.membro .foto-wrap, .galeria-grid figure, .galeria-item, .noticia img');
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('ce-visto'); io.unobserve(e.target); } });
    }, {threshold:.15});
    [].forEach.call(els, function(e){ e.classList.add('ce-mascara'); io.observe(e); });
  }

  function cursor(){
    if (reduz || !fino) return;
    var c = document.createElement('div'); c.className = 'ce-cursor'; c.setAttribute('aria-hidden', 'true');
    var p = document.createElement('div'); p.className = 'ce-ponto'; p.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c); document.body.appendChild(p);
    var x = -100, y = -100, cx = x, cy = y;
    document.addEventListener('pointermove', function(e){
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      p.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      document.documentElement.classList.add('ce-com-cursor');
    }, {passive:true});
    document.addEventListener('pointerleave', function(){ document.documentElement.classList.remove('ce-com-cursor'); });
    document.addEventListener('pointerover', function(e){
      var alvo = e.target.closest && e.target.closest('a, button, [role="button"], .arte-foto, canvas.arte-tela, input, select, textarea, label');
      c.classList.toggle('ce-sobre', !!alvo);
      c.classList.toggle('ce-tela', !!(alvo && alvo.matches('canvas.arte-tela')));
    });
    (function laco(){
      cx += (x - cx)*.18; cy += (y - cy)*.18;
      c.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(laco);
    })();
  }

  function magneticos(){
    if (reduz || !fino) return;
    document.addEventListener('pointermove', function(e){
      var b = e.target.closest && e.target.closest('.btn, .acesso-rapido a, .arte-filtros button, .arte-dica');
      if (!b) return;
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width/2)) / r.width, dy = (e.clientY - (r.top + r.height/2)) / r.height;
      b.style.setProperty('--mx', (dx*10).toFixed(1) + 'px');
      b.style.setProperty('--my', (dy*8).toFixed(1) + 'px');
      b.classList.add('ce-mag');
      if (!b.__ceSai){
        b.__ceSai = true;
        b.addEventListener('pointerleave', function(){ b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
      }
    }, {passive:true});
  }

  function sementes(){
    if (reduz) return;
    document.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('.btn, .acesso-rapido a, .arte-filtros button');
      if (!b) return;
      for (var i = 0; i < 10; i++){
        var s = document.createElement('i');
        s.className = 'ce-semente'; s.setAttribute('aria-hidden', 'true');
        var a = Math.random()*Math.PI*2, d = 30 + Math.random()*50;
        s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
        s.style.background = CORES[i % CORES.length];
        s.style.setProperty('--dx', (Math.cos(a)*d).toFixed(0) + 'px');
        s.style.setProperty('--dy', (Math.sin(a)*d).toFixed(0) + 'px');
        document.body.appendChild(s);
        setTimeout(function(n){ return function(){ n.remove(); }; }(s), 800);
      }
    });
  }

  function grao(){
    var g = document.createElement('div'); g.className = 'ce-grao'; g.setAttribute('aria-hidden', 'true');
    document.body.appendChild(g);
  }

  function iniciar(){
    document.documentElement.classList.add('ce');
    barra(); titulos(); fotos(); cursor(); magneticos(); sementes(); grao();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
