/* Alfa Labs HSE — Master Sidebar + Footer Standard */
(function(){
  function init(){
    /* Global access gate: every Sidebar page is protected by the same auth layer. */
    if(!document.querySelector('script[data-alfa-auth]')){
      const a=document.createElement('script');a.src='./auth.js?v=20260918.5';a.async=false;a.dataset.alfaAuth='1';document.head.appendChild(a);
    }
    const sidebar=document.querySelector('.sidebar');
    if(!sidebar)return;
    const links=[['index.html','🏠','Home'],['capa.html','📋','CAPA'],['training.html','🎓','Training'],['environment.html','🌱','Environment'],['#','👁️','Safety Observations'],['#','🚨','Incidents'],['#','⚠️','Near Miss'],['#','🔍','Inspections'],['#','🔥','Fire Safety'],['#','🩹','First Aid'],['hse-portal.html#library','📚','HSE Library'],['hse-portal.html#achievements','🏆','Achievements'],['hse-portal.html#activities','📸','HSE Activities'],['#','📊','Analytics'],['#','📄','Reports'],['#','⚙️','Settings']];
    const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    sidebar.innerHTML='<div class="master-sidebar-brand"><img src="./LOGOG.png" alt="Alfa Labs Logo"><strong>Alfa Labs</strong><span>Alfa Labs • HSE Platform</span></div><nav class="master-sidebar-nav">'+links.map(function(x){const active=x[0]===path?' active':'';return '<a class="master-sidebar-link'+active+'" href="'+x[0]+'"><span class="master-sidebar-icon">'+x[1]+'</span><span>'+x[2]+'</span></a>'}).join('')+'</nav>';
    const style=document.createElement('style');style.id='master-sidebar-style';style.textContent=`
      .sidebar{direction:ltr!important;width:230px!important;left:0!important;right:auto!important;top:0!important;background:#082b52!important;padding:18px 12px!important;overflow-y:auto!important;box-shadow:2px 0 12px rgba(10,40,70,.12)!important}
      .master-sidebar-brand{text-align:center;padding:2px 0 18px;border-bottom:1px solid rgba(255,255,255,.14);margin-bottom:14px}.master-sidebar-brand img{width:102px;height:74px;object-fit:contain;background:#fff;border-radius:8px;padding:6px;display:block;margin:0 auto 9px}.master-sidebar-brand strong{display:block;font-size:25px;line-height:1.15;color:#fff;margin-bottom:5px}.master-sidebar-brand span{display:block;font-size:12px;color:#c9d9e9}
      .master-sidebar-nav{margin-top:10px}.master-sidebar-link{display:flex!important;align-items:center!important;gap:11px!important;text-decoration:none!important;color:#e2edf8!important;padding:11px 10px!important;border-radius:9px!important;margin:3px 0!important;font-size:14px!important;line-height:1.25!important;transition:.18s!important;direction:ltr!important;white-space:nowrap!important}.master-sidebar-link:hover{background:rgba(255,255,255,.10)!important;color:#fff!important}.master-sidebar-link.active{background:#1976d2!important;color:#fff!important;font-weight:800!important;box-shadow:0 4px 12px rgba(0,0,0,.10)!important}.master-sidebar-icon{width:27px!important;min-width:27px!important;text-align:center!important;font-size:18px!important}
      @media(max-width:900px){.sidebar{width:215px!important}.master-sidebar-link{font-size:14px!important}}@media(max-width:800px){.sidebar{width:285px!important;max-width:84vw!important;transform:translateX(-105%);transition:transform .25s ease!important;z-index:1001!important}.sidebar.open{transform:translateX(0)!important}.master-sidebar-brand strong{font-size:24px}.master-sidebar-link{font-size:15px!important;padding:12px 11px!important}}
    `;document.head.appendChild(style);
    const overlay=document.querySelector('.sidebar-overlay,.overlay');
    const button=document.querySelector('#mobileMenuBtn,#menu');
    function close(){sidebar.classList.remove('open');if(overlay)overlay.classList.remove('show');if(button)button.setAttribute('aria-expanded','false');document.body.style.overflow='';document.documentElement.style.overflow=''}
    function open(){sidebar.classList.add('open');if(overlay)overlay.classList.add('show');if(window.innerWidth<=800){document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden'}}
    function toggle(e){if(e){e.preventDefault();e.stopPropagation()}sidebar.classList.contains('open')?close():open()}
    /* SINGLE mobile-menu owner: overwrite legacy page onclick handlers so every page uses this controller. */
    if(button){
      button.onclick=toggle;
      button.ontouchstart=null;
      button.ontouchend=null;
      button.onpointerup=null;
      button.setAttribute('aria-controls','sidebar');
      button.setAttribute('aria-expanded',sidebar.classList.contains('open')?'true':'false');
    }
    if(overlay){
      overlay.onclick=function(e){if(e){e.preventDefault();e.stopPropagation()}close()};
      overlay.ontouchstart=null;
      overlay.ontouchend=null;
      overlay.onpointerup=null;
    }
    sidebar.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){if(window.innerWidth<=800)close()})});
    window.addEventListener('resize',function(){if(window.innerWidth>800)close()});
    window.addEventListener('orientationchange',function(){setTimeout(function(){if(window.innerWidth>800)close()},100)});
    const ms=document.createElement('style');ms.id='global-mobile-drawer-final';ms.textContent=`
      @media(max-width:800px){
        html,body{width:100%;max-width:100%;overflow-x:hidden!important}
        .sidebar{
          position:fixed!important;left:0!important;right:auto!important;top:0!important;
          bottom:0!important;width:min(285px,84vw)!important;height:100dvh!important;min-height:100vh!important;
          z-index:2000!important;overflow-y:auto!important;overflow-x:hidden!important;
          -webkit-overflow-scrolling:touch!important;
          transform:translate3d(-110%,0,0)!important;-webkit-transform:translate3d(-110%,0,0)!important;
          visibility:hidden!important;pointer-events:none!important;
          transition:transform .22s ease,-webkit-transform .22s ease!important;
        }
        .sidebar.open{
          transform:translate3d(0,0,0)!important;-webkit-transform:translate3d(0,0,0)!important;
          visibility:visible!important;pointer-events:auto!important;
        }
        .sidebar-overlay,.overlay{
          position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;
          min-height:100vh!important;background:rgba(4,22,40,.55)!important;
          z-index:1990!important;display:none!important;touch-action:none!important;
        }
        .sidebar-overlay.show,.overlay.show{display:block!important}
        .mobile-menu-btn,#menu{
          display:grid!important;place-items:center!important;position:relative!important;z-index:2010!important;
          width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;
          padding:0!important;margin:0!important;border:0!important;cursor:pointer!important;
          touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;
          user-select:none!important;-webkit-user-select:none!important;
        }
      }
      @media(max-width:430px){
        .mobile-menu-btn,#menu{width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important}
      }
    `;
    document.head.appendChild(ms);
    const fs=document.createElement('style');fs.id='global-slim-footer';fs.textContent=`
      .footer{width:100%!important;box-sizing:border-box!important;margin:18px 0 0!important;background:#082b52!important;color:#fff!important;padding:8px 18px!important;min-height:0!important;height:auto!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:16px!important;flex-wrap:nowrap!important;border-top:1px solid rgba(255,255,255,.12)!important;text-align:center!important;line-height:1.2!important}
      .footer-brand,.footer-copy,.footer-tag,.footer-created{margin:0!important;padding:0!important;white-space:nowrap!important;display:inline-flex!important;align-items:center!important;height:26px!important;box-sizing:border-box!important}
      .footer-brand,.footer-copy,.footer-tag{font-size:11px!important;font-weight:700!important;line-height:1.2!important}
      .footer-created{font-size:11px!important;font-weight:700!important;background:#66717c!important;color:#fff!important;border-radius:6px!important;padding:4px 9px!important;box-shadow:0 1px 3px rgba(0,0,0,.18)!important}
      .footer-created-label{font-weight:900!important;margin-right:5px!important}
      .footer-copy small{font-size:inherit!important;font-weight:inherit!important;opacity:1!important}
      @media(max-width:800px){.footer{margin-top:14px!important;padding:7px 8px!important;gap:7px!important}.footer-brand,.footer-copy,.footer-tag,.footer-created{font-size:8px!important;height:22px!important}.footer-created{padding:3px 6px!important}.footer-created-label{margin-right:3px!important}}
      @media(max-width:430px){.footer{padding:6px 4px!important;gap:4px!important}.footer-brand,.footer-copy,.footer-tag,.footer-created{font-size:7px!important;height:20px!important}.footer-created{padding:2px 5px!important}.footer-created-label{margin-right:2px!important}}
    `;document.head.appendChild(fs);
    function buildFooter(){document.querySelectorAll('.footer').forEach(function(f){f.innerHTML='<div class="footer-brand">Alfa Labs</div><div class="footer-copy">Environment, Health &amp; Safety Management</div><div class="footer-created"><span class="footer-created-label">Created</span><span>Hossam Elsharabasy — HSE Manager</span></div><div class="footer-tag">🛡️ Safety First • Safety Is Everyone’s Responsibility</div>';});}
    buildFooter();
    if(!document.querySelector('script[data-alfa-global-ui]')){const g=document.createElement('script');g.src='./global-ui.js?v=20260918.5';g.async=false;g.dataset.alfaGlobalUi='1';document.head.appendChild(g);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
