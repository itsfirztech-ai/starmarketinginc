import { ArrowUpRight, Search, MapPin, MousePointer2, Megaphone, MessagesSquare, PenTool, Target, ChartNoAxesCombined, PanelsTopLeft, Sparkles, Bot, LayoutTemplate, WandSparkles, Smartphone, Gauge, PlugZap, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
const icons = { Search, MapPin, MousePointer2, Megaphone, MessagesSquare, PenTool, Target, ChartNoAxesCombined, PanelsTopLeft, Sparkles, Bot, LayoutTemplate, WandSparkles, Smartphone, Gauge, PlugZap, Workflow };
export type IconName = keyof typeof icons;
export default function ServiceCard({ title, description, icon, href, tag }: { title: string; description: string; icon: string; href?: string; tag?: string }) {
  const Icon = icons[icon as IconName] || Sparkles;
  return <article className="service-card"><div className="card-top"><span className="service-icon"><Icon size={23} strokeWidth={1.7}/></span>{tag && <span className="small-tag">{tag}</span>}</div><h3>{title}</h3><p>{description}</p>{href && <Link to={href} className="card-link">Explore service <ArrowUpRight size={17}/></Link>}</article>;
}
