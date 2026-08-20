import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { motionTokens, shadowTokens } from '../../config/theme';
import { MagneticButton } from '../ui/MagneticButton';
import { useCart } from './CartContext';
import { generateWhatsAppMessage, buildWhatsAppUrl, makeOrderRef } from '../checkout/generateWhatsAppMessage';
import type { CheckoutCustomerInfo, DiningOption, Language } from '../../types';

interface CartDrawerProps {
  language: Language;
}

// Fixed engine component. The ONE checkout flow every client site uses:
// review cart -> fill dining option/name/phone -> send to WhatsApp via
// generateWhatsAppMessage.ts (which reads the number from brand.config.ts).
export const CartDrawer: React.FC<CartDrawerProps> = ({ language }) => {
  const { colors, ordering } = brandConfig;
  const { lines, totalMAD, isDrawerOpen, closeDrawer, removeLine, updateQuantity, clear } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [diningOption, setDiningOption] = useState<DiningOption>(brandConfig.ordering.diningOptionsEnabled[0]);
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  // Two-tap clear-all instead of a browser confirm() popup (those block
  // the page and look cheap). First tap arms it and shows a "Confirmer"
  // label for 3s; a second tap within that window actually clears. Tapping
  // anywhere else lets it quietly disarm on its own via the timeout.
  const [clearArmed, setClearArmed] = useState(false);
  const clearArmTimer = React.useRef<number | undefined>(undefined);

  const handleClearTap = () => {
    if (clearArmed) {
      window.clearTimeout(clearArmTimer.current);
      setClearArmed(false);
      clear();
      return;
    }
    setClearArmed(true);
    clearArmTimer.current = window.setTimeout(() => setClearArmed(false), 3000);
  };

  const handleCheckout = () => {
    const customer: CheckoutCustomerInfo = { customerName, diningOption, tableNumber, deliveryAddress, phone, notes };
    const message = generateWhatsAppMessage(lines, customer, totalMAD, makeOrderRef(), language);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
    clear();
    closeDrawer();
  };

  const diningLabels: Record<DiningOption, string> = {
    dine_in: language === 'fr' ? 'Sur place' : language === 'ar' ? 'في المطعم' : 'Dine-in',
    takeaway: language === 'fr' ? 'À emporter' : language === 'ar' ? 'سفري' : 'Takeaway',
    delivery: language === 'fr' ? 'Livraison' : language === 'ar' ? 'توصيل' : 'Delivery',
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70" onClick={closeDrawer} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: motionTokens.base, ease: motionTokens.easeOut }}
            className="relative w-full sm:max-w-md h-full overflow-y-auto flex flex-col"
            style={{ backgroundColor: colors.surface, boxShadow: shadowTokens.drawer }}
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
              <h2 className="font-display text-lg font-semibold" style={{ color: colors.textPrimary }}>
                {language === 'fr' ? 'Votre commande' : language === 'ar' ? 'طلبك' : 'Your order'}
              </h2>
              <div className="flex items-center gap-1">
                {lines.length > 0 && (
                  <button
                    onClick={handleClearTap}
                    aria-label="clear-all-cart"
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-bold"
                    style={{ color: clearArmed ? colors.danger : colors.textMuted }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {clearArmed && (language === 'fr' ? 'Confirmer' : language === 'ar' ? 'تأكيد' : 'Confirm')}
                  </button>
                )}
                <button onClick={closeDrawer} className="p-1.5" style={{ color: colors.textMuted }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-3">
              {lines.length === 0 && (
                <p className="text-sm text-center py-10" style={{ color: colors.textMuted }}>
                  {language === 'fr' ? 'Votre panier est vide.' : language === 'ar' ? 'سلتك فارغة.' : 'Your cart is empty.'}
                </p>
              )}
              {lines.map((line) => {
                const name = line.item.name[language] ?? line.item.name.fr;
                return (
                  <div key={line.lineId} className="flex gap-3 rounded-xl p-2.5" style={{ backgroundColor: colors.surfaceMuted }}>
                    <img src={line.item.image} alt={name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                          {name}
                        </span>
                        <button onClick={() => removeLine(line.lineId)} aria-label="remove-line" style={{ color: colors.textMuted }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {line.selectedOptions.map((o) => (
                        <p key={o.optionId} className="text-[11px]" style={{ color: colors.textMuted }}>
                          {o.label}
                        </p>
                      ))}
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-2 rounded-full px-1.5 py-0.5" style={{ backgroundColor: colors.background }}>
                          <button onClick={() => updateQuantity(line.lineId, Math.max(1, line.quantity - 1))}>
                            <Minus className="w-3 h-3" style={{ color: colors.textPrimary }} />
                          </button>
                          <span className="text-xs w-4 text-center" style={{ color: colors.textPrimary }}>
                            {line.quantity}
                          </span>
                          <button onClick={() => updateQuantity(line.lineId, line.quantity + 1)}>
                            <Plus className="w-3 h-3" style={{ color: colors.textPrimary }} />
                          </button>
                        </div>
                        <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                          {line.lineTotalMAD} {ordering.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {lines.length > 0 && (
              <div className="p-4 space-y-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                <div className="flex gap-2">
                  {ordering.diningOptionsEnabled.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDiningOption(opt)}
                      className="flex-1 py-2 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: diningOption === opt ? colors.accent : colors.surfaceMuted,
                        color: diningOption === opt ? colors.background : colors.textMuted,
                      }}
                    >
                      {diningLabels[opt]}
                    </button>
                  ))}
                </div>

                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'fr' ? 'Votre nom' : language === 'ar' ? 'اسمك' : 'Your name'}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
                />

                {diningOption === 'dine_in' && (
                  <input
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder={language === 'fr' ? 'Numéro de table' : language === 'ar' ? 'رقم الطاولة' : 'Table number'}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
                  />
                )}
                {diningOption === 'delivery' && (
                  <input
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={language === 'fr' ? 'Adresse de livraison' : language === 'ar' ? 'عنوان التوصيل' : 'Delivery address'}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
                  />
                )}
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'fr' ? 'Téléphone' : language === 'ar' ? 'الهاتف' : 'Phone'}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-semibold" style={{ color: colors.textMuted }}>
                    {language === 'fr' ? 'Total' : language === 'ar' ? 'الإجمالي' : 'Total'}
                  </span>
                  <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {totalMAD} {ordering.currency}
                  </span>
                </div>

                <MagneticButton
                  onClick={handleCheckout}
                  disabled={!customerName}
                  glowColor={colors.accent}
                  showArrow={false}
                  fullWidth
                  className="py-3.5 font-bold"
                >
                  {language === 'fr' ? 'Commander sur WhatsApp' : language === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                </MagneticButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
