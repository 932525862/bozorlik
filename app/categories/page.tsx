"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

export default function CategoryList() {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  // 🔍 Qidiruv uchun state
  const [search, setSearch] = useState("");

  // 📡 API orqali kategoriya olish
  const { data } = useFetch<any>({
    key: ["category", search],
    url: "/category",
    config: {
      params: {
        search: search || null,
      },
    },
  });

  // 📌 Bosilganda sahifaga o'tkazish
  const handleCategoryClick = (id: string) => {
    router.push(`/categories/${id}`);
  };

  return (
    <div className=" space-y-6">
      {/* Qidiruv inputi */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative">
        <div className="absolute inset-y-0  left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          type="text"
          placeholder={t("searchCategories")}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border h-12 border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Kategoriyalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-8 gap-6">
        {data?.items?.map((category: any) => (
          <Card
            key={category.id}
            className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#09bcbf] to-[#5ce1e6] p-[2px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="bg-white rounded-2xl h-full flex flex-col">
              <CardContent className="p-0 text-center flex-1 flex flex-col">
                {/* Rasm */}
                <div className="relative w-full h-44 overflow-hidden rounded-t-2xl">
                  <img
                    src={category.image}
                    alt={category.titleUz}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Nomi */}
                <h3 className="text-lg font-semibold px-4 py-3 text-gray-800 group-hover:text-[#09bcbf] transition-colors duration-300">
                  {i18n.language == "uz"
                    ? category?.titleUz
                    : i18n.language == "ru"
                    ? category?.titleRu
                    : category?.titleEn}
                </h3>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      </main>
    </div>
    
  );
}
