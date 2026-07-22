// DTOs mirror the Spring Boot backend contract (verified against the live API).

export interface SignUpRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  /** Backend rejects an empty string — omit the field when blank. */
  phoneNumber?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

/** Body of POST /auth/forgot-password. Resolves 200 even for unknown addresses. */
export interface ForgotPasswordRequest {
  email: string;
}

/** Response of GET /auth/reset-password/verify?token= (200). */
export interface ResetTokenVerifyResponse {
  valid: boolean;
}

/** Body of POST /auth/reset-password. */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/** Response of POST /auth/sign-up (201). */
export interface UserResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}

/** Response of POST /auth/sign-in (200). */
export interface SignInResponse extends UserResponse {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
}

/** Response of POST /auth/refresh-token (200). BOTH tokens are rotated. */
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Response of GET /users/me (200). */
export interface CurrentUser extends UserResponse {
  active: boolean;
  verified: boolean;
}

/** Item of GET /products (paged listing) AND of GET /favorites — same shape. */
export interface ProductSummary {
  id: number;
  /** Null on some legacy products — they cannot link to a detail page. */
  slug: string | null;
  name: string;
  price: number;
  mainImageUrl: string | null;
  /** Slug of the product's category; only GET /products sends it (favorites omit it). */
  categorySlug?: string | null;
}

/** Item of GET /categories and GET /categories/{slug}; also embedded in product detail. */
export interface Category {
  name: string;
  /** Null on legacy records — they cannot have a category page. */
  slug: string | null;
}

/** Image embedded in GET /products/{slug}. */
export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  /** True on the image shown in listings. */
  main: boolean;
  /** Full thumbnail URL; null when no thumbnail was generated (older uploads). */
  thumbnailPath: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Response of GET /products/{slug} (200). Unknown slug -> 404 "Ürün bulunamadı". */
export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  slug: string;
  categoryResponse: Category;
  imagesResponse: ProductImage[];
}

/** Item of the cart envelope. NO slug — cart rows cannot link to detail pages. */
export interface CartItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  mainImageUrl: string | null;
  /** unitPrice * quantity, computed by the backend. */
  totalPrice: number;
}

/**
 * Response of GET /cart and every cart mutation
 * (POST/PATCH/DELETE /cart/items/{productId}) — always the full current cart.
 */
export interface Cart {
  userId: number;
  /** Turkish feedback on mutations; null on plain reads. */
  message: string | null;
  totalQuantity: number;
  totalPrice: number;
  cartItems: CartItem[];
}

/** Response of POST /favorites/{productId}/toggle (200). */
export interface FavoriteToggleResponse {
  /** Favorite record id — not the product id. */
  id: number;
  product: ProductSummary | null;
  /** Turkish, e.g. added/removed feedback. */
  message: string;
}

/** Spring pagination envelope. */
export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** Body of POST/PUT /addresses. */
export interface AddressRequest {
  city: string;
  district: string;
  fullAddress: string;
  /** Exactly 5 digits. */
  postalCode: string;
}

/** Response of GET/POST/PUT /addresses (200). One address per user. */
export interface Address extends AddressRequest {
  id: number;
}

/** Standard backend error body. Messages are already in Turkish. */
export interface ApiErrorResponse {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
  /** Field name -> Turkish validation message. */
  validationErrors: Record<string, string> | null;
}
