import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail, Phone, ShieldCheck, AlertCircle, CalendarDays, Clock3, LoaderCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { site } from '../data/site';
import { track } from '../lib/analytics';
type FormKey = 'fullName'|'email'|'company'|'phone'|'website'|'service'|'budget'|'goals'|'contactMethod'|'consent';
type FormState = Record<FormKey, string | boolean>;
type Errors = Partial<Record<FormKey, string>>;
const init: FormState = {fullName:'',email:'',company:'',phone:'',website:'',service:'',budget:'',goals:'',contactMethod:'email',consent:false};
const validation = (f: FormState): Errors => {
  const e: Errors = {};
  if (String(f.fullName).trim().length < 2) e.fullName = 'Enter your full name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(f.email).trim())) e.email = 'Enter a valid business email address.';
  if (!String(f.company).trim()) e.company = 'Enter your company name.';
  if (f.phone && !/^[+()\d\s.-]{7,24}$/.test(String(f.phone).trim())) e.phone = 'Enter a valid phone number.';
  if (f.contactMethod === 'phone' && !String(f.phone).trim()) e.phone = 'Enter a phone number so we can call you.';
  if (f.website && !/^https?:\/\/[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i.test(String(f.website))) e.website = 'Include a full URL, for example https://yourcompany.com.';
  if (!f.service) e.service = 'Select a service.';
  if (String(f.goals).trim().length < 20) e.goals = 'Tell us a little more (at least 20 characters).';
  if (!f.contactMethod) e.contactMethod = 'Choose how you would like us to respond.';
  if (!f.consent) e.consent = 'Please confirm you agree to be contacted about this inquiry.';
  return e;
};
const FieldError = ({message, id}: {message?:string;id:string}): JSX.Element | null => message ? <span id={`${id}-error`} className="field-error" role="alert"><AlertCircle size={13}/>{message}</span> : null;
export default function Contact() {
  const [search] = useSearchParams();
  const preselected = search.get('service') === 'ai-web-development' ? 'AI Web Development' : search.get('service') === 'digital-marketing' ? 'Digital Marketing' : '';
  const [data,setData] = useState<FormState>({...init,service:preselected});
  const [errors,setErrors] = useState<Errors>({});
  const [status,setStatus] = useState<'idle'|'sending'|'success'|'error'|'unconfigured'>('idle');
  const [message,setMessage] = useState('');
  const [honeypot,setHoneypot] = useState('');
  const sending = useRef(false);
  const intent = useMemo(() => search.get('intent') === 'consultation' ? 'consultation' : 'project', [search]);
  const update = (name: FormKey, value: string|boolean) => { setData(v => ({ ...v, [name]: value })); setErrors(v => ({...v,[name]:undefined})); if (status !== 'sending') setStatus('idle'); };
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (sending.current) return;
    const found = validation(data); setErrors(found);
    if (Object.keys(found).length) { const first = Object.keys(found)[0]; document.getElementById(first)?.focus(); return; }
    if (honeypot) { setStatus('error'); setMessage('Please try again or use another contact method.'); return; }
    const externalEndpoint = site.formEndpoint.trim();
    if (externalEndpoint && !/^https:\/\//i.test(externalEndpoint)) {
      setStatus('error'); setMessage('The configured form endpoint must use HTTPS.'); return;
    }
    if (!externalEndpoint && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      setStatus('unconfigured'); setMessage('Netlify Forms only processes submissions on a deployed Netlify website. Local preview cannot send real inquiries.'); return;
    }
    sending.current = true; setStatus('sending'); setMessage('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let response: Response;
      try {
        if (externalEndpoint) {
          response = await fetch(externalEndpoint, { method:'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: !!data.consent, inquiryType: intent, sourcePage: 'contact' }), signal: controller.signal });
        } else {
          const formBody = new URLSearchParams();
          formBody.set('form-name', 'star-inquiry');
          for (const [key, value] of Object.entries(data)) formBody.set(key, String(value));
          formBody.set('inquiryType', intent);
          response = await fetch('/contact/', { method:'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: formBody.toString(), signal: controller.signal });
        }
      }
      finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error('The server did not accept your inquiry.');
      setStatus('success'); setMessage('Your inquiry was accepted by the website. This is not a confirmed consultation. The agency will review your request.');
      setData({ ...init, service: preselected });
      track('generate_lead', { service: String(data.service), inquiry_type: intent });
    } catch (err) { setStatus('error'); setMessage(err instanceof DOMException && err.name === 'AbortError' ? 'The request timed out. Please try again.' : 'The inquiry could not be sent. Please try again or contact us by email.'); }
    finally { sending.current = false; }
  };
  const inputProps = (name: FormKey) => ({ id: name, name, 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  return <>
    <section className="contact-intro"><div className="container"><div className="eyebrow light"><span className="eyebrow-dot"/> GET IN TOUCH</div><h1>Let's talk about <span>what's next.</span></h1><p>Tell us about the challenge, the opportunity or the idea you've been thinking about. A thoughtful next step begins here.</p></div></section>
    <section className="contact-section"><div className="container contact-layout"><div className="contact-aside"><span className="aside-kicker">START A CONVERSATION</span><h2>Big idea or small first step—we're listening.</h2><p>Whether you're refining a marketing strategy, planning a new website or exploring practical AI, share a few details and we'll take it from there.</p><div className="contact-tips"><div><span><CalendarDays size={21}/></span><div><strong>Consultation requests</strong><small>{site.bookingUrl ? 'Open the online scheduling link from the consultation button.' : 'Select your project needs and tell us you want an initial consultation.'}</small></div></div><div><span><Clock3 size={21}/></span><div><strong>Clear next steps</strong><small>Submission does not confirm a booked meeting or an accepted project.</small></div></div><div><span><ShieldCheck size={21}/></span><div><strong>Your information matters</strong><small>We use inquiry details to respond—not to populate analytics events.</small></div></div></div><div className="contact-details"><span>DIRECT CONTACT</span>{site.email ? <a href={`mailto:${site.email}`} onClick={() => track('email_click')}><Mail size={18}/>{site.email} <ArrowUpRight size={15}/></a> : <p><Mail size={18}/> Business email: add verified address in configuration</p>}{site.phone ? <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} onClick={() => track('phone_click')}><Phone size={18}/>{site.phone} <ArrowUpRight size={15}/></a> : <p><Phone size={18}/> Business phone: not yet provided</p>}</div></div>
    <div className="form-card"><div className="form-heading"><span className="form-icon">✳</span><div><h2>{intent === 'consultation' ? 'Request a free consultation' : 'Tell us about your project'}</h2><p>Share the essentials. Required fields are marked with *.</p></div></div>
    {status === 'success' ? <div className="form-success" role="status"><CheckCircle2 size={34}/><h3>Inquiry successfully submitted</h3><p>{message}</p><button type="button" className="btn btn-dark" onClick={() => setStatus('idle')}>Send another inquiry <ArrowRight size={16}/></button></div> : <form name="star-inquiry" method="POST" data-netlify="true" data-netlify-honeypot="companyFax" noValidate onSubmit={submit} aria-label="Project inquiry form"><input type="hidden" name="form-name" value="star-inquiry" /><input type="hidden" name="inquiryType" value={intent} /><div className="form-grid"><div className="field"><label htmlFor="fullName">Full name <b>*</b></label><input {...inputProps('fullName')} autoComplete="name" placeholder="Your full name" value={String(data.fullName)} onChange={e=>update('fullName',e.target.value)} /><FieldError id="fullName" message={errors.fullName}/></div><div className="field"><label htmlFor="email">Business email <b>*</b></label><input {...inputProps('email')} type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={String(data.email)} onChange={e=>update('email',e.target.value)} /><FieldError id="email" message={errors.email}/></div><div className="field"><label htmlFor="company">Company name <b>*</b></label><input {...inputProps('company')} autoComplete="organization" placeholder="Your company" value={String(data.company)} onChange={e=>update('company',e.target.value)} /><FieldError id="company" message={errors.company}/></div><div className="field"><label htmlFor="phone">Phone number <em>{data.contactMethod === 'phone' ? '(required for phone contact)' : '(optional)'}</em></label><input {...inputProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 123 4567" value={String(data.phone)} onChange={e=>update('phone',e.target.value)} /><FieldError id="phone" message={errors.phone}/></div><div className="field"><label htmlFor="website">Website URL <em>(optional)</em></label><input {...inputProps('website')} type="url" placeholder="https://yourcompany.com" value={String(data.website)} onChange={e=>update('website',e.target.value)} /><FieldError id="website" message={errors.website}/></div><div className="field"><label htmlFor="service">What can we help with? <b>*</b></label><select {...inputProps('service')} value={String(data.service)} onChange={e=>update('service',e.target.value)}><option value="">Select a service</option><option>Digital Marketing</option><option>AI Web Development</option><option>Both</option></select><FieldError id="service" message={errors.service}/></div><div className="field"><label htmlFor="budget">Estimated project budget <em>(optional)</em></label><select {...inputProps('budget')} value={String(data.budget)} onChange={e=>update('budget',e.target.value)}><option value="">Prefer to discuss</option><option>Under $2,500</option><option>$2,500–$5,000</option><option>$5,000–$10,000</option><option>$10,000–$25,000</option><option>$25,000+</option></select></div><div className="field full-field"><label htmlFor="goals">Tell us about your goals <b>*</b></label><textarea {...inputProps('goals')} rows={5} placeholder="What are you trying to achieve? What does success look like for your business?" value={String(data.goals)} onChange={e=>update('goals',e.target.value)} /><FieldError id="goals" message={errors.goals}/></div><fieldset className="field full-field contact-method"><legend>Preferred contact method <b>*</b></legend><div className="radio-grid"><label><input type="radio" name="contactMethod" value="email" checked={data.contactMethod === 'email'} onChange={e=>update('contactMethod',e.target.value)}/> Email</label><label><input type="radio" name="contactMethod" value="phone" checked={data.contactMethod === 'phone'} onChange={e=>update('contactMethod',e.target.value)}/> Phone</label></div><FieldError id="contactMethod" message={errors.contactMethod}/></fieldset></div>
    <div className="hidden-trap" aria-hidden="true"><label htmlFor="companyFax">Leave this field blank</label><input id="companyFax" name="companyFax" value={honeypot} onChange={e=>setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
    <label className="consent-checkbox"><input name="consent" type="checkbox" checked={!!data.consent} onChange={e=>update('consent',e.target.checked)}/><span>I agree to be contacted about this inquiry. My details will be used to respond to this request, not sent to analytics tools. <b>*</b></span></label><FieldError id="consent" message={errors.consent}/>
    {status === 'unconfigured' || status === 'error' ? <div className="form-alert" role="alert"><AlertCircle size={18}/>{message}</div> : null}
    <button className="btn btn-primary submit-btn" type="submit" disabled={status==='sending'}>{status==='sending' ? <><LoaderCircle className="spin" size={18}/> Sending inquiry...</> : <>Request Your Consultation <ArrowUpRight size={18}/></>}</button><p className="form-footnote"><ShieldCheck size={15}/> Sending this form requests follow-up; it does not book an appointment. No obligation to proceed.</p>
    </form>}</div></div></section>
    <section className="contact-followup"><div className="container"><p>Still exploring your options? <Link to="/digital-marketing/">Explore digital marketing <ArrowUpRight size={14}/></Link> or <Link to="/ai-web-development/">see AI web development <ArrowUpRight size={14}/></Link>.</p></div></section>
  </>;
}
