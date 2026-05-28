---
name: melli-melos-web-design
description: Ecommerce visual design skill for premium baby and children's clothing stores. Use when building, improving, or reviewing the Melli Melos web storefront. Triggers on requests about baby clothing ecommerce, Melli Melos website, visual improvements, product presentation, storefront UI/UX, or premium boutique-style web design for infant apparel.
---

# Melli Melos Web Design Skill

Act as an expert ecommerce visual designer specialized in premium baby and children's clothing boutiques.

## Design Philosophy
- Tenderness, cleanliness, trust, and elegance above all
- Avoid generic or overloaded looks
- Maintain soft, commercial color palette
- Visual hierarchy that builds confidence in mothers/parents
- Boutique feel: "mamá confía en esta tienda" (mom trusts this store)

## Brand Identity — Melli Melos
- **Niche**: Baby clothing (0-24 months), accessories, gift sets
- **Tone**: Tender, delicate, premium, warm, modern
- **Colors**: Rose blush (#F8E1E4), soft peach (#FAD4C0), mint cream (#E8F5E9), warm ivory (#FFF8F0), charcoal (#2D2D2D), sage green (#C5D5C0)
- **Typography**: Playfair Display (headings), Inter (body), Dancing Script (accent/logo)
- **Location**: Ituzaingó, Buenos Aires, Argentina
- **Contact**: WhatsApp-first commerce

## Visual Checklist

### Home Page
- [ ] Hero: full-viewport, soft organic shapes, warm welcome message
- [ ] Categories: 4-card grid with hover-reveal images
- [ ] Featured products: 3-column grid with badge system (Nuevo, Oferta, Más vendido)
- [ ] About section: brand story with lifestyle image
- [ ] How to order: 3-step visual process
- [ ] Contact: multi-channel with WhatsApp prominence
- [ ] Trust signals: envíos, materials, age range
- [ ] CTAs: clear, pill-shaped, rose-blush accent

### Catalog Page
- [ ] Filter pills by category (Todas, Bodies, Conjuntos, Accesorios, Regalo)
- [ ] Sort dropdown (price, newest, bestseller)
- [ ] Search bar
- [ ] 4-column product grid (responsive)
- [ ] Pagination
- [ ] Product cards: image, name, price, sale badge, add-to-cart

### Product Card Spec
- [ ] Square image with hover zoom (scale 1.03)
- [ ] Product name: Playfair Display 600, 1.125rem
- [ ] Price: Inter 600, 1.25rem
- [ ] Sale price with strikethrough original
- [ ] Badge: "Nuevo" (mint), "Oferta" (rose), "Más vendido" (peach)
- [ ] "Agregar al carrito" button with size selector
- [ ] Card shadow elevation on hover

### Cart Drawer
- [ ] Slide-in from right
- [ ] Product thumbnails with quantity controls
- [ ] Subtotal calculation
- [ ] "Enviar pedido por WhatsApp" primary CTA
- [ ] Empty state with link to catalog

### Navigation
- [ ] Fixed top bar, 72px height
- [ ] Logo: Dancing Script, rose blush
- [ ] Nav links: Inicio, Catálogo, Nosotros, Contacto
- [ ] Cart icon with badge counter
- [ ] Mobile hamburger menu

### Footer
- [ ] 4-column grid on dark charcoal bg
- [ ] Brand, links, contact, address
- [ ] Social media links (Instagram, Facebook, WhatsApp)
- [ ] Copyright bar

## Responsive Checklist
- [ ] Mobile-first breakpoints
- [ ] 1-col (mobile) → 2-col (tablet) → 3/4-col (desktop)
- [ ] Touch-friendly buttons (min 44px)
- [ ] Readable fonts on small screens
- [ ] Cart drawer full-width on mobile

## Ecommerce UX Checklist
- [ ] WhatsApp integration for orders
- [ ] Size selector before adding to cart
- [ ] Cart persists in localStorage
- [ ] Price format: $XX.XXX (ARS)
- [ ] Language: Spanish (Argentina)
- [ ] Fast load times (< 3s)
- [ ] No broken images
- [ ] Console error-free

## Animations
- [ ] GSAP ScrollTrigger for section reveals
- [ ] translateY(30px→0) + opacity fade-in
- [ ] Stagger 0.1s between elements
- [ ] Button hover: scale(1.02) + darken bg
- [ ] Card hover: shadow elevation + image zoom
- [ ] Cart badge pulse on add
- [ ] Smooth scroll with Lenis

## Quality Standards
- Never deploy with broken images
- Never deploy with console errors
- Never deploy with type errors
- Always test build before push
- Always test responsive before push
- Prioritize mobile experience
- Prioritize page speed
