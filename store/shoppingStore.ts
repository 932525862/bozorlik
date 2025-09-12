// store/shoppingStore.ts
import { create } from "zustand";

export const useShoppingStore = create<any>((set) => ({
  shoppingList: null,
  showExtraProductDialog: false,
  shoppingId: null,
  setShoppingList: (newItem: any) =>
    set((state: any) => ({
      shoppingList: [...state.shoppingList, newItem],
    })),

    updateShoppingItemName: (id: string, newName: string) =>
      set((state: any) => ({
        shoppingList: state.shoppingList.map((item: any) =>
          item.id === id ? { ...item, name: newName } : item
        ),
      })),

  setShoppingListAll: (newItemAll: any) =>
    set(() => ({
      shoppingList: newItemAll,
    })),
  setShoppingId: (id: any) =>
    set(() => ({
      shoppingId: id,
    })),
  removeShoppingItem: (id: string) =>
    set((state: any) => ({
      shoppingList: state?.shoppingList?.filter((item:any) => item?.id !== id),
    })),

  setShowExtraProductDialog: (show: any) =>
    set({ showExtraProductDialog: show }),
}));
