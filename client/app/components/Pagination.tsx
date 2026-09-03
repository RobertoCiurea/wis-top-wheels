"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/app/styles/filters.css";
export const Pagination = ({
  total,
  limit,
}: {
  total?: number;
  limit?: number;
}) => {
  type Page = {
    page: number;
  };

  let pagesNumber = 1;
  if (total && limit)
    pagesNumber = total / limit > 1 ? Math.ceil(total / limit) : 1;

  const pages: Page[] = Array.from({ length: pagesNumber }, (_, index) => ({
    page: index + 1,
  }));

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const handlePagination = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button type="button" aria-label="Pagina anterioară">
          <ChevronLeft
            onClick={() => handlePagination((currentPage - 1).toString())}
          />
        </button>
      )}
      {pages.map((obj, index) => (
        <button
          type="button"
          className={`page ${obj.page === currentPage ? "active" : ""}`}
          key={index}
          onClick={() => handlePagination(obj.page.toString())}
        >
          {obj.page}
        </button>
      ))}
      {currentPage < pagesNumber && (
        <button type="button" aria-label="Pagina următoare">
          <ChevronRight
            onClick={() => handlePagination((currentPage + 1).toString())}
          />
        </button>
      )}
    </div>
  );
};
