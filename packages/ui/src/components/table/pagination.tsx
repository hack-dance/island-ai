import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@ui/components/ui/select"

import type { JSX } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  selectedRender?: ({ table }: { table: Table<TData> }) => JSX.Element
}

export function DataTablePagination<TData>({
  table,
  selectedRender
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full items-center justify-between py-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ?
        selectedRender ?
          selectedRender({ table })
        : <div className="text-muted-foreground flex-1 text-xs">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

      : <div />}

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-6 w-[60px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {table.getPageCount() > 1 && (
          <>
            <div className="text-muted-foreground text-xs font-medium">
              Page{"  "} <strong>{table.getState().pagination.pageIndex + 1}</strong> {` of `}
              <strong>{table.getPageCount()}</strong>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
