import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const origin='http://127.0.0.1:4173';
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const failures=[];
async function run(name,fn){try{await fn();console.log('PASS '+name)}catch(e){failures.push({name,error:String(e)});console.error('FAIL '+name+': '+e)}}
const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
await run('Homepage renders and desktop layout fits',async()=>{
 await desktop.goto(origin+'/',{waitUntil:'domcontentloaded'});
 assert.match(await desktop.title(),/Tranquilitas Bahamas/);
 assert.equal(await desktop.locator('h1').count(),1);
 assert.equal(await desktop.locator('.hero').count(),1);
 const width=await desktop.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
 assert.ok(width.scroll<=width.inner+8,'Desktop horizontal overflow');
 await desktop.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
});
await run('Hero image and logo have loaded',async()=>{
 await desktop.locator('.hero-picture img').evaluate(img=>img.scrollIntoView());
 await desktop.waitForTimeout(2000);
 const imgs=await desktop.evaluate(()=>{
   const select=['.hero-picture img','.brand-mark img','.card img'];
   return select.flatMap(q=>[...document.querySelectorAll(q)].slice(0,2).map(img=>({src:img.src,loaded:img.complete && img.naturalWidth>0})));
 });
 console.log('IMAGE_CHECK '+JSON.stringify(imgs));
 const hero=imgs.find(x=>x.src.includes('f97d98'));
 assert.ok(hero?.loaded,'Hero image did not load');
});
await run('Desktop services and booking links resolve',async()=>{
 await desktop.goto(origin+'/in-spa-nassau/',{waitUntil:'domcontentloaded'});
 assert.match(await desktop.locator('h1').innerText(),/Nassau spa/i);
 assert.ok((await desktop.locator('a[href="/book/"]').count())>0);
 assert.match(await desktop.locator('link[rel="canonical"]').getAttribute('href'),/bahamas.tranquilitasspa.com\/in-spa-nassau\/$/);
 await desktop.goto(origin+'/book/',{waitUntil:'domcontentloaded'});
 assert.ok(await desktop.locator('#request-form').isVisible());
 assert.ok(await desktop.locator('button[data-email-request]').isVisible());
 assert.ok(await desktop.locator('input[name="date"]').getAttribute('min'));
 await desktop.screenshot({path:'artifacts/booking-desktop.png',fullPage:true});
});
const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
await run('Mobile menu and viewport work',async()=>{
 await mobile.goto(origin+'/',{waitUntil:'domcontentloaded'});
 const toggle=mobile.locator('[data-menu-toggle]');
 assert.ok(await toggle.isVisible());
 await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),'true');
 assert.ok(await mobile.locator('#main-nav a[href="/book/"]').isVisible());
 await mobile.locator('#main-nav a[href="/book/"]').click();
 assert.match(mobile.url(),/\/book\/$/);
 const width=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth}));
 assert.ok(width.scroll<=width.inner+8,'Mobile horizontal overflow');
 await mobile.screenshot({path:'artifacts/booking-mobile.png',fullPage:true});
});
await run('Gallery opens and closes accessible lightbox',async()=>{
 await mobile.goto(origin+'/gallery/',{waitUntil:'domcontentloaded'});
 await mobile.locator('[data-lightbox]').first().click();
 assert.equal(await mobile.locator('#gallery-dialog').evaluate(x=>x.open),true);
 await mobile.locator('[data-lightbox-close]').click();
 assert.equal(await mobile.locator('#gallery-dialog').evaluate(x=>x.open),false);
 await mobile.screenshot({path:'artifacts/gallery-mobile.png',fullPage:true});
});
await browser.close();
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1)}
console.log('All browser smoke checks passed');
