// Duplicate this file to menu.ts and replace with the real client menu.
// Structure never changes across clients — only content.
import type { MenuCategory, MenuItem } from '../types';

export const categories: MenuCategory[] = [
  { id: 'starters', label: { fr: 'Entrées', en: 'Starters' } },
  { id: 'mains', label: { fr: 'Plats', en: 'Mains' } },
  { id: 'drinks', label: { fr: 'Boissons', en: 'Drinks' } },
];

export const menuItems: MenuItem[] = [
  {
    id: 'item-1',
    categoryId: 'mains',
    name: { fr: 'Plat Signature', en: 'Signature Dish' },
    description: { fr: 'La spécialité de la maison.', en: "The house's specialty." },
    priceMAD: 89,
    image: '/menu/item-1.jpg',
    signature: true,
    optionGroups: [
      {
        id: 'size',
        label: { fr: 'Taille', en: 'Size' },
        required: true,
        multiple: false,
        options: [
          { id: 'regular', label: { fr: 'Normal', en: 'Regular' }, priceDeltaMAD: 0 },
          { id: 'large', label: { fr: 'Grand', en: 'Large' }, priceDeltaMAD: 20 },
        ],
      },
    ],
  },
];
