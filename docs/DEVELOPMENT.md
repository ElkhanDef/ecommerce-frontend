# Development

Bu doküman projenin mevcut tech stack'ini ve geliştirme bilgilerini içerir. Projeye yeni teknolojiler eklendikçe bu dosya güncellenir.

## Proje Hakkında

Müşteriye yönelik e-ticaret sitesi (storefront). Admin paneli **değildir** — admin paneli ayrı bir proje olarak geliştirilecek.

Backend: Java Spring Boot ile yazılmış ayrı bir REST API projesi. Bu proje sadece frontend'dir ve backend API'yi tüketir.

## Tech Stack

| Teknoloji | Sürüm | Notlar |
|---|---|---|
| Next.js | 16.2.10 | App Router (`src/app/`) |
| React | 19.2.4 | |
| TypeScript | 5 | strict mode açık |
| Tailwind CSS | 4 | `@tailwindcss/postcss` üzerinden |
| ESLint | 9 | `eslint-config-next` ile |
| Axios | 1.x | HTTP client (kuruldu) |
| Zustand | 5.0.14 | Favoriler state'i (kuruldu); sepet store'u da buradan gelecek |

> **Not:** Bu Next.js sürümünde breaking change'ler var. Kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili dokümana bakın (bkz. `AGENTS.md`).

## Proje Yapısı

```
src/
  app/
    layout.tsx          # Root layout: fontlar (Playfair Display + DM Sans), global metadata
    globals.css         # Tailwind 4 @theme design token'ları (gold paleti, fontlar)
    (auth)/             # Header/Footer'sız auth grubu
      layout.tsx        # Sol altın marka paneli (AuthTabs'ı /giris ve /kayit sayfaları kendileri render eder)
      giris/page.tsx    # /giris
      kayit/page.tsx    # /kayit
      sifremi-unuttum/  # /sifremi-unuttum (şifre sıfırlama maili isteme)
      reset-password/   # /reset-password?token= (mail linkinden gelinir — URL backend şablonundan, bu yüzden İngilizce)
    (shop)/             # Header + Footer'lı mağaza grubu
      layout.tsx
      page.tsx          # / (ana sayfa, ürün grid gelecek)
      urun/[slug]/      # /urun/[slug] (ürün detayı: galeri, stok, favori; not-found.tsx ile 404)
      yeni-gelenler/    # /yeni-gelenler (createdAt'e göre en yeni ürünler)
      kategori/[slug]/  # /kategori/[slug] (kategori ürünleri; not-found.tsx ile 404)
      sepet/            # /sepet (giriş gerektirir)
      favoriler/        # /favoriler (giriş gerektirir)
      profil/           # /profil (giriş gerektirir)
  components/
    ui/                 # Genel parçalar (Button, Input...) — henüz boş
    layout/             # Header, Footer
    auth/               # AuthTabs (form komponentleri gelecek)
    product/            # ProductCard, ProductGrid, ProductGallery, FavoriteButton, AddToCartButton
    favorites/          # FavoritesList (auth guard + favori grid'i)
    cart/               # CartView (auth guard + özet), CartItemRow (adet/sil)
  services/             # api.ts, auth.ts, users.ts, products.ts, favorites.ts, cart.ts, addresses.ts, token-storage.ts
  stores/               # Zustand store'ları: favorites.ts, cart.ts
  types/                # Paylaşılan TypeScript tipleri / DTO'lar
  lib/                  # Yardımcı fonksiyonlar — henüz boş
docs/                   # Proje dokümantasyonu + tasarım referansı
```

- Path alias: `@/*` → `./src/*`
- URL'ler Türkçe: `/giris`, `/kayit`, `/urun/[slug]`, `/sepet`, `/favoriler`, `/profil`

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Production build alır |
| `npm run start` | Production sunucusunu başlatır |
| `npm run lint` | ESLint çalıştırır |

## Backend Entegrasyonu

- Backend: Java Spring Boot REST API (ayrı repo), JWT auth
- Base URL: `NEXT_PUBLIC_API_URL` env değişkeni (`.env.local`, örnek: `.env.example`) → `http://localhost:8080/api/v1`
- Servis katmanı: `src/services/api.ts` (Axios instance + JWT interceptor + hata normalizasyonu), `src/services/auth.ts` (auth çağrıları), `src/services/token-storage.ts` (localStorage token yönetimi — cookie'ye geçiş tek dosyaya dokunur)
- Sepet ve Favoriler giriş gerektirir; ürün sayfaları herkese açıktır
- API sözleşmesi Postman collection'dan gelir — endpoint uydurma

### Keşfedilen API Sözleşmesi (canlı backend'e karşı doğrulandı)

- `POST /auth/sign-up` → 201 `{id, name, lastName, email, phoneNumber}` — e-posta doğrulaması zorunlu, doğrulanmadan giriş yapılamaz. `phoneNumber` opsiyonel ama boş string gönderilirse validasyon hatası döner (alan hiç gönderilmemeli).
- `POST /auth/sign-in` → 200 `{id, name, lastName, email, phoneNumber, accessToken, refreshToken, expiresIn}` — access token 900 sn (15 dk), refresh token ~7 gün.
- `POST /auth/sign-up/verify?token={token}` → hesabı doğrular; geçersiz/kullanılmış token'da 401 "Geçersiz token". Doğrulama maili `http://localhost:3000/verify-user/{token}` linki içerir → frontend'de `/verify-user/[token]` sayfası karşılar (URL backend mail şablonundan geliyor, bu yüzden İngilizce).
- `POST /auth/refresh-token` → body `{refreshToken}`, 200 `{accessToken, refreshToken, expiresIn}` — **iki token da rotate edilir**, ikisi birden kaydedilmeli. Geçersizse 401 "Geçersiz refresh token". `api.ts` interceptor'ı 401'de otomatik yeniler (eşzamanlı istekler tek refresh'te birleştirilir), başarısızsa token'lar temizlenir.
- `GET /users/me` → 200 `{id, name, lastName, email, phoneNumber, active, verified}` (Bearer token gerekli).
- `POST /auth/forgot-password` → body `{email}`, 200 boş yanıt — **bilinmeyen e-posta için de 200** (hesap enumeration koruması); boş email → 400 `validationErrors: {email}`. Sıfırlama maili `http://localhost:3000/reset-password?token={token}` linki içerir → frontend'de `/reset-password` sayfası karşılar (URL backend mail şablonundan geliyor, bu yüzden İngilizce).
- `GET /auth/reset-password/verify?token={token}` → 200 `{valid: true|false}`. **Dikkat:** method GET olmalı — POST atılırsa 500 döner.
- `POST /auth/reset-password` → body `{token, newPassword}`, alan hataları 400 `validationErrors: {token, newPassword}`.
- `GET /products?pageNumber=&pageSize=&column=&asc=` → 200 `{content: [{id (number), slug (null olabilir!), name, price, mainImageUrl (null olabilir)}], page: {size, number, totalElements, totalPages}}` — `column` opsiyonel sıralama (regex `^[a-zA-Z0-9_]+$`, örn. `createdAt`), `asc` boolean yön (`false` = azalan). **Arama parametresi YOK** — `search` vb. bilinmeyen parametreler sessizce yok sayılır (OpenAPI `/v3/api-docs` ile doğrulandı); bu yüzden header'daki arama kutusu backend desteği gelene kadar kaldırıldı. Görseller `http://localhost:9000` (MinIO) üzerinden gelir; `next.config.ts`'te `images.remotePatterns` izni var. **Dikkat:** Next 16 private IP'ye çözünen upstream görselleri SSRF koruması gereği bloklar — dev'de `dangerouslyAllowLocalIP: true` (sadece `NODE_ENV=development`) ile açıldı; production'da MinIO public host'u `remotePatterns`'a eklenmeli.
- `GET /products/{slug}` → 200 `{id, name, price, stock, sku, description, slug, categoryResponse: {name, slug}, imagesResponse: [{id, productId, url, main, thumbnailPath, createdAt, updatedAt}]}` — bilinmeyen slug'da 404 "Ürün bulunamadı". `main: true` olan görsel listelerdeki kapak görselidir. `thumbnailPath` 2026-07-19'dan beri **tam URL** döner, thumbnail üretilmemişse (eski yüklemeler) **null** — galeri şeridi `thumbnailPath ?? url` fallback'iyle çizer.
- `GET /categories` → 200 `[{name, slug}]` — eski kayıtlarda `slug` null olabilir; header menüsü bu listeden dinamik render edilir (slug'sızlar atlanır), satıcının eklediği her kategori otomatik görünür.
- `GET /categories/{slug}` → 200 `{name, slug}`; bilinmeyen slug'da 404 — kategori sayfası başlığı ve 404 kontrolü buradan.
- `GET /products?categorySlug=` → kategoriye göre filtre. **DİKKAT (2026-07-20):** parametre frontend'den gönderiliyor ama backend henüz uygulamıyor (her değerde tüm ürünler dönüyor) — backend filtreyi uyguladığında frontend değişikliği gerekmeden çalışacak. Yanıttaki `ProductListResponseDto`'ya `categorySlug` alanı eklendi (favorites yanıtında YOK).
- `GET /favorites` → 200 `[{id, slug, name, price, mainImageUrl}]` (Bearer gerekli) — 2026-07-19'dan beri ürün listesiyle birebir aynı şekil (`ProductSummary`); `id` ürün id'si (number), `slug` eski kayıtlarda null olabilir.
- `POST /favorites/{productId}/toggle` → 200 `{id (favori kaydı id'si), product, message}` (Bearer gerekli) — üründe varsa çıkarır, yoksa ekler. Frontend yanıt gövdesine güvenmez (optimistic toggle + hata durumunda rollback).
- `GET /cart` → 200 `{userId, message (null olabilir), totalQuantity, totalPrice, cartItems: [{productId, productName, unitPrice, quantity, mainImageUrl, totalPrice}]}` (Bearer gerekli) — `cartItems`'da `slug` YOK, satırlar ürün detayına linklenemiyor.
- `POST /cart/items/{productId}?quantity=` / `PATCH /cart/items/{productId}?quantity=` / `DELETE /cart/items/{productId}` → 200, hepsi güncel sepetin tamamını (`CartResponseDto`) döndürür; `{id}` **ürün id'sidir** (sepet satırının ayrı id'si yok). PATCH mutlak adet alır (delta değil). `DELETE /cart` sepeti boşaltır, gövdesiz 200 döner.
- Hata formatı (tüm endpoint'ler): `{error, message, path, status, timestamp, validationErrors}` — `message` ve `validationErrors` (alan → mesaj) **backend'den Türkçe gelir**, UI'da doğrudan gösterilir.
- `GET /addresses` → 200 `{id, city, district, fullAddress, postalCode}` (Bearer gerekli) — **kullanıcı başına tek adres**, `{id}` path parametresi YOK. Adres yoksa hata döner (spec'te belgelenmemiş; frontend her hatayı "adres yok" kabul edip ekleme formunu gösterir).
- `POST /addresses` / `PUT /addresses` → body `AddressRequestDto {city, district, fullAddress (max 500), postalCode (tam 5 karakter)}`, hepsi zorunlu, 200 `AddressResponseDto` döner.
- `DELETE /addresses` → 200, gövdesiz.

## Mimari Kararlar

| Karar | Seçim | Tarih |
|---|---|---|
| JWT saklama | localStorage + Axios interceptor | 2026-07-16 |
| HTTP client | Axios | 2026-07-16 |
| Client state (sepet/favori) | Zustand | 2026-07-16 |
| Google login | Şimdilik yok (backend desteği netleşince) | 2026-07-16 |
| URL dili | Türkçe (`/giris`, `/sepet`...) — Türkçe SEO için | 2026-07-16 |
| Auth route yapısı | `/giris` ve `/kayit` ayrı sayfalar, tab görünümü Link ile | 2026-07-16 |
| Komponent organizasyonu | Hibrit: `components/ui` + `components/layout` + özellik klasörleri | 2026-07-16 |
| Header içeriği | Logo + arama çubuğu + kategori menüsü + favori/sepet/profil ikonları | 2026-07-16 |
| Dil politikası | Kod tamamen İngilizce (isimler, yorumlar); sadece müşteriye görünen kısımlar Türkçe (UI metinleri, hata mesajları, metadata, URL'ler). Route klasörleri (`giris/`, `sepet/`...) URL'nin kendisi olduğu için Türkçe kalır | 2026-07-16 |

## Tasarım Sistemi — "Gold Premium"

Lüks butik hissiyatı; sıcak, zarif, sade. Mobil öncelikli. Referans mockup: `docs/design-reference/auth.html` — tüm sayfalar bu stile uyar.

- Renkler: ana `#EF9F27`, koyu altın `#BA7517`, açık altın `#FAC775`, altın üstü metin `#412402`, sayfa arka planı `#f8f9fa`
- Fontlar: başlık `Playfair Display`, gövde `DM Sans` (`next/font` ile yüklenir)
- Köşeler yuvarlak (10–20px), ince kenarlıklar, yumuşak altın focus ring

## Changelog

- **2026-07-22** — Adres yönetimi bağlandı: backend'de kullanıcı başına tek adres modeli (`GET/POST/PUT/DELETE /addresses`, id parametresiz, OpenAPI `/v3/api-docs` ile doğrulandı). `services/addresses.ts`, `Address`/`AddressRequest` tipleri, `components/profile/AddressDetails.tsx` (görüntüle/düzenle/sil + boş durumda ekleme formu, `window.confirm`'lü silme) ve genel amaçlı `ui/TextAreaField.tsx` eklendi. `/profil` sayfası iki sütuna bölündü: solda hesap bilgileri, sağda adresim.
- **2026-07-20** — Kategoriler dinamik bağlandı: header menüsü `GET /categories`'ten render ediliyor (satıcı ne eklerse otomatik görünür, slug'sız eski kayıtlar atlanır, backend'e ulaşılamazsa menü yerleşik linklere düşer), `/kategori/[slug]` sayfası (`GET /categories/{slug}` ile başlık + 404, `GET /products?categorySlug=` ile grid + sayfalama), `services/categories.ts`, `ProductCategory` tipi `Category` olarak genelleştirildi, `ProductSummary`'ye opsiyonel `categorySlug` eklendi. Bilinen eksik: backend `categorySlug` filtresini henüz uygulamıyor.
- **2026-07-19** — Backend `thumbnailPath`'i tam URL (yoksa null) dönecek şekilde düzeltildi → galeri şeridindeki küçük görseller artık `thumbnailPath ?? url` ile çiziliyor.
- **2026-07-19** — Sepet bağlandı: `stores/cart.ts` + `services/cart.ts` (her mutasyon tam sepeti döndürdüğü için optimistic state yok, sunucu yanıtı doğrudan yazılır), `/sepet` sayfası (auth guard, satır bazlı adet artır/azalt + silme, sipariş özeti, onaylı "Sepeti Temizle", boş durum), ürün detayına adet seçicili "Sepete Ekle" (stok 0 → Tükendi), header sepet ikonuna ürün adedi rozeti (`HeaderCartLink` — soft navigation sonrası da güncellenir). Ödeme/checkout backend'de sipariş endpoint'i olmadığı için yok.
- **2026-07-19** — Ürün detay sayfası yapıldı (`/urun/[slug]` → `GET /products/{slug}`): server-side render + `generateMetadata` (SEO, `cache()` ile istek dedup'u), görsel galerisi (`ProductGallery` — thumbnail seçimi, `main` görsel önce), stok rozeti (Tükendi / Son N ürün / Stokta var), kategori adı, SKU, favori butonu (`FavoriteButton`'a `inline` varyantı eklendi), bilinmeyen slug'da `notFound()` + özel `not-found.tsx`. Sepete ekle butonu sepet adımında gelecek.
- **2026-07-19** — Backend sözleşme güncellemesine uyum: `GET /products` artık `id`'yi number döndürüyor (string değil) ve `GET /favorites` `slug` içeriyor → `FavoriteProduct` tipi kaldırıldı, her iki endpoint de `ProductSummary` kullanıyor; favori kartları artık ürün detayına linkleniyor; store'daki string/number id normalizasyonu kaldırıldı.
- **2026-07-18** — Favoriler bağlandı: Zustand 5 kuruldu, `stores/favorites.ts` (optimistic toggle + rollback, tek seferlik deduplu yükleme), `services/favorites.ts` (`GET /favorites`, `POST /favorites/{id}/toggle`), ürün kartlarına kalp butonu (`FavoriteButton` — girişsiz tıklamada `/giris?redirect=`), `/favoriler` sayfası gerçek listeye bağlandı (auth guard, boş durum, karttan çıkarınca anında güncellenir). Not: `GET /favorites` `slug` döndürmediği için favori kartları detay sayfasına linklenemiyor.
- **2026-07-18** — "Yeni Gelenler" sayfası eklendi (`/yeni-gelenler` → `GET /products?column=createdAt&asc=false`, grid + sayfalama yeniden kullanıldı); header'daki link bağlandı. Header'daki arama kutusu kaldırıldı: backend'de ürün arama endpoint'i yok (`GET /products` `search` parametresini yok sayıyor, OpenAPI ile doğrulandı) — backend'e arama eklenince kutu geri gelecek.
- **2026-07-17** — Şifre sıfırlama akışı eklendi: `/sifremi-unuttum` (mail isteme) ve `/reset-password?token=` (token server-side doğrulanır, geçersizse "Bağlantı Geçersiz" ekranı; geçerliyse yeni şifre formu). `AuthTabs` layout'tan `/giris` ve `/kayit` sayfalarına taşındı (yeni auth sayfalarında tab yok). Ana sayfadaki "Ürünleri Keşfet" butonu düzeltildi (`next/link` hash linki güvenilir kaydırmıyordu → native `<a href="#urunler">` + sticky header için `scroll-mt`). Canlı backend'le doğrulandı.
- **2026-07-17** — Refresh token akışı eklendi (401'de otomatik yenileme + retry, token rotasyonu, eşzamanlı istek dedup'u); profil sayfası `GET /users/me`'ye bağlandı (auth guard: girişsiz → `/giris?redirect=/profil`, çıkış butonu); `HeaderAuthAction` `useSyncExternalStore`'a geçirildi.
- **2026-07-17** — Ana sayfa yapıldı: hero (altın gradient), ürün grid'i (`GET /products`, sayfa başı 12, server-side render), `?sayfa=` ile sayfalama, TRY fiyat formatı (`lib/format.ts`), görselsiz/slug'sız ürünler için fallback'ler, MinIO görsel izni. Canlı backend'le doğrulandı.
- **2026-07-17** — E-posta doğrulama sayfası eklendi (`/verify-user/[token]` → `POST /auth/sign-up/verify`); header'a auth-duyarlı "Giriş Yap" butonu eklendi (`HeaderAuthAction`); backend CORS sorunu çözüldü (`.cors(Customizer.withDefaults())` eksikti).
- **2026-07-17** — Giriş/Kayıt sayfaları backend'e bağlandı (`/auth/sign-in`, `/auth/sign-up`): Axios kuruldu, servis katmanı (`api.ts`, `auth.ts`, `token-storage.ts`), gerçek DTO tipleri, `LoginForm`/`RegisterForm` client komponentleri, `TextField` UI komponenti, alan bazlı Türkçe validasyon hataları, kayıt sonrası e-posta doğrulama ekranı, `?redirect=` desteği. API sözleşmesi canlı backend'e karşı doğrulanıp belgelendi.
- **2026-07-16** — Proje iskeleti kuruldu: `(auth)`/`(shop)` route grupları, Türkçe URL'ler, Header/Footer, design token'ları (`globals.css` @theme), font kurulumu (`next/font`), placeholder sayfalar. Build ve lint doğrulandı.
- **2026-07-16** — Mimari kararlar eklendi (Axios, Zustand, localStorage JWT), tasarım sistemi belgelendi, sayfa yol haritası eklendi.
- **2026-07-16** — İlk sürüm: mevcut tech stack ve proje yapısı belgelendi.
