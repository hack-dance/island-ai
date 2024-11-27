import { Button } from "@ui/components/ui/button"
import { Input, InputProps } from "@ui/components/ui/input"
import { cn } from "@ui/lib/utils"
import { Loader2 } from "lucide-react"

import React from "react"

import { AnimatedBorderWrapper } from "./animated-border-wrapper"

export interface PromptComposerProps {
  prompt: string
  onChange: (event: string) => void
  onSubmit: (value: string) => void
  loading: boolean
  onCancel?: () => void
  animatedLoading?: boolean
  placeholder?: string
  inputProps?: InputProps
  jumbo?: boolean
  className?: string
}

/**
 * `PromptComposer` is a component that allows users to input prompts and submit them.
 *
 * @param {PromptComposerProps} props - The properties that define the component's behavior and display.
 *
 * @returns {React.ReactElement} The rendered `PromptComposer` component.
 */
export function PromptComposer({
  prompt = "",
  placeholder,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  animatedLoading = true,
  inputProps = {},
  jumbo = false,
  className
}: PromptComposerProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault()
      onSubmit(prompt)
    }
  }

  return (
    <>
      <AnimatedBorderWrapper enabled={animatedLoading && loading} className={cn(className)}>
        <div className="relative flex h-auto w-full flex-row items-center">
          <div className="w-full">
            <Input
              {...inputProps}
              disabled={loading}
              autoFocus
              onChange={event => onChange((event.target as HTMLInputElement).value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? "Ask me anything..."}
              value={prompt}
              className={cn(
                "border-foreground text-foreground focus:z-100 placeholder:text-foreground/70 bg-background disabled:bg-muted disabled:placeholder:text-text-foreground/50 disabled:text-foreground/50 relative flex h-11 w-full rounded-full border-2 py-3 pr-[52px] text-sm outline-none disabled:cursor-not-allowed disabled:opacity-100",
                {
                  "h-14 py-6 text-lg placeholder:text-lg": jumbo,
                  "border-purps": loading
                }
              )}
            />
          </div>
          <>
            <Button
              variant="secondary"
              size="lg"
              disabled={loading}
              onClick={() => onSubmit(prompt)}
              className="z-10 ml-[-88px] h-14"
            >
              {loading ?
                <Loader2 className="h-4 w-6 animate-spin" />
              : "Ask"}
            </Button>
          </>
        </div>
        {loading && onCancel && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            className="absolute right-0 mt-2"
          >
            Stop Generating
          </Button>
        )}
      </AnimatedBorderWrapper>
    </>
  )
}
