"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [pages, setPages] = useState<Page[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentPage = searchParams.get("page");
  console.log("Current page" + currentPage);
  console.log("Number of pages: " + pagesNumber);
  const handlePagination = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    replace(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    setPages(
      Array.from({ length: pagesNumber }, (_, index) => ({
        page: index,
      })),
    );
  }, [searchParams]);

  return (
    <div className="pagination">
      {Number.parseInt(currentPage!) !== 1 && (
        <button>
          <ChevronLeft
            onClick={() =>
              handlePagination((Number.parseInt(currentPage!) - 1).toString())
            }
          />
        </button>
      )}
      {pages.map((obj, index) => (
        <button
          className={`page ${(obj.page + 1).toString() === currentPage ? "active" : ""}`}
          key={index}
          onClick={() => handlePagination((obj.page + 1).toString())}
        >
          {obj.page + 1}
        </button>
      ))}
      {Number.parseInt(currentPage!) < pagesNumber && (
        <button>
          <ChevronRight
            onClick={() =>
              handlePagination((Number.parseInt(currentPage!) + 1).toString())
            }
          />
        </button>
      )}
    </div>
  );
};
