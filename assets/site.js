(() => {
 const menu = document.querySelector('[data-menu-toggle]');
 const nav = document.getElementById('main-nav');
 if(menu && nav){
   const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');};
   menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');});
   nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 }
 const yr=document.querySelector('[data-year]');if(yr)yr.textContent=String(new Date().getFullYear());
 const lightbox=document.querySelector('#gallery-dialog');
 if(lightbox && typeof lightbox.showModal==='function'){
   document.querySelectorAll('[data-lightbox]').forEach(button=>{
     button.addEventListener('click',()=>{
       const im=lightbox.querySelector('img'), cap=lightbox.querySelector('figcaption');
       if(!im || !cap)return;
       const pic=button.querySelector('img');if(!pic)return;
       im.src=pic.currentSrc||pic.src;im.alt=pic.alt;cap.textContent=button.dataset.caption||pic.alt;lightbox.showModal();
     });
   });
   lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click',()=>lightbox.close());
   lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
 }
 const widget=document.querySelector('[data-review-widget]');
 if(widget){
   const load=()=>{
     if(document.querySelector('script[data-elfsight-loader]'))return;
     const script=document.createElement('script');
     script.async=true;script.dataset.elfsightLoader='1';script.src='https://elfsightcdn.com/platform.js';
     document.head.appendChild(script);
   };
   if('IntersectionObserver' in window){
     const observer=new IntersectionObserver(entries=>{
       if(entries.some(e=>e.isIntersecting)){load();observer.disconnect();}
     },{rootMargin:'300px'});observer.observe(widget);
   }else{load();}
 }
 const form=document.querySelector('#request-form');
 if(form){
   const date=form.querySelector('[name="date"]');
   const localToday=()=>{
     const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Nassau',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
     const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
     return [p.year,p.month,p.day].join('-');
   };
   if(date){date.min=localToday();}
   const serialize=()=>{
     const data=new FormData(form);
     const val=(key)=>String(data.get(key)||'').trim();
     const service=val('service'),format=val('format'),guests=val('guests'),when=val('date'),time=val('time'),area=val('area');
     const lines=[
       'Hello Tranquilitas, I would like to REQUEST a Bahamas massage appointment.',
       '',
       'Treatment: '+service,
       'Setting: '+format,
       'Guests: '+guests,
       'Preferred date: '+when,
       'Preferred time: '+time+' (Nassau time)',
       'Location / property: '+area,
       'Name: '+val('name'),
       'Phone / WhatsApp: '+val('phone'),
       'Email: '+val('email'),
       'Notes: '+(val('notes')||'None'),
       '',
       'Source: bahamas.tranquilitasspa.com',
       'I understand this is a request, not a confirmed appointment.'
     ];
     return {text:lines.join('\n'),date:when};
   };
   form.addEventListener('submit',event=>{
     event.preventDefault();
     if(!form.reportValidity())return;
     const info=serialize();
     if(info.date<localToday()){date?.setCustomValidity('Please choose today or a future date.');date?.reportValidity();date?.setCustomValidity('');return;}
     window.location.href='https://wa.me/12428168286?text='+encodeURIComponent(info.text);
   });
   const mail=form.querySelector('[data-email-request]');
   if(mail){mail.addEventListener('click',()=>{
     if(!form.reportValidity())return;
     const info=serialize();
     if(info.date<localToday()){date?.setCustomValidity('Please choose today or a future date.');date?.reportValidity();date?.setCustomValidity('');return;}
     const subject='Bahamas massage appointment request';
     window.location.href='mailto:info@massagebahamas.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(info.text);
   });}
 }
})();