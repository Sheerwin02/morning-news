"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { LayoutOption } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentLayout: LayoutOption
  currentArticlesPerFeed: number
  onUpdateSettings: (layout: LayoutOption, articlesPerFeed: number) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  currentLayout,
  currentArticlesPerFeed,
  onUpdateSettings,
}: SettingsDialogProps) {
  const [layout, setLayout] = useState<LayoutOption>(currentLayout)
  const [articlesPerFeed, setArticlesPerFeed] = useState(currentArticlesPerFeed)

  const handleSave = () => {
    onUpdateSettings(layout, articlesPerFeed)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>Customize how your dashboard looks and behaves.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="layout" className="text-right">
              Layout
            </Label>
            <Select value={layout} onValueChange={(value) => setLayout(value as LayoutOption)}>
              <SelectTrigger id="layout" className="col-span-3">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3x2">3 columns x 2 rows</SelectItem>
                <SelectItem value="2x4">2 columns x 4 rows</SelectItem>
                <SelectItem value="1x6">1 column x 6 rows</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="articles" className="text-right">
              Articles
            </Label>
            <Input
              id="articles"
              type="number"
              min={1}
              max={20}
              value={articlesPerFeed}
              onChange={(e) => setArticlesPerFeed(Number.parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

