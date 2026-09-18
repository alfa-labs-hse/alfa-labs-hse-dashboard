/* Alfa Labs HSE — Authentication UI / Role Gate
 * NOTE: This is the front-end gate for the current static GitHub Pages build.
 * It is NOT a security boundary. Production enforcement should be moved to
 * Microsoft Entra ID / Cloudflare Access / Supabase before sensitive data is exposed.
 */
(function(){
'use strict';
if(window.__ALFA_AUTH__)return; window.__ALFA_AUTH__=true;

const CONFIG={
  allowedDomain:'@alfalabs.com',
  users:[
    {email:'hossam.elsharabasy@alfalabs.com',role:'admin'},
    {email:'mohamed.nasr@alfascan.com',role:'viewer',expiresAt:1789774860000}
  ],
  sessionKey:'alfaLabsAuthSession'
};

function getSession(){
  try{return JSON.parse(sessionStorage.getItem(CONFIG.sessionKey)||'null')}catch(e){return null}
}
function setSession(email,role){
  const u=CONFIG.users.find(x=>x.email.toLowerCase()===String(email||'').trim().toLowerCase());
  sessionStorage.setItem(CONFIG.sessionKey,JSON.stringify({email:email,role:role,loginAt:Date.now(),expiresAt:u&&u.expiresAt?u.expiresAt:null}));
}
function clearSession(){sessionStorage.removeItem(CONFIG.sessionKey)}
function isAllowed(email){
  const e=String(email||'').trim().toLowerCase();
  const u=CONFIG.users.find(x=>x.email.toLowerCase()===e);
  if(!u)return false;
  if(u.expiresAt&&Date.now()>=u.expiresAt)return false;
  return e.endsWith(CONFIG.allowedDomain)||e==='mohamed.nasr@alfascan.com';
}
function roleFor(email){
  const e=String(email||'').trim().toLowerCase();
  const u=CONFIG.users.find(x=>x.email.toLowerCase()===e);
  return u?u.role:null;
}

function guard(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(path==='login.html')return true;
  const s=getSession();
  if(!s||!isAllowed(s.email)||(s.expiresAt&&Date.now()>=s.expiresAt)){
    clearSession();
    location.replace('./login.html?return='+encodeURIComponent(location.href));
    return false;
  }
  document.documentElement.dataset.alfaRole=s.role;
  document.body.dataset.alfaRole=s.role;
  return true;
}

function viewerLock(){
  const s=getSession(); if(!s||s.role==='admin')return;
  document.documentElement.dataset.alfaRole='viewer';
  document.body.dataset.alfaRole='viewer';
  const block=function(e){
    const t=e.target.closest('button,a,[role="button"]');
    if(!t)return;
    const text=(t.innerText||t.getAttribute('aria-label')||t.title||'').toLowerCase();
    const forbidden=/(export|download|print|copy|save report|get a report|تحميل|تنزيل|طباعة|نسخ|تقرير)/.test(text);
    if(forbidden){e.preventDefault();e.stopPropagation();toast('View-only access — this action is restricted.');}
  };
  document.addEventListener('click',block,true);
  document.addEventListener('contextmenu',e=>{e.preventDefault();toast('Copying is disabled for Viewer access.');});
  document.addEventListener('copy',e=>{e.preventDefault();toast('Copying is disabled for Viewer access.');});
  document.addEventListener('cut',e=>e.preventDefault());
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&['c','x','s','p','u'].includes(e.key.toLowerCase())){
      e.preventDefault();toast('This action is restricted for Viewer access.');
    }
  },true);
}
function toast(msg){
  let t=document.getElementById('alfa-auth-toast');
  if(!t){t=document.createElement('div');t.id='alfa-auth-toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),2200);
}
function addUserBadge(){
  const s=getSession(); if(!s)return;
  if(document.getElementById('alfa-user-badge'))return;
  const host=document.querySelector('.unified-meta,.header-actions,.user')||document.body;
  const wrap=document.createElement('div');wrap.id='alfa-user-badge';
  wrap.innerHTML='<span class="alfa-role-pill">'+(s.role==='admin'?'ADMIN':'VIEW ONLY')+'</span><span class="alfa-user-email">'+s.email+'</span><button type="button" id="alfa-logout">Logout</button>';
  host.appendChild(wrap);
  document.getElementById('alfa-logout').onclick=()=>{clearSession();location.replace('./login.html')};
}
function init(){
  if(!guard())return;
  const s=getSession();
  if(s){viewerLock();addUserBadge()}
}
window.AlfaHSEAuth={CONFIG,getSession,setSession,clearSession,isAllowed,roleFor,guard,toast};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();