export const site = {
  name: 'Star Marketing Agency Inc',
  shortName: 'Star Marketing',
  tagline: 'Digital-first thinking. Growth-minded execution.',
  website: import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  phone: import.meta.env.VITE_CONTACT_PHONE || '+1 631 397 6692',
  bookingUrl: import.meta.env.VITE_BOOKING_URL || '',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  socials: [] as { label: string; href: string }[], // add only verified account URLs
  logo: 'assets/star-mark.svg',
};

export const routes = [
  { path: '/', label: 'Home', title: 'Digital Marketing & AI Web Development Agency', description: 'Build standout digital experiences with Star Marketing Agency Inc: strategic digital marketing, AI web development, SEO and conversion-focused growth.' },
  { path: '/digital-marketing/', label: 'Digital Marketing', title: 'Digital Marketing, SEO & PPC Services', description: 'Explore SEO, local SEO, Google Ads, Meta campaigns, CRO, content strategy and analytics from Star Marketing Agency Inc.' },
  { path: '/ai-web-development/', label: 'AI Web Development', title: 'AI Web Development & Conversion-Focused Websites', description: 'Custom websites, AI-ready customer experiences, lead qualification integrations, CRM automation and high-performance web design.' },
  { path: '/about/', label: 'About Us', title: 'About Star Marketing Agency Inc', description: 'Learn how Star Marketing Agency Inc brings clear strategy, thoughtful design, technology and measurable improvement together.' },
  { path: '/contact/', label: 'Contact & Project Inquiry', title: 'Contact Star Marketing Agency Inc | Request a Consultation', description: 'Talk with Star Marketing Agency Inc about your digital marketing, AI web development or growth project. Send an inquiry to start the conversation.' },
];

export const marketingServices = [
  { icon: 'Search', title: 'Search Engine Optimization', short: 'Build discoverability through useful content, technical health and search intent.', problem: 'Potential customers cannot find you when they need your solution.', deliverables: ['Technical & content audits', 'On-page optimization', 'Search opportunity roadmap'] },
  { icon: 'MapPin', title: 'Local SEO', short: 'Strengthen local visibility through accurate listings, useful location content and reputation practices.', problem: 'Local buyers find competitors before they find your business.', deliverables: ['Google Business Profile guidance', 'Listing consistency review', 'Location-page recommendations'] },
  { icon: 'MousePointer2', title: 'Google Ads & PPC', short: 'Connect high-intent demand to carefully designed campaigns and landing experiences.', problem: 'Paid spend lacks targeting, measurement or commercial intent.', deliverables: ['Campaign and keyword structure', 'Conversion tracking plan', 'Creative & bid optimizations'] },
  { icon: 'Megaphone', title: 'Meta Ads & Paid Social', short: 'Reach relevant audiences through creative testing and audience-led paid social.', problem: 'Campaigns generate attention but little qualified engagement.', deliverables: ['Audience & message research', 'Ad creative variations', 'Campaign performance analysis'] },
  { icon: 'MessagesSquare', title: 'Social Media Marketing', short: 'Communicate consistently with content that supports positioning and customer trust.', problem: 'Your brand presence feels inconsistent or disconnected from buyer needs.', deliverables: ['Content pillars', 'Publishing calendar', 'Engagement reporting'] },
  { icon: 'PenTool', title: 'Content Marketing', short: 'Create purposeful content that educates buyers and supports acquisition channels.', problem: 'Your website does not answer questions prospects are already asking.', deliverables: ['Editorial strategy', 'SEO-aligned content briefs', 'Content improvement roadmap'] },
  { icon: 'Target', title: 'Conversion Rate Optimization', short: 'Improve landing pages and journeys so more relevant visitors take meaningful action.', problem: 'Traffic reaches your site but visitors do not consistently inquire.', deliverables: ['Journey & friction audits', 'Conversion hypotheses', 'Testing recommendations'] },
  { icon: 'ChartNoAxesCombined', title: 'Analytics & Performance', short: 'Make decisions using reliable measurement and clear performance interpretation.', problem: 'Reports are full of activity but short on decisions.', deliverables: ['GA4/GTM measurement plans', 'Lead-event validation', 'Decision-focused reports'] },
];

export const webServices = [
  { icon: 'PanelsTopLeft', title: 'Custom Business Websites', short: 'Purpose-built websites that express your brand and guide prospective customers.' },
  { icon: 'Sparkles', title: 'AI-Powered Experiences', short: 'Intelligent customer journeys where AI adds genuine utility, not complexity.' },
  { icon: 'Bot', title: 'AI Chatbots & Lead Qualification', short: 'Configured assistants that help answer questions and route inquiries responsibly.' },
  { icon: 'LayoutTemplate', title: 'Landing Page Development', short: 'Focused landing pages designed around a campaign and a clear conversion action.' },
  { icon: 'WandSparkles', title: 'Conversion-Focused Redesigns', short: 'Refresh outdated digital experiences with clear UX and measurable goals.' },
  { icon: 'Smartphone', title: 'Responsive Web Design', short: 'Thoughtful layouts and accessible interactions across phones and desktops.' },
  { icon: 'Gauge', title: 'Performance & Technical SEO', short: 'Faster, more crawlable foundations built to support search visibility.' },
  { icon: 'PlugZap', title: 'CRM, Forms & Marketing Integrations', short: 'Connect inquiry capture with approved downstream tools and workflows.' },
  { icon: 'Workflow', title: 'AI Workflows & Automation', short: 'Reduce manual steps using configurable integrations and human oversight.' },
];
