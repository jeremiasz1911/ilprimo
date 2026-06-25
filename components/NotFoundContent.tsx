import Link from "next/link";

interface NotFoundContentProps {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export default function NotFoundContent({
  title,
  description,
  backHref = "/#menu",
  backLabel = "Wróć do menu",
}: NotFoundContentProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <p className="text-xs tracking-[0.3em] text-amber-400 uppercase sm:text-sm">
        404
      </p>
      <h1 className="mt-4 font-serif text-3xl tracking-wide text-white sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-400 sm:text-base">
        {description}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href={backHref} className="btn-premium inline-block">
          {backLabel}
        </Link>
        <Link
          href="/"
          className="inline-block border border-stone-700 px-6 py-3 text-sm tracking-[0.1em] text-stone-300 transition-colors hover:border-amber-400 hover:text-amber-400"
        >
          Strona główna
        </Link>
      </div>
    </div>
  );
}
