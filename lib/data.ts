export type Category = { name: string; slug: string; blurb: string; img: string; group: "ppe" | "uniform" };
export type Product = {
  name: string; slug: string; price: number; oldPrice?: number;
  category: string; img: string; tag?: string; featured?: boolean; rating?: number; stock?: number;
  material?: string;
  colors?: { name: string; hex: string }[]; sizes?: string[]; images?: string[]; discount?: number; reviewsCount?: number;
};

export const ksh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export const contact = {
  phone: "+254 707 866 446",
  phoneHref: "tel:+254707866446",
  email: "info@neosafetysupplies.com",
  domain: "neosafetysupplies.com",
  location: "Delivering Safety Across Kenya",
  whatsapp: "254707866446",
};

const C = "/images/catalog";

export const categories: Category[] = [
  { name: "Reflector Jackets", slug: "reflector-jackets", blurb: "Hi-vis vests & reflective wear", img: `${C}/hivis-vest.jpg`, group: "uniform" },
  { name: "Overalls", slug: "overalls", blurb: "Boiler suits & coveralls", img: `${C}/coveralls.jpg`, group: "uniform" },
  { name: "Industrial Uniforms", slug: "industrial-uniforms", blurb: "Heavy-duty wear for plants & sites", img: `${C}/coveralls-set.jpg`, group: "uniform" },
  { name: "Head Protection", slug: "head-protection", blurb: "Hard hats & helmets", img: `${C}/hardhat.jpg`, group: "ppe" },
  { name: "Hand Protection", slug: "hand-protection", blurb: "Work & cut-resistant gloves", img: `${C}/gloves.jpg`, group: "ppe" },
  { name: "Security Uniforms", slug: "security-uniforms", blurb: "Guard uniforms & accessories", img: `${C}/security-jacket.jpg`, group: "uniform" },
  { name: "Corporate Uniforms", slug: "corporate-uniforms", blurb: "Shirts, suits & office wear", img: `${C}/suits-rack.jpg`, group: "uniform" },
  { name: "Fire Safety", slug: "fire-safety", blurb: "Extinguishers & fire equipment", img: `/images/products/fire.png`, group: "ppe" },
  { name: "Cleaners Uniforms", slug: "cleaners-uniforms", blurb: "Housekeeping & janitorial wear", img: `${C}/housekeeping-blue.jpg`, group: "uniform" },
  { name: "Dust Coats", slug: "dust-coats", blurb: "Lab coats & warehouse dust coats", img: `${C}/dustcoat.jpg`, group: "uniform" },
  { name: "School Uniforms", slug: "school-uniforms", blurb: "Durable uniforms for schools", img: `${C}/school-uniform.jpg`, group: "uniform" },
  { name: "Hospitality & Service", slug: "hospitality-service", blurb: "Chef, waiter & service wear", img: `${C}/chef-set.jpg`, group: "uniform" },
  { name: "Medical & Healthcare", slug: "medical-scrubs", blurb: "Scrubs, tunics & theatre wear", img: `${C}/scrubs-blue.jpg`, group: "uniform" },
];


export type Advert = { id?: number; title: string; subtitle?: string; priceLabel?: string; ctaLabel?: string; href: string; img: string; placement?: string; sort?: number };

export const adverts: Advert[] = [
  { title: "New Season Hi-Vis Range", subtitle: "Get 10 to 20% off when you order online", priceLabel: "From KSh 720", ctaLabel: "Shop Now", href: "/category/reflector-jackets", img: `${C}/hivis.jpg`, placement: "home", sort: 1 },
  { title: "Bulk PPE for Worksites", subtitle: "Volume pricing for teams and sites, delivered across Kenya", priceLabel: "Request a quote", ctaLabel: "Get Quote", href: "/contact", img: `${C}/scene.jpg`, placement: "home", sort: 2 },
  { title: "Branded Workwear", subtitle: "Your logo, embroidered or printed in-house", ctaLabel: "Explore", href: "/branding", img: `${C}/security.jpg`, placement: "shop_top", sort: 1 },
  { title: "Fire Safety Essentials", subtitle: "Extinguishers and signage, always in stock", ctaLabel: "Shop", href: "/category/fire-safety", img: "/images/products/fire.png", placement: "shop_side", sort: 1 },
  { title: "PPE & Safety Gear", subtitle: "Helmets, gloves and boots — certified", ctaLabel: "Shop PPE", href: "/ppe", img: `${C}/worker-hivis.jpg`, placement: "shop_side", sort: 2 },
  { title: "Branding & Printing", subtitle: "Your logo on any garment, in-house", ctaLabel: "Explore", href: "/branding", img: `${C}/security-jacket.jpg`, placement: "shop_side", sort: 3 },
];

export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const ppeCategories = categories.filter((c) => c.group === "ppe");
export const uniformCategories = categories.filter((c) => c.group === "uniform");

export const products: Product[] = [
  // Head protection
  { name: "Industrial Safety Helmet", slug: "industrial-safety-helmet", price: 850, oldPrice: 1100, category: "head-protection", img: `${C}/hardhat.jpg`, tag: "-23%", featured: true, rating: 5 },
  { name: "Vented Ratchet Hard Hat", slug: "vented-ratchet-hard-hat", price: 1200, category: "head-protection", img: `${C}/hardhat.jpg`, rating: 4 },
  // Hand protection
  { name: "Impact-Resistant Gloves", slug: "impact-resistant-gloves", price: 980, category: "hand-protection", img: `${C}/gloves.jpg`, featured: true, rating: 5 },
  { name: "Cut-Resistant Work Gloves", slug: "cut-resistant-gloves", price: 640, category: "hand-protection", img: `${C}/gloves.jpg`, rating: 4 },
  // Fire safety
  { name: "6kg Fire Extinguisher", slug: "fire-extinguisher-6kg", price: 4200, oldPrice: 4800, category: "fire-safety", img: `/images/products/fire.png`, tag: "-13%", featured: true, rating: 5 },
  { name: "9kg Fire Extinguisher", slug: "fire-extinguisher-9kg", price: 5600, category: "fire-safety", img: `/images/products/fire.png`, rating: 5 },
  // Reflector jackets
  { name: "Hi-Vis Reflector Vest", slug: "hi-vis-reflector-vest", price: 720, oldPrice: 900, category: "reflector-jackets", img: `${C}/hivis-vest.jpg`, tag: "-20%", featured: true, rating: 5 },
  { name: "Hi-Vis Safety Apparel Set", slug: "hi-vis-safety-apparel-set", price: 3800, category: "reflector-jackets", img: `${C}/coveralls-set.jpg`, rating: 4 },
  { name: "Reflective Bomber Jacket", slug: "reflective-bomber-jacket", price: 2900, category: "reflector-jackets", img: `${C}/hivis-jacket.jpg`, tag: "New", rating: 4 },
  // Overalls
  { name: "Navy Work Coverall", slug: "navy-work-coverall", price: 2650, category: "overalls", img: `${C}/coveralls.jpg`, featured: true, rating: 5 },
  { name: "Cotton Boiler Suit", slug: "cotton-boiler-suit", price: 2400, category: "overalls", img: `${C}/coveralls-set.jpg`, rating: 4 },
  // Industrial uniforms
  { name: "Industrial Uniform Set", slug: "industrial-uniform-set", price: 3100, category: "industrial-uniforms", img: `${C}/industrial.jpg`, tag: "New", featured: true, rating: 5 },
  { name: "Two-Tone Work Shirt & Trouser", slug: "two-tone-work-shirt-trouser", price: 2750, category: "industrial-uniforms", img: `${C}/industrial.jpg`, rating: 4 },
  // Security uniforms
  { name: "Supervisor Reflective Vest", slug: "supervisor-reflective-vest", price: 1450, category: "security-uniforms", img: `${C}/security.jpg`, rating: 4 },
  { name: "Security Guard Uniform", slug: "security-guard-uniform", price: 3200, category: "security-uniforms", img: `${C}/security-guard.jpg`, rating: 5 },
  // Corporate uniforms
  { name: "Corporate Shirt & Trouser", slug: "corporate-shirt-trouser", price: 2200, category: "corporate-uniforms", img: `${C}/shirts-rack.jpg`, rating: 4 },
  { name: "Branded Office Polo", slug: "branded-office-polo", price: 1150, category: "corporate-uniforms", img: `${C}/branded-polo.jpg`, rating: 4 },
  // Cleaners uniforms
  { name: "Cleaners Coverall", slug: "cleaners-coverall", price: 1900, category: "cleaners-uniforms", img: `${C}/housekeeping-blue.jpg`, rating: 4 },
  { name: "Housekeeping Tunic", slug: "housekeeping-tunic", price: 1450, category: "cleaners-uniforms", img: `${C}/housekeeping-green.jpg`, rating: 4 },
  // Dust coats
  { name: "White Dust Coat", slug: "white-dust-coat", price: 1300, category: "dust-coats", img: `${C}/dustcoat.jpg`, rating: 4 },
  { name: "Warehouse Dust Coat", slug: "warehouse-dust-coat", price: 1250, category: "dust-coats", img: `${C}/dustcoat.jpg`, rating: 4 },
  // School uniforms
  { name: "School Uniform Set", slug: "school-uniform-set", price: 1800, category: "school-uniforms", img: `${C}/school-uniform.jpg`, rating: 5 },
  { name: "School Sports Kit", slug: "school-sports-kit", price: 1500, category: "school-uniforms", img: `${C}/school-uniform.jpg`, rating: 4 },
  // Hospitality
  { name: "Chef Jacket & Apron", slug: "chef-jacket-apron", price: 2100, category: "hospitality-service", img: `${C}/chef-set.jpg`, rating: 4 },
  { name: "Waiter Service Uniform", slug: "waiter-service-uniform", price: 1950, category: "hospitality-service", img: `${C}/chef-apron.jpg`, rating: 4 },
  { name: "Blue Medical Scrubs Set", slug: "blue-medical-scrubs", price: 2400, category: "medical-scrubs", img: `${C}/scrubs-blue.jpg`, rating: 5 },
  { name: "Navy Scrubs Set", slug: "navy-medical-scrubs", price: 2500, category: "medical-scrubs", img: `${C}/scrubs-navy.jpg`, tag: "New", featured: true, rating: 5 },
  { name: "Green Theatre Scrubs", slug: "green-theatre-scrubs", price: 2300, category: "medical-scrubs", img: `${C}/scrubs-green.jpg`, rating: 4 },
  { name: "Nurse Tunic", slug: "nurse-tunic", price: 1800, category: "medical-scrubs", img: `${C}/nurse-tunic.jpg`, rating: 4 },
];

export const featured = products.filter((p) => p.featured);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);

export const brandingServices = [
  { title: "Embroidery", desc: "Durable stitched logos on workwear, caps, polos and overalls." },
  { title: "DTF Printing", desc: "Vibrant direct-to-film transfers for detailed, full-colour logos." },
  { title: "Screen Printing", desc: "Cost-effective, bold prints ideal for large batch orders." },
  { title: "Digital Printing", desc: "Sharp, photo-quality prints for complex, multi-colour artwork." },
];

export const industries = [
  "Corporate & Office", "Hospitality & Service", "Healthcare Sector",
  "Agriculture & Farming", "Manufacturing Plants", "Construction Industry",
  "Cleaning & Janitorial", "Schools & Education", "Transport & Logistics",
  "Security Industry", "Beauty & Wellness", "Retail & Warehousing",
];

export const safetySigns = [
  "Mandatory Signs", "Prohibition Signs", "Warning Signs",
  "Fire Safety Signs", "Emergency / First Aid", "Custom Site Signs",
];

export type BlogPost = { title: string; slug: string; date: string; tag: string; img: string; excerpt: string; body: string[] };

export const blogPosts: BlogPost[] = [
  {
    title: "How to choose the right hi-vis clothing for your site",
    slug: "choosing-hi-vis-clothing", date: "12 Jun 2026", tag: "Guides", img: `${C}/hivis.jpg`,
    excerpt: "Not all reflective wear is equal — here is how to match visibility class, colour and comfort to the job.",
    body: [
      "High-visibility clothing keeps workers seen in traffic, low light and busy sites. Across Kenya's roadworks, construction sites and warehouses, the right vest or jacket can be the difference between a near-miss and a serious incident.",
      "Visibility comes in classes. Class 2 vests suit most general sites, while Class 3 jackets with reflective sleeves are made for high-speed roads, night work and poor weather. Look for a healthy balance of fluorescent background fabric and reflective tape.",
      "Colour matters too. Yellow-green reads best against most backgrounds by day, while orange stands out against greenery and dust. Whatever you pick, keep the whole crew consistent so they are instantly recognisable.",
      "Finally, comfort drives compliance. Breathable fabric, a good fit and freedom to move mean the gear actually stays on all day. We can also brand every vest with your logo so your team looks the part while staying safe.",
    ],
  },
  {
    title: "Hard hats 101: types, ratings and when to replace them",
    slug: "hard-hats-101", date: "5 Jun 2026", tag: "Guides", img: `${C}/hardhat.jpg`,
    excerpt: "Vented or non-vented, cap or full brim, and the one date stamped on your helmet you should never ignore.",
    body: [
      "A hard hat is the simplest piece of PPE and one of the most important. But not every helmet suits every job, and an ageing shell can give a false sense of safety.",
      "Know the type and class. Type I guards against top impact; Type II adds lateral protection. Electrical classes (E, G and C) tell you how much voltage the shell can resist — critical for utility and electrical work.",
      "Vented shells keep workers cooler under the sun but must never be used around live electrical hazards. A ratchet harness gives a secure, adjustable fit that stays put through the shift.",
      "Replace a helmet after any significant impact, and check the moulded date stamp — most shells are rated for roughly three to five years from first use. If the plastic is faded, chalky or cracked, retire it.",
    ],
  },
  {
    title: "Why branded workwear wins more contracts",
    slug: "branded-workwear-wins-contracts", date: "28 May 2026", tag: "Branding", img: `${C}/security.jpg`,
    excerpt: "A logo'd crew signals professionalism, builds trust on site and quietly markets your business.",
    body: [
      "When your team turns up in matching, logo'd workwear, clients notice. It signals that you take safety and standards seriously — before a single word is spoken.",
      "Branded gear also improves control on busy or public sites. It is instantly clear who belongs, which helps security and keeps visitors and subcontractors accountable.",
      "And it is free advertising. Every branded vest, coverall or cap is a moving billboard on the road, at the depot and on the job — putting your name in front of future clients.",
      "We brand in-house with embroidery, DTF, screen and digital printing, so you get a consistent, durable finish across your entire crew, whatever the garment.",
    ],
  },
  {
    title: "A PPE compliance checklist for Kenyan workplaces",
    slug: "ppe-compliance-checklist", date: "20 May 2026", tag: "Compliance", img: `${C}/scene.jpg`,
    excerpt: "A practical, head-to-toe checklist to keep your crew protected and inspection-ready.",
    body: [
      "Meeting your safety obligations protects both your people and your business. Use this quick checklist to make sure nothing is missed before work starts.",
      "Head, eyes and ears: hard hats in date, safety goggles for grinding and cutting, and hearing protection wherever noise is sustained.",
      "Body and hands: hi-vis appropriate to the site, coveralls or workwear suited to the task, and gloves matched to the hazard — cut, chemical or general handling.",
      "Feet and fire: steel or composite toe boots with the right slip rating, plus accessible, serviced fire extinguishers and clear signage. Keep records of issue and replacement, because inspectors will ask for them.",
    ],
  },
  {
    title: "Choosing durable coveralls for industrial work",
    slug: "choosing-durable-coveralls", date: "13 May 2026", tag: "Guides", img: `${C}/coveralls.jpg`,
    excerpt: "Fabric weight, reflective tape and fit — what makes a coverall actually last on a hard site.",
    body: [
      "Coveralls take a beating. A good pair protects against dirt, abrasion and minor splashes while still giving workers the freedom to move.",
      "Fabric matters most. A cotton or poly-cotton blend around 190–260 gsm balances durability with breathability for Kenya's climate, and reinforced knees and seams add life where it counts.",
      "Add reflective tape for visibility and enough pockets for tools. A proper fit — not too tight, not snagging — keeps workers comfortable and compliant.",
      "We supply coveralls and boiler suits in a range of colours and can embroider or print your logo for a smart, uniform crew.",
    ],
  },
  {
    title: "Glove guide: matching hand protection to the hazard",
    slug: "glove-guide", date: "6 May 2026", tag: "Safety", img: `${C}/gloves.jpg`,
    excerpt: "Cut, impact, chemical or general handling — the wrong glove is nearly as risky as no glove at all.",
    body: [
      "Hands are the most commonly injured body part on site, yet gloves are often an afterthought. Matching the glove to the hazard is what actually prevents injuries.",
      "For sharp materials, choose cut-resistant gloves rated to the task. For handling tools and heavy materials, impact-resistant gloves protect the back of the hand.",
      "Chemical work needs the right nitrile or coated glove for the substance, while general handling calls for a comfortable, grippy glove that workers will happily keep on.",
      "Fit and grip drive compliance: too bulky and they come off, too thin and they do not protect. We stock a full range so you can match protection to every job.",
    ],
  },
];

export const findPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const blogCategories = Array.from(new Set(blogPosts.map((p) => p.tag)));


export const brandingFaqs = [
  { q: "What branding methods do you offer?", a: "We do it all in-house: embroidery, DTF (direct-to-film) printing, screen printing and digital printing. We recommend the best method for your artwork, fabric and order size." },
  { q: "Can you brand garments I already own?", a: "Yes. You can bring your own workwear, uniforms, caps or polos and we will apply your logo — or we can supply and brand the garments together for a consistent finish." },
  { q: "What is the minimum order for branding?", a: "There is no strict minimum for embroidery or DTF, so we can do single items or small batches. Screen printing is most cost-effective on larger runs, and we offer better per-piece pricing as quantities grow." },
  { q: "How long does branding take?", a: "Typical turnaround is 2–5 working days depending on the method and quantity. Urgent orders can often be fast-tracked — tell us your deadline when you request a quote." },
  { q: "Which method is best for my logo?", a: "Embroidery suits simple, premium logos on workwear and caps; DTF and digital printing handle detailed, full-colour artwork; screen printing is ideal for bold designs on large batches. We will advise once we see your logo." },
  { q: "Will the branding fade or wash off?", a: "No. All our methods are durable and wash-proof when cared for correctly — embroidery is stitched into the fabric, and our prints are heat-cured to resist cracking and fading." },
  { q: "Do you offer discounts for bulk or site orders?", a: "Yes. We offer volume pricing for teams, sites and repeat orders. Share your quantities and we will send a tailored quote." },
];

export type MenuItem = { label: string; href: string; children?: MenuItem[] };

export const megaMenu: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "PPE", href: "/ppe", children: [
    { label: "Head Protection", href: "/category/head-protection", children: [
      { label: "Hard Hats", href: "/search?q=helmet" },
      { label: "Bump Caps", href: "/search?q=hard+hat" },
      { label: "Accessories", href: "/category/head-protection" },
    ]},
    { label: "Hand Protection", href: "/category/hand-protection", children: [
      { label: "Cut-Resistant Gloves", href: "/search?q=cut" },
      { label: "Impact Gloves", href: "/search?q=impact" },
    ]},
    { label: "Eye & Face Protection", href: "/search?q=goggles" },
    { label: "Ear Protection", href: "/search?q=ear" },
    { label: "Respiratory Protection", href: "/search?q=respirator" },
    { label: "Fire Safety", href: "/category/fire-safety" },
  ]},
  { label: "PROTECTIVE WEAR", href: "/uniforms", children: [
    { label: "Reflector Jackets", href: "/category/reflector-jackets" },
    { label: "Overalls", href: "/category/overalls" },
    { label: "Dust Coats", href: "/category/dust-coats" },
    { label: "Industrial Uniforms", href: "/category/industrial-uniforms" },
  ]},
  { label: "FOOTWEAR", href: "/search?q=boots", children: [
    { label: "Safety Boots", href: "/search?q=boots" },
    { label: "Safety Shoes", href: "/search?q=shoes" },
    { label: "Gumboots", href: "/search?q=gumboot" },
  ]},
  { label: "WORK UNIFORMS", href: "/uniforms", children: [
    { label: "Corporate Uniforms", href: "/category/corporate-uniforms" },
    { label: "Security Uniforms", href: "/category/security-uniforms" },
    { label: "Cleaners Uniforms", href: "/category/cleaners-uniforms" },
    { label: "School Uniforms", href: "/category/school-uniforms" },
    { label: "Hospitality & Service", href: "/category/hospitality-service" },
  ]},
  { label: "FIRE FIGHTING", href: "/category/fire-safety", children: [
    { label: "Fire Extinguishers", href: "/category/fire-safety", children: [
      { label: "6kg Extinguisher", href: "/product/fire-extinguisher-6kg" },
      { label: "9kg Extinguisher", href: "/product/fire-extinguisher-9kg" },
    ]},
    { label: "Fire Blankets", href: "/search?q=fire" },
    { label: "Safety Signs", href: "/safety-signs" },
  ]},
  { label: "BRANDING & PRINTING", href: "/branding", children: [
    { label: "Embroidery", href: "/branding" },
    { label: "DTF Printing", href: "/branding" },
    { label: "Screen Printing", href: "/branding" },
    { label: "Digital Printing", href: "/branding" },
  ]},
  { label: "BLOG", href: "/blog", children: [
    { label: "All Articles", href: "/blog" },
    { label: "About Us", href: "/about" },
  ] },
  { label: "CONTACT", href: "/contact" },
];

export const navLinks = [
  { label: "HOME", href: "/" },
  {
    label: "PPE PRODUCTS", href: "/ppe",
    children: [
      { label: "Head Protection", href: "/category/head-protection" },
      { label: "Hand Protection", href: "/category/hand-protection" },
      { label: "Hi-Vis & Reflective", href: "/category/reflector-jackets" },
      { label: "Fire Safety", href: "/category/fire-safety" },
      { label: "All PPE", href: "/ppe" },
    ],
  },
  {
    label: "UNIFORMS", href: "/uniforms",
    children: [
      { label: "Overalls", href: "/category/overalls" },
      { label: "Industrial Uniforms", href: "/category/industrial-uniforms" },
      { label: "Corporate Uniforms", href: "/category/corporate-uniforms" },
      { label: "Security Uniforms", href: "/category/security-uniforms" },
      { label: "Cleaners Uniforms", href: "/category/cleaners-uniforms" },
      { label: "Dust Coats", href: "/category/dust-coats" },
      { label: "School Uniforms", href: "/category/school-uniforms" },
      { label: "Hospitality & Service", href: "/category/hospitality-service" },
      { label: "Medical & Healthcare", href: "/category/medical-scrubs" },
      { label: "All Uniforms", href: "/uniforms" },
    ],
  },
  { label: "BRANDING SERVICES", href: "/branding" },
  { label: "SAFETY SIGNS", href: "/safety-signs" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT US", href: "/contact" },
];
