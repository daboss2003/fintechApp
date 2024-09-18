import { create } from 'zustand';
import { zustandStorage } from './mmkv-storage';
import { createJSONStorage, persist } from 'zustand/middleware';




export const useBalanceStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction) => {
        set((state) => ({ transactions: [...state.transactions, transaction] }));
      },
      balance: () => get().transactions.reduce((acc, transaction) => acc + transaction.amount, 0),
      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'balance',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);