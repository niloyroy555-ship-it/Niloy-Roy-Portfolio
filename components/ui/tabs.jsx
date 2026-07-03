"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  const localRef = React.useRef(null)
  const blobRef = React.useRef(null)
  const rafRef = React.useRef(null)

  React.useImperativeHandle(ref, () => localRef.current)

  React.useLayoutEffect(() => {
    const listEl = localRef.current
    const blob = blobRef.current
    if (!listEl || !blob) return

    // Put the blob vertically centered via CSS (top:50% + translateY(-50%)) and only translateX in JS
    const update = () => {
      // single read
      const active = listEl.querySelector('[data-state="active"]')
      const first = listEl.querySelector('[role="tab"]')
      const el = active || first
      if (!el) return

      const rect = el.getBoundingClientRect()
      const parentRect = listEl.getBoundingClientRect()
      const left = Math.round(rect.left - parentRect.left)

      // writes
      blob.style.width = `${Math.round(rect.width)}px`
      blob.style.height = `${Math.round(rect.height)}px`
      // Use translate3d for GPU-accelerated movement
      blob.style.transform = `translate3d(${left}px, -50%, 0)`
      blob.style.opacity = '1'
    }

    const scheduleUpdate = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        update()
      })
    }

    // initial
    scheduleUpdate()

    // Observe size changes of the list (tabs wrapping/responsive)
    const ro = new ResizeObserver(scheduleUpdate)
    ro.observe(listEl)

    // Observe attribute changes only on direct children (data-state changes when active tab changes)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes') {
          if (m.attributeName === 'data-state' || m.attributeName === 'class') {
            scheduleUpdate()
            return
          }
        }
        if (m.type === 'childList') {
          scheduleUpdate()
          return
        }
      }
    })
    // Observe only immediate children attributes to reduce work
    mo.observe(listEl, { attributes: true, childList: true, subtree: false, attributeFilter: ['data-state', 'class'] })

    const onResize = () => scheduleUpdate()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
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
      "tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-colors duration-220 ease-[cubic-bezier(.2,.9,.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
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
