import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const pages=['','digital-marketing','ai-web-development','about','contact'];
for (const page of pages) test('Page present: '+(page||'home'),()=>{
 const path='dist/'+(page?page+'/':'')+'index.html';
 assert.ok(existsSync(path));
 const html=readFileSync(path,'utf8');
 assert.match(html,/<h1[\s>]/);
 assert.match(html,/<meta name="description"/);
 assert.match(html,/\+1 631 397 6692/);
 assert.match(html,/<script type="application\/ld\+json">/);
});
test('Contact captures lead via Netlify form and exposes no limo email',()=>{
 const html=readFileSync('dist/contact/index.html','utf8');
 const js=readFileSync('dist/assets/site-fallback.js','utf8');
 assert.match(html,/<form[^>]+name="star-inquiry"[^>]+data-netlify="true"/);
 assert.match(html,/name="form-name" value="star-inquiry"/);
 assert.match(js,/application\/x-www-form-urlencoded/);
 assert.doesNotMatch(html,/longislandnylimoservice@gmail.com/);
});
test('Base infrastructure and assets',()=>{
 for (const file of ['dist/assets/site.css','dist/assets/site-fallback.js','dist/assets/star-mark.svg','netlify.toml','static-site/index.html']) assert.ok(existsSync(file));
});
