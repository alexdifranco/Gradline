// Gradeline relay: Cloudflare Worker + one KV namespace bound as GL.
// The bookmark sends your grades here; the app picks them up with the same secret key.
const cors={'access-control-allow-origin':'*'};
const gif=Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),c=>c.charCodeAt(0));
export default{async fetch(req,env){
 const u=new URL(req.url),k=u.searchParams.get('k')||'';
 if(!/^[a-f0-9]{32}$/.test(k))return new Response('bad key',{status:400,headers:cors});
 if(u.pathname==='/put'){
  const d=u.searchParams.get('d')||'';
  if(d.length>20000)return new Response('too big',{status:413,headers:cors});
  let j;try{j=JSON.parse(d)}catch{return new Response('bad data',{status:400,headers:cors})}
  await env.GL.put(k,JSON.stringify({t:Date.now(),d:j}),{expirationTtl:86400});
  return new Response(gif,{headers:{...cors,'content-type':'image/gif','cache-control':'no-store'}})}
 if(u.pathname==='/get'){const v=await env.GL.get(k);return new Response(v||'null',{headers:{...cors,'content-type':'application/json','cache-control':'no-store'}})}
 return new Response('not found',{status:404,headers:cors})}};
