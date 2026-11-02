import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes, site } from '../data/site';
import { track } from '../lib/analytics';
const manageMeta = (name: string, value: string, property = false) => {
  let item = document.head.querySelector<HTMLMetaElement>(`meta[${property ? 'property' : 'name'}="${name}"]`);
  if (!item) { item = document.createElement('meta'); item.setAttribute(property ? 'property' : 'name', name); document.head.append(item); }
  item.setAttribute('content', value);
};
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const route = routes.find(x => x.path === pathname || x.path.replace(/\/$/, '') === pathname) || routes[0];
    const origin = site.website ? site.website.replace(/\/$/, '') : '';
    const canonical = `${origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}${route.path}`;
    document.title = `${route.title} | Star Marketing Agency Inc`;
    manageMeta('description', route.description);
    manageMeta('og:title', document.title, true);
    manageMeta('og:description', route.description, true);
    manageMeta('og:type', 'website', true);
    if (origin) { manageMeta('og:url', canonical, true); let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!link) { link = document.createElement('link'); link.rel='canonical'; document.head.append(link); } link.href = canonical; }
    track('page_view', { page_path: pathname });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
