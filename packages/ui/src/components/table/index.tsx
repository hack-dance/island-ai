"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Renderable,
  RowSelectionState,
  Table as RTTAble,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import { Input } from "@ui/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow
} from "@ui/components/ui/table"
import useLocalStorage from "@ui/hooks/use-local-storage"
import { cn } from "@ui/lib/utils"
import { SearchX } from "lucide-react"

import { useEffect, useMemo, useState, type JSX } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DataTableViewOptions } from "./column-toggle"
import { DataTablePagination } from "./pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  actionColumn?: Renderable<{
    row: TData
    table: RTTAble<TData>
    index: number
    selected: boolean
    isSelectedRow: boolean
  }>
  data: TData[]
  rowCount: number
  filterBy?: string
  filterPlaceholderText?: string
  name?: string
  onRowClick?: (index?: number | undefined) => void
  selectedRowClassname?: string
  selectedRow?: number
  rowSelection?: RowSelectionState
  setRowSelection?: (rowSelection: RowSelectionState) => void
  selectedRender?: ({ table }: { table: RTTAble<TData> }) => JSX.Element
}

export function DataTable<TData, TValue>({
  columns,
  actionColumn,
  data,
  rowCount,
  filterBy,
  filterPlaceholderText,
  name = "_ignore",
  onRowClick,
  selectedRow,
  selectedRowClassname,
  rowSelection,
  setRowSelection,
  selectedRender
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    `${name}_data_table_cols`,
    {}
  )
  const [_rowSelection, _setRowSelection] = useState({})

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("skip") ?? 0) / Number(searchParams.get("take") ?? 10),
    pageSize: Number(searchParams.get("take") ?? 10)
  })

  const handleColumnVisibilityChange = (updater: Updater<VisibilityState>) => {
    setColumnVisibility(updater instanceof Function ? updater(columnVisibility) : updater)
  }

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(rowCount / pageSize),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange:
      setRowSelection ?
        updater =>
          setRowSelection(updater instanceof Function ? updater(rowSelection ?? {}) : updater)
      : _setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection: rowSelection ?? _rowSelection,
      sorting,
      pagination
    }
  })

  useEffect(() => {
    const newSkip = pageIndex * pageSize
    const newTake = pageSize ?? 10

    const paramsString = searchParams.toString()
    const params = new URLSearchParams(paramsString)

    params.set("take", `${newTake}`)
    params.set("skip", `${newSkip}`)

    router.push(`${pathname}?${params.toString()}`)
  }, [pageIndex, pageSize])

  return (
    <>
      {filterBy && (
        <div className="flex items-center py-4">
          <Input
            placeholder={filterPlaceholderText}
            value={filterBy ? (table.getColumn(filterBy)?.getFilterValue() as string) : ""}
            onChange={event =>
              filterBy && table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}

      <div className="p-2">
        <Table>
          <TableHeader className="bg-none">
            {table.getHeaderGroups().map(headerGroup => (
              <TableHeaderRow className="hover:bg-muted/0 bg-none" key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
                <TableHead className="w-12 px-0 pr-4">
                  <div className="flex w-full flex-row-reverse">
                    <DataTableViewOptions table={table} />
                  </div>
                </TableHead>
              </TableHeaderRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ?
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  onClick={e => {
                    if (
                      e.target instanceof HTMLInputElement ||
                      e.target instanceof HTMLButtonElement ||
                      e.target instanceof HTMLAnchorElement ||
                      e.target instanceof HTMLTextAreaElement ||
                      e.target instanceof HTMLSelectElement ||
                      e.target instanceof HTMLLabelElement
                    ) {
                      return
                    }

                    onRowClick && onRowClick(index === selectedRow ? undefined : index)
                  }}
                  className={cn({
                    ...(selectedRowClassname ?
                      {
                        [selectedRowClassname]: selectedRow === index,
                        "cursor-pointer": onRowClick
                      }
                    : {})
                  })}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}

                  <TableCell key={"action"} className="pr-4">
                    {actionColumn &&
                      flexRender(actionColumn, {
                        row: row.original,
                        table,
                        index,
                        selected: row.getIsSelected(),
                        isSelectedRow: selectedRow === index
                      })}
                  </TableCell>
                </TableRow>
              ))
            : null}
          </TableBody>
        </Table>

        {!(table.getRowModel().rows?.length > 0) && (
          <div className="flex min-h-24 w-full flex-col items-center justify-center gap-4 py-12">
            <SearchX className="text-muted-foreground size-10" />
            <h4 className="text-muted-foreground foreground w-full text-center text-sm font-bold uppercase tracking-wide">
              No results.
            </h4>
          </div>
        )}
        <div className="mt-2">
          <DataTablePagination table={table} selectedRender={selectedRender} />
        </div>
      </div>
    </>
  )
}
