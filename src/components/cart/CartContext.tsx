import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CartLine, MenuItem, SelectedOption } from '../../types';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  totalMAD: number;
  addLine: (item: MenuItem, quantity: number, selectedOptions: SelectedOption[], note?: string) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Increments on every addLine call. Header keys its cart icon/badge on
  // this value so each add-to-cart gets a visible bounce confirmation —
  // not just an instant, silent count change.
  bumpTrigger: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function computeLineTotal(item: MenuItem, quantity: number, selectedOptions: SelectedOption[]): number {
  const optionsTotal = selectedOptions.reduce((sum, o) => sum + o.priceDeltaMAD, 0);
  return (item.priceMAD + optionsTotal) * quantity;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [bumpTrigger, setBumpTrigger] = useState(0);

  const addLine = useCallback(
    (item: MenuItem, quantity: number, selectedOptions: SelectedOption[], note?: string) => {
      const lineId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const lineTotalMAD = computeLineTotal(item, quantity, selectedOptions);
      setLines((prev) => [...prev, { lineId, item, quantity, selectedOptions, note, lineTotalMAD }]);
      setBumpTrigger((n) => n + 1);
      // Deliberately does NOT open the drawer anymore. Popping the full
      // checkout drawer open on every single add-to-cart interrupts
      // browsing — especially bad on a menu with many dishes, where you
      // add several things before you're ready to order. The floating
      // cart bar (FloatingCartBar) is the non-intrusive signal instead;
      // the drawer only opens when the person actually taps it or the
      // header cart icon.
    },
    []
  );

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.lineId === lineId
          ? { ...l, quantity, lineTotalMAD: computeLineTotal(l.item, quantity, l.selectedOptions) }
          : l
      )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const totalMAD = useMemo(() => lines.reduce((sum, l) => sum + l.lineTotalMAD, 0), [lines]);

  const value: CartContextValue = {
    lines,
    count,
    totalMAD,
    addLine,
    removeLine,
    updateQuantity,
    clear,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    bumpTrigger,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
