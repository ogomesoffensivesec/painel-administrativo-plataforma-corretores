import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationComponent({ currentPage, totalPages, onPageChange, totalCount, itemsOnPage}) {
  return (
    <Pagination className="flex items-center justify-end mt-4 select-none">
      <PaginationContent>
        <span className="text-sm text-muted-foreground mr-2 select-none">
            Mostrando {itemsOnPage.length } de  {totalCount - 1} empreendimentos.
        </span>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <PaginationItem>
            <PaginationLink
              className="hidden h-8 w-auto p-2  lg:flex cursor-pointer items-center gap-1 justify-center select-none"
              onClick={() =>currentPage > 1 &&  onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4"/>
              Anterior
            </PaginationLink>
          </PaginationItem>

          <PaginationLink
            className="hidden h-8 w-auto p-2  lg:flex cursor-pointer items-center gap-1 justify-center select-none"
            onClick={() => currentPage != totalPages && onPageChange(currentPage + 1)}
       
          >
          Próximo

          <ChevronRight className="h-4 w-4"/>
          </PaginationLink>
        </div>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
