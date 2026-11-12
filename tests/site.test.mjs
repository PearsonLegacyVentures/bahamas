import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const base='https://bahamas.tranquilitasspa.com';
const read=(file)=>readFileSync(file,'utf8');
const walk=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(x=>{
 const p=join(dir,x.name);
 if(x.isDirectory() && x.name!=='.git' && x.name!=='node_modules')return walk(p);
 return x.isFile()&&x.name==='index.html'?[p]:[];
});
const htmls=walk('.').map(x=>({path:x.replace(/^\.\//,''),html:read(x)}));
test('all 23 routes build and preserve distinct canonicals',()=>{
 assert.equal(htmls.length,23);
 const canonical=new Set();
 for(const {path,html} of htmls){
  assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1,path);
  const matched=html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(matched,'Missing canonical: '+path);
  assert.ok(matched[1].startsWith(base+'/'),path);
  assert.ok(!canonical.has(matched[1]),'Duplicate canonical: '+matched[1]);
  canonical.add(matched[1]);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,path);
  assert.match(html,/<meta name="description"/,path);
  assert.match(html,/<script type="application\/ld\+json">/,path);
  assert.match(html,/Tranquilitas/,path);
  assert.doesNotMatch(html,/Anguilla|Meads Bay|Turks and Caicos|St Barts/i,path);
  assert.match(html,/<meta property="og:site_name" content="Tranquilitas Bahamas"/,path);
 }
});
test('sitemap is complete but does not promote the booking request',()=>{
 const s=read('sitemap.xml');
 assert.match(s,/<urlset/);
 assert.equal((s.match(/<loc>/g)||[]).length,22);
 assert.ok(!s.includes('<loc>'+base+'/book/</loc>'));
 assert.match(read('book/index.html'),/<meta name="robots" content="noindex,follow"/);
});
test('all internal page links resolve to built routes',()=>{
 for(const {path,html} of htmls){
  for(const m of html.matchAll(/\bhref="(\/[^"#?]*)"/g)){
   const href=m[1];
   if(href.startsWith('/assets/')){assert.ok(existsSync('.'+href),path+': '+href);continue}
   if(href==='/')assert.ok(existsSync('index.html'));else assert.ok(existsSync('.'+href+'index.html'),path+': '+href);
  }
 }
});
test('main conversion contacts use original Tranquilitas number',()=>{
 for(const p of ['index.html','book/index.html','contact/index.html','in-spa-nassau/index.html']){
  const s=read(p);
  assert.match(s,/tel:\+12428168286/,p);
  assert.match(s,/https:\/\/wa.me\/12428168286/,p);
  assert.doesNotMatch(s,/tel:\+12428198286/,p);
 }
});
test('request form has a functional WhatsApp/email path and no false confirmation',()=>{
 const s=read('book/index.html');
 assert.match(s,/id="request-form"/);
 assert.match(s,/data-email-request/);
 assert.match(s,/not a confirmed booking/i);
 const js=read('assets/site.js');
 assert.match(js,/mailto:info@massagebahamas.com/);
 assert.match(js,/https:\/\/wa.me\/12428168286\?text=/);
 assert.match(js,/reportValidity/);
});
test('robots/sitemap reference intended subdomain only',()=>{
 assert.match(read('robots.txt'),/Sitemap: https:\/\/bahamas.tranquilitasspa.com\/sitemap.xml/);
 assert.ok(!read('sitemap.xml').includes('massagebahamas.com'));
 assert.match(read('index.html'),/rel="canonical" href="https:\/\/bahamas.tranquilitasspa.com\/"/);
});
test('Tranquilitas is represented as the existing spa, not a duplicate GBP',()=>{
 const home=read('index.html');
 assert.match(home,/"@id":"https:\/\/www.tranquilitasspa.com\/#localbusiness"/);
 assert.match(home,/"name":"Tranquilitas Day Spa"/);
 assert.match(home,/"streetAddress":"#7 Fourth Terrace, Collins Avenue"/);
 assert.match(home,/not a separate business or Google listing/i);
});

test('additional wellness services have working enquiry options',()=>{
 const a=read('index.html'),b=read('experiences/index.html'),c=read('book/index.html');
 for(const [path,service] of [['beach-pilates-nassau','Beach Pilates'],['villa-wellness-packages-bahamas','Villa Wellness Package'],['bespoke-wellness-bahamas','Special / Bespoke Wellness Request']]){
  assert.ok(a.includes(path));assert.ok(b.includes(path));assert.ok(c.includes(service));
  assert.match(read(path+'/index.html'),/not an instant booking/i);
 }
 assert.match(read('assets/site.js'),/URLSearchParams/);
});

test('yacht charter wellness is available as a custom group enquiry',()=>{const page=read('yacht-massage-bahamas/index.html');assert.match(page,/tqYachtRequest/);assert.match(page,/captain/i);assert.match(page,/crew/i);assert.match(read('book/index.html'),/Yacht \/ Charter Group Wellness/);assert.match(read('index.html'),/yacht-massage-bahamas/)});

test('Bahamas conversion content preserves service search intent and working yacht media',()=>{const home=read('index.html');const y=read('yacht-massage-bahamas/index.html');assert.match(home,/Massage in Nassau & The Bahamas/);assert.match(home,/data-tranquilitas-ambient/);assert.match(y,/Yacht Massage in The Bahamas/);assert.match(y,/yw-gallery-grid/);assert.ok(!y.includes('PearsonLegacyVentures/The Bahamas'));assert.match(y,/tqYachtRequest/);});
