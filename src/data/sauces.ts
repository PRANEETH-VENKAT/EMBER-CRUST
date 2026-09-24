/**
 * Artisanal house sauce options available for Ember & Crust customers.
 * Offered during purchase options and inside the cart drawer.
 */

export interface SauceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  dietary: 'veg' | 'non-veg';
  spiceLevel?: 1 | 2 | 3 | 4 | 5;
  tag?: string;
}

export const SAUCE_OPTIONS: SauceOption[] = [
  {
    id: 'sc-01',
    name: 'Smoked Garlic Confit Aioli',
    description:
      'Slow-roasted garlic confit whipped with cold-pressed olive oil & smoked Maldon salt.',
    price: 39,
    dietary: 'veg',
    tag: 'Bestseller',
  },
  {
    id: 'sc-02',
    name: 'Fiery Naga Ghost Pepper Dip',
    description:
      'Assam ghost pepper and roasted red chili reduction with serious street heat.',
    price: 49,
    dietary: 'veg',
    spiceLevel: 5,
    tag: 'Fiery Hot',
  },
  {
    id: 'sc-03',
    name: 'Mint & Coriander Desi Emulsion',
    description:
      'Fresh mountain mint, coriander, roasted cumin, and lime-whipped yogurt.',
    price: 39,
    dietary: 'veg',
    spiceLevel: 1,
    tag: 'Cooling',
  },
  {
    id: 'sc-04',
    name: 'Charred Habanero Hot Honey',
    description:
      'Wild forest honey infused with wood-charred habaneros and apple cider vinegar.',
    price: 49,
    dietary: 'veg',
    spiceLevel: 3,
    tag: 'Chef Choice',
  },
  {
    id: 'sc-05',
    name: 'Black Truffle Mayo Cream',
    description:
      'Aged balsamic, cracked black pepper, and Italian summer black truffle essence.',
    price: 49,
    dietary: 'veg',
    tag: 'Signature',
  },
  {
    id: 'sc-06',
    name: 'Ember Chipotle BBQ Glaze',
    description:
      'Smoked chipotle peppers, jaggery molasses, and toasted coriander seed glaze.',
    price: 39,
    dietary: 'veg',
    spiceLevel: 2,
    tag: 'Popular',
  },
];
