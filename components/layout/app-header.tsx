"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 border-border/50 bg-background pl-9 text-sm placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  )
}
