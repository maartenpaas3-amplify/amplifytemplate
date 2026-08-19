// ============================================================================
// The ONE place that builds the order message and the ONE place that reads
// the WhatsApp number. This is what was missing across the four legacy
// projects: japoneza/caribou shipped with a leftover test number, café crème
// shipped with no number at all. By centralizing it here, "did we set the
// real number" becomes a single, obvious thing to check in brand.config.ts
// instead of a scavenger hunt across 4 files.
// ============================================================================

import type { CartLine, CheckoutCustomerInfo, Language } from '../../types';
import { brandConfig } from '../../config/brand.config';

const DINING_LABEL: Record<CheckoutCustomerInfo['diningOption'], Record<Language, string>> = {
  dine_in: { fr: 'Sur place', ar: 'في المقهى', en: 'Dine-in' },
  takeaway: { fr: 'À emporter', ar: 'سفري', en: 'Takeaway' },
  delivery: { fr: 'Livraison', ar: 'توصيل', en: 'Delivery' },
};

export function generateWhatsAppMessage(
  lines: CartLine[],
  customer: CheckoutCustomerInfo,
  totalMAD: number,
  orderRef: string,
  language: Language
): string {
  const L = (key: keyof typeof LABELS) => LABELS[key][language] ?? LABELS[key].fr;

  const LABELS = {
    newOrder: { fr: 'NOUVELLE COMMANDE', ar: 'طلب جديد', en: 'NEW ORDER' },
    ref: { fr: 'Réf', ar: 'رقم الطلب', en: 'Ref' },
    client: { fr: 'Client', ar: 'العميل', en: 'Customer' },
    mode: { fr: 'Mode', ar: 'طريقة الطلب', en: 'Mode' },
    table: { fr: 'Table', ar: 'طاولة', en: 'Table' },
    address: { fr: 'Adresse', ar: 'العنوان', en: 'Address' },
    phone: { fr: 'Tél', ar: 'الهاتف', en: 'Phone' },
    order: { fr: 'DÉTAIL DE LA COMMANDE', ar: 'العناصر المطلوبة', en: 'ORDER DETAILS' },
    note: { fr: 'Note', ar: 'ملاحظات', en: 'Note' },
    total: { fr: 'TOTAL À PAYER', ar: 'الإجمالي النهائي', en: 'TOTAL DUE' },
  } as const;

  const lines_: string[] = [];
  lines_.push(`*${L('newOrder')} — ${brandConfig.identity.name.toUpperCase()}*`);
  lines_.push(`*${L('ref')}:* ${orderRef}`);
  lines_.push('---------------------------------------');
  lines_.push(`*${L('client')}:* ${customer.customerName || '—'}`);

  const diningLabel = DINING_LABEL[customer.diningOption][language] ?? DINING_LABEL[customer.diningOption].fr;
  let modeLine = `*${L('mode')}:* ${diningLabel}`;
  if (customer.diningOption === 'dine_in' && customer.tableNumber) {
    modeLine += ` (${L('table')} ${customer.tableNumber})`;
  }
  lines_.push(modeLine);

  if (customer.diningOption === 'delivery' && customer.deliveryAddress) {
    lines_.push(`*${L('address')}:* ${customer.deliveryAddress}`);
  }
  if (customer.phone) {
    lines_.push(`*${L('phone')}:* ${customer.phone}`);
  }

  lines_.push('---------------------------------------');
  lines_.push(`*${L('order')}:*`);
  lines_.push('');

  lines.forEach((line, idx) => {
    const name = line.item.name[language] ?? line.item.name.fr;
    lines_.push(`${idx + 1}. *${line.quantity}x ${name}* — ${line.lineTotalMAD} ${brandConfig.ordering.currency}`);
    line.selectedOptions.forEach((opt) => {
      lines_.push(`   └ ${opt.label}${opt.priceDeltaMAD ? ` (+${opt.priceDeltaMAD})` : ''}`);
    });
    if (line.note) lines_.push(`   └ ${L('note')}: ${line.note}`);
  });

  lines_.push('---------------------------------------');
  if (customer.notes) lines_.push(`*${L('note')}:* ${customer.notes}`);
  lines_.push(`*${L('total')}:* *${totalMAD} ${brandConfig.ordering.currency}*`);

  return encodeURIComponent(lines_.join('\n'));
}

export function buildWhatsAppUrl(encodedMessage: string): string {
  const number = brandConfig.contact.whatsappNumber.replace(/\D/g, '');
  if (!number) {
    // Fail loud in dev instead of silently opening WhatsApp with no
    // recipient the way the café-crème project did.
    console.error(
      '[AmplifyMenuEngine] brand.config.ts contact.whatsappNumber is empty — orders will not reach anyone. Set the real number before going live.'
    );
  }
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

export function makeOrderRef(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
