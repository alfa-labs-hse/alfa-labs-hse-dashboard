/* Alfa Labs HSE — CAPA data loader | latest snapshot mode */
(function(){
'use strict';
const BUILD_VERSION='20261001.3';
window.loadAlfaCapaData=async function(){
  const cacheKey=BUILD_VERSION+'-'+Date.now();
  const baseResponse=await fetch('./capa-data.json?v='+cacheKey,{cache:'no-store'});
  if(!baseResponse.ok)throw new Error('CAPA base data HTTP '+baseResponse.status);
  const base=await baseResponse.json();

  const updateResponse=await fetch('./capa-sep-2026-update.b64?v='+cacheKey,{cache:'no-store'});
  if(!updateResponse.ok)throw new Error('CAPA latest update HTTP '+updateResponse.status);

  const b64=(await updateResponse.text()).replace(/\s+/g,'');
  const binary=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  if(typeof DecompressionStream!=='function')throw new Error('Browser does not support gzip decompression');
  const stream=new Blob([binary]).stream().pipeThrough(new DecompressionStream('gzip'));
  const update=JSON.parse(await new Response(stream).text());
  if(!Array.isArray(update))throw new Error('Invalid CAPA latest update');

  /* Latest dataset = base snapshot + latest uploaded records.
     Never expose the base dataset by itself. */
  const latest=base.concat(update);
  if(latest.length<1)throw new Error('Empty CAPA dataset');
  return latest;
};
})();