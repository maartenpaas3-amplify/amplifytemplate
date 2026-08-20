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
  {
    id: 'item-2',
    categoryId: 'mains',
    name: { fr: 'Plat du jour', en: "Today's Dish" },
    description: { fr: 'Selon arrivage du marché.', en: 'Depends on market arrivals.' },
    priceMAD: 65,
    image: '/menu/item-2.jpg',
  },
  {
    id: 'item-3',
    categoryId: 'mains',
    name: { fr: 'Plat végétarien', en: 'Vegetarian Dish' },
    description: { fr: 'Légumes de saison, sauce maison.', en: 'Seasonal vegetables, house sauce.' },
    priceMAD: 55,
    image: '/menu/item-3.jpg',
  },
  {
    id: 'item-4',
    categoryId: 'starters',
    name: { fr: 'Entrée fraîche', en: 'Fresh Starter' },
    description: { fr: 'Légère et parfumée.', en: 'Light and fragrant.' },
    priceMAD: 35,
    image: '/menu/item-4.jpg',
    tags: ['Populaire'],
  },
  {
    id: 'item-5',
    categoryId: 'starters',
    name: { fr: "Soupe de l'instant", en: "Today's Soup" },
    description: { fr: 'Chaude, réconfortante.', en: 'Hot and comforting.' },
    priceMAD: 30,
    image: '/menu/item-5.jpg',
  },
  {
    id: 'item-6',
    categoryId: 'drinks',
    name: { fr: 'Thé à la menthe', en: 'Mint Tea' },
    description: { fr: 'Servi traditionnellement.', en: 'Served traditionally.' },
    priceMAD: 15,
    image: '/menu/item-6.jpg',
  },
  {
    id: 'item-7',
    categoryId: 'drinks',
    name: { fr: 'Jus frais', en: 'Fresh Juice' },
    description: { fr: 'Pressé sur place.', en: 'Freshly squeezed.' },
    priceMAD: 25,
    image: '/menu/item-7.jpg',
  },
];
