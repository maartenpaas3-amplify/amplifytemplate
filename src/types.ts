// ============================================================================
// Amplify Menu Engine — shared types
// Layer 1 components import ONLY from here + brand.config.ts. Never redefine
// shapes locally inside a component — that is how the four legacy projects
// drifted apart from each other.
// ============================================================================

export type Language = 'fr' | 'ar' | 'en';

export type DiningOption = 'dine_in' | 'takeaway' | 'delivery';

export type WowModuleId =
  | 'none'
  | 'accent3d'
  | 'customCursor'
  | 'introTransition'
  | 'parallaxHero'
  | 'editorialMoment'
  | 'signatureSpotlight';

export interface LocalizedText {
  fr: string;
  ar?: string;
  en?: string;
}

export interface MenuItemOption {
  id: string;
  label: LocalizedText;
  priceDeltaMAD: number;
}

export interface MenuItemOptionGroup {
  id: string;
  label: LocalizedText;
  required: boolean;
  multiple: boolean;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description?: LocalizedText;
  priceMAD: number;
  image: string;
  tags?: string[];
  optionGroups?: MenuItemOptionGroup[];
  signature?: boolean; // used by the signatureSpotlight wow module
}

export interface MenuCategory {
  id: string;
  label: LocalizedText;
  icon?: string;
}

export interface SelectedOption {
  groupId: string;
  optionId: string;
  label: string;
  priceDeltaMAD: number;
}

export interface CartLine {
  lineId: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  note?: string;
  lineTotalMAD: number;
}

export interface CheckoutCustomerInfo {
  customerName: string;
  diningOption: DiningOption;
  tableNumber?: string;
  deliveryAddress?: string;
  phone?: string;
  notes?: string;
}
