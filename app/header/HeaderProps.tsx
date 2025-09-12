"use client"

import { ShoppingCart, User, Home, History, Settings, Languages, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

import { useStore } from "@/store/userStore"
import { useShoppingStore } from "@/store/shoppingStore"
import api from "@/service/api"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const languages = [
  { code: "uz", label: "Uzb", flag: "🇺🇿" },
  { code: "ru", label: "Рус", flag: "🇷🇺" },
  { code: "en", label: "Eng", flag: "🇬🇧" },
]

export default function Header() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")

  const currentLang = i18n.language || "uz"
  const { user } = useStore();
  const { shoppingList, setShoppingListAll } =
      useShoppingStore();
  const getMarkets = async () => {
    try {
      const response = await api.get("/market");
      setShoppingListAll(response?.data?.data)
      return response.data;
    } catch (error: any) {
      console.error(t("error_fetch_markets"), error);
      throw error;
    }
  };

  useEffect(() => {
    getMarkets()
  }, [])

  const handleBasketClick = () => router.push(`/basket`)
  const handleHistoryClick = () => router.push(`/history`)
  const handleHomeClick = () => router.push(`/`)
  const handleSettingsClick = () => router.push(`/profile`)
  const handleCategoriesClick = () => router.push(`/categories`)

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="bg-white shadow-sm border-b hidden md:block">
        {/* ... DESKTOP qismini o'zgartirmadim ... */}
      </header>

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-0 z-[99999] w-full bg-white border-t shadow-md">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button onClick={handleHomeClick} className="flex cursor-pointer flex-col items-center text-gray-600">
            <Home className="h-6 w-6" />
            <span className="text-xs">{t("home")}</span>
          </button>

          {/* Categories */}
          <button onClick={handleCategoriesClick} className="flex flex-col items-center cursor-pointer text-gray-600">
            <LayoutGrid className="h-6 w-6" />
            <span className="text-xs">{t("historym")}</span>
          </button>

          {/* LANGUAGE SELECT */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex flex-col items-center cursor-pointer text-gray-600">
                <Languages className="h-6 w-6" />
                <span className="text-xs">{t("language")}</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("choose_language")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2 mt-4">
                {languages.map((lng) => (
                  <Button
                    key={lng.code}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleLanguageChange(lng.code)}
                  >
                    <span className="mr-2">{lng.flag}</span>
                    {lng.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Basket */}
          <button onClick={handleBasketClick} className="flex flex-col items-center cursor-pointer text-gray-600 relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs">{t("basket")}</span>
            {shoppingList?.length > 0 && (
              <Badge className="absolute top-0 right-3 h-4 w-4 rounded-full flex items-center justify-center text-[10px]">
                {shoppingList.length}
              </Badge>
            )}
          </button>

          {/* History */}
          <button onClick={handleHistoryClick} className="flex flex-col cursor-pointer items-center text-gray-600">
            <History className="h-6 w-6" />
            <span className="text-xs">{t("history")}</span>
          </button>

          {/* Settings */}
          <button onClick={handleSettingsClick} className="flex flex-col cursor-pointer items-center text-gray-600">
            <Settings className="h-6 w-6" />
            <span className="text-xs">{t("settings")}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
