"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/shoppingStore";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Trash2 } from "lucide-react";
import useApiMutation from "@/hooks/useMutation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store/userStore";

const Page = () => {
  const router = useRouter();
  const { shoppingList, setShoppingList, setShoppingId, removeShoppingItem } =
    useShoppingStore();
  const { t } = useTranslation("common");
  const [marketId, setMarketId] = useState<string>();
  const { user } = useStore();

  const [listName, setListName] = useState("");
  const [showStartDialog, setShowStartDialog] = useState(false);

  // DELETE uchun
  const { mutate: deleteMarket, isLoading: isDeleting } = useApiMutation({
    url: "market",
    method: "DELETE",
    onSuccess: () => {
      removeShoppingItem(marketId);
      toast.success(t("basket.delete.message"));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  // POST uchun
  const { mutate: createMarket, isLoading: isCreating } = useApiMutation({
    url: "market",
    method: "POST",
    onSuccess: (data) => {
      setShoppingId(data?.data?.id);
      setShoppingList(data?.data);
      toast.success(t("basket.create.success"));
      setShowStartDialog(false);
      setListName("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });

  const handleBasketClick = (id: string) => {
    setShoppingId(id);
    router.push(`/basket/${id}`);
  };

  const handleStartShopping = () => {
    if (listName.trim()) {
      const newList = {
        name: listName,
        userId: user?.id,
      };
      createMarket(newList); // ✅ POST uchun to‘g‘rilandi
    } else {
      toast.error(t("basket.create.error"));
    }
  };

  const handleDelete = (id: string) => {
    setMarketId(id);
    deleteMarket({ id }); // ✅ DELETE uchun to‘g‘rilandi
  };

  return (
    <div className="max-w-7xl mx-auto p-7">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("basket1.title")}
          </h2>
          <p className="text-gray-600">{t("basket1.subtitle")}</p>
        </div>
        <Button
          className="rounded-xl px-5 py-2 text-white cursor-pointer bg-[#85dc3c] hover:bg-[#30c3c4]"
          onClick={() => router.push("/")}
        >
          {t("createListBtn")}
        </Button>
      </div>

      {!shoppingList || shoppingList.length === 0 ? (
        <div className="flex justify-center">
          <Card className="w-full max-w-5xl h-80 flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-white shadow-md p-10 text-center">
            <CardContent className="flex flex-col items-center gap-6">
              <div className="w-30 h-30 flex items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <ShoppingCart className="h-20 w-20 text-[#30c3c4] transition-colors duration-300" />
              </div>
              <p className="text-gray-700 text-lg font-medium">
                {t("markets")}
              </p>
              <Button
                onClick={() => setShowStartDialog(true)}
                className="bg-[#85dc3c] hover:bg-[#30c3c4] font-bold text-xm cursor-pointer text-white"
              >
                {t("createList")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Market cards grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shoppingList?.map((market: any) => (
            <Card
              key={market.id}
              className="relative cursor-pointer rounded-2xl bg-gradient-to-br from-teal-50 to-white 
                   shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(market?.id)}
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
              >
                <Trash2 size={18} />
              </button>

              <CardContent
                onClick={() => handleBasketClick(market?.id)}
                className="p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <ShoppingCart className="h-9 w-9 text-[#30c3c4] transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {market.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createShoppingListTitle")}</DialogTitle>
            <DialogDescription>
              {t("createShoppingListDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="listName">{t("shoppingListNameLabel")}</Label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder={t("shoppingListNamePlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleStartShopping}
              className="cursor-pointer"
              disabled={!listName.trim() || isCreating}
            >
              {t("createListBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
