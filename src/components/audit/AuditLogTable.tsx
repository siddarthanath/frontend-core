"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { useAuditLog } from "@/lib/api/audit"
import { useAuthStore } from "@/stores/auth"
import { DataTable } from "@/components/shared/DataTable"
import { ErrorState } from "@/components/shared/FeedbackStates/ErrorState"
import type { AuditLogResponse } from "@/types/audit"

const PAGE_SIZE = 20

function formatAction(action: string): string {
  const [resource, verb] = action.split(".")
  if (!verb) return action
  return `${verb.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())} ${resource.replace(/_/g, " ")}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
}

function truncateId(id: string): string {
  return `${id.slice(0, 8)}…`
}

const columns: ColumnDef<AuditLogResponse>[] = [
  {
    accessorKey: "created_at",
    header: "Time",
    size: 140,
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs text-fg-3 whitespace-nowrap">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-fg">
        {formatAction(row.original.action)}
      </span>
    ),
  },
  {
    accessorKey: "resource_type",
    header: "Resource",
    cell: ({ row }) => (
      <span className="text-xs text-fg-3">
        {row.original.resource_type}
        {row.original.resource_id && (
          <span className="ml-1 font-mono">{truncateId(row.original.resource_id)}</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "actor_id",
    header: "Actor",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs text-fg-3 font-mono">
        {row.original.actor_id ? truncateId(row.original.actor_id) : "System"}
      </span>
    ),
  },
]

export function AuditLogTable() {
  const { currentOrg } = useAuthStore()
  const orgId = currentOrg?.id ?? ""
  const [offset, setOffset] = useState(0)
  const { data, isLoading, isError, refetch } = useAuditLog(orgId, offset, PAGE_SIZE)

  if (isError) return <ErrorState message="Failed to load audit log." onRetry={() => refetch()} />

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      isLoading={isLoading}
      loadingRows={8}
      emptyMessage="No audit events yet. Actions taken in this org will appear here."
      pagination={
        data
          ? {
              total: data.total,
              offset,
              limit: PAGE_SIZE,
              onNext: () => setOffset((o) => o + PAGE_SIZE),
              onPrev: () => setOffset((o) => Math.max(0, o - PAGE_SIZE)),
            }
          : undefined
      }
    />
  )
}
