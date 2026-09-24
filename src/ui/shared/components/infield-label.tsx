"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "cn"

import { Popover, PopoverAnchor, PopoverContent } from "@/ui/shared/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shared/components/select"

const AUTOFILL_ANIMATION_NAME = "infield-label-autofill-start"
const AUTOFILL_INPUT_CLASS = "infield-label-autofill-input"
const AUTOFILL_DETECT_MS = 1000

let autofillStylesInjected = false

function ensureAutofillStyles() {
  if (typeof document === "undefined" || autofillStylesInjected) return
  autofillStylesInjected = true
  const style = document.createElement("style")
  style.id = "infield-label-autofill-styles"
  const floatedLabel = `
    top: 0.5rem;
    transform: translateY(0);
    font-size: 0.75rem;
    line-height: 1;
    font-weight: 500;
    transition: none;
  `
  style.textContent = `
    @keyframes ${AUTOFILL_ANIMATION_NAME} {}
    .${AUTOFILL_INPUT_CLASS}:-webkit-autofill { animation-name: ${AUTOFILL_ANIMATION_NAME}; }
    .infield-label:has(input:-webkit-autofill):not(:focus-within) > label.infield-label-text,
    .infield-label:has(textarea:-webkit-autofill):not(:focus-within) > label.infield-label-text { ${floatedLabel} }
    .infield-label:has(input:-moz-autofill):not(:focus-within) > label.infield-label-text,
    .infield-label:has(textarea:-moz-autofill):not(:focus-within) > label.infield-label-text { ${floatedLabel} }
    .infield-label:has(input:autofill):not(:focus-within) > label.infield-label-text,
    .infield-label:has(textarea:autofill):not(:focus-within) > label.infield-label-text { ${floatedLabel} }
  `
  document.head.appendChild(style)
}

function isElementAutofilled(element: Element) {
  try {
    return (
      element.matches(":-webkit-autofill") ||
      element.matches(":-moz-autofill") ||
      element.matches(":autofill")
    )
  } catch {
    return element.matches(":-webkit-autofill")
  }
}

function hasText(value: unknown) {
  if (value == null) return false
  if (Array.isArray(value)) return value.some((item) => String(item).length > 0)
  return String(value).length > 0
}

export type InfieldOption = {
  value: string
  label: string
  disabled?: boolean
}

type InfieldShared = {
  label: string
  id?: string
  description?: string
  error?: string
  className?: string
}

type InfieldInputProps = InfieldShared &
  Omit<React.ComponentProps<"input">, "id" | "size"> & {
    control?: "input"
    type?: "text" | "email" | "password" | "tel" | "url" | "number" | "search"
  }

type InfieldTextareaProps = InfieldShared &
  Omit<React.ComponentProps<"textarea">, "id"> & {
    control: "textarea"
  }

type InfieldChoiceProps = InfieldShared & {
  options: InfieldOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  required?: boolean
  disabled?: boolean
}

type InfieldSelectProps = InfieldChoiceProps & {
  control: "select"
}

type InfieldComboboxProps = InfieldChoiceProps & {
  control: "combobox"
  emptyMessage?: string
  placeholder?: string
}

export type InfieldLabelProps =
  | InfieldInputProps
  | InfieldTextareaProps
  | InfieldSelectProps
  | InfieldComboboxProps

function useDescribedBy(id: string, description?: string, error?: string) {
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const describedBy = [description ? descriptionId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ")

  return {
    descriptionId,
    errorId,
    describedBy: describedBy || undefined,
    invalid: Boolean(error),
  }
}

function InfieldShell({
  control,
  id,
  labelId,
  label,
  required,
  description,
  error,
  descriptionId,
  errorId,
  floating,
  active,
  invalid,
  skipMotion,
  textarea = false,
  reserveEnd = false,
  className,
  children,
}: {
  id: string
  labelId: string
  label: string
  required?: boolean
  description?: string
  error?: string
  descriptionId: string
  errorId: string
  floating: boolean
  active: boolean
  invalid: boolean
  skipMotion: boolean
  control: "input" | "textarea" | "select" | "combobox"
  textarea?: boolean
  reserveEnd?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn("flex w-full flex-col gap-1.5", className)}
      data-slot="infield-label"
      data-control={control}
    >
      <div
        data-active={active ? "true" : undefined}
        className={cn(
          "infield-label relative w-full rounded-surface border border-border bg-input outline-none transition-colors",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-muted has-[:disabled]:opacity-50",
          !active && "has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/30",
          textarea ? "min-h-28" : "h-14"
        )}
      >
        {children}
        <label
          id={labelId}
          htmlFor={id}
          data-slot="infield-label-text"
          className={cn(
            "infield-label-text pointer-events-none absolute z-10 flex items-center",
            reserveEnd ? "start-3 end-10" : "start-3 end-3",
            skipMotion
              ? "transition-none"
              : "transition-[top,transform,font-size,color] duration-200 ease-out motion-reduce:transition-none",
            floating
              ? "top-2 translate-y-0 text-xs leading-none font-medium"
              : textarea
                ? "top-3 translate-y-0 text-base leading-none"
                : "top-1/2 -translate-y-1/2 text-base leading-none",
            invalid && !active
              ? "text-destructive"
              : active
                ? undefined
                : floating
                  ? "text-foreground"
                  : "text-muted-foreground"
          )}
        >
          <span className={cn("truncate", active && "gradient-text")}>{label}</span>
          {required ? (
            <span aria-hidden="true" className={cn("ms-0.5 shrink-0", active && "gradient-text")}>
              *
            </span>
          ) : null}
        </label>
      </div>
      {description ? (
        <p id={descriptionId} className="ps-1 text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="ps-1 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function useAutofillWatch(
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  uncontrolled: boolean,
  setHasValue: React.Dispatch<React.SetStateAction<boolean>>,
  setAutofilled: React.Dispatch<React.SetStateAction<boolean>>
) {
  React.useEffect(() => {
    ensureAutofillStyles()
    let attempts = 0
    const maxAttempts = Math.ceil(AUTOFILL_DETECT_MS / 50)
    const intervalId = window.setInterval(() => {
      const node = ref.current
      if (node) {
        const autofilled = isElementAutofilled(node)
        setAutofilled(autofilled)
        if (uncontrolled && node.value.length > 0) setHasValue(true)
      }
      if (++attempts >= maxAttempts) window.clearInterval(intervalId)
    }, 50)

    return () => window.clearInterval(intervalId)
  }, [ref, setAutofilled, setHasValue, uncontrolled])
}

function InfieldInputField({
  control = "input",
  label,
  id,
  description,
  error,
  className,
  type = "text",
  value,
  defaultValue,
  required,
  disabled,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  onAnimationStart,
  ...inputProps
}: InfieldInputProps) {
  const generatedId = React.useId()
  const controlId = id ?? generatedId
  const labelId = `${controlId}-label`
  const { descriptionId, errorId, describedBy, invalid } = useDescribedBy(
    controlId,
    description,
    error
  )
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [focused, setFocused] = React.useState(false)
  const [autofilled, setAutofilled] = React.useState(false)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => hasText(defaultValue))
  const filled = value !== undefined ? hasText(value) : uncontrolledValue
  const floating = focused || filled || autofilled

  useAutofillWatch(inputRef, value === undefined, setUncontrolledValue, setAutofilled)

  return (
    <InfieldShell
      control={control}
      id={controlId}
      labelId={labelId}
      label={label}
      required={required}
      description={description}
      error={error}
      descriptionId={descriptionId}
      errorId={errorId}
      floating={floating}
      active={focused}
      invalid={invalid}
      skipMotion={(filled || autofilled) && !focused}
      className={className}
    >
      <input
        {...inputProps}
        ref={inputRef}
        id={controlId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        suppressHydrationWarning
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value.length > 0)
          if (!isElementAutofilled(event.target)) setAutofilled(false)
          onChange?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onAnimationStart={(event) => {
          if (event.animationName === AUTOFILL_ANIMATION_NAME) {
            setAutofilled(isElementAutofilled(event.currentTarget))
            if (value === undefined && event.currentTarget.value.length > 0) {
              setUncontrolledValue(true)
            }
          }
          onAnimationStart?.(event)
        }}
        className={cn(
          AUTOFILL_INPUT_CLASS,
          "h-full w-full rounded-surface bg-transparent px-3 pt-6 pb-1.5 text-base text-foreground outline-none disabled:cursor-not-allowed md:text-sm",
          floating ? "placeholder:text-muted-foreground" : "placeholder:text-transparent"
        )}
      />
    </InfieldShell>
  )
}

function InfieldTextareaField({
  control,
  label,
  id,
  description,
  error,
  className,
  value,
  defaultValue,
  required,
  disabled,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  onAnimationStart,
  ...textareaProps
}: InfieldTextareaProps) {
  const generatedId = React.useId()
  const controlId = id ?? generatedId
  const labelId = `${controlId}-label`
  const { descriptionId, errorId, describedBy, invalid } = useDescribedBy(
    controlId,
    description,
    error
  )
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = React.useState(false)
  const [autofilled, setAutofilled] = React.useState(false)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => hasText(defaultValue))
  const filled = value !== undefined ? hasText(value) : uncontrolledValue
  const floating = focused || filled || autofilled

  useAutofillWatch(textareaRef, value === undefined, setUncontrolledValue, setAutofilled)

  return (
    <InfieldShell
      control={control}
      id={controlId}
      labelId={labelId}
      label={label}
      required={required}
      description={description}
      error={error}
      descriptionId={descriptionId}
      errorId={errorId}
      floating={floating}
      active={focused}
      invalid={invalid}
      skipMotion={(filled || autofilled) && !focused}
      textarea
      className={className}
    >
      <textarea
        {...textareaProps}
        ref={textareaRef}
        id={controlId}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        suppressHydrationWarning
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value.length > 0)
          if (!isElementAutofilled(event.target)) setAutofilled(false)
          onChange?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onAnimationStart={(event) => {
          if (event.animationName === AUTOFILL_ANIMATION_NAME) {
            setAutofilled(isElementAutofilled(event.currentTarget))
            if (value === undefined && event.currentTarget.value.length > 0) {
              setUncontrolledValue(true)
            }
          }
          onAnimationStart?.(event)
        }}
        className={cn(
          AUTOFILL_INPUT_CLASS,
          "block min-h-28 w-full resize-y rounded-surface bg-transparent px-3 pt-8 pb-2 text-base text-foreground outline-none disabled:cursor-not-allowed md:text-sm",
          floating ? "placeholder:text-muted-foreground" : "placeholder:text-transparent"
        )}
      />
    </InfieldShell>
  )
}

function useChoiceValue(value: string | undefined, defaultValue: string | undefined) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const selected = value !== undefined ? value : internal
  const setSelected = React.useCallback(
    (next: string, onValueChange?: (value: string) => void) => {
      if (value === undefined) setInternal(next)
      if (next !== (value !== undefined ? value : internal)) onValueChange?.(next)
    },
    [internal, value]
  )

  return { selected, setSelected }
}

function InfieldSelectField({
  label,
  id,
  description,
  error,
  className,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  disabled,
}: InfieldSelectProps) {
  const generatedId = React.useId()
  const controlId = id ?? generatedId
  const labelId = `${controlId}-label`
  const { descriptionId, errorId, describedBy, invalid } = useDescribedBy(
    controlId,
    description,
    error
  )
  const { selected, setSelected } = useChoiceValue(value, defaultValue)
  const [open, setOpen] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const filled = selected.length > 0
  const floating = focused || open || filled
  const active = focused || open

  return (
    <InfieldShell
      control="select"
      id={controlId}
      labelId={labelId}
      label={label}
      required={required}
      description={description}
      error={error}
      descriptionId={descriptionId}
      errorId={errorId}
      floating={floating}
      active={active}
      invalid={invalid}
      skipMotion={filled && !active}
      reserveEnd
      className={className}
    >
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <Select
        value={selected === "" ? undefined : selected}
        disabled={disabled}
        onOpenChange={setOpen}
        onValueChange={(next) => setSelected(next, onValueChange)}
      >
        <SelectTrigger
          id={controlId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-full! w-full! rounded-none! border-0! bg-transparent! px-3 py-0! shadow-none! ring-0! hover:bg-transparent! focus-visible:border-transparent! focus-visible:ring-0! aria-invalid:ring-0! data-[size=default]:h-full"
        >
          <span className="min-w-0 flex-1 truncate pt-6 text-start">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent position="popper" align="start" className="min-w-(--radix-select-trigger-width)">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </InfieldShell>
  )
}

function moveHighlight(options: InfieldOption[], current: number, direction: 1 | -1) {
  if (options.length === 0) return -1
  let index = current
  for (let step = 0; step < options.length; step += 1) {
    index = (index + direction + options.length) % options.length
    if (!options[index]?.disabled) return index
  }
  return -1
}

function edgeHighlight(options: InfieldOption[], fromEnd: boolean) {
  const start = fromEnd ? options.length - 1 : 0
  const direction = fromEnd ? -1 : 1
  for (let index = start; index >= 0 && index < options.length; index += direction) {
    if (!options[index]?.disabled) return index
  }
  return -1
}

function InfieldComboboxField({
  label,
  id,
  description,
  error,
  className,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  disabled,
  emptyMessage = "No results.",
  placeholder,
}: InfieldComboboxProps) {
  const generatedId = React.useId()
  const controlId = id ?? generatedId
  const labelId = `${controlId}-label`
  const listboxId = `${controlId}-listbox`
  const { descriptionId, errorId, describedBy, invalid } = useDescribedBy(
    controlId,
    description,
    error
  )
  const { selected, setSelected } = useChoiceValue(value, defaultValue)
  const [open, setOpen] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [query, setQuery] = React.useState<string | null>(null)
  const [highlighted, setHighlighted] = React.useState(-1)
  const fieldRef = React.useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === selected)
  const inputValue = query ?? selectedOption?.label ?? ""
  const filtered = React.useMemo(() => {
    if (!query) return options
    const needle = query.toLowerCase()
    return options.filter((option) => option.label.toLowerCase().includes(needle))
  }, [options, query])
  const filled = selected.length > 0 || (query?.length ?? 0) > 0
  const floating = focused || open || filled
  const active = focused || open
  const activeOption = open && highlighted >= 0 ? filtered[highlighted] : undefined
  const activeId = activeOption ? `${listboxId}-option-${highlighted}` : undefined

  React.useEffect(() => {
    if (!open || highlighted < 0) return
    const list = document.getElementById(listboxId)
    const option = document.getElementById(`${listboxId}-option-${highlighted}`)
    if (!list || !option) return
    const listRect = list.getBoundingClientRect()
    const optionRect = option.getBoundingClientRect()
    if (optionRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optionRect.top
    } else if (optionRect.bottom > listRect.bottom) {
      list.scrollTop += optionRect.bottom - listRect.bottom
    }
  }, [highlighted, listboxId, open])

  function commit(next: string) {
    setSelected(next, onValueChange)
  }

  function selectOption(option: InfieldOption) {
    if (option.disabled) return
    commit(option.value)
    setQuery(null)
    setOpen(false)
  }

  function closeList() {
    setQuery(null)
    setOpen(false)
    setHighlighted(-1)
  }

  return (
    <InfieldShell
      control="combobox"
      id={controlId}
      labelId={labelId}
      label={label}
      required={required}
      description={description}
      error={error}
      descriptionId={descriptionId}
      errorId={errorId}
      floating={floating}
      active={active}
      invalid={invalid}
      skipMotion={filled && !active}
      reserveEnd
      className={className}
    >
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setQuery(null)
            setHighlighted(-1)
          }
        }}
      >
        <PopoverAnchor asChild>
          <div ref={fieldRef} className="relative h-full">
            <input
              id={controlId}
              type="text"
              role="combobox"
              disabled={disabled}
              required={required}
              autoComplete="off"
              placeholder={placeholder}
              value={inputValue}
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              aria-required={required || undefined}
              onChange={(event) => {
                const next = event.target.value
                const needle = next.toLowerCase()
                const nextOptions = next
                  ? options.filter((option) => option.label.toLowerCase().includes(needle))
                  : options
                setQuery(next)
                setOpen(true)
                setHighlighted(edgeHighlight(nextOptions, false))
                if (selected !== "") commit("")
              }}
              onFocus={() => {
                setFocused(true)
                setOpen(true)
                setHighlighted((current) =>
                  current >= 0 ? current : edgeHighlight(filtered, false)
                )
              }}
              onClick={() => setOpen(true)}
              onBlur={(event) => {
                setFocused(false)
                const next = event.relatedTarget
                if (next instanceof Node && fieldRef.current?.contains(next)) return
                closeList()
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault()
                  if (!open) {
                    setOpen(true)
                    setHighlighted(edgeHighlight(filtered, false))
                    return
                  }
                  setHighlighted((current) => moveHighlight(filtered, current, 1))
                } else if (event.key === "ArrowUp") {
                  event.preventDefault()
                  if (!open) {
                    setOpen(true)
                    setHighlighted(edgeHighlight(filtered, true))
                    return
                  }
                  setHighlighted((current) => moveHighlight(filtered, current, -1))
                } else if (event.key === "Home" && open) {
                  event.preventDefault()
                  setHighlighted(edgeHighlight(filtered, false))
                } else if (event.key === "End" && open) {
                  event.preventDefault()
                  setHighlighted(edgeHighlight(filtered, true))
                } else if (event.key === "Enter" && open && activeOption && !activeOption.disabled) {
                  event.preventDefault()
                  selectOption(activeOption)
                } else if (event.key === "Escape" && open) {
                  event.preventDefault()
                  closeList()
                }
              }}
              className={cn(
                "h-full w-full rounded-surface bg-transparent px-3 pt-6 pe-10 pb-1.5 text-base text-foreground outline-none disabled:cursor-not-allowed md:text-sm",
                floating ? "placeholder:text-muted-foreground" : "placeholder:text-transparent"
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                "absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-muted-foreground",
                disabled ? "pointer-events-none" : "cursor-pointer"
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (disabled) return
                if (!open) setHighlighted(edgeHighlight(filtered, false))
                setOpen((current) => !current)
                document.getElementById(controlId)?.focus()
              }}
            >
              <ChevronDownIcon className="size-4" />
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width)! p-1"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onFocusOutside={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => {
            const target = event.target
            if (target instanceof Node && fieldRef.current?.contains(target)) {
              event.preventDefault()
            }
          }}
          onInteractOutside={(event) => {
            const target = event.target
            if (target instanceof Node && fieldRef.current?.contains(target)) {
              event.preventDefault()
            }
          }}
        >
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            className="max-h-60 overflow-y-auto"
          >
            {filtered.map((option, index) => {
              const optionId = `${listboxId}-option-${index}`
              const isSelected = option.value === selected
              return (
                <div
                  key={option.value}
                  id={optionId}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-inset px-2 py-1.5 text-sm",
                    index === highlighted && "bg-accent text-accent-foreground",
                    option.disabled && "pointer-events-none opacity-50"
                  )}
                  onMouseEnter={() => {
                    if (!option.disabled) setHighlighted(index)
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectOption(option)
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  <CheckIcon
                    className={cn("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                  />
                </div>
              )
            })}
          </div>
          {filtered.length === 0 ? (
            <p role="status" className="px-2 py-3 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : null}
        </PopoverContent>
      </Popover>
    </InfieldShell>
  )
}

function InfieldLabel(props: InfieldLabelProps) {
  if (props.control === "textarea") return <InfieldTextareaField {...props} />
  if (props.control === "select") return <InfieldSelectField {...props} />
  if (props.control === "combobox") return <InfieldComboboxField {...props} />
  return <InfieldInputField {...props} />
}

export { InfieldLabel }
