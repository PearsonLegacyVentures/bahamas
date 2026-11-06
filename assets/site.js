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

   // Nassau request form uses live booking prices managed by Tranquilitas; do not invent static rates.
   const serviceField=form.querySelector('[name="service"]');
   const formatField=form.querySelector('[name="format"]');
   const guestField=form.querySelector('[name="guests"]');
   const durationWrap=document.createElement('div');
   durationWrap.className='field';
   durationWrap.innerHTML='<label for="preferredDuration">Preferred duration *</label><select id="preferredDuration" name="duration" required><option value="">Choose a duration</option><option value="50">50 minutes</option><option value="60">60 minutes</option><option value="80">80 minutes</option><option value="90">90 minutes</option><option value="other">Other / not sure</option></select>';
   serviceField?.closest('.field')?.after(durationWrap);
   const summary=document.createElement('div');
   summary.className='bahamasBookingSummary';
   summary.setAttribute('role','status');
   summary.setAttribute('aria-live','polite');
   summary.innerHTML='<span>YOUR REQUEST SUMMARY</span><strong data-summary-service>Choose a massage</strong><p data-summary-details>Choose treatment, duration, setting and guest count.</p><p class="request-price-status" data-summary-price>Price: confirmed on our live booking menu</p><small>We do not duplicate potentially outdated Nassau prices. Your final quote and appointment are confirmed before payment.</small><a href="https://tranquilitasspa.setmore.com" target="_blank" rel="noopener noreferrer">See current Tranquilitas service prices</a>';
   form.querySelector('button[type="submit"]')?.before(summary);
   function syncRequestSummary(){
     const name=serviceField?.value||'Choose a massage';
     const duration=form.querySelector('[name="duration"]')?.value;
     const place=formatField?.value,guests=guestField?.value;
     summary.querySelector('[data-summary-service]').textContent=name;
     summary.querySelector('[data-summary-details]').textContent=[duration&&duration!=='other'?duration+' minutes':(duration==='other'?'Duration by arrangement':null),place,guests?guests+' guest(s)':null].filter(Boolean).join(' · ')||'Choose treatment, duration, setting and guest count.';
     summary.querySelector('[data-summary-price]').textContent='Price: see live booking menu / confirm with concierge';
   }
   form.addEventListener('change',syncRequestSummary);
   form.addEventListener('input',syncRequestSummary);
   syncRequestSummary();

   const serialize=()=>{
     const data=new FormData(form);
     const val=(key)=>String(data.get(key)||'').trim();
     const service=val('service'),format=val('format'),guests=val('guests'),when=val('date'),time=val('time'),area=val('area');
     const lines=[
       'Hello Tranquilitas, I would like to REQUEST a Bahamas massage appointment.',
       '',
       'Treatment: '+service,
       'Duration: '+val('duration')+' minutes',
       'Setting: '+format,
       'Guests: '+guests,
       'Listed total: see current Tranquilitas booking menu / quote required',
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