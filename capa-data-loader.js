/* Alfa Labs HSE — CAPA data loader */
(function(){
'use strict';
window.loadAlfaCapaData = async function(){
  const baseResponse = await fetch('./capa-data.json',{cache:'no-store'});
  if(!baseResponse.ok) throw new Error('CAPA base data HTTP '+baseResponse.status);
  const base = await baseResponse.json();
  const updateResponse = await fetch('./capa-data-update-sep2026.b64',{cache:'no-store'});
  if(!updateResponse.ok) throw new Error('CAPA update data HTTP '+updateResponse.status);
  const b64 = (await updateResponse.text()).replace(/\s+/g,'');
  const bytes = Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const update = JSON.parse(await new Response(stream).text());
  const merged = [];
  const seen = new Set();
  [...base,...update].forEach(x=>{
    const key=JSON.stringify(x);
    if(!seen.has(key)){seen.add(key);merged.push(x);}
  });
  return merged;
};
})();