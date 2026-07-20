import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex p-4 bg-surface">
      {/* Left side — brand panel and stats */}
      <div className="hidden lg:flex flex-1 rounded-[20px] flex-col justify-between p-12 relative overflow-hidden min-h-[500px] bg-gradient-to-br from-gold-dark via-gold to-gold-light">
        {/* Decorative circles */}
        <div className="absolute -top-[80px] -right-[80px] w-[300px] h-[300px] rounded-full bg-white/10" />
        <div className="absolute -bottom-[60px] -left-[60px] w-[250px] h-[250px] rounded-full bg-white/5" />

        <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-[22px]">
            🛍
          </div>
          <span className="font-serif text-[22px] font-bold text-white">
            E-Commerce
          </span>
        </Link>

        <div className="relative z-10">
          <p className="font-serif text-[40px] font-bold text-white leading-[1.2] mb-4">
            Kaliteli
            <br />
            Hediyelikler
            <br />
            Kapınızda
          </p>
          <p className="text-[15px] text-white/85 leading-[1.7] max-w-[300px]">
            El yapımı porselen ve cam ürünler, özel tasarım hediyelikler.
            Türkiye&apos;nin en güzel el sanatları burada.
          </p>
        </div>

        <div className="flex gap-8 relative z-10">
          <div>
            <div className="font-serif text-[28px] font-bold text-white">500+</div>
            <div className="text-[12px] text-white/75 tracking-wider">ÜRÜN</div>
          </div>
          <div>
            <div className="font-serif text-[28px] font-bold text-white">12K+</div>
            <div className="text-[12px] text-white/75 tracking-wider">MÜŞTERİ</div>
          </div>
          <div>
            <div className="font-serif text-[28px] font-bold text-white">4.9</div>
            <div className="text-[12px] text-white/75 tracking-wider">PUAN</div>
          </div>
        </div>
      </div>

      {/* Right side — form area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* AuthTabs is rendered by /giris and /kayit themselves — the other
            auth pages (forgot/reset password) have no tab bar. */}
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
