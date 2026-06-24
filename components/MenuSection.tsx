import Image from "next/image";
import Link from "next/link";
import { menuCategories } from "@/data/menu";
import ScrollReveal from "@/components/ScrollReveal";

export default function MenuSection() {
  return (
    <section id="menu" className="bg-stone-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs tracking-[0.25em] text-amber-400 uppercase sm:text-sm sm:tracking-[0.3em]">
              Nasze menu
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-wide text-white sm:mt-4 sm:text-4xl md:text-5xl">
              Smaki Italii
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-stone-400 sm:mt-6 sm:text-base md:text-lg">
              Odkryj nasze dania — od klasycznych przystawek po autorskie makarony
              i wyśmienite desery.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 space-y-16 sm:mt-20 sm:space-y-24">
          {menuCategories.map((category, categoryIndex) => (
            <ScrollReveal key={category.id} delay={categoryIndex * 0.05}>
              <div>
                <h3 className="mb-8 border-b border-stone-700 pb-3 text-center font-serif text-lg tracking-[0.15em] text-amber-400 uppercase sm:mb-12 sm:pb-4 sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
                  {category.name}
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-10">
                  {category.items.map((item, itemIndex) => (
                    <ScrollReveal
                      key={item.slug}
                      delay={itemIndex * 0.04}
                      className="h-full"
                    >
                      <Link
                        href={`/menu/${item.slug}`}
                        className="menu-card group flex h-full flex-col overflow-hidden bg-stone-800/50"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/30" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <span className="border border-amber-400/60 bg-black/50 px-4 py-2 text-[0.65rem] tracking-[0.2em] text-amber-400 uppercase backdrop-blur-sm sm:text-xs">
                              Zobacz szczegóły
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-3 transition-transform duration-500 ease-out sm:p-5 lg:p-6 group-hover:-translate-y-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                            <h4 className="font-serif text-sm leading-snug text-white transition-transform duration-500 ease-out sm:text-lg md:text-xl lg:text-2xl group-hover:-translate-y-0.5">
                              {item.name}
                            </h4>
                            <span className="shrink-0 text-sm font-medium text-amber-400 sm:text-base lg:text-lg">
                              {item.price}
                            </span>
                          </div>
                          <p className="mt-2 flex-1 text-xs leading-relaxed text-stone-400 sm:mt-3 sm:text-sm">
                            {item.shortDescription}
                          </p>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
