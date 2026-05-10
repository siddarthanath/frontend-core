"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { GoogleButton, MicrosoftButton } from "@/components/auth/OAuthButton"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormData = z.infer<typeof schema>

interface LoginFormProps {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      toast.error(error.message)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm" style={{ color: "oklch(0.577 0.245 27.325)" }}>
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm" style={{ color: "oklch(0.577 0.245 27.325)" }}>
            {errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1" style={{ backgroundColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }} />
        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>or continue with</span>
        <div className="h-px flex-1" style={{ backgroundColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }} />
      </div>
      <div className="flex flex-col gap-2">
        <GoogleButton redirectTo={redirectTo} />
        <MicrosoftButton redirectTo={redirectTo} />
      </div>
    </form>
  )
}
