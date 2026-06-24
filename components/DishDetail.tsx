"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MenuItem } from "@/data/menu";

interface DishDetailProps {
  item: MenuItem;
}

export default function DishDetail({ item }: DishDetailProps) {
  const badges = [
    item.isVegetarian && "Wegetariańskie",
    item.isSpicy && "Ostre",
    item.isGlutenFree && "Bez glutenu",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-stone-950 pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-square">
            <Image
              src={item.image}
              alt={item.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-xs tracking-[0.3em] text-amber-400 uppercase sm:text-sm"
            >
              {item.category}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl"
            >
              {item.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-2xl font-medium text-amber-400 sm:text-3xl"
            >
              {item.price}
            </motion.p>

            {badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs tracking-wide text-amber-300"
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-base leading-relaxed text-stone-300 sm:text-lg"
            >
              {item.longDescription}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10"
        >
          <div className="rounded-sm border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-amber-400 sm:text-2xl">
              Składniki
            </h2>
            <ul className="mt-4 space-y-2">
              {item.ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="flex items-center gap-2 text-sm text-stone-300 sm:text-base"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-sm border border-stone-800 bg-stone-900/50 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-amber-400 sm:text-2xl">
              Alergeny
            </h2>
            {item.allergens.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {item.allergens.map((allergen) => (
                  <li
                    key={allergen}
                    className="flex items-center gap-2 text-sm text-stone-300 sm:text-base"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {allergen}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-stone-400 sm:text-base">
                Brak zadeklarowanych alergenów.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-12 text-center sm:mt-16"
        >
          <Link href="/#menu" className="btn-premium inline-block">
            Wróć do menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
