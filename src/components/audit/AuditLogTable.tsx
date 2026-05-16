"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAuditLog } from "@/lib/api/audit"
import { useAuthStore } from "@/stores/auth"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 20

function formatAction(action: string): string {
  const [resource, verb] = action.split(".")
  if (!verb) return action
  const v = verb.replace(/_/g, " ")
  const r = resource.replace(/_/g, " ")
  return `${v.charAt(0).toUpperCase() + v.slice(1)} ${r}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })
}

function truncateId(id: string): string {
  return `${id.slice(0, 8)}…`
}

export function AuditLogTable() {
  const { currentOrg } = useAuthStore()
  const orgId = currentOrg?.id ?? ""
  const [offset, setOffset] = useState(0)
  const { data, isLoading } = useAuditLog(orgId, offset, PAGE_SIZE)

  const total = data?.total ?? 0
  const page = Math.floor(offset / PAGE_SIZE) + 1
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-fg-3">
        No audit events yet. Actions taken in this org will appear here.
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-36">Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Actor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="text-xs text-fg-3 whitespace-nowrap">
                {formatDate(event.created_at)}
              </TableCell>
              <TableCell className="text-sm font-medium text-fg">
                {formatAction(event.action)}
              </TableCell>
              <TableCell className="text-xs text-fg-3">
                {event.resource_type}
                {event.resource_id && (
                  <span className="ml-1 font-mono">{truncateId(event.resource_id)}</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-fg-3 font-mono">
                {event.actor_id ? truncateId(event.actor_id) : "System"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-fg-3">
            Page {page} of {totalPages} · {total} events
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={offset + PAGE_SIZE >= total}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
