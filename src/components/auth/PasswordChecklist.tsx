"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { PASSWORD_RULES } from "@/lib/auth/password"

interface PasswordChecklistProps {
  password: string
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  if (!password) return null

  return (
    <ul className="flex flex-col gap-1 mt-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password)
        return (
          <li key={rule.id} className="flex items-center gap-1.5 text-xs">
            {passed ? (
              <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="size-3.5 text-error shrink-0" />
            )}
            <span className={passed ? "text-green-500" : "text-error"}>{rule.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
