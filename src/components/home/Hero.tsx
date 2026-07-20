export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-gold-dark via-gold to-gold-light px-8 py-12 md:px-12 md:py-16 mb-10">
      {/* Decorative circles, same language as the auth panel */}
      <div className="absolute -top-[70px] -right-[70px] w-[260px] h-[260px] rounded-full bg-white/10" />
      <div className="absolute -bottom-[50px] -left-[50px] w-[200px] h-[200px] rounded-full bg-white/[0.08]" />

      <div className="relative z-10 max-w-xl">
        <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-white leading-[1.2] mb-3">
          Kaliteli Hediyelikler Kapınızda
        </h1>
        <p className="text-[15px] text-white/85 leading-[1.7] mb-6">
          El yapımı porselen ve cam ürünler, özel tasarım hediyelikler.
          Türkiye&apos;nin en güzel el sanatları burada.
        </p>
        {/* Plain <a>: next/link intercepts hash-only hrefs via the router,
            which does not reliably scroll to the fragment. */}
        <a
          href="#urunler"
          className="inline-block px-6 py-3 bg-white hover:bg-gold-ink text-gold-ink hover:text-white rounded-xl text-[15px] font-medium transition-colors"
        >
          Ürünleri Keşfet
        </a>
      </div>
    </section>
  );
}
