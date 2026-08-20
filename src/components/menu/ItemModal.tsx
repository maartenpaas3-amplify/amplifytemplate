import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus } from 'lucide-react';
import { brandConfig } from '../../config/brand.config';
import { motionTokens } from '../../config/theme';
import { MagneticButton } from '../ui/MagneticButton';
import { useCart } from '../cart/CartContext';
import type { Language, MenuItem, SelectedOption } from '../../types';

interface ItemModalProps {
  item: MenuItem | null;
  language: Language;
  onClose: () => void;
}

// Fixed engine component. Handles required/optional option groups generically
// from item.optionGroups — a new client never needs a bespoke modal, only
// different data in src/data/menu.ts.
export const ItemModal: React.FC<ItemModalProps> = ({ item, language, onClose }) => {
  const { colors, ordering } = brandConfig;
  const { addLine } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [note, setNote] = useState('');

  const selectedOptions: SelectedOption[] = useMemo(() => {
    if (!item?.optionGroups) return [];
    const result: SelectedOption[] = [];
    item.optionGroups.forEach((group) => {
      (selected[group.id] ?? []).forEach((optionId) => {
        const opt = group.options.find((o) => o.id === optionId);
        if (opt) {
          result.push({
            groupId: group.id,
            optionId: opt.id,
            label: opt.label[language] ?? opt.label.fr,
            priceDeltaMAD: opt.priceDeltaMAD,
          });
        }
      });
    });
    return result;
  }, [selected, item, language]);

  if (!item) return null;

  const name = item.name[language] ?? item.name.fr;
  const description = item.description?.[language] ?? item.description?.fr;
  const unitPrice = item.priceMAD + selectedOptions.reduce((s, o) => s + o.priceDeltaMAD, 0);

  const toggleOption = (groupId: string, optionId: string, multiple: boolean) => {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      if (multiple) {
        const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
        return { ...prev, [groupId]: next };
      }
      return { ...prev, [groupId]: [optionId] };
    });
  };

  const requiredGroupsSatisfied = (item.optionGroups ?? [])
    .filter((g) => g.required)
    .every((g) => (selected[g.id] ?? []).length > 0);

  const handleAdd = () => {
    addLine(item, quantity, selectedOptions, note || undefined);
    onClose();
    setQuantity(1);
    setSelected({});
    setNote('');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: motionTokens.base, ease: motionTokens.easeOut }}
          className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
          style={{ backgroundColor: colors.surface }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background, color: colors.textPrimary }}
          >
            <X className="w-4 h-4" />
          </button>

          <img src={item.image} alt={name} className="w-full aspect-[16/9] object-cover" />

          <div className="p-5 space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold" style={{ color: colors.textPrimary }}>
                {name}
              </h2>
              {description && (
                <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
                  {description}
                </p>
              )}
            </div>

            {(item.optionGroups ?? []).map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                  {group.label[language] ?? group.label.fr}
                  {group.required && <span style={{ color: colors.accent }}> *</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const active = (selected[group.id] ?? []).includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(group.id, opt.id, group.multiple)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: active ? colors.accent : colors.surfaceMuted,
                          color: active ? colors.background : colors.textMuted,
                        }}
                      >
                        {opt.label[language] ?? opt.label.fr}
                        {opt.priceDeltaMAD ? ` (+${opt.priceDeltaMAD})` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={language === 'fr' ? 'Note (optionnel)' : language === 'ar' ? 'ملاحظة (اختياري)' : 'Note (optional)'}
              className="w-full rounded-xl px-3 py-2 text-sm resize-none"
              style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, border: `1px solid ${colors.border}` }}
              rows={2}
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-full px-2 py-1" style={{ backgroundColor: colors.surfaceMuted }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ color: colors.textPrimary }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center font-semibold" style={{ color: colors.textPrimary }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ color: colors.textPrimary }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <MagneticButton
                  disabled={!requiredGroupsSatisfied}
                  onClick={handleAdd}
                  glowColor={colors.accent}
                  showArrow={false}
                  fullWidth
                  className="py-3 font-bold text-sm"
                >
                  {language === 'fr' ? 'Ajouter' : language === 'ar' ? 'إضافة' : 'Add'} — {unitPrice * quantity} {ordering.currency}
                </MagneticButton>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
