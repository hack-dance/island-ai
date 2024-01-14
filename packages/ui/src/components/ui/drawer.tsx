"use client"

import React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Drawer as Vaul } from "vaul"

import { cn } from "@/lib/utils"

export const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof Vaul.Root>) => (
  <Vaul.Root shouldScaleBackground={shouldScaleBackground} {...props} />
)

Drawer.displayName = "Drawer"

export const DrawerTrigger = Vaul.Trigger

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Vaul.Content>,
  React.ComponentPropsWithoutRef<typeof Vaul.Content>
>(({ className, children, ...props }, ref) => (
  <Vaul.Portal>
    <Vaul.Overlay className="fixed inset-0 bg-foreground/40" />
    <Vaul.Content
      ref={ref}
      className={cn(
        "flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 bg-background z-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-12 md:w-24 h-1.5 flex-shrink-0 rounded-full bg-foreground/70 my-8" />
      {children}
      <Vaul.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Vaul.Close>
    </Vaul.Content>
  </Vaul.Portal>
))

DrawerContent.displayName = Vaul.Content.displayName

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
