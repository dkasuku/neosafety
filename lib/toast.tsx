"use client";
import { createContext, useCallback, useContext, useState } from "react";

type ToastItem = { id: number; msg: string };
type ToastCtx = { toast: (msg: string) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems((t) => [...t, { id, msg }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div key={t.id} className="toast-in rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-float">
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  return c ?? { toast: () => {} };
}
