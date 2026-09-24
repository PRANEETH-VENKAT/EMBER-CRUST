/**
 * Menu data for Ember & Crust.
 * Single source of truth for all 23 artisanal dishes across 5 categories.
 */

export const CATEGORIES = [
  'All',
  'Pizza',
  'Burgers',
  'Sides',
  'Drinks',
  'Desserts',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type ItemCategory = Exclude<Category, 'All'>;

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: ItemCategory;
  price: number;
  description: string;
  dietary: 'veg' | 'non-veg';
  badge?: string;
  spicyLevel?: 1 | 2 | 3 | 4 | 5;
  isIndianStreetFood?: boolean;
}

export type SpicePreference = 'all' | 'mild' | 'medium' | 'hot';

export const MENU_ITEMS: MenuItem[] = [
  // --- PIZZA (6 Items) ---
  {
    id: 'pz-01',
    slug: 'smoked-margherita-dop',
    name: 'Smoked Margherita D.O.P.',
    category: 'Pizza',
    price: 449,
    description:
      '48h slow-fermented sourdough crust, San Marzano sauce, charred fior di latte, fresh basil, and smoked extra virgin olive oil.',
    dietary: 'veg',
    badge: 'Bestseller',
  },
  {
    id: 'pz-02',
    slug: 'ember-diablo-pepperoni',
    name: 'Ember Diablo Pepperoni',
    category: 'Pizza',
    price: 599,
    description:
      'Crispy cupping pork pepperoni, hot chili honey drizzle, spiced chili oil, smoked mozzarella, and toasted oregano.',
    dietary: 'non-veg',
    badge: "Chef's Special",
    spicyLevel: 3,
  },
  {
    id: 'pz-03',
    slug: 'truffled-wild-mushroom-pizza',
    name: 'Truffled Wild Mushroom',
    category: 'Pizza',
    price: 549,
    description:
      'Charred king oyster and cremini mushrooms, fontina crema, black truffle oil, fresh thyme, and sea salt crust.',
    dietary: 'veg',
    badge: 'Signature',
  },
  {
    id: 'pz-04',
    slug: 'fire-roasted-bbq-chicken-pizza',
    name: 'Fire-Roasted BBQ Chicken',
    category: 'Pizza',
    price: 579,
    description:
      'Wood-fired tender chicken thigh, ember chipotle BBQ glaze, caramelized red onions, smoked mozzarella, and fresh cilantro.',
    dietary: 'non-veg',
    spicyLevel: 1,
  },
  {
    id: 'pz-05',
    slug: 'four-fire-cheese-garlic-pizza',
    name: 'Four Fire-Cheese & Garlic',
    category: 'Pizza',
    price: 529,
    description:
      'Smoked scamorza, aged gorgonzola, fresh mozzarella, parmesan crisp shards, roasted garlic confit, and rosemary.',
    dietary: 'veg',
  },
  {
    id: 'pz-06',
    slug: 'old-delhi-butter-chicken-pizza',
    name: 'Old Delhi Butter Chicken Naan Pizza',
    category: 'Pizza',
    price: 589,
    description:
      'Wood-fired charred naan sourdough crust, rich makhani gravy, clay-oven tandoori chicken, kasuri methi, and molten smoked mozzarella.',
    dietary: 'non-veg',
    badge: 'Street Craft',
    isIndianStreetFood: true,
    spicyLevel: 3,
  },

  // --- BURGERS (6 Items) ---
  {
    id: 'bg-01',
    slug: 'the-ember-double-smash',
    name: 'The Ember Double Smash',
    category: 'Burgers',
    price: 499,
    description:
      'Two smashed prime beef patties, double aged cheddar, charred ember aioli, and house dill pickles on buttered brioche.',
    dietary: 'non-veg',
    badge: 'Bestseller',
  },
  {
    id: 'bg-02',
    slug: 'hot-nashville-crisp-chicken',
    name: 'Hot Nashville Crisp Chicken',
    category: 'Burgers',
    price: 449,
    description:
      'Double-dredged buttermilk fried chicken thigh tossed in habanero chili oil, crunchy slaw, sweet pickles, and garlic crema.',
    dietary: 'non-veg',
    spicyLevel: 4,
    badge: 'Spicy',
  },
  {
    id: 'bg-03',
    slug: 'smoked-portobello-gouda-burger',
    name: 'Smoked Portobello & Gouda',
    category: 'Burgers',
    price: 429,
    description:
      'Whole flame-charred balsamic portobello mushroom cap, smoked gouda melt, crispy onion straws, and roasted garlic sauce.',
    dietary: 'veg',
    badge: 'Veg Special',
  },
  {
    id: 'bg-04',
    slug: 'black-truffle-bacon-melt',
    name: 'Black Truffle Bacon Melt',
    category: 'Burgers',
    price: 569,
    description:
      'Smashed wagyu-blend patty, smoked bacon rashers, molten raclette cheese, caramelized shallots, and black truffle glaze.',
    dietary: 'non-veg',
    badge: 'Chef Choice',
  },
  {
    id: 'bg-05',
    slug: 'charred-paneer-tikka-smash-burger',
    name: 'Charred Paneer Tikka Smash',
    category: 'Burgers',
    price: 389,
    description:
      'Tandoor-charred cottage cheese steak, mint-coriander emulsion, pickled red onions, and buttered potato bun.',
    dietary: 'veg',
    badge: 'Street Craft',
    isIndianStreetFood: true,
    spicyLevel: 2,
  },
  {
    id: 'bg-06',
    slug: 'mumbai-vada-pav-bomb',
    name: 'Mumbai Firecracker Vada Pav Bomb',
    category: 'Burgers',
    price: 349,
    description:
      'Crispy golden spiced batata vada patty, fiery roasted garlic-peanut thecha chutney, fried green chilies, and tamarind drizzle on toasted brioche.',
    dietary: 'veg',
    badge: 'Street Legend',
    isIndianStreetFood: true,
    spicyLevel: 4,
  },

  // --- SIDES (6 Items) ---
  {
    id: 'sd-01',
    slug: 'truffle-parmesan-ember-fries',
    name: 'Truffle & Parmesan Ember Fries',
    category: 'Sides',
    price: 269,
    description:
      'Hand-cut russet potatoes, white truffle oil essence, 24-month aged grana padano, fresh parsley, and smoked garlic dip.',
    dietary: 'veg',
    badge: 'Bestseller',
  },
  {
    id: 'sd-02',
    slug: 'wood-fired-buffalo-wings',
    name: 'Wood-Fired Buffalo Wings',
    category: 'Sides',
    price: 349,
    description:
      'Cast-iron roasted jumbo wings tossed in smoked cayenne pepper glaze, charred lime, and house blue cheese dressing.',
    dietary: 'non-veg',
    spicyLevel: 3,
  },
  {
    id: 'sd-03',
    slug: 'molten-scamorza-bites',
    name: 'Molten Scamorza Bites',
    category: 'Sides',
    price: 289,
    description:
      'Panko-crusted smoked Italian scamorza cheese nuggets seasoned with sea salt and served with fiery arrabbiata dip.',
    dietary: 'veg',
  },
  {
    id: 'sd-04',
    slug: 'charred-corn-ribs',
    name: 'Charred Street Corn Ribs (Bhutta)',
    category: 'Sides',
    price: 249,
    description:
      'Wood-roasted sweet corn ribs, tangy street chaat masala, Kashmiri sweet chili butter baste, cotija cheese crumble, and fresh lime.',
    dietary: 'veg',
    badge: 'Street Style',
    isIndianStreetFood: true,
    spicyLevel: 1,
  },
  {
    id: 'sd-05',
    slug: 'gunpowder-masala-ember-fries',
    name: 'Gunpowder Masala Ember Fries',
    category: 'Sides',
    price: 279,
    description:
      'Double-crisped russet fries tossed in aromatic South Indian podi gunpowder masala, fried curry leaves, and tempered mustard seeds.',
    dietary: 'veg',
    badge: 'Desi Street',
    isIndianStreetFood: true,
    spicyLevel: 2,
  },
  {
    id: 'sd-06',
    slug: 'kolhapuri-fiery-guntur-wings',
    name: 'Kolhapuri Fiery Guntur Wings',
    category: 'Sides',
    price: 369,
    description:
      'Wood-fired crispy jumbo wings glazed in scorching Kolhapuri lavangi chili paste and crushed Andhra Guntur chilies with charred lime.',
    dietary: 'non-veg',
    badge: 'Fiery 5/5',
    isIndianStreetFood: true,
    spicyLevel: 5,
  },

  // --- DRINKS (4 Items) ---
  {
    id: 'dk-01',
    slug: 'smoked-ember-vanilla-cola',
    name: 'Smoked Ember Vanilla Cola',
    category: 'Drinks',
    price: 189,
    description:
      'House-infused Madagascar vanilla craft cola with a hint of toasted oak smoke and fresh orange peel.',
    dietary: 'veg',
    badge: 'Craft',
  },
  {
    id: 'dk-02',
    slug: 'charred-peach-iced-tea',
    name: 'Charred Peach Iced Tea',
    category: 'Drinks',
    price: 199,
    description:
      'Slow-steeped Assam black tea, flame-caramelized yellow peach purée, fresh mint, and cracked ice.',
    dietary: 'veg',
  },
  {
    id: 'dk-03',
    slug: 'spiced-blood-orange-fizz',
    name: 'Spiced Blood Orange Fizz',
    category: 'Drinks',
    price: 219,
    description:
      'Cold-pressed Sicilian blood orange, sparkling spring water, rosemary sprig, and a touch of toasted chili honey.',
    dietary: 'veg',
    spicyLevel: 1,
  },
  {
    id: 'dk-04',
    slug: 'roasted-hazelnut-cold-brew',
    name: 'Roasted Hazelnut Cold Brew',
    category: 'Drinks',
    price: 229,
    description:
      '18-hour cold brew from Chikmagalur Arabica beans, roasted hazelnut syrup, poured over crystal ice rock.',
    dietary: 'veg',
  },

  // --- DESSERTS (5 Items) ---
  {
    id: 'ds-01',
    slug: 'wood-fired-skillet-cookie',
    name: 'Wood-Fired Skillet Cookie',
    category: 'Desserts',
    price: 329,
    description:
      'Fresh-baked chocolate chip & dark fudge cookie skillet straight from the ember oven, topped with vanilla bean gelato.',
    dietary: 'veg',
    badge: 'Must Try',
  },
  {
    id: 'ds-02',
    slug: 'burnt-basque-cheesecake',
    name: 'Burnt Basque Cheesecake',
    category: 'Desserts',
    price: 349,
    description:
      'Caramelized mahogany top with an ultra-creamy, molten cream cheese center, drizzled with warm berry coulis.',
    dietary: 'veg',
  },
  {
    id: 'ds-03',
    slug: 'molten-belgian-dark-lava-cake',
    name: 'Molten Belgian Dark Lava Cake',
    category: 'Desserts',
    price: 319,
    description:
      '70% dark Belgian chocolate sponge with a steaming, flowing ganache core, dusted with roasted cocoa powder.',
    dietary: 'veg',
    badge: 'Popular',
  },
  {
    id: 'ds-04',
    slug: 'smoked-hazelnut-tiramisu',
    name: 'Smoked Hazelnut Tiramisu',
    category: 'Desserts',
    price: 329,
    description:
      'Savoiardi ladyfingers soaked in dark roast espresso, layered with smoked mascarpone cream and cacao nibs.',
    dietary: 'veg',
  },
  {
    id: 'ds-05',
    slug: 'salted-caramel-thickshake',
    name: 'Salted Caramel Thickshake',
    category: 'Desserts',
    price: 249,
    description:
      'Handcrafted bourbon vanilla bean gelato churned with Maldon salted butter caramel and waffle crunch.',
    dietary: 'veg',
    badge: 'Indulgent',
  },
];
