"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { DataTablePagination } from "./pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowCount: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("skip") ?? 0) / Number(searchParams.get("take") ?? 10),
    pageSize: Number(searchParams.get("take") ?? 10)
  })

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
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
      pagination
    }
  })

  useEffect(() => {
    const newSkip = pageIndex * pageSize
    const newTake = pageSize ?? 10

    const params = new URLSearchParams(Object.fromEntries(searchParams))

    params.set("take", `${newTake}`)
    params.set("skip", `${newSkip}`)

    router.push(`${pathname}?${params.toString()}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter conversations..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event => {
            const target = event.target as HTMLInputElement
            table.getColumn("name")?.setFilterValue(target?.value)
          }}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-8">
        <DataTablePagination table={table} />
      </div>
    </>
  )
}
