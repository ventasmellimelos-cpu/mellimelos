import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal as progressive enhancement.
 *
 * Content is VISIBLE by default. We only hide-then-animate an element when ALL
 * of these hold: JS is running, motion is allowed, the tab is visible, and the
 * element is currently BELOW the fold (so the user will scroll to it). Anything
 * else stays visible immediately. A timeout failsafe reveals the element even if
 * the IntersectionObserver never fires. This is the opposite of class-gated CSS
 * reveals, which ship blank on hidden tabs and headless renderers.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || document.hidden || typeof IntersectionObserver === "undefined") {
      return; // stay visible
    }

    // Already on screen at mount: no entrance animation, just show it.
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;

    // Below the fold: hide, then animate in when it scrolls into view.
    setRevealed(false);
    let fired = false;
    const reveal = () => {
      if (fired) return;
      fired = true;
      setRevealed(true);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
          }
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? "0px 0px -10% 0px" }
    );
    io.observe(el);

    // Failsafe: never let content stay hidden if the observer never fires.
    const failsafe = window.setTimeout(reveal, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [options?.threshold, options?.rootMargin]);

  return { ref, revealed };
}
