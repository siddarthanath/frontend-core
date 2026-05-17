"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { useCreateApiKey } from "@/lib/api/api-keys"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Phase = "form" | "reveal"

interface CreateApiKeyModalProps {
  orgId: string
}

export function CreateApiKeyModal({ orgId }: CreateApiKeyModalProps) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>("form")
  const [name, setName] = useState("")
  const [rawKey, setRawKey] = useState("")
  const [copied, setCopied] = useState(false)
  const createKey = useCreateApiKey(orgId)

  async function handleCreate() {
    if (!name.trim()) return
    try {
      const result = await createKey.mutateAsync({ name: name.trim() })
      setRawKey(result.raw_key)
      setPhase("reveal")
    } catch {
      toast.error("Failed to create API key")
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(rawKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClose() {
    setOpen(false)
    setTimeout(() => {
      setPhase("form")
      setName("")
      setRawKey("")
      setCopied(false)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Generate key</Button>
      </DialogTrigger>

      <DialogContent>
        {phase === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Generate API key</DialogTitle>
              <DialogDescription>
                Give this key a label so you can identify it later.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. CI Pipeline, Server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
                <Button
                  size="sm"
                  disabled={!name.trim() || createKey.isPending}
                  onClick={handleCreate}
                >
                  {createKey.isPending ? "Generating…" : "Generate"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Save your API key</DialogTitle>
              <DialogDescription>
                This key will not be shown again. Copy it now and store it securely.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
                <code className="flex-1 text-xs break-all text-fg font-mono">{rawKey}</code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-fg-3 hover:text-fg transition-colors"
                  aria-label="Copy key"
                >
                  {copied ? <Check size={14} className="text-brand" /> : <Copy size={14} />}
                </button>
              </div>

              <p className="text-xs text-fg-3">
                Use this key in the <code className="font-mono">Authorization: Bearer &lt;key&gt;</code> header.
              </p>

              <div className="flex justify-end">
                <Button size="sm" onClick={handleClose}>Done</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
