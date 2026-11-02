import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {join,resolve,extname} from 'node:path';
const root=resolve('dist');const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{try{let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.includes('..'))throw Error('Bad path');let file=join(root,path);if((await stat(file)).isDirectory())file=join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(4173,()=>console.log('Static preview at http://localhost:4173 (form requires Netlify)'));
