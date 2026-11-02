import {cpSync, rmSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
const source = resolve('static-site');
const target = resolve('dist');
if (!existsSync(source+'/contact/index.html')) throw new Error('Static site bundle missing. Re-download complete ZIP.');
rmSync(target,{recursive:true,force:true});
cpSync(source,target,{recursive:true});
console.log('Copied five SEO-ready pages and assets into dist/');
