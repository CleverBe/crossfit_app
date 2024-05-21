"use client"

import { cn } from "@/lib/utils"

import { Check, X, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useRef, useState } from "react"

export type OptionType = {
  label: string
  value: string
}

interface MultiSelectProps {
  searchInput?: boolean
  options: OptionType[]
  selected: OptionType[]
  onChange: React.Dispatch<React.SetStateAction<OptionType[]>>
  className?: string
  placeholder: string
}

function MultiSelect({
  searchInput = true,
  options,
  selected,
  onChange,
  className,
  placeholder,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i.value !== item))
  }

  return (
    <div ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${selected.length > 1 ? "h-full" : "h-10"}`}
            onClick={() => setOpen(!open)}
          >
            {selected.length === 0 && (
              <span className="truncate">{placeholder}</span>
            )}
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <Badge
                  variant="default"
                  key={item.value}
                  onClick={() => handleUnselect(item.value)}
                >
                  {item.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item.value)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      handleUnselect(item.value)
                      e.stopPropagation()
                    }}
                  >
                    <X className="h-3 w-3 hover:text-red-700" />
                  </button>
                </Badge>
              ))}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{
            width: containerRef.current?.offsetWidth,
          }}
          container={containerRef.current}
        >
          <Command className={className}>
            {searchInput && <CommandInput placeholder="Search ..." />}
            <CommandList>
              {searchInput && <CommandEmpty>No item found.</CommandEmpty>}
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(
                        selected
                          .map((item) => item.value)
                          .includes(option.value)
                          ? selected.filter(
                              (item) => item.value !== option.value,
                            )
                          : [...selected, option],
                      )
                      setOpen(true)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected
                          .map((item) => item.value)
                          .includes(option.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { MultiSelect }
