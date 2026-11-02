/* Progressive enhancement for the independently generated static preview. */
(() => {
'use strict';
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('.desktop-nav');
if(menuButton&&menu)menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));menu.classList.toggle('is-open',!expanded);menuButton.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');});
const key='star-marketing-consent-v1';const consent=(()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}})();
const track=(event,params={})=>{try{if(!JSON.parse(localStorage.getItem(key)||'null')?.analytics)return;window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...params})}catch{}};
if(!consent){const banner=document.createElement('div');banner.className='consent-banner';banner.setAttribute('role','region');banner.setAttribute('aria-label','Privacy choices');banner.innerHTML='<span>Optional analytics are off until you choose. Essential site functionality is available without consent.</span><div><button class="small-btn" data-choice="reject">Reject optional</button><button class="small-btn accent" data-choice="accept">Allow analytics</button></div>';
  banner.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem(key,JSON.stringify({analytics:btn.dataset.choice==='accept',marketing:false}));banner.remove();}));document.body.append(banner);
}
document.querySelectorAll('.footer-bottom button').forEach(btn=>btn.addEventListener('click',()=>{localStorage.removeItem(key);location.reload()}));
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>track('email_click')));
document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.addEventListener('click',()=>track('phone_click')));
document.querySelectorAll('a[href*="intent=consultation"]').forEach(a=>a.addEventListener('click',()=>track('consultation_cta_click')));
const form=document.querySelector('form[aria-label="Project inquiry form"]'); if(!form)return;
const params=new URLSearchParams(location.search);
const val=params.get('service'); if(val){const service=form.querySelector('#service'); if(service)service.value=val==='digital-marketing'?'Digital Marketing':val==='ai-web-development'?'AI Web Development':'';}
const title=document.querySelector('.form-heading h2');if(title&&params.get('intent')==='consultation')title.textContent='Request a free consultation';
const errors={fullName:'Enter your full name (at least 2 characters).',email:'Enter a valid business email address.',company:'Enter your company name.',phone:'Enter a valid phone number.',service:'Select a service.',goals:'Tell us a little more (at least 20 characters).',consent:'Please confirm you agree to be contacted about this inquiry.'};
const fields=['fullName','email','company','phone','website','service','budget','goals','contactMethod','consent'];
const clearError=(id)=>{const elem=document.getElementById(id);if(elem)elem.removeAttribute('aria-invalid');const msg=document.getElementById(id+'-error');if(msg)msg.remove();};
const showError=(id,text)=>{const elem=document.getElementById(id);if(elem){elem.setAttribute('aria-invalid','true');elem.setAttribute('aria-describedby',id+'-error');}const node=document.createElement('span');node.id=id+'-error';node.className='field-error';node.setAttribute('role','alert');node.textContent=text;const holder=id==='consent'?form.querySelector('.consent-checkbox'):elem?.closest('.field');holder?.insertAdjacentElement('afterend',node);};
form.addEventListener('input',e=>{if(e.target.name)clearError(e.target.name)});
let sending=false;form.addEventListener('submit',async e=>{
  e.preventDefault();if(sending)return;
  fields.forEach(clearError);
  const f=Object.fromEntries(new FormData(form).entries());f.consent=!!form.querySelector('.consent-checkbox input')?.checked;
  const invalid={};if(String(f.fullName||'').trim().length<2)invalid.fullName=errors.fullName;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.email||'').trim()))invalid.email=errors.email;
  if(!String(f.company||'').trim())invalid.company=errors.company;
  if(f.phone&&!/^[+()\d\s.-]{7,24}$/.test(String(f.phone).trim()))invalid.phone=errors.phone;
  if(f.contactMethod==='phone'&&!String(f.phone||'').trim())invalid.phone='Enter a phone number so we can call you.';
  if(f.website&&!/^https?:\/\/[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i.test(f.website))invalid.website='Include a full URL, such as https://yourcompany.com.';
  if(!f.service)invalid.service=errors.service;
  if(String(f.goals||'').trim().length<20)invalid.goals=errors.goals;
  if(!f.consent)invalid.consent=errors.consent;
  if(String(f.companyFax||'').trim())return;
  if(Object.keys(invalid).length){Object.entries(invalid).forEach(([k,v])=>showError(k,v));document.getElementById(Object.keys(invalid)[0])?.focus();return;}
  const alertOld=form.querySelector('.form-alert');alertOld?.remove();
  const endpoint=window.STAR_FORM_ENDPOINT||'';
  if(endpoint&&!/^https:\/\//.test(endpoint)){
    const alert=document.createElement('div');alert.className='form-alert';alert.setAttribute('role','alert');alert.textContent='Configured form endpoint must use HTTPS.';form.querySelector('.submit-btn')?.before(alert);return;
  }
  if(!endpoint&&['localhost','127.0.0.1'].includes(location.hostname)){
    const alert=document.createElement('div');alert.className='form-alert';alert.setAttribute('role','alert');alert.textContent='The form can only submit after deployment on Netlify.';form.querySelector('.submit-btn')?.before(alert);return;
  }
  const btn=form.querySelector('.submit-btn'); const old=btn?.innerHTML;sending=true;if(btn){btn.disabled=true;btn.textContent='Sending inquiry...'}
  const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),15000);
  try{
    const encoded = new URLSearchParams(new FormData(form));
    encoded.set('form-name','star-inquiry');
    encoded.set('inquiryType',params.get('intent')==='consultation'?'consultation':'project');
    const response=endpoint
      ?await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...f,inquiryType:params.get('intent')==='consultation'?'consultation':'project'}),signal:ctrl.signal})
      :await fetch('/contact/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded.toString(),signal:ctrl.signal});if(!response.ok)throw Error('Failed');
    const success=document.createElement('div');success.className='form-success';success.setAttribute('role','status');success.innerHTML='<h3>Inquiry successfully submitted</h3><p>Your inquiry was accepted by the website. This is not a confirmed appointment.</p><a class="btn btn-dark" href="' + location.pathname + '">Send another inquiry</a>';form.replaceWith(success);track('generate_lead',{service:f.service,inquiry_type:params.get('intent')==='consultation'?'consultation':'project'});
  }catch{const alert=document.createElement('div');alert.className='form-alert';alert.setAttribute('role','alert');alert.textContent='The inquiry could not be sent. Please try again or contact the agency by email when available.';btn?.before(alert)}
  finally{clearTimeout(timeout);sending=false;if(btn){btn.disabled=false;btn.innerHTML=old}}
});
})();
