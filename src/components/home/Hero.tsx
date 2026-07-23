import BrandMark from "@/components/layout/BrandMark";

export default function Hero() {
  return (
    <section className="animate-fade-in-up relative overflow-hidden rounded-[20px] bg-gradient-to-br from-gold-dark via-gold to-gold-light px-8 py-12 md:px-12 md:py-16 mb-10 shadow-[0_20px_50px_-20px_rgba(186,117,23,0.5)]">
      {/* Decorative circles, same language as the auth panel */}
      <div className="absolute -top-[70px] -right-[70px] w-[260px] h-[260px] rounded-full bg-white/10" />
      <div className="absolute -bottom-[50px] -left-[50px] w-[200px] h-[200px] rounded-full bg-white/[0.08]" />

      <div className="relative z-10 flex items-center gap-10">
        <div className="max-w-xl">
          <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-white leading-[1.2] mb-3">
            Kütahya&apos;nın Zarif Çinileri Kapınızda
          </h1>
          <p className="text-[15px] text-white/85 leading-[1.7] mb-6">
            El yapımı Kütahya çinileri ve özel tasarım seramik hediyelikler.
            Yüzyıllardır süregelen çini sanatının inceliği artık kapınızda.
          </p>
          {/* Plain <a>: next/link intercepts hash-only hrefs via the router,
              which does not reliably scroll to the fragment. */}
          <a
            href="#urunler"
            className="inline-block px-6 py-3 bg-white hover:bg-gold-ink text-gold-ink hover:text-white rounded-xl text-[15px] font-medium shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            Ürünleri Keşfet
          </a>

          <div className="flex gap-8 mt-10 pt-6 border-t border-white/20">
            <div>
              <div className="font-serif text-[26px] font-bold text-white">500+</div>
              <div className="text-[11px] text-white/70 tracking-wider">ÜRÜN</div>
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-white">12K+</div>
              <div className="text-[11px] text-white/70 tracking-wider">MÜŞTERİ</div>
            </div>
            <div>
              <div className="font-serif text-[26px] font-bold text-white">4.9</div>
              <div className="text-[11px] text-white/70 tracking-wider">PUAN</div>
            </div>
          </div>
        </div>

        {/* Decorative showcase — fills the otherwise empty space on wide screens */}
        <div className="hidden lg:flex flex-1 items-center justify-center" aria-hidden="true">
          <div className="relative w-56 h-56 shrink-0">
            <div className="absolute inset-0 rounded-full bg-white/10" />
            <div className="absolute inset-7 rounded-full bg-white/10" />
            <div className="absolute inset-0 flex items-center justify-center drop-shadow-lg">
              <BrandMark variant="glass" className="w-24 h-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
