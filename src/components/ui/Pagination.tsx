import Link from "next/link";

interface PaginationProps {
  /** 1-based current page. */
  currentPage: number;
  totalPages: number;
  /** Path the page links point to; the page number goes into ?sayfa=. */
  basePath?: string;
}

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}?sayfa=${page}`;
}

/** Returns the page numbers to render, with null marking an ellipsis gap. */
function pageItems(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items: (number | null)[] = [];
  for (const page of sorted) {
    const prev = items[items.length - 1];
    if (typeof prev === "number" && page - prev > 1) {
      items.push(null);
    }
    items.push(page);
  }
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkClass =
    "min-w-9 h-9 px-2 inline-flex items-center justify-center rounded-xl text-[14px] font-medium transition-colors";

  return (
    <nav aria-label="Sayfalama" className="mt-10 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          {currentPage > 1 ? (
            <Link
              href={pageHref(basePath, currentPage - 1)}
              className={`${linkClass} text-gray-600 hover:bg-white hover:text-gold-dark border border-transparent hover:border-[#e0e0e0]`}
            >
              ‹<span className="sr-only">Önceki sayfa</span>
            </Link>
          ) : (
            <span aria-hidden="true" className={`${linkClass} text-gray-300`}>
              ‹
            </span>
          )}
        </li>

        {pageItems(currentPage, totalPages).map((item, index) =>
          item === null ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-gray-400">
              …
            </li>
          ) : (
            <li key={item}>
              {item === currentPage ? (
                <span aria-current="page" className={`${linkClass} bg-gold text-gold-ink`}>
                  {item}
                </span>
              ) : (
                <Link
                  href={pageHref(basePath, item)}
                  className={`${linkClass} text-gray-600 hover:bg-white hover:text-gold-dark border border-transparent hover:border-[#e0e0e0]`}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(basePath, currentPage + 1)}
              className={`${linkClass} text-gray-600 hover:bg-white hover:text-gold-dark border border-transparent hover:border-[#e0e0e0]`}
            >
              ›<span className="sr-only">Sonraki sayfa</span>
            </Link>
          ) : (
            <span aria-hidden="true" className={`${linkClass} text-gray-300`}>
              ›
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
