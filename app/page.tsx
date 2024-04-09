"use client"

import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ChevronDownIcon} from "@radix-ui/react-icons";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {Filter} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {QueryResult} from "@upstash/vector";
import type {Product as ProductType} from "@/db";
import Product from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";
import {Accordion} from "@/components/ui/accordion";

const SORT_OPTIONS = [
    {name: "None", value: "none"},
    {name: "Price: Low to High", value: "price-asc"},
    {name:"Price: High to Low",value: "price-desc"}
] as const

const SUBCATEGORIES = [
    {name: "T-Shirts", selected: true, href:"#"},
    {name: "Hoodies", selected: false, href:"#"},
    {name: "Sweatshirts", selected: false, href:"#"},
    {name: "Accessories", selected: false, href:"#"},
] as const

export default function Home() {
    const [filter, setFilter] = useState({
        sort: "none",
    })

    const {data: products} = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const {data} = await axios.post<QueryResult<ProductType>[]>(
                "http://localhost:3000/api/products", {
                    filter: {
                        sort: filter.sort
                    }
                }
            )

            return data
        }
    })

    console.log(products)

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              High Quality Cotton selection
          </h1>

          <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 test-gray-400 group-hover:text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={"end"}>
                    {SORT_OPTIONS.map((option) => (
                        <button key={option.name}
                                className={cn("text-left w-full block px-4 py-2 text-sm", {
                                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                                    "text-gray-500": option.value !== filter.sort
                                })}
                                onClick={() => {
                                setFilter((prev) => ({
                                    ...prev,
                                    sort: option.value
                                }))
                            }}>
                            {option.name}
                        </button>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

              <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                  <Filter className="h-5 w-5" />
              </button>
          </div>
      </div>

        <section className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <div className={"hidden lg:block"}>
                    <ul className={"space-y-4 border-b border-gray-200 pb-g text-sm font-medium text-gray-900"}>
                        {SUBCATEGORIES.map((category) => (
                            <li key={category.name}>
                                <button
                                    disabled={!category.selected}
                                    className={"disabled:cursor-not-allowed disabled:opacity-60"}>
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <Accordion type={"multiple"} className={"animate-none"}>
                        {/* Color */}
                    </Accordion>
                </div>

                {/* Product grid */}
                <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {
                        products ? (
                            products?.map((product) => (
                                <Product key={product.id} product={product.metadata!}/>
                            ))
                        ): new Array(12).fill(null).map((_,i) => (
                            <ProductSkeleton key={i} />
                        ))
                    }
                </ul>
            </div>
        </section>
    </main>
  );
}
