import { LOCAL_STORAGE_KEYS } from "./constants";
import { QuickSelect } from "./interfaces";

export const localStorageService = {
  get: {
    quickSelects: () => {
      const quickSelects = localStorage.getItem(
        LOCAL_STORAGE_KEYS.QUICK_SELECTS
      );
      return quickSelects ? (JSON.parse(quickSelects) as QuickSelect[]) : [];
    },
  },
  set: {
    quickSelects: (quickSelects: QuickSelect[]) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.QUICK_SELECTS,
        JSON.stringify(quickSelects)
      );
    },
  },
  remove: {
    quickSelect: (id: string) => {
      const quickSelects = localStorageService.get
        .quickSelects()
        .filter((quickSelect: QuickSelect) => quickSelect.id !== id);
      localStorageService.set.quickSelects(quickSelects);
    },
  },
};
