'use client'

import { Menu, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from './sidebar-nav'
import type { NavData } from './types'

type MobileNavProps = NavData & {
  title: string
  openLabel: string
  closeLabel: string
  /** Extra controls (theme, language) that do not fit the compact mobile header. */
  children?: ReactNode
}

/** Drawer version of the sidebar for tablet and mobile widths. */
export function MobileNav({ title, openLabel, closeLabel, children, ...navProps }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={openLabel} className="lg:hidden">
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} aria-describedby={undefined} className="w-80 max-w-[85vw] gap-0 p-0">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label={closeLabel}>
              <X aria-hidden />
            </Button>
          </SheetClose>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <SidebarNav {...navProps} onNavigate={() => setOpen(false)} />
        </div>
        {children && <div className="mt-auto flex items-center gap-2 border-t p-4">{children}</div>}
      </SheetContent>
    </Sheet>
  )
}
