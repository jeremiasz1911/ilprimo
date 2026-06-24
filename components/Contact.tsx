import ScrollReveal from "@/components/ScrollReveal";

export default function Contact() {
  return (
    <footer id="kontakt" className="bg-black py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-serif text-xl tracking-[0.15em] uppercase sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
            IL PRIMO Ristorante Italiano
          </h2>

          <div className="mt-8 space-y-3 text-stone-400 sm:mt-10 sm:space-y-4">
            <p className="text-sm leading-relaxed sm:text-base md:text-lg">
              Aleja Marszałka Józefa Piłsudskiego 41/68,
              <br className="sm:hidden" /> 06-500 Mława
            </p>
            <p>
              <a
                href="tel:+48510457222"
                className="text-base text-amber-400 transition-all duration-500 hover:text-amber-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.35)] sm:text-lg md:text-xl"
              >
                510 457 222
              </a>
            </p>
          </div>

          <div className="mt-10 border-t border-stone-800 pt-6 sm:mt-12 sm:pt-8">
            <p className="text-xs text-stone-500 sm:text-sm">&copy; 2026 IL PRIMO</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
