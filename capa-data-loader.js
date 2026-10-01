/* Alfa Labs HSE — CAPA data loader */
(function(){
'use strict';
window.loadAlfaCapaData = async function(){
  const baseResponse = await fetch('./capa-data.json?v=20261001',{cache:'no-store'});
  if(!baseResponse.ok) throw new Error('CAPA base data HTTP '+baseResponse.status);
  const base = await baseResponse.json();

  const updateResponse = await fetch('./capa-sep-2026-update.b64?v=20261001',{cache:'no-store'});
  if(!updateResponse.ok) throw new Error('CAPA update data HTTP '+updateResponse.status);

  const b64 = (await updateResponse.text()).replace(/\s+/g,'');
  const binary = Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  if(typeof DecompressionStream !== 'function') throw new Error('Browser does not support gzip decompression');
  const stream = new Blob([binary]).stream().pipeThrough(new DecompressionStream('gzip'));
  const update = JSON.parse(await new Response(stream).text());

  return base.concat(update);
};
})();