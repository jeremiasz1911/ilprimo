import Image from "next/image";
import { localImages } from "@/data/menu";
import ScrollReveal from "@/components/ScrollReveal";

export default function About() {
  return (
    <section id="o-nas" className="bg-stone-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ScrollReveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none">
            <Image
              src={localImages.about}
              alt="Wnętrze restauracji IL PRIMO"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div>
            <p className="text-xs tracking-[0.25em] text-amber-700 uppercase sm:text-sm sm:tracking-[0.3em]">
              O nas
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-wide text-stone-900 sm:mt-4 sm:text-4xl md:text-5xl">
              Tradycja i smak Włoch
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-600 sm:mt-8 sm:space-y-6 sm:text-base md:text-lg">
              <p>
                IL PRIMO to miejsce, w którym spotykają się autentyczne włoskie
                smaki i ciepła atmosfera. Nasza kuchnia opiera się na świeżych
                składnikach, sprawdzonych recepturach i pasji do gotowania
                przekazywanej z pokolenia na pokolenie.
              </p>
              <p>
                Serwujemy domowe makarony, klasyczne przystawki i desery, które
                przeniosą Cię prosto do serca Italii. Zapraszamy do odkrywania
                prawdziwej kuchni włoskiej w eleganckim wnętrzu w centrum Mławy.
              </p>
              <p>
                Każde danie przygotowujemy z dbałością o detale — od aromatycznego
                espresso po perfekcyjnie ugotowane al dente spaghetti. U nas
                gościnność to nie tylko słowo, to sposób, w jaki witamy każdego
                gościa.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
