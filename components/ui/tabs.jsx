"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  const localRef = React.useRef(null)
  const blobRef = React.useRef(null)

  React.useImperativeHandle(ref, () => localRef.current)

  React.useLayoutEffect(() => {
    const listEl = localRef.current
    const blob = blobRef.current
    if (!listEl || !blob) return

    const update = () => {
      const active = listEl.querySelector('[data-state="active"]')
      const first = listEl.querySelector('[role="tab"]')
      const el = active || first
      if (!el) return

      const rect = el.getBoundingClientRect()
      const parentRect = listEl.getBoundingClientRect()
      const left = rect.left - parentRect.left

      // size + position
      blob.style.width = `${Math.round(rect.width)}px`
      blob.style.height = `${Math.round(rect.height)}px`
      blob.style.left = `${Math.round(left)}px`
      // center vertically inside the list (uses translateY(-50%))
      const top = rect.top - parentRect.top + rect.height / 2
      blob.style.top = `${Math.round(top)}px`
      blob.style.opacity = '1'
    }

    // initial
    update()

    const ro = new ResizeObserver(update)
    ro.observe(listEl)

    const mo = new MutationObserver(update)
    mo.observe(listEl, { attributes: true, childList: true, subtree: true })

    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={localRef}
      className={cn(
        "relative tabs-glass inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <span ref={blobRef} className="tab-blob" aria-hidden="true" />
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
