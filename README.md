# NEO Safety Supplies Ltd — Storefront

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Rebuilt from the brand reference
using the `image-to-code` skill and the official brand guidelines.

## Brand system (extracted from guidelines)
- **Green** `#1B933C` · **Navy** `#0C192B` · **Slate** `#617389`
- **Headings:** Montserrat (600/700/800) · **Body:** Inter — both via `next/font`
- Logo/icon in `public/` with white background knocked out (transparent).

## Product imagery
All merchandise is delivered as **raster PNG images** in `public/images/` — rendered
branded mockups with the **NEO hand logo composited onto the apparel** (jacket, hi-vis vest,
gloves, hard hat). Files: `public/images/hero.png` (hero collage) and
`public/images/products/*.png` (hard hat, gloves, hivis, boots, respirator, fire, workwear,
branding, earmuffs, goggles). They render via `next/image`. To use photoreal shots later,
just replace the PNGs at the same paths (keep square ~600x600 for products). Small UI icons
(search, cart, chevrons) remain lightweight inline SVG.


## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Pages
```
/                 Home (hero collage, trust bar, categories, featured, promos, values, newsletter)
/ppe              All PPE products (sidebar + grid)
/workwear         Workwear listing
/category/[slug]  Dynamic category listings (8 categories)
/product/[slug]   Product detail + related
/branding         Branding services
/safety-signs     Safety signs
/blog             Blog index
/about            About + brand values
/contact          Contact form + details
/track            Track order
/cart /wishlist   Empty states
/account          Sign in
not-found         Branded 404
```

## Structure
```
app/            layout (chrome + fonts) + all route pages
components/      TopBar, Header, NavBar, Hero, HeroScene, TrustBar, CategoryGrid,
                 FeaturedProducts, ProductCard, ProductGrid, ShopSidebar, PageHero,
                 PromoStrip, BrandValues, Newsletter, Footer, RatingStars, products, icons
lib/data.ts     categories, products, services, signs, blog, nav
public/         logo.png, icon.png, favicon.png
```

## Next steps for your stack
- **Admin:** add an `app/admin/` route group with its own layout + auth.
- **Go backend:** replace the static arrays in `lib/data.ts` with fetches to your API
  (products, categories, orders). Cart/wishlist/account forms are UI-only stubs ready to wire up.
"# neosafety" 
