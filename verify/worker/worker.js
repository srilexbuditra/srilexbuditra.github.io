/* V30 Cloudflare Worker + KV verification API.
 * Create a KV namespace and bind it as VERIFY_DB.
 * Set an environment secret named PUBLISHER_TOKEN.
 */
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8',...cors}});
function authorized(req,env){const h=req.headers.get('Authorization')||'';return h==='Bearer '+env.PUBLISHER_TOKEN;}
export default {async fetch(req,env){if(req.method==='OPTIONS')return new Response(null,{headers:cors});const u=new URL(req.url);if(u.pathname==='/health')return json({ok:true,service:'Srilex Buditra verification API'});
 if(u.pathname.startsWith('/documents/')){const id=decodeURIComponent(u.pathname.slice('/documents/'.length)).trim().toUpperCase();if(!id)return json({error:'missing id'},400);const raw=await env.VERIFY_DB.get('doc:'+id);if(!raw)return json({error:'not_found'},404);return json(JSON.parse(raw));}
 if(u.pathname==='/documents'&&req.method==='POST'){if(!authorized(req,env))return json({error:'unauthorized'},401);let d;try{d=await req.json()}catch{return json({error:'invalid_json'},400)};if(!d.id)return json({error:'missing id'},400);const record={id:String(d.id),status:'Verified',issued_at:d.issued_at||new Date().toISOString().slice(0,10),client_name:d.client_name||'-',project:d.project||'-',fingerprint:d.fingerprint||'-'};await env.VERIFY_DB.put('doc:'+record.id.toUpperCase(),JSON.stringify(record));return json(record,201);}
 return json({error:'not_found'},404);}};
