import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"
import { Button } from "@ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@ui/components/ui/dropdown-menu"
import { cn } from "@ui/lib/utils"

import * as React from "react"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  titleClassName?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  titleClassName = ""
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className, titleClassName)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted hover:text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground -ml-1 h-7"
          >
            <span className={cn("truncate text-xs font-semibold", titleClassName)}>{title}</span>
            {column.getIsSorted() === "desc" ?
              <ArrowDownIcon className="ml-2 size-4" />
            : column.getIsSorted() === "asc" ?
              <ArrowUpIcon className="ml-2 size-4" />
            : <CaretSortIcon className="ml-2 size-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 size-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 size-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="text-muted-foreground/70 mr-2 size-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
