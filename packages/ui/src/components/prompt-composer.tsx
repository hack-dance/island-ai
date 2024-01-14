import React from "react"
import { Forward, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, InputProps } from "@/components/ui/input"

import { AnimatedBorderWrapper } from "./animated-border-wrapper"

export interface PromptComposerProps {
  prompt: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: (value: string) => void
  loading: boolean
  onCancel?: () => void
  animatedLoading?: boolean
  placeholder?: string
  inputProps?: InputProps
  jumbo?: boolean
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
  onKeyDown,
  onSubmit,
  onCancel,
  loading = false,
  animatedLoading = true,
  inputProps = {},
  jumbo = false
}: PromptComposerProps) {
  return (
    <>
      <AnimatedBorderWrapper enabled={animatedLoading && loading}>
        <div className="flex h-auto flex-row items-center relative">
          <div className="w-full">
            <Input
              {...inputProps}
              disabled={loading}
              autoFocus
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder ?? "Ask me anything..."}
              value={prompt}
              className={cn(
                "text-foreground focus:z-100 placeholder:text-foreground/50 relative flex h-11 w-full rounded-md bg-background py-3 pr-[52px] text-sm outline-none disabled:cursor-not-allowed disabled:opacity-[1] disabled:bg-muted disabled:placeholder-text-foreground/50 disabled:text-foreground/50",
                {
                  "text-lg placeholder:text-lg py-6 h-14": jumbo
                }
              )}
            />
          </div>
          <div className="">
            {loading ? (
              <Loader2 className="ml-[-30px] h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubmit(prompt)}
                className="ml-[-46px] h-8"
              >
                <Forward className="h-4 w-4 shrink-0 cursor-pointer opacity-50" />
              </Button>
            )}
          </div>
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
