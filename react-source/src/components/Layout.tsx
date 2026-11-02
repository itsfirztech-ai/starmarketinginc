import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Menu, X, Phone, Mail, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';
import { site, routes } from '../data/site';
import { applyConsent, getConsent, track, type Consent } from '../lib/analytics';
import Seo from './Seo';
const nav = routes.slice(1);
export const ContactCTA = ({ label = 'Book a Free Consultation', className = '', source = 'general' }: { label?: string; className?: string; source?: string }) => {
  const onClick = () => track('consultation_cta_click', { source });
  return site.bookingUrl ? <a className={`btn btn-primary ${className}`} href={site.bookingUrl} onClick={onClick} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={17} aria-hidden="true"/></a> : <Link className={`btn btn-primary ${className}`} to="/contact/?intent=consultation" onClick={onClick}>{label}<ArrowUpRight size={17} aria-hidden="true"/></Link>;
};
export function PageHero({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: string }) {
  return <section className="page-hero"><div className="container"><div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div><h1>{title}</h1><p className="lead">{description}</p>{action && <ContactCTA label={action} source="page_hero" />}</div><div className="page-hero-glow" aria-hidden="true" /></section>;
}
export function SectionTitle({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return <div className={`section-title ${light ? 'on-dark' : ''}`}><div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
export function ClosingCTA({ title = 'Build something worth growing.', body = 'Tell us where you want to go. We’ll start with the right questions and a practical conversation about what comes next.' }: { title?: string; body?: string }) {
  return <section className="closing-section"><div className="container"><div className="closing-card"><div className="closing-orbit" aria-hidden="true">✳</div><div className="eyebrow light"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER</div><h2>{title}</h2><p>{body}</p><div className="cta-group"><ContactCTA source="closing_cta" /><Link className="btn btn-outline-white" to="/digital-marketing/">Explore services <ArrowRight size={16}/></Link></div></div></div></section>;
}
export default function Layout() {
  const [menu, setMenu] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const [choice, setChoice] = useState<Consent>({ analytics: false, marketing: false });
  const [hasChoice, setHasChoice] = useState(true);
  const location = useLocation();
  useEffect(() => { const saved = getConsent(); setHasChoice(!!saved); if (saved) { setChoice(saved); applyConsent(saved); } }, []);
  useEffect(() => setMenu(false), [location.pathname]);
  const saveConsent = (next: Consent) => { const previous = getConsent(); applyConsent(next); setChoice(next); setHasChoice(true); setConsentOpen(false); if (previous?.analytics && !next.analytics) window.location.reload(); };
  return <>
    <a href="#main" className="skip-link">Skip to content</a><Seo />
    <header className="site-header"><div className="container header-inner"><Link className="brand" to="/" aria-label="Star Marketing Agency Inc — home"><img src={`${import.meta.env.BASE_URL}assets/star-mark.svg`} width="40" height="40" alt=""/><span>STAR<span className="brand-break">MARKETING <em>AGENCY INC</em></span></span></Link>
      <nav aria-label="Main navigation" className={menu ? 'desktop-nav is-open' : 'desktop-nav'}>{nav.map(item => <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'nav-link current' : 'nav-link'}>{item.label}</NavLink>)}<div className="mobile-menu-cta"><ContactCTA /></div></nav>
      <div className="header-actions"><ContactCTA className="header-consult" /><button type="button" className="menu-toggle" onClick={() => setMenu(v => !v)} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button></div>
    </div></header>
    <main id="main"><Outlet /></main>
    <footer className="footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><Link className="brand" to="/"><img src={`${import.meta.env.BASE_URL}assets/star-mark.svg`} width="43" height="43" alt=""/><span>STAR<span className="brand-break">MARKETING <em>AGENCY INC</em></span></span></Link><p>Thoughtful marketing. Intelligent digital experiences. A clearer path from your next idea to its next opportunity.</p><span className="footer-caption">Strategy • Design • Technology • Growth</span></div>
      <div><h3>Explore</h3><Link to="/">Home</Link><Link to="/digital-marketing/">Digital marketing</Link><Link to="/ai-web-development/">AI web development</Link><Link to="/about/">About the agency</Link></div>
      <div><h3>How we help</h3><Link to="/digital-marketing/">SEO & local SEO</Link><Link to="/digital-marketing/">Paid advertising</Link><Link to="/ai-web-development/">Website development</Link><Link to="/ai-web-development/">AI integrations</Link></div>
      <div><h3>Start a conversation</h3><Link to="/contact/" className="footer-contact">Tell us about your project <ArrowUpRight size={15}/></Link>{site.email && <a href={`mailto:${site.email}`} onClick={() => track('email_click')}><Mail size={16}/>{site.email}</a>}{site.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} onClick={() => track('phone_click')}><Phone size={16}/>{site.phone}</a>}{!site.email && !site.phone && <small>Contact information will appear here once verified.</small>}{site.socials.map(x => <a key={x.href} href={x.href} target="_blank" rel="noreferrer">{x.label}</a>)}</div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Star Marketing Agency Inc. All rights reserved.</span><div><Link to="/contact/?intent=privacy">Privacy inquiry</Link><button onClick={() => setConsentOpen(true)}>Privacy settings</button><a href="#main">Back to top <ArrowUpRight size={13}/></a></div></div>
    </div></footer>
    <div className="mobile-sticky"><Link to="/contact/?intent=consultation" onClick={() => track('consultation_cta_click', { source: 'mobile_sticky' })}>Book a consultation <ArrowRight size={17}/></Link></div>
    {!hasChoice && <div className="consent-banner" role="region" aria-label="Privacy choices"><span><ShieldCheck size={17}/> Optional analytics are off until you choose. We use essential site functionality only by default.</span><div><button onClick={() => setConsentOpen(true)} className="text-button">Customize</button><button onClick={() => saveConsent({ analytics: false, marketing: false })} className="small-btn">Reject optional</button><button onClick={() => saveConsent({ analytics: true, marketing: false })} className="small-btn accent">Allow analytics</button></div></div>}
    {consentOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setConsentOpen(false); }}><div className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title"><div className="modal-header"><Sparkles size={20}/><button aria-label="Close privacy settings" onClick={() => setConsentOpen(false)}><X size={20}/></button></div><h2 id="consent-title">Your privacy preferences</h2><p>Analytics and advertising tools stay disabled unless you choose to enable them. You can change your preferences anytime.</p><label className="switch-row"><span>Analytics <small>Anonymous website usage events. No form field content.</small></span><input type="checkbox" checked={choice.analytics} onChange={e => setChoice(v => ({ ...v, analytics: e.target.checked }))}/></label><label className="switch-row"><span>Marketing <small>Reserved for a separately audited advertising-pixel setup.</small></span><input type="checkbox" checked={choice.marketing} onChange={e => setChoice(v => ({ ...v, marketing: e.target.checked }))}/></label><button className="btn btn-primary full" onClick={() => saveConsent(choice)}>Save preferences <ArrowRight size={16}/></button><button className="back-action" onClick={() => saveConsent({ analytics: false, marketing: false })}><ArrowLeft size={16}/> Reject optional cookies</button></div></div>}
  </>;
}
