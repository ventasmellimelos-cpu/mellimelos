import { useEffect } from "react";

const SITE_URL = "https://www.mellimelos.site";

interface SeoOptions {
  title: string;
  description?: string;
  /** Path part of the canonical URL, e.g. "/catalogo". Defaults to "/". */
  path?: string;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, name] = selector.match(/\[(?:name|property)="(.+)"\]/) ?? [];
    if (selector.includes("property=")) el.setAttribute("property", name ?? "");
    else el.setAttribute("name", name ?? "");
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Updates document title and key SEO meta tags per route. SPAs keep the same
 * HTML <head> across navigations, so without this every route shares the home
 * page's title/description. Google (which renders JS) reads the updated values.
 */
export function useSeo({ title, description, path = "/" }: SeoOptions) {
  useEffect(() => {
    const url = SITE_URL + path;
    document.title = title;
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="twitter:title"]', "content", title);
    setCanonical(url);
  }, [title, description, path]);
}
